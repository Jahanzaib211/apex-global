import { prisma } from "@apex/db";
import { SectionHeading } from "@apex/ui";
import Link from "next/link";
import { requirePortalUserAccount } from "@/lib/portal/auth";
import { invoiceHeading, invoiceSortRank } from "@/lib/portal/billing";

export const dynamic = "force-dynamic";

export default async function PortalInvoicesPage() {
  const { user } = await requirePortalUserAccount();

  const invoices = await prisma.invoice.findMany({
    where: { lead: { portalAccounts: { some: { id: user.portalAccountId } } } },
    include: {
      quote: { select: { serviceSlug: true, productSlug: true } },
      lead: { select: { interestSlug: true } },
    },
  });
  invoices.sort((a, b) => invoiceSortRank(a.status) - invoiceSortRank(b.status) ||
    b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <div className="flex flex-col gap-8">
      <SectionHeading
        eyebrow="Invoices"
        title="Your invoices"
        lede="Every invoice issued to your account, scoped to your data only."
      />

      {invoices.length === 0 ? (
        <Empty
          title="No invoices yet"
          body="When an Apex team member issues a quote or invoice, it will appear here."
        />
      ) : (
        <div className="grid gap-4">
          {invoices.map((inv) => (
            <Link
              key={inv.id}
              href={`/portal/invoices/${inv.id}`}
              className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-5 transition-colors hover:border-[var(--color-amber-500)] md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-2xs font-semibold tracking-[0.16em] text-[var(--ink-muted)] uppercase">
                  {inv.number}
                </p>
                <p className="mt-1 text-lg font-semibold">{invoiceHeading(inv)}</p>
                <p className="text-sm text-[var(--ink-secondary)]">
                  Issued {inv.createdAt.toLocaleDateString("en-GB")}
                  {inv.dueDate ? ` · Due ${inv.dueDate.toLocaleDateString("en-GB")}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-display text-xl font-semibold">
                  {inv.currency} {(inv.totalAmount / 100).toLocaleString()}
                </p>
                <span
                  className={`text-2xs rounded-full px-3 py-1 font-medium uppercase ${
                    inv.status === "PAID"
                      ? "bg-[var(--color-success-100)] text-[var(--color-success-500)]"
                      : inv.status === "OVERDUE"
                        ? "bg-[var(--color-danger-100)] text-[var(--color-danger-500)]"
                        : "bg-[var(--bg-sunken)] text-[var(--ink-secondary)]"
                  }`}
                >
                  {inv.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Empty({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] bg-[var(--bg-raised)] p-8 text-center">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-[var(--ink-secondary)]">{body}</p>
    </div>
  );
}
