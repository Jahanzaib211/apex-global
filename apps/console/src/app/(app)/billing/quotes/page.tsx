import { prisma } from "@apex/db";
import { SectionHeading } from "@apex/ui";
import Link from "next/link";
import { requirePermission } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function QuotesPage() {
  await requirePermission("billing:read");

  const quotes = await prisma.quote.findMany({ orderBy: [{ createdAt: "desc" }] });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <SectionHeading
          eyebrow="Billing"
          title="Quotes"
          lede="Proposals sent to leads and clients."
        />
        <Link
          href="/billing/quotes/new"
          className="inline-flex h-11 items-center rounded-[var(--radius-md)] bg-[var(--accent)] px-5 text-sm font-medium text-[var(--ink-on-accent)]"
        >
          New quote
        </Link>
      </div>

      {quotes.length === 0 ? (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] bg-[var(--bg-raised)] p-8 text-center">
          <h2 className="text-lg font-semibold">No quotes yet</h2>
          <p className="mt-2 text-sm text-[var(--ink-secondary)]">
            Create a quote to start the billing loop.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {quotes.map((q) => (
            <Link
              key={q.id}
              href={`/billing/quotes/${q.id}`}
              className="flex items-center justify-between gap-3 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-4 transition-colors hover:border-[var(--color-amber-500)]"
            >
              <div>
                <p className="font-medium">{q.number}</p>
                <p className="text-2xs text-[var(--ink-muted)]">
                  {q.customerName}
                  {q.companyName ? ` · ${q.companyName}` : ""}
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-lg font-semibold">
                  {q.currency} {(q.totalAmount / 100).toLocaleString()}
                </p>
                <p className="text-2xs tracking-[0.12em] text-[var(--ink-muted)] uppercase">
                  {q.status}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
