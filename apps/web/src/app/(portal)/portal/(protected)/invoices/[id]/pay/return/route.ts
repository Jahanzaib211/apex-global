import { prisma } from "@apex/db";
import { open } from "@apex/integrations/vault";
import { clientFromConfig, HyperswitchError } from "@apex/integrations/hyperswitch";
import { NextResponse } from "next/server";
import { requirePortalUserAccount } from "@/lib/portal/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /portal/invoices/[id]/pay/return — Hyperswitch 3DS / redirect return.
 *
 * After the customer completes (or abandons) the gateway's redirect flow it
 * sends them back here with the payment id and outcome. We confirm server-side
 * so the invoice status reflects reality without waiting for the webhook, then
 * drop the user back on the invoice page (which already renders live status).
 *
 * The exact return params depend on the provisioned merchant profile. We read
 * every plausible name defensively — `payment_id` / `payment_intent_id` for the
 * id, and `redirect_status` / `status` for the outcome — and fall back to the
 * invoice's stored `paymentRef` when the redirect omits the id.
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user } = await requirePortalUserAccount();

  const url = new URL(request.url);
  const paymentId =
    url.searchParams.get("payment_id") ?? url.searchParams.get("payment_intent_id") ?? null;
  const clientSecret =
    url.searchParams.get("client_secret") ?? url.searchParams.get("redirect_client_secret") ?? null;

  const invoice = await prisma.invoice.findFirst({
    where: {
      id,
      lead: { portalAccounts: { some: { id: user.portalAccountId } } },
    },
  });
  if (!invoice) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://tech.apexgroupcompanies.com"}/portal/invoices`,
      { status: 303 },
    );
  }

  const integration = await prisma.partnerIntegration.findUnique({
    where: { provider: "hyperswitch" },
  });
  const cfg = (integration?.config ?? {}) as {
    baseUrl?: string;
    publishableKey?: string;
    profileId?: string;
    routing?: string[];
  };

  const effectiveId = paymentId ?? invoice.paymentRef;
  const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://tech.apexgroupcompanies.com"}/portal/invoices/${invoice.id}`;

  if (!integration?.secretCiphertext || !integration.secretIv || !integration.secretTag) {
    return NextResponse.redirect(redirectTo, { status: 303 });
  }

  const apiKey = open({
    ciphertext: integration.secretCiphertext,
    iv: integration.secretIv,
    tag: integration.secretTag,
  });

  const client = clientFromConfig({
    baseUrl: cfg.baseUrl ?? "",
    apiKey,
    publishableKey: cfg.publishableKey ?? "",
    profileId: cfg.profileId ?? "",
    routing: cfg.routing,
  });

  try {
    let payment = null;
    if (effectiveId && clientSecret) {
      payment = await client.confirmPayment(effectiveId, clientSecret);
    } else if (effectiveId) {
      // No client secret in the redirect — reconcile straight from the gateway
      // rather than guessing. The webhook remains the source of truth.
      payment = await client.retrievePayment(effectiveId);
    }

    if (payment) {
      const mapped =
        payment.status === "succeeded"
          ? "PAID"
          : payment.status === "failed"
            ? "FAILED"
            : payment.status === "cancelled"
              ? "CANCELLED"
              : payment.status === "processing"
                ? "PROCESSING"
                : null;
      if (mapped) {
        await prisma.invoice.update({
          where: { id: invoice.id },
          data: {
            status: mapped,
            paymentProvider: "hyperswitch",
            paymentRef: payment.id,
            paidAt: mapped === "PAID" ? new Date() : null,
          },
        });
      }
    }
  } catch (error) {
    // A failed confirm must not strand the user on an error page — the invoice
    // page shows the current (still-correct) status. Log for the operator.
    if (!(error instanceof HyperswitchError)) {
      console.error("Invoice return confirm failed", error);
    }
  }

  return NextResponse.redirect(redirectTo, { status: 303 });
}
