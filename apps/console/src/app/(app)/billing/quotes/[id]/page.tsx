import { prisma } from "@apex/db";
import type { QuoteStatus } from "@apex/db";
import { SectionHeading, Button } from "@apex/ui";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requirePermission } from "@/lib/auth";
import { audit } from "@/lib/audit";
import { nextSequential } from "@/lib/numbers";

export const dynamic = "force-dynamic";

const STATUSES: QuoteStatus[] = ["DRAFT", "SENT", "ACCEPTED", "REJECTED", "EXPIRED"];

type Props = { params: Promise<{ id: string }> };

export default async function QuoteDetailPage({ params }: Props) {
  await requirePermission("billing:read");
  const { id } = await params;
  const found = await prisma.quote.findUnique({ where: { id } });
  if (!found) notFound();
  const quote = found;

  async function setStatus(formData: FormData) {
    "use server";
    const actor = await requirePermission("billing:write");
    const status = String(formData.get("status") ?? "") as QuoteStatus;
    if (!STATUSES.includes(status)) return;
    await prisma.quote.update({
      where: { id },
      data: { status, acceptedAt: status === "ACCEPTED" ? new Date() : null },
    });
    await audit({
      actor,
      action: "billing.quote_status",
      entityType: "Quote",
      entityId: id,
      summary: `${quote!.number} → ${status}`,
    });
    redirect(`/billing/quotes/${id}`);
  }

  async function convertToInvoice() {
    "use server";
    const actor = await requirePermission("billing:write");
    const number = await nextSequential("invoice", "INV");
    const invoice = await prisma.invoice.create({
      data: {
        number,
        status: "DRAFT",
        customerName: quote!.customerName,
        customerEmail: quote!.customerEmail,
        companyName: quote!.companyName,
        subtotalAmount: quote!.subtotalAmount,
        taxAmount: quote!.taxAmount,
        totalAmount: quote!.totalAmount,
        currency: quote!.currency,
        notes: quote!.notes,
        lineItems: quote!.lineItems as object,
        quoteId: quote!.id,
        leadId: quote!.leadId,
      },
    });
    await prisma.quote.update({
      where: { id },
      data: { status: "ACCEPTED", acceptedAt: new Date() },
    });
    await audit({
      actor,
      action: "billing.quote_converted",
      entityType: "Quote",
      entityId: id,
      summary: `Quote ${quote!.number} → invoice ${number}`,
    });
    redirect(`/billing/invoices/${invoice.id}`);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between">
        <SectionHeading
          eyebrow={`Quote ${quote.number}`}
          title={quote.customerName}
          lede={quote.companyName ?? undefined}
        />
        <Link href="/billing/quotes" className="text-sm underline-offset-4 hover:underline">
          ← All quotes
        </Link>
      </div>

      <div className="mt-6 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-6">
        <div className="flex items-center justify-between">
          <span className="text-2xs rounded-full bg-[var(--bg-sunken)] px-2.5 py-0.5 font-medium tracking-[0.12em] text-[var(--ink-secondary)] uppercase">
            {quote.status}
          </span>
          <span className="font-display text-xl font-semibold">
            {quote.currency} {(quote.totalAmount / 100).toLocaleString()}
          </span>
        </div>

        <div className="mt-6 space-y-2 text-sm">
          {Array.isArray(quote.lineItems) &&
            (
              quote.lineItems as Array<{
                description: string;
                quantity: number;
                unitAmount: number;
              }>
            ).map((l, i) => (
              <div
                key={i}
                className="flex justify-between border-b border-[var(--border-subtle)] pb-2"
              >
                <span>
                  {l.description} <span className="text-[var(--ink-muted)]">× {l.quantity}</span>
                </span>
                <span>
                  {(l.unitAmount / 100).toLocaleString()} {quote.currency}
                </span>
              </div>
            ))}
          <div className="flex justify-between pt-2 font-medium">
            <span>Total</span>
            <span>
              {quote.currency} {(quote.totalAmount / 100).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <form action={convertToInvoice}>
            <Button type="submit" size="sm">
              Convert to invoice
            </Button>
          </form>
          <form action={setStatus} className="flex items-end gap-2">
            <select
              name="status"
              defaultValue={quote.status}
              className="h-9 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-2 text-sm"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <Button type="submit" size="sm" variant="secondary">
              Set status
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
