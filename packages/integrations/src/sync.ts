import "server-only";
import { prisma } from "@apex/db";
import {
  clientFromConfig,
  companyExternalId,
  leadExternalId,
  splitName,
  TwentyError,
} from "./twenty";
import type { TwentyClient } from "./twenty";

/**
 * Sync a Lead into Twenty CRM.
 *
 * Called fire-and-forget after a lead is committed — the lead is the source
 * of truth in our CRM, and Twenty is the partner-facing system. Failure to
 * sync must never lose the lead: errors are swallowed and logged.
 *
 * External ids are stable across syncs (`apex_lead_<id>`, `apex_co_<slug>`),
 * so re-running this for the same lead is an idempotent upsert rather than
 * a duplicate.
 */

export interface SyncResult {
  ok: boolean;
  detail: string;
  syncedAt: Date;
}

export async function syncLeadToTwenty(leadId: string): Promise<SyncResult> {
  const integration = await prisma.partnerIntegration.findUnique({
    where: { provider: "twenty-crm" },
  });

  if (!integration?.isEnabled) {
    return { ok: false, detail: "Twenty CRM integration is not enabled", syncedAt: new Date() };
  }

  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: { attribution: true },
  });

  if (!lead) return { ok: false, detail: `Lead ${leadId} not found`, syncedAt: new Date() };

  if (!integration.secretCiphertext || !integration.secretIv || !integration.secretTag) {
    return {
      ok: false,
      detail: "Twenty API key not configured",
      syncedAt: new Date(),
    };
  }

  const cfg = (integration.config ?? {}) as {
    baseUrl?: string;
    workspaceSlug?: string;
  };

  // Lazy import `open` so the package can be imported by code paths that don't
  // need to decrypt (e.g. typecheck in a non-Node environment).
  const { open } = await import("./vault");
  const client: TwentyClient = clientFromConfig({
    baseUrl: cfg.baseUrl ?? "",
    apiKey: open({
      ciphertext: integration.secretCiphertext,
      iv: integration.secretIv,
      tag: integration.secretTag,
    }),
    workspaceSlug: cfg.workspaceSlug,
  });

  const { firstName, lastName } = splitName(lead.name);

  try {
    // Create the company first if the lead has one, so the person can be
    // linked on insert. Twenty's upsert is idempotent on externalId.
    if (lead.companyName) {
      await client.upsertCompany({
        externalId: companyExternalId(lead.companyName),
        name: lead.companyName,
      });
    }

    await client.upsertPerson({
      externalId: leadExternalId(lead.id),
      firstName,
      lastName,
      email: lead.email,
      phone: lead.phone ?? undefined,
      jobTitle: lead.jobTitle ?? undefined,
      country: lead.country ?? lead.attribution?.country ?? undefined,
      companyExternalId: lead.companyName ? companyExternalId(lead.companyName) : undefined,
      source: lead.attribution?.utmSource ?? lead.sourceType,
      notes: lead.message ?? lead.requirements ?? undefined,
    });

    const detail = `Synced lead ${lead.email} to Twenty`;
    await markEvent("twenty-crm", "sync.ok", detail);
    return { ok: true, detail, syncedAt: new Date() };
  } catch (error) {
    const message =
      error instanceof TwentyError
        ? `${error.message}${error.body ? ` (${JSON.stringify(error.body).slice(0, 200)})` : ""}`
        : error instanceof Error
          ? error.message
          : String(error);
    await markEvent("twenty-crm", "sync.error", message);
    return { ok: false, detail: message, syncedAt: new Date() };
  }
}

async function markEvent(provider: string, kind: string, detail: string): Promise<void> {
  try {
    await prisma.partnerIntegration.update({
      where: { provider },
      data: { lastEventAt: new Date(), lastEventKind: `${kind} · ${detail.slice(0, 180)}` },
    });
  } catch {
    // Non-fatal — the sync status was the important thing.
  }
}
