import { prisma } from "@apex/db";
import { clientFromConfig as twentyFromConfig } from "@apex/integrations/twenty";
import type { TwentyClient } from "@apex/integrations/twenty";
import { open } from "@apex/integrations/vault";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Twenty CRM webhook handler.
 *
 * Receives events from Twenty when a Person or Company record changes. We
 * only need to react to outbound changes that affect us — most often, the
 * partner moving a deal from "Lead" → "Qualified" → "Won" and pushing the
 * resulting revenue back.
 *
 * Verification uses `x-twenty-signature` with HMAC-SHA256 over the raw body.
 */
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-twenty-signature");

  const integration = await prisma.partnerIntegration.findUnique({
    where: { provider: "twenty-crm" },
  });

  if (!integration?.isEnabled) {
    return NextResponse.json({ error: "Twenty CRM integration is not enabled" }, { status: 503 });
  }

  if (!integration.secretCiphertext || !integration.secretIv || !integration.secretTag) {
    return NextResponse.json({ error: "Twenty CRM is not configured" }, { status: 503 });
  }

  const cfg = (integration.config ?? {}) as { baseUrl?: string; workspaceSlug?: string };
  const apiKey = open({
    ciphertext: integration.secretCiphertext,
    iv: integration.secretIv,
    tag: integration.secretTag,
  });
  const client: TwentyClient = twentyFromConfig({
    baseUrl: cfg.baseUrl ?? "",
    apiKey,
    workspaceSlug: cfg.workspaceSlug,
  });

  // Prefer the webhook signing secret stored in its own sealed envelope; fall
  // back to the env var only when nothing is stored. Truthiness (not `??`) so an
  // empty `.env.example` value cannot shadow a real stored secret.
  let signingSecret = process.env.TWENTY_WEBHOOK_SECRET ?? "";
  if (integration.webhookCiphertext && integration.webhookIv && integration.webhookTag) {
    try {
      signingSecret = open({
        ciphertext: integration.webhookCiphertext,
        iv: integration.webhookIv,
        tag: integration.webhookTag,
      });
    } catch {
      // A corrupt envelope must not crash verification — fall through to the
      // missing-secret guard below.
    }
  }

  // Refuse unsigned traffic outright. The old guard only ran when a secret was
  // present, so an unconfigured deployment accepted any payload and let a
  // stranger move leads to CUSTOMER or LOST.
  if (!signingSecret) {
    return NextResponse.json({ error: "Webhook signing is not configured" }, { status: 503 });
  }

  if (!client.verifyWebhookSignature(rawBody, signature ?? null, signingSecret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: {
    event?: string;
    data?: { personExternalId?: string; stage?: string; amount?: number; currency?: string };
  };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Malformed payload" }, { status: 400 });
  }

  const externalId = payload.data?.personExternalId;
  const stage = payload.data?.stage;
  const amount = payload.data?.amount;

  await prisma.partnerIntegration.update({
    where: { provider: "twenty-crm" },
    data: {
      lastEventAt: new Date(),
      lastEventKind: `webhook.${payload.event} · ${externalId ?? "—"} · ${stage ?? "—"}`,
    },
  });

  // Translate the partner-side stage into our pipeline. `apex_lead_<id>` is
  // the externalId format produced by `leadExternalId` in the sync layer.
  if (externalId?.startsWith("apex_lead_")) {
    const leadId = externalId.slice("apex_lead_".length);
    const mapped =
      stage === "QUALIFIED"
        ? "QUALIFIED"
        : stage === "OPPORTUNITY" || stage === "NEGOTIATION"
          ? "OPPORTUNITY"
          : stage === "WON" || stage === "CUSTOMER"
            ? "CUSTOMER"
            : stage === "LOST"
              ? "LOST"
              : null;

    if (mapped) {
      try {
        await prisma.lead.update({
          where: { id: leadId },
          data: {
            stage: mapped,
            convertedAt: mapped === "CUSTOMER" ? new Date() : undefined,
            lostAt: mapped === "LOST" ? new Date() : undefined,
            valueAmount: mapped === "CUSTOMER" && amount ? Math.round(amount * 100) : undefined,
          },
        });
      } catch {
        // Lead may have been deleted in our CRM — log and continue.
      }
    }
  }

  return NextResponse.json({ received: true });
}
