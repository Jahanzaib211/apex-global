import { prisma } from "@apex/db";
import { renderInvoiceHtml } from "@apex/ui";
import { requirePortalUserAccount } from "@/lib/portal/auth";
import { invoiceHeading } from "@/lib/portal/billing";

export const dynamic = "force-dynamic";

/**
 * Print-ready invoice document for the portal customer. Auth is the portal
 * session cookie, and the invoice is scoped to the signed-in account — the
 * same `lead.portalAccounts` join the page uses, so a customer can never
 * print another account's document.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { user } = await requirePortalUserAccount();
  const { id } = await params;

  const invoice = await prisma.invoice.findFirst({
    where: { id, lead: { portalAccounts: { some: { id: user.portalAccountId } } } },
    include: {
      quote: { select: { serviceSlug: true, productSlug: true } },
      lead: { select: { interestSlug: true } },
    },
  });
  if (!invoice) return new Response("Not found", { status: 404 });

  const html = renderInvoiceHtml({
    number: invoice.number,
    status: invoice.status,
    customerName: invoice.customerName,
    customerEmail: invoice.customerEmail,
    companyName: invoice.companyName,
    heading: invoiceHeading(invoice),
    lineItems: Array.isArray(invoice.lineItems)
      ? (invoice.lineItems as Array<{ description: string; quantity: number; unitAmount: number }>)
      : [],
    subtotalAmount: invoice.subtotalAmount,
    taxAmount: invoice.taxAmount,
    totalAmount: invoice.totalAmount,
    currency: invoice.currency,
    notes: invoice.notes,
    dueDate: invoice.dueDate,
    issuedAt: invoice.createdAt,
  });

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `inline; filename="invoice-${invoice.number}.html"`,
    },
  });
}