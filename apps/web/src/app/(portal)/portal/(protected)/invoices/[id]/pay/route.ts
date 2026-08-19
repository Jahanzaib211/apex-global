import { prisma } from "@apex/db";
import { open } from "@apex/integrations/vault";
import { clientFromConfig } from "@apex/integrations/hyperswitch";
import { NextResponse } from "next/server";
import { requirePortalUserAccount } from "@/lib/portal/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /portal/invoices/[id]/pay — create a Hyperswitch payment for this
 * invoice and hand the customer off to the payment page.
 *
 * Scopes strictly to the signed-in account, then creates a payment that
 * carries `invoiceId` in its metadata so the webhook handler can reconcile
 * the result back to the ledger. When the gateway's stored config is not
 * enabled the route responds clearly instead of crashing.
 */
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user } = await requirePortalUserAccount();

  const integration = await prisma.partnerIntegration.findUnique({
    where: { provider: "hyperswitch" },
  });

  const baseUrl = (integration?.config as { baseUrl?: string } | null)?.baseUrl;
  const enabled = Boolean(integration?.isEnabled && baseUrl);
  const configured =
    enabled &&
    Boolean(integration?.secretCiphertext && integration.secretIv && integration.secretTag);
  const profileId = (integration?.config as { profileId?: string } | null)?.profileId;

  if (!enabled || !configured || !profileId) {
    return NextResponse.json(
      {
        error:
          "Online payment is not configured yet. Please contact us to settle this invoice by bank transfer or card over the phone.",
      },
      { status: 503 },
    );
  }

  const invoice = await prisma.invoice.findFirst({
    where: {
      id,
      lead: { portalAccounts: { some: { id: user.portalAccountId } } },
      status: { in: ["SENT", "OVERDUE"] },
    },
  });
  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found or not payable." }, { status: 404 });
  }

  const apiKey = open({
    ciphertext: integration!.secretCiphertext!,
    iv: integration!.secretIv!,
    tag: integration!.secretTag!,
  });

  const client = clientFromConfig({
    baseUrl: baseUrl!,
    apiKey,
    publishableKey: (integration!.config as { publishableKey?: string }).publishableKey ?? "",
    profileId,
    routing: (integration!.config as { routing?: string[] }).routing,
  });

  try {
    const payment = await client.createPayment({
      amount: invoice.totalAmount,
      currency: invoice.currency,
      customerEmail: invoice.customerEmail,
      customerName: invoice.customerName,
      description: `Invoice ${invoice.number}`,
      // The webhook handler keys its reconciliation off `metadata.invoiceId`.
      metadata: { invoiceId: invoice.id, invoiceNumber: invoice.number },
      returnUrl: `${process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://tech.apexgroupcompanies.com"}/portal/invoices/${invoice.id}/pay/return`,
      idempotencyKey: `invoice-${invoice.id}`,
    });

    // Leave the invoice in SENT/OVERDUE until the gateway (webhook or the
    // return-route reconcile) confirms the outcome. Flipping to PROCESSING
    // here would orphan a payable invoice if the customer abandoned the 3DS
    // flow before completing it.
    await prisma.invoice.update({
      where: { id: invoice.id },
      data: { paymentProvider: "hyperswitch", paymentRef: payment.id },
    });

    // The invoice page submits a plain <form>, so anything returned here is
    // rendered directly by the browser. Both success paths must therefore be
    // redirects — returning JSON would show the customer a page of raw text.
    if (payment.nextAction?.redirectUrl) {
      return NextResponse.redirect(payment.nextAction.redirectUrl, { status: 303 });
    }
    if (payment.clientSecret) {
      // Hand off to the branded checkout. Only the payment id travels in the
      // URL; the checkout page re-fetches the client secret server-side so it
      // never reaches browser history or referrer headers.
      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
        "https://tech.apexgroupcompanies.com";
      return NextResponse.redirect(
        `${siteUrl}/portal/invoices/${invoice.id}/pay/checkout?payment=${encodeURIComponent(payment.id)}`,
        { status: 303 },
      );
    }
    return NextResponse.json(
      { error: "The gateway did not return a payment target. Please try again." },
      { status: 502 },
    );
  } catch (error) {
    console.error("Invoice pay failed", error);
    return NextResponse.json(
      { error: "We could not start the payment just now. Please try again or contact us." },
      { status: 502 },
    );
  }
}
