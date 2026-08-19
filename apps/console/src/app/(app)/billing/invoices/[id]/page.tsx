import { prisma } from "@apex/db";
import { hyperswitchFromConfig, open } from "@apex/integrations";
import { SectionHeading, Button } from "@apex/ui";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requirePermission } from "@/lib/auth";
import { audit } from "@/lib/audit";
import { nextSequential } from "@/lib/numbers";
import { parseLineItems, computeTotals, formatMinor, isLineItemsArray } from "@/lib/billing/line-items";
import {
  sendInvoiceEmail,
  sendInvoiceReminderEmail,
  sendInvoiceCancelledEmail,
} from "@/lib/billing/emails";
import {
  advanceLeadOnInvoiceSent,
  advanceLeadOnInvoicePaid,
} from "@/lib/crm/state-machine";
import { BillingEditor } from "@/components/billing/billing-editor";

export const dynamic = "force-dynamic";

const EDITABLE: string[] = ["DRAFT"];
const SENDABLE: string[] = ["DRAFT", "OVERDUE"];
const REMINDABLE: string[] = ["SENT", "OVERDUE"];
const REOPENABLE: string[] = ["PAID", "CANCELLED", "WRITE_OFF", "FAILED"];
const REMINDER_COOLDOWN_MS = 24 * 60 * 60 * 1000;

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    edit?: string;
    created?: string;
    saved?: string;
    sent?: string;
    reminded?: string;
    reopened?: string;
    paid?: string;
    writtenOff?: string;
    cancelled?: string;
    error?: string;
  }>;
};

export default async function InvoiceDetailPage({ params, searchParams }: Props) {
  await requirePermission("billing:read");
  const { id } = await params;
  const { edit, created, saved, sent, reminded, reopened, paid, writtenOff, cancelled, error } =
    await searchParams;

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: { lead: { include: { portalAccounts: true } } },
  });
  if (!invoice) notFound();

  const canEdit = EDITABLE.includes(invoice.status) && edit === "1";
  const auditEntries = await prisma.auditLog.findMany({
    where: { entityType: "Invoice", entityId: id },
    orderBy: { createdAt: "desc" },
    take: 12,
    include: { actor: { select: { name: true } } },
  });

  async function updateInvoice(formData: FormData) {
    "use server";
    const actor = await requirePermission("billing:write");
    const current = await prisma.invoice.findUnique({ where: { id } });
    if (!current || current.status !== "DRAFT") redirect(`/billing/invoices/${id}?error=cannot-edit`);

    const customerName = String(formData.get("customerName") ?? "").trim();
    const customerEmail = String(formData.get("customerEmail") ?? "").trim().toLowerCase();
    const companyName = String(formData.get("companyName") ?? "").trim() || null;
    const currency = (String(formData.get("currency") ?? "USD").trim() || "USD").toUpperCase();
    const notes = String(formData.get("notes") ?? "").trim() || null;
    const leadId = String(formData.get("leadId") ?? "").trim() || null;
    const dueRaw = String(formData.get("dueDate") ?? "").trim();
    const dueDate = dueRaw ? new Date(dueRaw) : null;

    const lineItems = parseLineItems(formData, currency);
    if (!customerName || !customerEmail || lineItems.length === 0) {
      redirect(`/billing/invoices/${id}?edit=1&error=missing-fields`);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      redirect(`/billing/invoices/${id}?edit=1&error=invalid-email`);
    }

    const totals = computeTotals(lineItems, Number(formData.get("taxAmount") ?? 0));

    await prisma.invoice.update({
      where: { id },
      data: {
        customerName,
        customerEmail,
        companyName,
        currency,
        notes,
        leadId,
        dueDate,
        lineItems,
        ...totals,
      },
    });
    await audit({
      actor,
      action: "billing.invoice_updated",
      entityType: "Invoice",
      entityId: id,
      summary: `Updated invoice ${current.number}`,
      changes: {
        totalAmount: { from: String(current.totalAmount), to: String(totals.totalAmount) },
        lineItems: {
          from: String((current.lineItems as Array<{ description: string }> | null)?.length ?? 0),
          to: String(lineItems.length),
        },
      },
    });
    redirect(`/billing/invoices/${id}?saved=1`);
  }

  async function duplicateInvoice() {
    "use server";
    const actor = await requirePermission("billing:write");
    const number = await nextSequential("invoice", "INV");
    const copy = await prisma.invoice.create({
      data: {
        number,
        status: "DRAFT",
        customerName: invoice!.customerName,
        customerEmail: invoice!.customerEmail,
        companyName: invoice!.companyName,
        lineItems: invoice!.lineItems ?? [],
        subtotalAmount: invoice!.subtotalAmount,
        taxAmount: invoice!.taxAmount,
        totalAmount: invoice!.totalAmount,
        currency: invoice!.currency,
        notes: invoice!.notes,
        leadId: invoice!.leadId,
        dueDate: invoice!.dueDate,
        quoteId: invoice!.quoteId,
        serviceSlug: invoice!.serviceSlug,
        productSlug: invoice!.productSlug,
      },
    });
    await audit({
      actor,
      action: "billing.invoice_duplicated",
      entityType: "Invoice",
      entityId: copy.id,
      summary: `Duplicated invoice ${invoice!.number} → ${number}`,
      changes: { from: { from: invoice!.number, to: number } },
    });
    redirect(`/billing/invoices/${copy.id}?created=1`);
  }

  async function sendInvoice() {
    "use server";
    const actor = await requirePermission("billing:write");
    if (!SENDABLE.includes(invoice!.status)) redirect(`/billing/invoices/${id}`);
    await prisma.invoice.update({
      where: { id },
      data: { status: "SENT", sentAt: new Date() },
    });
    try {
      await sendInvoiceEmail(invoice!);
    } catch (err) {
      console.error("[invoice] send email failed", err);
    }
    await audit({
      actor,
      action: "billing.invoice_sent",
      entityType: "Invoice",
      entityId: id,
      summary: `Sent invoice ${invoice!.number}`,
    });
    if (invoice!.leadId) {
      const lead = await prisma.lead.findUnique({ where: { id: invoice!.leadId } });
      if (lead) {
        await advanceLeadOnInvoiceSent(lead, actor, invoice!.number);
        if (lead.valueAmount == null) {
          await prisma.lead.update({
            where: { id: lead.id },
            data: { valueAmount: invoice!.totalAmount, valueCurrency: invoice!.currency },
          });
        }
      }
    }
    redirect(`/billing/invoices/${id}?sent=1`);
  }

  async function markPaid() {
    "use server";
    const actor = await requirePermission("billing:write");
    await prisma.invoice.update({
      where: { id },
      data: { status: "PAID", paymentProvider: "manual", paidAt: new Date() },
    });
    await audit({
      actor,
      action: "billing.invoice_marked_paid",
      entityType: "Invoice",
      entityId: id,
      summary: `Marked ${invoice!.number} paid (manual)`,
    });
    if (invoice!.leadId) {
      const lead = await prisma.lead.findUnique({ where: { id: invoice!.leadId } });
      if (lead) {
        await advanceLeadOnInvoicePaid(lead, actor, invoice!.number, invoice!.totalAmount);
      }
    }
    redirect(`/billing/invoices/${id}?paid=1`);
  }

  async function remindInvoice() {
    "use server";
    const actor = await requirePermission("billing:write");
    if (!REMINDABLE.includes(invoice!.status)) redirect(`/billing/invoices/${id}`);
    if (invoice!.lastReminderAt && Date.now() - invoice!.lastReminderAt.getTime() < REMINDER_COOLDOWN_MS) {
      redirect(`/billing/invoices/${id}?error=reminder-cooldown`);
    }
    await prisma.invoice.update({ where: { id }, data: { lastReminderAt: new Date() } });
    try {
      await sendInvoiceReminderEmail(invoice!);
    } catch (err) {
      console.error("[invoice] reminder email failed", err);
    }
    await audit({
      actor,
      action: "billing.invoice_reminder_sent",
      entityType: "Invoice",
      entityId: id,
      summary: `Sent payment reminder for ${invoice!.number}`,
    });
    redirect(`/billing/invoices/${id}?reminded=1`);
  }

  async function reopenInvoice() {
    "use server";
    const actor = await requirePermission("billing:write");
    if (!REOPENABLE.includes(invoice!.status)) redirect(`/billing/invoices/${id}`);
    await prisma.invoice.update({
      where: { id },
      data: { status: "DRAFT", paymentProvider: null, paymentRef: null, paidAt: null },
    });
    await audit({
      actor,
      action: "billing.invoice_reopened",
      entityType: "Invoice",
      entityId: id,
      summary: `Reopened ${invoice!.number} (${invoice!.status} → DRAFT)`,
      changes: { status: { from: invoice!.status, to: "DRAFT" } },
    });
    redirect(`/billing/invoices/${id}?reopened=1`);
  }

  async function writeOffInvoice() {
    "use server";
    const actor = await requirePermission("billing:write");
    await prisma.invoice.update({ where: { id }, data: { status: "WRITE_OFF" } });
    await audit({
      actor,
      action: "billing.invoice_written_off",
      entityType: "Invoice",
      entityId: id,
      summary: `Wrote off ${invoice!.number}`,
      changes: { status: { from: invoice!.status, to: "WRITE_OFF" } },
    });
    redirect(`/billing/invoices/${id}?written-off=1`);
  }

  /**
   * Generate a branded, Hyperswitch-hosted payment link.
   */
  async function createPaymentLink() {
    "use server";
    const actor = await requirePermission("billing:write");

    const integration = await prisma.partnerIntegration.findUnique({
      where: { provider: "hyperswitch" },
    });
    const cfg = (integration?.config ?? {}) as {
      baseUrl?: string;
      publishableKey?: string;
      profileId?: string;
      routing?: string[];
    };

    if (
      !integration?.isEnabled ||
      !cfg.baseUrl ||
      !cfg.profileId ||
      !integration.secretCiphertext ||
      !integration.secretIv ||
      !integration.secretTag
    ) {
      redirect(`/billing/invoices/${id}?error=gateway-not-configured`);
    }

    const client = hyperswitchFromConfig({
      baseUrl: cfg.baseUrl,
      apiKey: open({
        ciphertext: integration.secretCiphertext,
        iv: integration.secretIv,
        tag: integration.secretTag,
      }),
      publishableKey: cfg.publishableKey ?? "",
      profileId: cfg.profileId,
      routing: cfg.routing,
    });

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://tech.apexgroupcompanies.com";
    const expiresInSeconds = 14 * 24 * 60 * 60;

    try {
      const link = await client.createPaymentLink({
        amount: invoice!.totalAmount,
        currency: invoice!.currency,
        customerEmail: invoice!.customerEmail,
        customerName: invoice!.customerName,
        description: `Invoice ${invoice!.number}`,
        metadata: { invoiceId: invoice!.id, invoiceNumber: invoice!.number },
        returnUrl: `${siteUrl}/portal/invoices/${invoice!.id}/pay/return`,
        idempotencyKey: `invoice-link-${invoice!.id}`,
        branding: {
          merchantName: "Apex Global Tech Solution",
          themeColor: "#34385B",
          logoUrl: process.env.NEXT_PUBLIC_BRAND_LOGO_URL || undefined,
          expiresInSeconds,
        },
      });

      await prisma.invoice.update({
        where: { id },
        data: {
          paymentProvider: "hyperswitch",
          paymentRef: link.paymentId,
          paymentLinkUrl: link.secureUrl ?? link.url,
          paymentLinkExpiresAt: new Date(Date.now() + expiresInSeconds * 1000),
        },
      });

      await audit({
        actor,
        action: "billing.invoice_payment_link_created",
        entityType: "Invoice",
        entityId: id,
        summary: `Created payment link for ${invoice!.number}`,
      });
    } catch (err) {
      console.error("[invoice] payment link failed", err);
      redirect(`/billing/invoices/${id}?error=payment-link-failed`);
    }

    redirect(`/billing/invoices/${id}`);
  }

  async function cancelInvoice() {
    "use server";
    const actor = await requirePermission("billing:write");
    await prisma.invoice.update({ where: { id }, data: { status: "CANCELLED" } });
    try {
      await sendInvoiceCancelledEmail(invoice!);
    } catch (err) {
      console.error("[invoice] cancel email failed", err);
    }
    await audit({
      actor,
      action: "billing.invoice_cancelled",
      entityType: "Invoice",
      entityId: id,
      summary: `Cancelled ${invoice!.number}`,
    });
    redirect(`/billing/invoices/${id}?cancelled=1`);
  }

  const statusPill =
    invoice.status === "PAID" || invoice.status === "WRITE_OFF"
      ? "bg-[var(--color-success-100)] text-[var(--color-success-700)]"
      : invoice.status === "CANCELLED"
        ? "text-[var(--ink-muted)]"
        : invoice.status === "OVERDUE" || invoice.status === "FAILED"
          ? "bg-[var(--color-danger-100)] text-[var(--color-danger-700)]"
          : invoice.status === "SENT" || invoice.status === "PROCESSING"
            ? "bg-[var(--color-warning-100)] text-[var(--color-warning-700)]"
            : "";

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between">
        <SectionHeading
          eyebrow={`Invoice ${invoice.number}`}
          title={invoice.customerName}
          lede={invoice.companyName ?? undefined}
        />
        <Link href="/billing/invoices" className="text-sm underline-offset-4 hover:underline">
          ← All invoices
        </Link>
      </div>

      {created ? (
        <Banner tone="success">Invoice created. Edit it while it is still a draft, then send.</Banner>
      ) : null}
      {saved ? <Banner tone="success">Invoice saved.</Banner> : null}
      {sent ? <Banner tone="success">Invoice sent to {invoice.customerEmail}.</Banner> : null}
      {paid ? <Banner tone="success">Invoice marked as paid.</Banner> : null}
      {reminded ? <Banner tone="success">Payment reminder sent.</Banner> : null}
      {reopened ? <Banner tone="info">Invoice reopened as a draft.</Banner> : null}
      {writtenOff ? <Banner tone="info">Invoice written off.</Banner> : null}
      {cancelled ? <Banner tone="info">Invoice cancelled.</Banner> : null}
      {errors({ error }) ? <Banner tone="danger">{errors({ error })}</Banner> : null}

      {canEdit ? (
        <>
          <Banner tone="info">
            Editing a draft. Send, mark paid or cancel to lock the numbers.
          </Banner>
          <BillingEditor
            action={updateInvoice}
            submitLabel="Save changes"
            dateField={{ name: "dueDate", label: "Due date (optional)" }}
            cancelHref={`/billing/invoices/${id}`}
            initial={{
              customerName: invoice.customerName,
              customerEmail: invoice.customerEmail,
              companyName: invoice.companyName ?? "",
              currency: invoice.currency,
              taxMajor: invoice.taxAmount / 100,
              date: invoice.dueDate?.toISOString().slice(0, 10),
              notes: invoice.notes ?? "",
              lineItems: isLineItemsArray(invoice.lineItems)
                ? invoice.lineItems.map((l) => ({
                    description: l.description,
                    quantity: l.quantity,
                    unitAmount: l.unitAmount / 100,
                  }))
                : [],
              leadId: invoice.leadId ?? "",
              initialLead: invoice.lead
                ? {
                    id: invoice.lead.id,
                    name: invoice.lead.name,
                    email: invoice.lead.email,
                    companyName: invoice.lead.companyName,
                    defaultCurrency: invoice.lead.portalAccounts[0]?.defaultCurrency ?? null,
                  }
                : null,
            }}
          />
        </>
      ) : (
        <>
          <div className="mt-6 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-6">
            <div className="flex items-center justify-between">
              <span
                className={`text-2xs rounded-full px-2.5 py-0.5 font-medium tracking-[0.12em] uppercase ${statusPill}`}
              >
                {invoice.status}
              </span>
              <span className="font-display text-xl font-semibold">
                {formatMinor(invoice.totalAmount, invoice.currency)}
              </span>
            </div>

            <div className="mt-6 space-y-2 text-sm">
              {isLineItemsArray(invoice.lineItems) &&
                invoice.lineItems.map((l, i) => (
                  <div
                    key={i}
                    className="flex justify-between border-b border-[var(--border-subtle)] pb-2"
                  >
                    <span>
                      {l.description} <span className="text-[var(--ink-muted)]">× {l.quantity}</span>
                    </span>
                    <span>{formatMinor(l.unitAmount * l.quantity, invoice.currency)}</span>
                  </div>
                ))}
              <div className="flex justify-between pt-2 text-[var(--ink-secondary)]">
                <span>Subtotal</span>
                <span>{formatMinor(invoice.subtotalAmount, invoice.currency)}</span>
              </div>
              <div className="flex justify-between text-[var(--ink-secondary)]">
                <span>Tax</span>
                <span>{formatMinor(invoice.taxAmount, invoice.currency)}</span>
              </div>
              <div className="flex justify-between pt-1 font-medium">
                <span>Total</span>
                <span>{formatMinor(invoice.totalAmount, invoice.currency)}</span>
              </div>
            </div>

            {invoice.notes ? (
              <p className="mt-4 text-sm whitespace-pre-wrap text-[var(--ink-secondary)]">
                {invoice.notes}
              </p>
            ) : null}

            {invoice.leadId ? (
              <p className="text-2xs mt-4 text-[var(--ink-muted)]">
                Linked to lead {invoice.leadId}
                {invoice.lead?.portalAccounts?.length
                  ? ` · visible to portal account ${invoice.lead.portalAccounts[0]!.name}`
                  : " · (no portal account linked yet — convert the lead to a customer to expose it in the portal)"}
              </p>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-3">
              {invoice.status === "DRAFT" ? (
                <Link
                  href={`/billing/invoices/${id}?edit=1`}
                  className="inline-flex h-9 items-center rounded-[var(--radius-md)] bg-[var(--accent)] px-3.5 text-sm font-medium text-[var(--ink-on-accent)]"
                >
                  Edit
                </Link>
              ) : null}
              {SENDABLE.includes(invoice.status) ? (
                <form action={sendInvoice}>
                  <Button type="submit" size="sm">
                    Send to customer
                  </Button>
                </form>
              ) : null}
              {REMINDABLE.includes(invoice.status) ? (
                <form action={remindInvoice}>
                  <Button type="submit" size="sm" variant="secondary">
                    Send reminder
                  </Button>
                </form>
              ) : null}
              {invoice.status !== "PAID" &&
              invoice.status !== "CANCELLED" &&
              invoice.status !== "WRITE_OFF" ? (
                <form action={markPaid}>
                  <Button type="submit" size="sm" variant="secondary">
                    Mark paid (manual)
                  </Button>
                </form>
              ) : null}
              {invoice.status !== "PAID" &&
              invoice.status !== "CANCELLED" &&
              invoice.status !== "WRITE_OFF" ? (
                <form action={createPaymentLink}>
                  <Button type="submit" size="sm" variant="secondary">
                    {invoice.paymentLinkUrl ? "Regenerate payment link" : "Create payment link"}
                  </Button>
                </form>
              ) : null}
              {invoice.status === "FAILED" ? (
                <form action={writeOffInvoice}>
                  <Button type="submit" size="sm" variant="secondary">
                    Write off
                  </Button>
                </form>
              ) : null}
              {invoice.status !== "CANCELLED" && invoice.status !== "WRITE_OFF" ? (
                <form action={cancelInvoice}>
                  <Button type="submit" size="sm" variant="secondary">
                    Cancel
                  </Button>
                </form>
              ) : null}
              {REOPENABLE.includes(invoice.status) ? (
                <form action={reopenInvoice}>
                  <Button type="submit" size="sm" variant="ghost">
                    Reopen (to draft)
                  </Button>
                </form>
              ) : null}
              <form action={duplicateInvoice}>
                <Button type="submit" size="sm" variant="ghost">
                  Duplicate
                </Button>
              </form>
              <a
                href={`/api/console/invoices/${id}/pdf`}
                className="inline-flex h-9 items-center rounded-[var(--radius-md)] border border-[var(--border-default)] px-3.5 text-sm"
              >
                Print / PDF
              </a>
            </div>

            {invoice.paymentLinkUrl ? (
              <div className="mt-6 rounded-[var(--radius-md)] border border-[var(--border-subtle)] p-4">
                <p className="text-2xs tracking-[0.16em] text-[var(--ink-muted)] uppercase">
                  Payment link
                </p>
                <p className="mt-1 font-mono text-xs break-all select-all">{invoice.paymentLinkUrl}</p>
                <p className="text-2xs mt-2 text-[var(--ink-muted)]">
                  {invoice.paymentLinkExpiresAt
                    ? `Expires ${invoice.paymentLinkExpiresAt.toLocaleDateString("en-GB")}`
                    : "No expiry recorded"}
                  {" · "}
                  Anyone with this link can pay the invoice.
                </p>
              </div>
            ) : null}
          </div>

          {auditEntries.length > 0 ? (
            <div className="mt-6">
              <p className="text-2xs tracking-[0.16em] text-[var(--ink-muted)] uppercase">
                Activity
              </p>
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

function Banner({ tone, children }: { tone: "success" | "info" | "danger"; children: React.ReactNode }) {
  const styles = {
    success: "border-[var(--color-success-500)] bg-[var(--color-success-100)] text-[var(--color-success-700)]",
    info: "border-[var(--border-default)] bg-[var(--bg-sunken)] text-[var(--ink-secondary)]",
    danger: "border-[var(--color-danger-500)] bg-[var(--color-danger-100)] text-[var(--color-danger-700)]",
  } as const;
  return (
    <div className={`mt-4 rounded-[var(--radius-md)] border px-4 py-3 text-sm ${styles[tone]}`}>
      {children}
    </div>
  );
}

function errors(searchParams: { error?: string }): string | null {
  const msg = searchParams.error;
  if (!msg) return null;
  const map: Record<string, string> = {
    "cannot-edit": "Only draft invoices can be edited. Reopen it first if needed.",
    "missing-fields": "A customer name, email and at least one line item are required.",
    "invalid-email": "That customer email address does not look valid.",
    "reminder-cooldown": "A reminder was sent within the last 24 hours. Try again later.",
    "gateway-not-configured": "The payment gateway is not configured.",
    "payment-link-failed": "The payment link could not be created. Check the gateway integration.",
  };
  return map[msg] ?? "Something went wrong.";
}