import { prisma } from "@apex/db";
import { SectionHeading } from "@apex/ui";
import Link from "next/link";
import { requirePermission } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function InvoicesPage() {
  await requirePermission("billing:read");

  const invoices = await prisma.invoice.findMany({ orderBy: [{ createdAt: "desc" }] });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <SectionHeading
          eyebrow="Billing"
          title="Invoices"
          lede="Issued invoices and their payment state."
        />
        <Link
          href="/billing/invoices/new"
          className="inline-flex h-11 items-center rounded-[var(--radius-md)] bg-[var(--accent)] px-5 text-sm font-medium text-[var(--ink-on-accent)]"
        >
          New invoice
        </Link>
      </div>

      {invoices.length === 0 ? (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] bg-[var(--bg-raised)] p-8 text-center">
          <h2 className="text-lg font-semibold">No invoices yet</h2>
          <p className="mt-2 text-sm text-[var(--ink-secondary)]">
            Create an invoice, or convert one from a quote.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {invoices.map((inv) => (
            <Link
              key={inv.id}
              href={`/billing/invoices/${inv.id}`}
              className="flex items-center justify-between gap-3 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-4 transition-colors hover:border-[var(--color-amber-500)]"
            >
              <div>
                <p className="font-medium">{inv.number}</p>
                <p className="text-2xs text-[var(--ink-muted)]">
                  {inv.customerName}
                  {inv.companyName ? ` · ${inv.companyName}` : ""}
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-lg font-semibold">
                  {inv.currency} {(inv.totalAmount / 100).toLocaleString()}
                </p>
                <p className="text-2xs tracking-[0.12em] text-[var(--ink-muted)] uppercase">
                  {inv.status}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
