import { hyperswitchFromConfig, twentyFromConfig } from "@apex/integrations";
import type { HyperswitchClient, TwentyClient } from "@apex/integrations";
import { open, seal } from "@apex/integrations/vault";
import { prisma } from "@apex/db";
import { Button } from "@apex/ui";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { audit } from "@/lib/audit";
import { requirePermission } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Integrations" };

interface TwentyCfg {
  baseUrl?: string;
  workspaceSlug?: string;
}

interface HyperswitchCfg {
  baseUrl?: string;
  publishableKey?: string;
  profileId?: string;
  routing?: string[];
}

/**
 * Partner-facing integrations: Hyperswitch (payment gateway) and Twenty CRM.
 *
 * Each integration has its own form. Saving a new key replaces the stored
 * ciphertext (the plaintext is never returned); leaving the field blank
 * preserves the existing credential so a model/base-URL change does not
 * wipe a working key.
 */
export default async function IntegrationsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; tested?: string; cleared?: string; error?: string }>;
}) {
  await requirePermission("partner:write");
  const flash = await searchParams;

  const integrations = await prisma.partnerIntegration.findMany({
    orderBy: { provider: "asc" },
  });
  const byProvider = new Map(integrations.map((i) => [i.provider, i]));

  const hyperswitch = byProvider.get("hyperswitch");
  const twenty = byProvider.get("twenty-crm");
  const smtp = await prisma.integration.findUnique({ where: { provider: "smtp" } });
  const leadNotifySetting = await prisma.setting.findUnique({ where: { key: "notify.lead_to" } });

  const hsCfg = (hyperswitch?.config ?? {}) as HyperswitchCfg;
  const twCfg = (twenty?.config ?? {}) as TwentyCfg;
  const smtpCfg = (smtp?.config ?? {}) as {
    host?: string;
    port?: number;
    user?: string;
    from?: string;
    replyTo?: string;
  };

  async function saveHyperswitch(formData: FormData) {
    "use server";
    const actor = await requirePermission("partner:write");

    const baseUrl = String(formData.get("baseUrl") ?? "").trim();
    const publishableKey = String(formData.get("publishableKey") ?? "").trim();
    const profileId = String(formData.get("profileId") ?? "").trim();
    const apiKey = String(formData.get("apiKey") ?? "").trim();
    const webhookSecret = String(formData.get("webhookSecret") ?? "").trim();
    const routingRaw = String(formData.get("routing") ?? "").trim();
    const enabled = formData.get("isEnabled") === "on";
    const routing = routingRaw
      ? routingRaw
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean)
      : undefined;

    if (!baseUrl || !profileId) {
      redirect("/integrations?error=baseUrl+and+profileId+are+required");
    }

    // Encrypt only when the user actually typed a new key. A blank field
    // leaves the existing credential alone, so editing routing does not
    // wipe the API key.
    const sealed = apiKey ? seal(apiKey) : null;
    const sealedWebhook = webhookSecret ? seal(webhookSecret) : null;

    await prisma.partnerIntegration.upsert({
      where: { provider: "hyperswitch" },
      create: {
        provider: "hyperswitch",
        label: "Hyperswitch payment gateway",
        isEnabled: enabled,
        config: { baseUrl, publishableKey, profileId, routing } as object,
        ...(sealed
          ? {
              secretCiphertext: sealed.ciphertext,
              secretIv: sealed.iv,
              secretTag: sealed.tag,
              lastFour: sealed.lastFour,
            }
          : {}),
        ...(sealedWebhook
          ? {
              webhookCiphertext: sealedWebhook.ciphertext,
              webhookIv: sealedWebhook.iv,
              webhookTag: sealedWebhook.tag,
              webhookLastFour: sealedWebhook.lastFour,
            }
          : {}),
      },
      update: {
        isEnabled: enabled,
        config: { baseUrl, publishableKey, profileId, routing } as object,
        ...(sealed
          ? {
              secretCiphertext: sealed.ciphertext,
              secretIv: sealed.iv,
              secretTag: sealed.tag,
              lastFour: sealed.lastFour,
            }
          : {}),
        ...(sealedWebhook
          ? {
              webhookCiphertext: sealedWebhook.ciphertext,
              webhookIv: sealedWebhook.iv,
              webhookTag: sealedWebhook.tag,
              webhookLastFour: sealedWebhook.lastFour,
            }
          : {}),
      },
    });

    await audit({
      actor,
      action: "partner.hyperswitch.updated",
      entityType: "PartnerIntegration",
      entityId: "hyperswitch",
      summary: `Hyperswitch: ${sealed ? "credential replaced, " : ""}${enabled ? "enabled" : "disabled"}`,
      changes: {
        isEnabled: { from: String(hyperswitch?.isEnabled ?? false), to: String(enabled) },
      },
    });

    redirect("/integrations?saved=hyperswitch");
  }

  async function testHyperswitch() {
    "use server";
    const actor = await requirePermission("partner:write");

    const record = await prisma.partnerIntegration.findUnique({
      where: { provider: "hyperswitch" },
    });
    if (!record?.secretCiphertext || !record.secretIv || !record.secretTag) {
      redirect("/integrations?error=No+credential+saved+for+Hyperswitch+yet");
    }

    const cfg = record.config as HyperswitchCfg;
    const apiKey = open({
      ciphertext: record.secretCiphertext!,
      iv: record.secretIv!,
      tag: record.secretTag!,
    });

    const client: HyperswitchClient = hyperswitchFromConfig({
      baseUrl: cfg.baseUrl ?? "",
      apiKey,
      publishableKey: cfg.publishableKey ?? "",
      profileId: cfg.profileId ?? "",
      routing: cfg.routing,
    });

    const result = await client.testConnection();

    // Round-trip the webhook signing secret if one is stored: sign a sample
    // body with it and confirm `verifyWebhookSignature` accepts it. This proves
    // the sealed secret reopens correctly before it is ever relied on in
    // production — a mis-sealed secret would otherwise only fail at webhook
    // time, leaving every payment unverifiable.
    let webhookNote = "";
    if (record.webhookCiphertext && record.webhookIv && record.webhookTag) {
      try {
        const webhookSecret = open({
          ciphertext: record.webhookCiphertext,
          iv: record.webhookIv,
          tag: record.webhookTag,
        });
        const { createHmac } = await import("node:crypto");
        // Mirror the real scheme exactly: HMAC-SHA512 over the raw body, sent
        // bare in `x-webhook-signature-512`. Signing the sample any other way
        // would make this check pass while production webhooks still failed.
        const sample = JSON.stringify({
          event_type: "payment_succeeded",
          content: { object: { payment_id: "test", status: "succeeded" } },
        });
        const sig = createHmac("sha512", webhookSecret).update(sample).digest("hex");
        const ok = client.verifyWebhookSignature(sample, sig);
        webhookNote = ok ? " · webhook secret verifies" : " · webhook secret MISMATCH";
      } catch {
        webhookNote = " · webhook secret unreadable";
      }
    }

    await prisma.partnerIntegration.update({
      where: { provider: "hyperswitch" },
      data: {
        lastTestedAt: new Date(),
        lastTestOk: result.ok,
        lastTestNote: `${result.detail}${webhookNote}`,
        lastEventAt: new Date(),
        lastEventKind: result.ok
          ? `test.ok · ${result.detail}${webhookNote}`
          : `test.error · ${result.detail}`,
      },
    });
    await audit({
      actor,
      action: "partner.hyperswitch.tested",
      entityType: "PartnerIntegration",
      entityId: "hyperswitch",
      summary: result.ok
        ? "Hyperswitch connection OK"
        : `Hyperswitch test failed: ${result.detail}`,
    });
    redirect(`/integrations?tested=${encodeURIComponent(`${result.detail}${webhookNote}`)}`);
  }

  async function saveTwenty(formData: FormData) {
    "use server";
    const actor = await requirePermission("partner:write");

    const baseUrl = String(formData.get("baseUrl") ?? "").trim();
    const workspaceSlug = String(formData.get("workspaceSlug") ?? "").trim();
    const apiKey = String(formData.get("apiKey") ?? "").trim();
    const webhookSecret = String(formData.get("webhookSecret") ?? "").trim();
    const enabled = formData.get("isEnabled") === "on";

    if (!baseUrl) {
      redirect("/integrations?error=baseUrl+is+required+for+Twenty");
    }

    const sealed = apiKey ? seal(apiKey) : null;
    const sealedWebhook = webhookSecret ? seal(webhookSecret) : null;

    await prisma.partnerIntegration.upsert({
      where: { provider: "twenty-crm" },
      create: {
        provider: "twenty-crm",
        label: "Twenty CRM",
        isEnabled: enabled,
        config: { baseUrl, workspaceSlug } as object,
        ...(sealed
          ? {
              secretCiphertext: sealed.ciphertext,
              secretIv: sealed.iv,
              secretTag: sealed.tag,
              lastFour: sealed.lastFour,
            }
          : {}),
        ...(sealedWebhook
          ? {
              webhookCiphertext: sealedWebhook.ciphertext,
              webhookIv: sealedWebhook.iv,
              webhookTag: sealedWebhook.tag,
              webhookLastFour: sealedWebhook.lastFour,
            }
          : {}),
      },
      update: {
        isEnabled: enabled,
        config: { baseUrl, workspaceSlug } as object,
        ...(sealed
          ? {
              secretCiphertext: sealed.ciphertext,
              secretIv: sealed.iv,
              secretTag: sealed.tag,
              lastFour: sealed.lastFour,
            }
          : {}),
        ...(sealedWebhook
          ? {
              webhookCiphertext: sealedWebhook.ciphertext,
              webhookIv: sealedWebhook.iv,
              webhookTag: sealedWebhook.tag,
              webhookLastFour: sealedWebhook.lastFour,
            }
          : {}),
      },
    });

    await audit({
      actor,
      action: "partner.twenty.updated",
      entityType: "PartnerIntegration",
      entityId: "twenty-crm",
      summary: `Twenty CRM: ${sealed ? "credential replaced, " : ""}${enabled ? "enabled" : "disabled"}`,
      changes: {
        isEnabled: { from: String(twenty?.isEnabled ?? false), to: String(enabled) },
      },
    });

    redirect("/integrations?saved=twenty");
  }

  async function testTwenty() {
    "use server";
    const actor = await requirePermission("partner:write");

    const record = await prisma.partnerIntegration.findUnique({
      where: { provider: "twenty-crm" },
    });
    if (!record?.secretCiphertext || !record.secretIv || !record.secretTag) {
      redirect("/integrations?error=No+credential+saved+for+Twenty+yet");
    }

    const cfg = record.config as TwentyCfg;
    const apiKey = open({
      ciphertext: record.secretCiphertext!,
      iv: record.secretIv!,
      tag: record.secretTag!,
    });

    const client: TwentyClient = twentyFromConfig({
      baseUrl: cfg.baseUrl ?? "",
      apiKey,
      workspaceSlug: cfg.workspaceSlug,
    });

    const result = await client.testConnection();
    await prisma.partnerIntegration.update({
      where: { provider: "twenty-crm" },
      data: {
        lastTestedAt: new Date(),
        lastTestOk: result.ok,
        lastTestNote: result.detail,
        lastEventAt: new Date(),
        lastEventKind: result.ok ? `test.ok · ${result.detail}` : `test.error · ${result.detail}`,
      },
    });
    await audit({
      actor,
      action: "partner.twenty.tested",
      entityType: "PartnerIntegration",
      entityId: "twenty-crm",
      summary: result.ok ? "Twenty connection OK" : `Twenty test failed: ${result.detail}`,
    });
    redirect(`/integrations?tested=${encodeURIComponent(result.detail)}`);
  }

  // ── SMTP (console-managed, DB-backed) ───────────────────────────────────────
  async function saveSmtp(formData: FormData) {
    "use server";
    const actor = await requirePermission("partner:write");

    const host = String(formData.get("host") ?? "").trim();
    const portRaw = String(formData.get("port") ?? "").trim();
    const user = String(formData.get("user") ?? "").trim();
    const from = String(formData.get("from") ?? "").trim();
    const replyTo = String(formData.get("replyTo") ?? "").trim();
    const password = String(formData.get("password") ?? "").trim();
    const enabled = formData.get("isEnabled") === "on";

    if (!host) {
      redirect("/integrations?error=SMTP+host+is+required");
    }

    const sealed = password ? seal(password) : null;

    await prisma.integration.upsert({
      where: { provider: "smtp" },
      create: {
        provider: "smtp",
        label: "SMTP email transport",
        isEnabled: enabled,
        config: {
          host,
          port: Number(portRaw) || 587,
          user: user || undefined,
          from: from || undefined,
          replyTo: replyTo || undefined,
        },
        ...(sealed
          ? {
              secretCiphertext: sealed.ciphertext,
              secretIv: sealed.iv,
              secretTag: sealed.tag,
              lastFour: sealed.lastFour,
            }
          : {}),
      },
      update: {
        isEnabled: enabled,
        config: {
          host,
          port: Number(portRaw) || 587,
          user: user || undefined,
          from: from || undefined,
          replyTo: replyTo || undefined,
        },
        ...(sealed
          ? {
              secretCiphertext: sealed.ciphertext,
              secretIv: sealed.iv,
              secretTag: sealed.tag,
              lastFour: sealed.lastFour,
            }
          : {}),
      },
    });

    await audit({
      actor,
      action: "partner.smtp.updated",
      entityType: "Integration",
      entityId: "smtp",
      summary: `SMTP: ${sealed ? "credential replaced, " : ""}${enabled ? "enabled" : "disabled"}`,
    });
    redirect("/integrations?saved=smtp");
  }

  async function verifySmtp(formData: FormData) {
    "use server";
    // Triggers a real outbound email — a side-effect, so write rather than read.
    const actor = await requirePermission("partner:write");

    const record = await prisma.integration.findUnique({ where: { provider: "smtp" } });
    if (!record?.secretCiphertext || !record.secretIv || !record.secretTag) {
      redirect("/integrations?error=No+credential+saved+for+SMTP+yet");
    }
    const cfg = (record.config ?? {}) as { from?: string };
    const to =
      String(formData.get("verifyTo") ?? "").trim() || cfg.from || "ops@apexgroupcompanies.com";

    // @apex/integrations re-exports sendEmail; use it instead of a new console
    // dependency on @apex/auth.
    const { sendEmail } = await import("@apex/auth");
    let ok = false;
    let detail = "";
    try {
      await sendEmail({
        to,
        subject: "Apex SMTP verification",
        text: "If you received this, the Apex console SMTP transport is working.",
      });
      ok = true;
      detail = `Sent test to ${to}`;
    } catch (error) {
      detail = (error instanceof Error ? error.message : String(error)).slice(0, 180);
    }
    await prisma.integration.update({
      where: { provider: "smtp" },
      data: { lastTestedAt: new Date(), lastTestOk: ok, lastTestNote: detail },
    });
    await audit({
      actor,
      action: ok ? "integration.tested" : "integration.test_failed",
      entityType: "Integration",
      entityId: "smtp",
      summary: ok ? `SMTP verify sent to ${to}` : `SMTP verify failed: ${detail}`,
    });
    if (ok) {
      redirect(`/integrations?tested=SMTP+test+sent+to+${encodeURIComponent(to)}`);
    }
    redirect(`/integrations?error=SMTP+verify+failed:+${encodeURIComponent(detail.slice(0, 120))}`);
  }

  async function saveLeadNotify(formData: FormData) {
    "use server";
    const actor = await requirePermission("partner:write");

    const email = String(formData.get("leadNotifyTo") ?? "").trim().toLowerCase();

    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      redirect("/integrations?error=Enter+a+valid+notification+email+address");
    }

    await prisma.setting.upsert({
      where: { key: "notify.lead_to" },
      create: {
        key: "notify.lead_to",
        group: "notifications",
        label: "New-lead notification email",
        value: email,
      },
      update: { value: email },
    });

    await audit({
      actor,
      action: "partner.lead_notify.updated",
      entityType: "Setting",
      entityId: "notify.lead_to",
      summary: `New-lead notifications now go to ${email}`,
    });
    redirect("/integrations?saved=notify");
  }

  async function useEnvSmtp() {
    "use server";
    const actor = await requirePermission("partner:write");

    // Delete the managed row entirely so the env-var transport is live again
    // and nothing stale lingers to be re-enabled later.
    const existing = await prisma.integration.findUnique({ where: { provider: "smtp" } });
    if (existing) {
      await prisma.integration.delete({ where: { provider: "smtp" } });
      await audit({
        actor,
        action: "partner.smtp.cleared",
        entityType: "Integration",
        entityId: "smtp",
        summary: "SMTP transport reset to environment variables",
      });
    }
    redirect("/integrations?cleared=smtp");
  }

  async function setupSmtpFromEnv() {
    "use server";
    const actor = await requirePermission("partner:write");

    // One-click import: copy the live environment transport into the
    // console-managed row. No typing — the operator just clicks.
    const host = process.env.SMTP_HOST;
    if (!host) {
      redirect("/integrations?error=No+SMTP_HOST+set+in+the+environment");
    }
    const port = Number(process.env.SMTP_PORT ?? 587);
    const user = process.env.SMTP_USER?.trim() || undefined;
    const from = process.env.SMTP_FROM?.trim() || undefined;
    const replyTo = process.env.SMTP_REPLY_TO?.trim() || undefined;
    const password = process.env.SMTP_PASSWORD ?? "";
    const sealed = password ? seal(password) : null;

    await prisma.integration.upsert({
      where: { provider: "smtp" },
      create: {
        provider: "smtp",
        label: "SMTP email transport",
        isEnabled: true,
        config: { host, port, user, from, replyTo },
        ...(sealed
          ? {
              secretCiphertext: sealed.ciphertext,
              secretIv: sealed.iv,
              secretTag: sealed.tag,
              lastFour: sealed.lastFour,
            }
          : {}),
      },
      update: {
        isEnabled: true,
        config: { host, port, user, from, replyTo },
        ...(sealed
          ? {
              secretCiphertext: sealed.ciphertext,
              secretIv: sealed.iv,
              secretTag: sealed.tag,
              lastFour: sealed.lastFour,
            }
          : {}),
      },
    });

    await audit({
      actor,
      action: "partner.smtp.imported",
      entityType: "Integration",
      entityId: "smtp",
      summary: `SMTP configured from environment variables (${host}:${port})`,
    });
    redirect("/integrations?saved=smtp-env");
  }

  // What is actually driving outbound email right now — the managed row wins
  // whenever it exists and is enabled; otherwise env vars; otherwise nothing.
  const envHost = process.env.SMTP_HOST;
  const liveSource = smtp?.isEnabled && smtpCfg.host ? "console" : envHost ? "env" : "none";
  const effectiveFrom =
    smtpCfg.from || process.env.SMTP_FROM?.trim() || "ops@apexgroupcompanies.com";
  // Test recipient = bare email of the effective From ("Name <a@b.c>" → "a@b.c"),
  // so the operator can send the verification to their own address.
  const effectiveFromEmail = effectiveFrom.match(/<([^>]+)>/)?.[1] ?? effectiveFrom;

  return (
    <div className="flex flex-col gap-9">
      <div>
        <h1 className="text-2xl">Integrations</h1>
        <p className="mt-1 max-w-2xl text-[var(--ink-secondary)]">
          Hyperswitch is the payment gateway for invoices issued from the console. Twenty CRM is the
          partner-facing sales surface that every captured lead is synced into.
        </p>
      </div>

      {flash.saved === "smtp-env" ? (
        <p className="rounded-[var(--radius-md)] border border-[var(--color-success-200)] bg-[var(--color-success-100)] px-4 py-2 text-sm text-[var(--color-success-500)]">
          SMTP configured from your environment variables. Send a test email below to confirm.
        </p>
      ) : flash.saved || flash.tested ? (
        <p className="rounded-[var(--radius-md)] border border-[var(--color-success-200)] bg-[var(--color-success-100)] px-4 py-2 text-sm text-[var(--color-success-500)]">
          Saved.
        </p>
      ) : null}
      {flash.cleared ? (
        <p className="rounded-[var(--radius-md)] border border-[var(--color-success-200)] bg-[var(--color-success-100)] px-4 py-2 text-sm text-[var(--color-success-500)]">
          SMTP reset — outbound email now uses environment variables.
        </p>
      ) : null}
      {flash.error ? (
        <p className="rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--bg-sunken)] px-4 py-2 text-sm text-[var(--color-danger-500)]">
          {flash.error.replace(/\+/g, " ")}
        </p>
      ) : null}

      {/* ── Hyperswitch ─────────────────────────────────────────────── */}
      <section className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <p className="text-2xs font-semibold tracking-[0.16em] text-[var(--color-amber-700)] uppercase">
              Payment gateway
            </p>
            <h2 className="mt-1 text-xl">Hyperswitch</h2>
            <p className="mt-1 max-w-2xl text-sm text-[var(--ink-secondary)]">
              Open-source payments orchestrator. Routes a single payment through multiple processors
              and switches between them without an integration change. The API key is encrypted with
              AES-256-GCM and never leaves the server.
            </p>
          </div>
          {hyperswitch?.isEnabled ? (
            <span className="text-2xs rounded-full bg-[var(--color-success-100)] px-2.5 py-0.5 font-medium text-[var(--color-success-500)]">
              Enabled
            </span>
          ) : null}
        </div>

        <form action={saveHyperswitch} className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Base URL
            <input
              name="baseUrl"
              defaultValue={hsCfg.baseUrl ?? ""}
              placeholder="https://sandbox.hyperswitch.io"
              className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Profile ID
            <input
              name="profileId"
              defaultValue={hsCfg.profileId ?? ""}
              placeholder="pro_..."
              className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium md:col-span-2">
            Publishable key
            <input
              name="publishableKey"
              defaultValue={hsCfg.publishableKey ?? ""}
              placeholder="pk_..."
              className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 font-mono text-xs font-normal"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium">
            API key (secret)
            <input
              name="apiKey"
              type="password"
              autoComplete="off"
              placeholder={
                hyperswitch?.lastFour
                  ? `Leave blank to keep the current key ending ${hyperswitch.lastFour}`
                  : "sk_..."
              }
              className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 font-mono text-xs font-normal"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Webhook signing secret (optional)
            <input
              name="webhookSecret"
              type="password"
              autoComplete="off"
              placeholder={
                hyperswitch
                  ? (hyperswitch.config as { webhookLastFour?: string })?.webhookLastFour
                    ? `Leave blank to keep the current secret ending ${(hyperswitch.config as { webhookLastFour?: string }).webhookLastFour}`
                    : "whsec_..."
                  : "whsec_..."
              }
              className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 font-mono text-xs font-normal"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium md:col-span-2">
            Connector routing (comma-separated, optional)
            <input
              name="routing"
              defaultValue={(hsCfg.routing ?? []).join(", ")}
              placeholder="stripe, adyen, checkout"
              className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 font-mono text-xs font-normal"
            />
          </label>

          <label className="flex items-center gap-2 text-sm md:col-span-2">
            <input
              type="checkbox"
              name="isEnabled"
              defaultChecked={hyperswitch?.isEnabled ?? false}
              className="h-4 w-4 accent-[var(--accent)]"
            />
            Route payments through Hyperswitch
          </label>

          <div className="flex gap-3 md:col-span-2">
            <Button type="submit">Save</Button>
          </div>
        </form>

        <form action={testHyperswitch} className="mt-3">
          <Button type="submit" variant="secondary" size="sm">
            Test connection
          </Button>
        </form>

        {hyperswitch?.lastTestedAt ? (
          <p className="text-2xs mt-3 text-[var(--ink-muted)]">
            Last tested {hyperswitch.lastTestedAt.toLocaleString("en-GB")} —{" "}
            {hyperswitch.lastTestOk ? "OK" : "failed"}: {hyperswitch.lastTestNote}
          </p>
        ) : null}
      </section>

      {/* ── Twenty CRM ──────────────────────────────────────────────── */}
      <section className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <p className="text-2xs font-semibold tracking-[0.16em] text-[var(--color-amber-700)] uppercase">
              Partner CRM
            </p>
            <h2 className="mt-1 text-xl">Twenty CRM</h2>
            <p className="mt-1 max-w-2xl text-sm text-[var(--ink-secondary)]">
              Open-source CRM. Every lead captured on the public site is upserted here as a Person +
              optional Company, with stable external ids so re-syncs are idempotent. The API key is
              encrypted at rest and never sent to the browser.
            </p>
          </div>
          {twenty?.isEnabled ? (
            <span className="text-2xs rounded-full bg-[var(--color-success-100)] px-2.5 py-0.5 font-medium text-[var(--color-success-500)]">
              Enabled
            </span>
          ) : null}
        </div>

        <form action={saveTwenty} className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Base URL
            <input
              name="baseUrl"
              defaultValue={twCfg.baseUrl ?? ""}
              placeholder="https://api.twenty.com"
              className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Workspace slug (optional)
            <input
              name="workspaceSlug"
              defaultValue={twCfg.workspaceSlug ?? ""}
              placeholder="apex"
              className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium md:col-span-2">
            API key
            <input
              name="apiKey"
              type="password"
              autoComplete="off"
              placeholder={
                twenty?.lastFour
                  ? `Leave blank to keep the current key ending ${twenty.lastFour}`
                  : "twenty_..."
              }
              className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 font-mono text-xs font-normal"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium md:col-span-2">
            Webhook signing secret (optional)
            <input
              name="webhookSecret"
              type="password"
              autoComplete="off"
              placeholder={
                twenty?.webhookLastFour
                  ? `Leave blank to keep the current secret ending ${twenty.webhookLastFour}`
                  : "whsec_..."
              }
              className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 font-mono text-xs font-normal"
            />
          </label>

          <label className="flex items-center gap-2 text-sm md:col-span-2">
            <input
              type="checkbox"
              name="isEnabled"
              defaultChecked={twenty?.isEnabled ?? false}
              className="h-4 w-4 accent-[var(--accent)]"
            />
            Sync every lead into Twenty as Person + Company
          </label>

          <div className="flex gap-3 md:col-span-2">
            <Button type="submit">Save</Button>
          </div>
        </form>

        <form action={testTwenty} className="mt-3">
          <Button type="submit" variant="secondary" size="sm">
            Test connection
          </Button>
        </form>

        {twenty?.lastTestedAt ? (
          <p className="text-2xs mt-3 text-[var(--ink-muted)]">
            Last tested {twenty.lastTestedAt.toLocaleString("en-GB")} —{" "}
            {twenty.lastTestOk ? "OK" : "failed"}: {twenty.lastTestNote}
          </p>
        ) : null}
      </section>

      {/* ── SMTP (console-managed email transport) ──────────────────────────── */}
      <section className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <p className="text-2xs font-semibold tracking-[0.16em] text-[var(--color-amber-700)] uppercase">
              Transactional email
            </p>
            <h2 className="mt-1 text-xl">SMTP</h2>
            <p className="mt-1 max-w-2xl text-sm text-[var(--ink-secondary)]">
              Outbound email (lead notifications, invoice links, portal invitations). Sealed at
              rest; falls back to environment variables when left blank.
            </p>
          </div>
          {liveSource === "console" ? (
            <span className="text-2xs rounded-full bg-[var(--color-success-100)] px-2.5 py-0.5 font-medium text-[var(--color-success-500)]">
              Live: console config
            </span>
          ) : liveSource === "env" ? (
            <span className="text-2xs rounded-full bg-[var(--bg-sunken)] px-2.5 py-0.5 font-medium text-[var(--ink-secondary)]">
              Live: env vars
            </span>
          ) : (
            <span className="text-2xs rounded-full bg-[var(--color-danger-100)] px-2.5 py-0.5 font-medium text-[var(--color-danger-500)]">
              No transport
            </span>
          )}
        </div>

        {liveSource === "console" ? (
          <p className="text-2xs mt-3 text-[var(--ink-muted)]">
            Outbound email is sent through <strong>{smtpCfg.host}:{smtpCfg.port ?? 587}</strong>
            {smtpCfg.from ? ` as ${smtpCfg.from}` : ""}. Toggle off and save to fall back to
            environment variables.
          </p>
        ) : liveSource === "env" ? (
          <p className="text-2xs mt-3 text-[var(--ink-muted)]">
            Outbound email is sent using environment variables (
            <code className="font-mono">SMTP_HOST={envHost}</code>). Fill in the form below and
            toggle on to manage it from the console instead.
          </p>
        ) : (
          <p className="text-2xs mt-3 text-[var(--color-danger-500)]">
            No SMTP transport is configured — set <code className="font-mono">SMTP_HOST</code> in
            the environment or configure one below.
          </p>
        )}

        <form action={saveSmtp} className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Host
            <input
              name="host"
              defaultValue={smtpCfg.host ?? ""}
              placeholder="smtp-relay.brevo.com"
              className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Port
            <input
              name="port"
              defaultValue={smtpCfg.port ?? 587}
              placeholder="587"
              className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            User
            <input
              name="user"
              defaultValue={smtpCfg.user ?? ""}
              className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            From
            <input
              name="from"
              defaultValue={smtpCfg.from ?? ""}
              placeholder="Apex <noreply@apexgroupcompanies.com>"
              className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Reply-To
            <input
              name="replyTo"
              defaultValue={smtpCfg.replyTo ?? ""}
              placeholder="Leave blank for no reply-to header"
              className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium md:col-span-2">
            Password
            <input
              name="password"
              type="password"
              autoComplete="off"
              placeholder={
                smtp?.lastFour
                  ? `Leave blank to keep the current password ending ${smtp.lastFour}`
                  : "app-specific / SMTP password"
              }
              className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 font-mono text-xs font-normal"
            />
          </label>

          <label className="flex cursor-pointer items-center gap-3 md:col-span-2">
            <input type="checkbox" name="isEnabled" defaultChecked={smtp?.isEnabled ?? false} className="sr-only peer" />
            <span
              aria-hidden
              className="relative h-6 w-11 shrink-0 rounded-full bg-[var(--bg-sunken)] transition-colors peer-checked:bg-[var(--color-success-500)] after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5"
            />
            <span className="text-sm font-medium">
              Use this SMTP server for outbound email
              <span className="text-2xs block font-normal text-[var(--ink-muted)]">
                Off = environment variables drive outbound email
              </span>
            </span>
          </label>

          <div className="flex flex-wrap gap-3 md:col-span-2">
            <Button type="submit">Save</Button>
            {envHost && (!smtp || !smtp.isEnabled) ? (
              <Button type="submit" formAction={setupSmtpFromEnv} variant="secondary" size="sm">
                Set up from env vars (one click)
              </Button>
            ) : null}
            {smtp ? (
              <Button type="submit" formAction={useEnvSmtp} variant="secondary" size="sm">
                Reset to env vars
              </Button>
            ) : null}
          </div>
        </form>

        <form action={verifySmtp} className="mt-3 flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Verify send to
            <input
              name="verifyTo"
              defaultValue={effectiveFromEmail}
              className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
            />
          </label>
          <Button type="submit" variant="secondary" size="sm">
            Send test email
          </Button>
        </form>

        {smtp?.lastTestedAt ? (
          <p className="text-2xs mt-3 text-[var(--ink-muted)]">
            Last tested {smtp.lastTestedAt.toLocaleString("en-GB")} —{" "}
            {smtp.lastTestOk ? "OK" : "failed"}: {smtp.lastTestNote}
          </p>
        ) : null}
      </section>

      {/* ── Lead notifications (console-managed recipient) ──────────────────── */}
      <section className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-6">
        <div>
          <p className="text-2xs font-semibold tracking-[0.16em] text-[var(--color-amber-700)] uppercase">
            Email routing
          </p>
          <h2 className="mt-1 text-xl">New-lead notifications</h2>
          <p className="mt-1 max-w-2xl text-sm text-[var(--ink-secondary)]">
            Every enquiry captured on the five public sites notifies this inbox. Managed in the
            database so a recipient change does not need a redeploy or an env edit.
          </p>
        </div>

        <form action={saveLeadNotify} className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Notification recipient
            <input
              name="leadNotifyTo"
              type="email"
              required
              defaultValue={
                typeof leadNotifySetting?.value === "string" ? leadNotifySetting.value : ""
              }
              placeholder="sales@apexgroupcompanies.com"
              className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
            />
          </label>
          <div className="flex items-end">
            <Button type="submit">Save</Button>
          </div>
        </form>

        {!leadNotifySetting ? (
          <p className="text-2xs mt-3 text-[var(--ink-muted)]">
            Not saved in the database yet — notifications currently fall back to the
            LEAD_NOTIFY_TO env var or the sales inbox.
          </p>
        ) : null}
      </section>
    </div>
  );
}
