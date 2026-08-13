import { prisma } from "@apex/db";
import { SectionHeading, Button } from "@apex/ui";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requirePermission } from "@/lib/auth";
import { audit } from "@/lib/audit";
import { sendEmail } from "@apex/auth";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function InvoiceDetailPage({ params }: Props) {
  await requirePermission("billing:read");
  const { id } = await params;
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: { lead: { include: { portalAccounts: true } } },
  });
  if (!invoice) notFound();

  const portalLink = `${process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://tech.apexgroupcompanies.com"}/portal/invoices/${id}`;

  async function sendInvoice() {
    "use server";
    const actor = await requirePermission("billing:write");
    await prisma.invoice.update({ where: { id }, data: { status: "SENT", sentAt: new Date() } });
    try {
      await sendEmail({
        to: invoice!.customerEmail,
        subject: `Invoice ${invoice!.number} from Apex Global Tech Solution`,
        text: [
          `Hi ${invoice!.customerName},`,
          "",
          `Your invoice ${invoice!.number} for ${invoice!.currency} ${(invoice!.totalAmount / 100).toLocaleString()} is ready.`,
          "You can view and pay it here:",
          portalLink,
        ].join("\n"),
      });
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
    redirect(`/billing/invoices/${id}`);
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
    redirect(`/billing/invoices/${id}`);
  }

  async function cancelInvoice() {
    "use server";
    const actor = await requirePermission("billing:write");
    await prisma.invoice.update({ where: { id }, data: { status: "CANCELLED" } });
    await audit({
      actor,
      action: "billing.invoice_cancelled",
      entityType: "Invoice",
      entityId: id,
      summary: `Cancelled ${invoice!.number}`,
    });
    redirect(`/billing/invoices/${id}`);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between">
        <SectionHeading
          eyebrow={`Invoice ${invoice!.number}`}
          title={invoice!.customerName}
          lede={invoice!.companyName ?? undefined}
        />
        <Link href="/billing/invoices" className="text-sm underline-offset-4 hover:underline">
          ← All invoices
        </Link>
      </div>

      <div className="mt-6 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-6">
        <div className="flex items-center justify-between">
          <span className="text-2xs rounded-full bg-[var(--bg-sunken)] px-2.5 py-0.5 font-medium tracking-[0.12em] text-[var(--ink-secondary)] uppercase">
            {invoice!.status}
          </span>
          <span className="font-display text-xl font-semibold">
            {invoice!.currency} {(invoice!.totalAmount / 100).toLocaleString()}
          </span>
        </div>

        <div className="mt-6 space-y-2 text-sm">
          {Array.isArray(invoice!.lineItems) &&
            (
              invoice!.lineItems as Array<{
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
                  {(l.unitAmount / 100).toLocaleString()} {invoice!.currency}
                </span>
              </div>
            ))}
          <div className="flex justify-between pt-2 font-medium">
            <span>Total</span>
            <span>
              {invoice!.currency} {(invoice!.totalAmount / 100).toLocaleString()}
            </span>
          </div>
        </div>

        {invoice!.leadId ? (
          <p className="text-2xs mt-4 text-[var(--ink-muted)]">
            Linked to lead {invoice!.leadId}
            {invoice!.lead?.portalAccounts?.length
              ? ` · visible to portal account ${invoice!.lead.portalAccounts[0]!.name}`
              : " · (no portal account linked yet — convert the lead to a customer to expose it in the portal)"}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          {invoice!.status !== "PAID" && invoice!.status !== "CANCELLED" ? (
            <form action={sendInvoice}>
              <Button type="submit" size="sm">
                Send to customer
              </Button>
            </form>
          ) : null}
          {invoice!.status !== "PAID" && invoice!.status !== "CANCELLED" ? (
            <form action={markPaid}>
              <Button type="submit" size="sm" variant="secondary">
                Mark paid (manual)
              </Button>
            </form>
          ) : null}
          {invoice!.status !== "CANCELLED" ? (
            <form action={cancelInvoice}>
              <Button type="submit" size="sm" variant="secondary">
                Cancel
              </Button>
            </form>
          ) : null}
        </div>
      </div>
    </div>
  );
}
