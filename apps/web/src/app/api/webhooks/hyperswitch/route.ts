import { prisma } from "@apex/db";
import {
  clientFromConfig,
  HyperswitchError,
  parseWebhookEvent,
} from "@apex/integrations/hyperswitch";
import type { HyperswitchClient } from "@apex/integrations/hyperswitch";
import { open } from "@apex/integrations/vault";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Hyperswitch webhook handler.
 *
 * Receives `payment.succeeded`, `payment.failed`, `payment.processing`,
 * `payment.cancelled` events from Hyperswitch and reconciles them against the
 * matching invoice in the billing ledger. Verification is performed before
 * the payload is trusted.
 *
 * Configured via the Hyperswitch dashboard → Webhooks → pointing at this URL.
 */
export async function POST(request: Request) {
  const rawBody = await request.text();
  // Hyperswitch sends `x-webhook-signature-512` (HMAC-SHA512 over the raw
  // body). The unsuffixed `x-webhook-signature` is read as a fallback only so a
  // future router build that renames it does not silently drop every event.
  const signatureHeader =
    request.headers.get("x-webhook-signature-512") ?? request.headers.get("x-webhook-signature");

  const integration = await prisma.partnerIntegration.findUnique({
    where: { provider: "hyperswitch" },
  });

  if (!integration?.isEnabled) {
    return NextResponse.json({ error: "Hyperswitch integration is not enabled" }, { status: 503 });
  }

  if (!integration.secretCiphertext || !integration.secretIv || !integration.secretTag) {
    return NextResponse.json({ error: "Hyperswitch is not configured" }, { status: 503 });
  }

  const cfg = (integration.config ?? {}) as {
    baseUrl?: string;
    publishableKey?: string;
    profileId?: string;
    routing?: string[];
  };

  // Prefer the webhook signing secret stored in its own sealed envelope
  // (sealed at rest in the `webhook*` columns). Fall back to the env var only
  // when nothing is stored. Use truthiness, not `??`, so an empty `.env.example`
  // value cannot shadow a real stored secret.
  let webhookSecret = process.env.HYPERSWITCH_WEBHOOK_SECRET ?? "";
  if (integration.webhookCiphertext && integration.webhookIv && integration.webhookTag) {
    try {
      webhookSecret = open({
        ciphertext: integration.webhookCiphertext,
        iv: integration.webhookIv,
        tag: integration.webhookTag,
      });
    } catch {
      // A corrupt envelope must not crash verification — fall through to the
      // missing-secret guard below, which returns a clean 503.
    }
  }

  const apiKey = open({
    ciphertext: integration.secretCiphertext,
    iv: integration.secretIv,
    tag: integration.secretTag,
  });

  const client: HyperswitchClient = clientFromConfig({
    baseUrl: cfg.baseUrl ?? "",
    apiKey,
    publishableKey: cfg.publishableKey ?? "",
    profileId: cfg.profileId ?? "",
    webhookSecret,
    routing: cfg.routing,
  });

  // Refuse unsigned traffic outright. This guard used to read
  // `!verify(...) && webhookSecret`, so with no secret configured the check was
  // skipped and an unauthenticated POST could mark any invoice PAID. An
  // unconfigured webhook is a broken webhook, not an open one.
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook signing is not configured" }, { status: 503 });
  }

  if (!client.verifyWebhookSignature(rawBody, signatureHeader ?? null)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // The payload is a `{ event_type, content: { object: {...} } }` envelope, not
  // a flat `{ type, data }` one — `parseWebhookEvent` owns that shape.
  const event = parseWebhookEvent(rawBody);
  if (!event) {
    return NextResponse.json({ error: "Malformed payload" }, { status: 400 });
  }

  const eventType = event.eventType;
  const paymentId = event.paymentId;
  const status = event.status;
  const invoiceId = event.metadata?.invoiceId;

  await prisma.partnerIntegration.update({
    where: { provider: "hyperswitch" },
    data: {
      lastEventAt: new Date(),
      lastEventKind: `webhook.${eventType} · ${paymentId ?? "—"} · ${status ?? "—"}`,
    },
  });

  if (invoiceId && paymentId) {
    // Reconcile the matching invoice. The status mapping follows Hyperswitch's
    // own status names — see packages/integrations/src/hyperswitch.ts.
    const mapped =
      status === "succeeded"
        ? "PAID"
        : status === "failed"
          ? "FAILED"
          : status === "cancelled"
            ? "CANCELLED"
            : status === "processing"
              ? "PROCESSING"
              : null;

    if (mapped) {
      try {
        await prisma.invoice.update({
          where: { id: invoiceId },
          data: {
            status: mapped,
            paymentProvider: "hyperswitch",
            paymentRef: paymentId,
            paidAt: mapped === "PAID" ? new Date() : null,
          },
        });
      } catch {
        // Invoice may not exist yet — the lead pipeline can fire before the
        // billing pipeline. Re-verify with the gateway if the reconciliation
        // missed: that gives us a single source of truth without a retry.
        try {
          const live = await client.retrievePayment(paymentId);
          if (live.status === "succeeded") {
            await prisma.invoice.update({
              where: { id: invoiceId },
              data: {
                status: "PAID",
                paymentProvider: "hyperswitch",
                paymentRef: paymentId,
                paidAt: new Date(),
              },
            });
          }
        } catch (error) {
          if (!(error instanceof HyperswitchError)) throw error;
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
