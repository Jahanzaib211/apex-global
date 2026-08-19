import { prisma } from "@apex/db";
import { SectionHeading } from "@apex/ui";
import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/auth";
import { audit } from "@/lib/audit";
import { nextSequential } from "@/lib/numbers";
import { parseLineItems, computeTotals } from "@/lib/billing/line-items";
import { BillingEditor } from "@/components/billing/billing-editor";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ leadId?: string }> };

export default async function NewQuotePage({ searchParams }: Props) {
  await requirePermission("billing:write");
  const { leadId } = await searchParams;

  const initialLead = leadId
    ? await prisma.lead.findUnique({
        where: { id: leadId },
        select: {
          id: true,
          name: true,
          email: true,
          companyName: true,
          portalAccounts: { select: { defaultCurrency: true }, take: 1 },
        },
      })
    : null;

  async function createQuote(formData: FormData) {
    "use server";
    const actor = await requirePermission("billing:write");

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
      redirect("/billing/quotes/new?error=missing-fields");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      redirect("/billing/quotes/new?error=invalid-email");
    }

    const { subtotalAmount, taxAmount, totalAmount } = computeTotals(
      lineItems,
      Number(formData.get("taxAmount") ?? 0),
    );
    const number = await nextSequential("quote", "QT");

    const quote = await prisma.quote.create({
      data: {
        number,
        status: "DRAFT",
        customerName,
        customerEmail,
        companyName,
        lineItems,
        subtotalAmount,
        taxAmount,
        totalAmount,
        currency,
        notes,
        validUntil,
        leadId,
      },
    });
    await audit({
      actor,
      action: "billing.quote_created",
      entityType: "Quote",
      entityId: quote.id,
      summary: `Created quote ${number}`,
      changes: {
        totalAmount: { from: null, to: String(totalAmount) },
        currency: { from: null, to: currency },
      },
    });
    redirect(`/billing/quotes/${quote.id}?created=1`);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <SectionHeading
        eyebrow="Billing"
        title="New quote"
        lede={
          initialLead
            ? `Pre-filled from lead ${initialLead.name}.`
            : "Pick a lead to pre-fill the customer, or enter the details by hand."
        }
      />
      <BillingEditor
        action={createQuote}
        submitLabel="Create quote"
        dateField={{ name: "validUntil", label: "Valid until (optional)" }}
        cancelHref="/billing/quotes"
        initial={
          initialLead
            ? {
                customerName: initialLead.name,
                customerEmail: initialLead.email,
                companyName: initialLead.companyName ?? "",
                currency: initialLead.portalAccounts[0]?.defaultCurrency ?? "USD",
                leadId: initialLead.id,
                initialLead: {
                  id: initialLead.id,
                  name: initialLead.name,
                  email: initialLead.email,
                  companyName: initialLead.companyName,
                  defaultCurrency: initialLead.portalAccounts[0]?.defaultCurrency ?? null,
                },
              }
            : undefined
        }
      />
    </div>
  );
}