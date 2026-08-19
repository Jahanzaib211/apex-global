import { prisma } from "@apex/db";
import type { QuoteStatus } from "@apex/db";
import { SectionHeading, Button } from "@apex/ui";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requirePermission } from "@/lib/auth";
import { audit } from "@/lib/audit";
import { nextSequential } from "@/lib/numbers";
import { parseLineItems, computeTotals, formatMinor, isLineItemsArray } from "@/lib/billing/line-items";
import { sendQuoteEmail } from "@/lib/billing/emails";
import { advanceLeadOnQuoteAccepted } from "@/lib/crm/state-machine";
import { BillingEditor } from "@/components/billing/billing-editor";

export const dynamic = "force-dynamic";

const STATUSES: QuoteStatus[] = ["DRAFT", "SENT", "ACCEPTED", "REJECTED", "EXPIRED"];
const REOPENABLE: QuoteStatus[] = ["REJECTED", "EXPIRED"];

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ edit?: string; created?: string; saved?: string; sent?: string; error?: string }>;
};

export default async function QuoteDetailPage({ params, searchParams }: Props) {
  await requirePermission("billing:read");
  const { id } = await params;
  const { edit, created, saved, sent, error } = await searchParams;

  const found = await prisma.quote.findUnique({
    where: { id },
    include: { lead: { include: { portalAccounts: true } }, invoices: { select: { id: true, number: true } } },
  });
  if (!found) notFound();
  const quote = found;

  const canEdit = quote.status === "DRAFT" && edit === "1";
  const auditEntries = await prisma.auditLog.findMany({
    where: { entityType: "Quote", entityId: id },
    orderBy: { createdAt: "desc" },
    take: 12,
    include: { actor: { select: { name: true } } },
  });

  async function updateQuote(formData: FormData) {
    "use server";
    const actor = await requirePermission("billing:write");
    const current = await prisma.quote.findUnique({ where: { id } });
    if (!current || current.status !== "DRAFT") redirect(`/billing/quotes/${id}?error=cannot-edit`);

    const customerName = String(formData.get("customerName") ?? "").trim();
    const customerEmail = String(formData.get("customerEmail") ?? "").trim().toLowerCase();
    const companyName = String(formData.get("companyName") ?? "").trim() || null;
    const currency = (String(formData.get("currency") ?? "USD").trim() || "USD").toUpperCase();
    const notes = String(formData.get("notes") ?? "").trim() || null;
    const leadId = String(formData.get("leadId") ?? "").trim() || null;
    const validRaw = String(formData.get("validUntil") ?? "").trim();
    const validUntil = validRaw ? new Date(validRaw) : null;

    const lineItems = parseLineItems(formData, currency);
    if (!customerName || !customerEmail || lineItems.length === 0) {
      redirect(`/billing/quotes/${id}?edit=1&error=missing-fields`);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      redirect(`/billing/quotes/${id}?edit=1&error=invalid-email`);
    }

    const totals = computeTotals(lineItems, Number(formData.get("taxAmount") ?? 0));
    await prisma.quote.update({
      where: { id },
      data: {
        customerName,
        customerEmail,
        companyName,
        currency,
        notes,
        leadId,
        validUntil,
        lineItems,
        ...totals,
      },
    });
    await audit({
      actor,
      action: "billing.quote_updated",
      entityType: "Quote",
      entityId: id,
      summary: `Updated quote ${current.number}`,
      changes: {
        totalAmount: { from: String(current.totalAmount), to: String(totals.totalAmount) },
      },
    });
    redirect(`/billing/quotes/${id}?saved=1`);
  }

  async function duplicateQuote() {
    "use server";
    const actor = await requirePermission("billing:write");
    const number = await nextSequential("quote", "QT");
    const copy = await prisma.quote.create({
      data: {
        number,
        status: "DRAFT",
        customerName: quote!.customerName,
        customerEmail: quote!.customerEmail,
        companyName: quote!.companyName,
        lineItems: quote!.lineItems ?? [],
        subtotalAmount: quote!.subtotalAmount,
        taxAmount: quote!.taxAmount,
        totalAmount: quote!.totalAmount,
        currency: quote!.currency,
        notes: quote!.notes,
        validUntil: quote!.validUntil,
        leadId: quote!.leadId,
        serviceSlug: quote!.serviceSlug,
        productSlug: quote!.productSlug,
      },
    });
    await audit({
      actor,
      action: "billing.quote_duplicated",
      entityType: "Quote",
      entityId: copy.id,
      summary: `Duplicated quote ${quote!.number} → ${number}`,
    });
    redirect(`/billing/quotes/${copy.id}?created=1`);
  }

  async function sendQuote() {
    "use server";
    const actor = await requirePermission("billing:write");
    if (quote!.status !== "DRAFT") redirect(`/billing/quotes/${id}`);
    await prisma.quote.update({ where: { id }, data: { status: "SENT" } });
    try {
      await sendQuoteEmail(quote!);
    } catch (err) {
      console.error("[quote] send email failed", err);
    }
    await audit({
      actor,
      action: "billing.quote_sent",
      entityType: "Quote",
      entityId: id,
      summary: `Sent quote ${quote!.number}`,
    });
    redirect(`/billing/quotes/${id}?sent=1`);
  }

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
      changes: { status: { from: quote!.status, to: status } },
    });
    if (status === "ACCEPTED" && quote!.leadId) {
      const lead = await prisma.lead.findUnique({ where: { id: quote!.leadId } });
      if (lead) await advanceLeadOnQuoteAccepted(lead, actor, quote!.number);
    }
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
        serviceSlug: quote!.serviceSlug,
        productSlug: quote!.productSlug,
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
    if (quote!.leadId) {
      const lead = await prisma.lead.findUnique({ where: { id: quote!.leadId } });
      if (lead) await advanceLeadOnQuoteAccepted(lead, actor, quote!.number);
    }
    redirect(`/billing/invoices/${invoice.id}?created=1`);
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

      {created ? <Banner tone="success">Quote created. Edit it while it is still a draft, then send.</Banner> : null}
      {saved ? <Banner tone="success">Quote saved.</Banner> : null}
      {sent ? <Banner tone="success">Quote sent to {quote.customerEmail}.</Banner> : null}
      {error === "cannot-edit" ? <Banner tone="danger">Only draft quotes can be edited.</Banner> : null}
      {error === "missing-fields" ? <Banner tone="danger">A customer name, email and at least one line item are required.</Banner> : null}
      {error === "invalid-email" ? <Banner tone="danger">That customer email address does not look valid.</Banner> : null}

      {canEdit ? (
        <BillingEditor
          action={updateQuote}
          submitLabel="Save changes"
          dateField={{ name: "validUntil", label: "Valid until (optional)" }}
          cancelHref={`/billing/quotes/${id}`}
          initial={{
            customerName: quote.customerName,
            customerEmail: quote.customerEmail,
            companyName: quote.companyName ?? "",
            currency: quote.currency,
            taxMajor: quote.taxAmount / 100,
            date: quote.validUntil?.toISOString().slice(0, 10),
            notes: quote.notes ?? "",
            lineItems: isLineItemsArray(quote.lineItems)
              ? quote.lineItems.map((l) => ({
                  description: l.description,
                  quantity: l.quantity,
                  unitAmount: l.unitAmount / 100,
                }))
              : [],
            leadId: quote.leadId ?? "",
            initialLead: quote.lead
              ? {
                  id: quote.lead.id,
                  name: quote.lead.name,
                  email: quote.lead.email,
                  companyName: quote.lead.companyName,
                  defaultCurrency: quote.lead.portalAccounts[0]?.defaultCurrency ?? null,
                }
              : null,
          }}
        />
      ) : (
        <>
          <div className="mt-6 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-6">
            <div className="flex items-center justify-between">
              <span className="text-2xs rounded-full bg-[var(--bg-sunken)] px-2.5 py-0.5 font-medium tracking-[0.12em] text-[var(--ink-secondary)] uppercase">
                {quote.status}
              </span>
              <span className="font-display text-xl font-semibold">
                {formatMinor(quote.totalAmount, quote.currency)}
              </span>
            </div>

            <div className="mt-6 space-y-2 text-sm">
              {isLineItemsArray(quote.lineItems) &&
                quote.lineItems.map((l, i) => (
                  <div
                    key={i}
                    className="flex justify-between border-b border-[var(--border-subtle)] pb-2"
                  >
                    <span>
                      {l.description} <span className="text-[var(--ink-muted)]">× {l.quantity}</span>
                    </span>
                    <span>{formatMinor(l.unitAmount * l.quantity, quote.currency)}</span>
                  </div>
                ))}
              <div className="flex justify-between pt-2 text-[var(--ink-secondary)]">
                <span>Subtotal</span>
                <span>{formatMinor(quote.subtotalAmount, quote.currency)}</span>
              </div>
              <div className="flex justify-between text-[var(--ink-secondary)]">
                <span>Tax</span>
                <span>{formatMinor(quote.taxAmount, quote.currency)}</span>
              </div>
              <div className="flex justify-between pt-1 font-medium">
                <span>Total</span>
                <span>{formatMinor(quote.totalAmount, quote.currency)}</span>
              </div>
            </div>

            {quote.validUntil ? (
              <p className="text-2xs mt-4 text-[var(--ink-muted)]">
                Valid until {quote.validUntil.toLocaleDateString("en-GB")}
              </p>
            ) : null}

            {quote.invoices.length > 0 ? (
              <p className="text-2xs mt-2 text-[var(--ink-muted)]">
                Converted to{" "}
                <Link
                  href={`/billing/invoices/${quote.invoices[0]!.id}`}
                  className="underline underline-offset-2"
                >
                  invoice {quote.invoices[0]!.number}
                </Link>
              </p>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-3">
              {quote.status === "DRAFT" ? (
                <Link
                  href={`/billing/quotes/${id}?edit=1`}
                  className="inline-flex h-9 items-center rounded-[var(--radius-md)] bg-[var(--accent)] px-3.5 text-sm font-medium text-[var(--ink-on-accent)]"
                >
                  Edit
                </Link>
              ) : null}
              {quote.status === "DRAFT" ? (
                <form action={sendQuote}>
                  <Button type="submit" size="sm">
                    Send to customer
                  </Button>
                </form>
              ) : null}
              {quote.status === "DRAFT" || quote.status === "SENT" ? (
                <form action={convertToInvoice}>
                  <Button type="submit" size="sm" variant="secondary">
                    Convert to invoice
                  </Button>
                </form>
              ) : null}
              {REOPENABLE.includes(quote.status) ? (
                <form action={setStatus}>
                  <input type="hidden" name="status" value="DRAFT" />
                  <Button type="submit" size="sm" variant="secondary">
                    Reopen
                  </Button>
                </form>
              ) : null}
              <form action={duplicateQuote}>
                <Button type="submit" size="sm" variant="ghost">
                  Duplicate
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

          {auditEntries.length > 0 ? (
            <div className="mt-6">
              <p className="text-2xs tracking-[0.16em] text-[var(--ink-muted)] uppercase">Activity</p>
              <ul className="mt-2 space-y-2 text-sm">
                {auditEntries.map((a) => (
                  <li key={a.id} className="flex justify-between gap-4">
                    <span className="text-[var(--ink-secondary)]">{a.summary}</span>
                    <span className="shrink-0 text-xs text-[var(--ink-muted)]">
                      {a.actor?.name ?? "system"} · {a.createdAt.toLocaleString("en-GB")}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

function Banner({ tone, children }: { tone: "success" | "danger"; children: React.ReactNode }) {
  const styles = {
    success:
      "border-[var(--color-success-500)] bg-[var(--color-success-100)] text-[var(--color-success-700)]",
    danger: "border-[var(--color-danger-500)] bg-[var(--color-danger-100)] text-[var(--color-danger-700)]",
  } as const;
  return (
    <div className={`mt-4 rounded-[var(--radius-md)] border px-4 py-3 text-sm ${styles[tone]}`}>
      {children}
    </div>
  );
}