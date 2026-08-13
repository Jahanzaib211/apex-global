import { prisma } from "@apex/db";
import { SectionHeading } from "@apex/ui";
import { notFound } from "next/navigation";
import Link from "next/link";
import { requirePortalUserAccount } from "@/lib/portal/auth";

export const dynamic = "force-dynamic";

export default async function PortalInvoiceDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user } = await requirePortalUserAccount();

  const invoice = await prisma.invoice.findFirst({
    where: {
      id,
      lead: { portalAccounts: { some: { id: user.portalAccountId } } },
    },
    include: { quote: true },
  });
  if (!invoice) notFound();

  return (
    <div className="flex flex-col gap-8">
      <Link href="/portal/invoices" className="text-sm text-[var(--ink-secondary)] hover:underline">
        ← All invoices
      </Link>

      <SectionHeading
        eyebrow={`Invoice ${invoice.number}`}
        title={`${invoice.currency} ${(invoice.totalAmount / 100).toLocaleString()}`}
        lede={`Issued ${invoice.createdAt.toLocaleDateString("en-GB")} · ${invoice.status}`}
      />

      <section className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-6">
        <dl className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Subtotal"
            value={`${invoice.currency} ${(invoice.subtotalAmount / 100).toLocaleString()}`}
          />
          <Field
            label="Tax"
            value={`${invoice.currency} ${(invoice.taxAmount / 100).toLocaleString()}`}
          />
          <Field
            label="Total"
            value={`${invoice.currency} ${(invoice.totalAmount / 100).toLocaleString()}`}
          />
          <Field
            label="Paid"
            value={invoice.paidAt ? invoice.paidAt.toLocaleDateString("en-GB") : "—"}
          />
        </dl>
      </section>

      {invoice.status === "SENT" || invoice.status === "OVERDUE" ? (
        <section className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-6">
          <h2 className="text-lg font-semibold">Pay this invoice</h2>
          <p className="mt-1 text-sm text-[var(--ink-secondary)]">
            Payment is processed by Hyperswitch — a single integration that routes through multiple
            providers to keep your card data off our servers.
          </p>
          <form action={`/portal/invoices/${invoice.id}/pay`} method="post" className="mt-4">
            <button
              type="submit"
              className="inline-flex h-11 items-center rounded-[var(--radius-md)] bg-[var(--accent)] px-5 text-sm font-medium text-[var(--ink-on-accent)]"
            >
              Pay {invoice.currency} {(invoice.totalAmount / 100).toLocaleString()}
            </button>
          </form>
        </section>
      ) : null}

      {invoice.notes ? (
        <section className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-6">
          <h2 className="text-lg font-semibold">Notes</h2>
          <p className="mt-2 text-sm whitespace-pre-wrap text-[var(--ink-secondary)]">
            {invoice.notes}
          </p>
        </section>
      ) : null}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-2xs tracking-[0.16em] text-[var(--ink-muted)] uppercase">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium">{value}</dd>
    </div>
  );
}
