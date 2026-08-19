import { prisma } from "@apex/db";
import { renderInvoiceHtml } from "@apex/ui";
import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth";
import { isLineItemsArray, invoiceHeading } from "@/lib/billing/line-items";

export const dynamic = "force-dynamic";

/**
 * Print-ready invoice document for the console. Auth is the console session
 * cookie; the response is HTML with a print stylesheet, so "Print → Save as
 * PDF" from the browser produces a branded PDF without a rendering dependency.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await requirePermission("billing:read");
  const { id } = await params;
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: { quote: { select: { serviceSlug: true, productSlug: true } }, lead: { select: { interestSlug: true } } },
  });
  if (!invoice) notFound();

  const html = renderInvoiceHtml({
    number: invoice.number,
    status: invoice.status,
    customerName: invoice.customerName,
    customerEmail: invoice.customerEmail,
    companyName: invoice.companyName,
    heading: invoiceHeading(invoice),
    lineItems: isLineItemsArray(invoice.lineItems)
      ? invoice.lineItems.map((l) => ({
          description: l.description,
          quantity: l.quantity,
          unitAmount: l.unitAmount,
        }))
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