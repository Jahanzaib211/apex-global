import { prisma } from "@apex/db";
import { open } from "@apex/integrations/vault";
import { clientFromConfig } from "@apex/integrations/hyperswitch";
import { SectionHeading } from "@apex/ui";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requirePortalUserAccount } from "@/lib/portal/auth";
import { Checkout } from "./checkout-client";

export const dynamic = "force-dynamic";

/**
 * Branded checkout for an invoice payment.
 *
 * The pay route creates the payment and redirects here with its id. This page
 * re-fetches the payment server-side to obtain a fresh `client_secret` — it is
 * never put in the URL, where it would leak through browser history, referrer
 * headers and server logs.
 *
 * Ownership is re-checked here rather than trusted from the redirect: a payment
 * id in a URL is guessable enough that this page must stand on its own.
 */
export default async function InvoiceCheckout({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ payment?: string }>;
}) {
  const { id } = await params;
  const { payment: paymentIdParam } = await searchParams;
  const { user } = await requirePortalUserAccount();

  const invoice = await prisma.invoice.findFirst({
    where: {
      id,
      lead: { portalAccounts: { some: { id: user.portalAccountId } } },
    },
  });
  if (!invoice) notFound();

  // Already settled — nothing to pay. Send them back rather than render a
  // checkout that would fail confusingly at confirm time.
  if (invoice.status !== "SENT" && invoice.status !== "OVERDUE") {
    redirect(`/portal/invoices/${invoice.id}`);
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

  const configured =
    integration?.isEnabled &&
    cfg.baseUrl &&
    cfg.profileId &&
    cfg.publishableKey &&
    integration.secretCiphertext &&
    integration.secretIv &&
    integration.secretTag;

  if (!configured) redirect(`/portal/invoices/${invoice.id}?error=payment-unavailable`);

  const paymentId = paymentIdParam ?? invoice.paymentRef;
  if (!paymentId) redirect(`/portal/invoices/${invoice.id}`);

  const client = clientFromConfig({
    baseUrl: cfg.baseUrl!,
    apiKey: open({
      ciphertext: integration!.secretCiphertext!,
      iv: integration!.secretIv!,
      tag: integration!.secretTag!,
    }),
    publishableKey: cfg.publishableKey!,
    profileId: cfg.profileId!,
    routing: cfg.routing,
  });

  let clientSecret: string | undefined;
  try {
    const payment = await client.retrievePayment(paymentId);
    // The payment must still belong to this invoice. Without this check a
    // customer could pin someone else's payment id onto their own invoice page.
    if (payment.metadata?.invoiceId && payment.metadata.invoiceId !== invoice.id) {
      redirect(`/portal/invoices/${invoice.id}`);
    }
    clientSecret = payment.clientSecret;
  } catch {
    redirect(`/portal/invoices/${invoice.id}?error=payment-unavailable`);
  }

  if (!clientSecret) redirect(`/portal/invoices/${invoice.id}?error=payment-unavailable`);

  const amountLabel = `${invoice.currency} ${(invoice.totalAmount / 100).toLocaleString()}`;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://tech.apexgroupcompanies.com";

  return (
    <div className="flex flex-col gap-8">
      <Link
        href={`/portal/invoices/${invoice.id}`}
        className="text-sm text-[var(--ink-secondary)] hover:underline"
      >
        ← Back to invoice
      </Link>

      <SectionHeading
        eyebrow={`Invoice ${invoice.number}`}
        title={`Pay ${amountLabel}`}
        lede="Choose how you'd like to pay. Your details are encrypted in transit and never stored by Apex."
      />

      <section className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-6">
        <Checkout
          clientSecret={clientSecret}
          publishableKey={cfg.publishableKey!}
          profileId={cfg.profileId!}
          baseUrl={cfg.baseUrl!}
          returnUrl={`${siteUrl}/portal/invoices/${invoice.id}/pay/return`}
          isSandbox={
            cfg.publishableKey!.includes("_test_") || cfg.publishableKey!.startsWith("pk_snd")
          }
          amountLabel={amountLabel}
        />
      </section>
    </div>
  );
}
