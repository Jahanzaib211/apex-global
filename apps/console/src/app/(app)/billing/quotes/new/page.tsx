import { prisma } from "@apex/db";
import { SectionHeading, Button } from "@apex/ui";
import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/auth";
import { audit } from "@/lib/audit";
import { nextSequential } from "@/lib/numbers";

export const dynamic = "force-dynamic";

export default async function NewQuotePage() {
  await requirePermission("billing:write");
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: { id: true, name: true, email: true, companyName: true },
  });

  async function createQuote(formData: FormData) {
    "use server";
    const actor = await requirePermission("billing:write");

    const customerName = String(formData.get("customerName") ?? "").trim();
    const customerEmail = String(formData.get("customerEmail") ?? "").trim();
    const companyName = String(formData.get("companyName") ?? "").trim() || null;
    const currency = String(formData.get("currency") ?? "USD").trim() || "USD";
    const taxAmount = Math.round(Number(formData.get("taxAmount") ?? 0) * 100) || 0;
    const notes = String(formData.get("notes") ?? "").trim() || null;
    const leadId = String(formData.get("leadId") ?? "").trim() || null;
    const validUntilRaw = String(formData.get("validUntil") ?? "").trim();
    const validUntil = validUntilRaw ? new Date(validUntilRaw) : null;

    // Parse repeated line items: desc_0, qty_0, amount_0, ...
    const lineItems: {
      description: string;
      quantity: number;
      unitAmount: number;
      currency: string;
    }[] = [];
    for (let i = 0; ; i++) {
      const desc = String(formData.get(`desc_${i}`) ?? "").trim();
      if (!desc) break;
      const quantity = Number(formData.get(`qty_${i}`) ?? 1) || 1;
      const unitAmount = Math.round(Number(formData.get(`amount_${i}`) ?? 0) * 100);
      lineItems.push({ description: desc, quantity, unitAmount, currency });
    }
    if (!customerName || !customerEmail || lineItems.length === 0) {
      redirect("/billing/quotes/new?error=missing-fields");
    }

    const subtotal = lineItems.reduce((s, l) => s + l.unitAmount * l.quantity, 0);
    const total = subtotal + taxAmount;
    const number = await nextSequential("quote", "QT");

    await prisma.quote.create({
      data: {
        number,
        status: "DRAFT",
        customerName,
        customerEmail,
        companyName,
        lineItems,
        subtotalAmount: subtotal,
        taxAmount,
        totalAmount: total,
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
      entityId: number,
      summary: `Created quote ${number}`,
    });
    redirect("/billing/quotes");
  }

  return (
    <div className="mx-auto max-w-3xl">
      <SectionHeading eyebrow="Billing" title="New quote" />
      <form
        action={createQuote}
        className="mt-6 flex flex-col gap-5 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Customer name
            <input
              name="customerName"
              required
              className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Customer email
            <input
              name="customerEmail"
              type="email"
              required
              className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Company (optional)
            <input
              name="companyName"
              className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Currency
            <input
              name="currency"
              defaultValue="USD"
              className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Tax amount (major units)
            <input
              name="taxAmount"
              type="number"
              step="0.01"
              defaultValue="0"
              className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Valid until (optional)
            <input
              name="validUntil"
              type="date"
              className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
            />
          </label>
        </div>

        <fieldset className="border-t border-[var(--border-subtle)] pt-4">
          <legend className="text-sm font-medium">Line items</legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-12">
            <input
              name="desc_0"
              placeholder="Description"
              className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal sm:col-span-6"
            />
            <input
              name="qty_0"
              type="number"
              step="1"
              defaultValue="1"
              placeholder="Qty"
              className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal sm:col-span-2"
            />
            <input
              name="amount_0"
              type="number"
              step="0.01"
              placeholder="Unit (major)"
              className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal sm:col-span-4"
            />
            <input
              name="desc_1"
              placeholder="Description (optional)"
              className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal sm:col-span-6"
            />
            <input
              name="qty_1"
              type="number"
              step="1"
              defaultValue="1"
              placeholder="Qty"
              className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal sm:col-span-2"
            />
            <input
              name="amount_1"
              type="number"
              step="0.01"
              placeholder="Unit (major)"
              className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal sm:col-span-4"
            />
          </div>
        </fieldset>

        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Notes
          <textarea
            name="notes"
            rows={3}
            className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 py-2 text-sm font-normal"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Link to lead (optional id)
          <select
            name="leadId"
            className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
          >
            <option value="">— none —</option>
            {leads.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name} ({l.email})
              </option>
            ))}
          </select>
        </label>

        <div>
          <Button type="submit" size="lg">
            Create quote
          </Button>
        </div>
      </form>
    </div>
  );
}
