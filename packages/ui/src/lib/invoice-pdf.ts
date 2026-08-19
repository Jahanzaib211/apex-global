export type InvoicePdfData = {
  number: string;
  status: string;
  customerName: string;
  customerEmail: string;
  companyName?: string | null;
  heading: string;
  lineItems: Array<{ description: string; quantity: number; unitAmount: number }>;
  subtotalAmount: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  notes?: string | null;
  dueDate?: Date | string | null;
  issuedAt?: Date | string | null;
};

const minor = (amount: number, currency: string) =>
  `${currency} ${(amount / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const date = (value?: Date | string | null) =>
  value ? new Date(value).toLocaleDateString("en-GB") : "—";

/**
 * A self-contained, print-ready invoice document. Rendered to a string so the
 * console and the portal can serve it from their own authenticated routes
 * without sharing server-only code — the template is pure presentation.
 */
export function renderInvoiceHtml(invoice: InvoicePdfData): string {
  const rows = invoice.lineItems
    .map(
      (l) => `
        <tr>
          <td>${escapeHtml(l.description)}</td>
          <td class="num">${l.quantity}</td>
          <td class="num">${minor(l.unitAmount, invoice.currency)}</td>
          <td class="num">${minor(l.unitAmount * l.quantity, invoice.currency)}</td>
        </tr>`,
    )
    .join("");

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>Invoice ${escapeHtml(invoice.number)}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; color: #1a1d2e; margin: 0; }
  .page { max-width: 720px; margin: 0 auto; padding: 48px 56px; }
  header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #34385b; padding-bottom: 24px; }
  .brand { font-size: 22px; font-weight: 700; letter-spacing: 0.02em; color: #34385b; }
  .brand span { color: #b45309; }
  h1 { font-size: 28px; margin: 4px 0 0; }
  .meta { text-align: right; font-size: 13px; color: #555a75; }
  .meta strong { color: #1a1d2e; }
  .customer { margin-top: 32px; font-size: 14px; line-height: 1.6; }
  table { width: 100%; margin-top: 28px; border-collapse: collapse; font-size: 14px; }
  th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #555a75; border-bottom: 1px solid #e4e6ee; padding: 8px 6px; }
  td { padding: 10px 6px; border-bottom: 1px solid #eef0f5; }
  .num { text-align: right; }
  tfoot td { border-bottom: none; padding-top: 14px; font-size: 14px; }
  tfoot tr.total td { font-weight: 700; font-size: 16px; color: #34385b; }
  .status { display: inline-block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; padding: 3px 10px; border: 1px solid #cbd0dd; border-radius: 999px; margin-top: 10px; }
  .notes { margin-top: 28px; font-size: 13px; color: #555a75; white-space: pre-wrap; }
  footer { margin-top: 56px; border-top: 1px solid #e4e6ee; padding-top: 16px; font-size: 12px; color: #8b90a6; display: flex; justify-content: space-between; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .page { padding: 24px 32px; } }
</style>
</head>
<body>
  <div class="page">
    <header>
      <div>
        <div class="brand">Apex Global Tech <span>Solution</span></div>
        <h1>${escapeHtml(invoice.heading)}</h1>
      </div>
      <div class="meta">
        <div><strong>Invoice ${escapeHtml(invoice.number)}</strong></div>
        <div>Issued ${date(invoice.issuedAt)}</div>
        <div>Due ${date(invoice.dueDate)}</div>
        <div><span class="status">${escapeHtml(invoice.status)}</span></div>
      </div>
    </header>

    <div class="customer">
      <strong>${escapeHtml(invoice.customerName)}</strong><br />
      ${invoice.companyName ? `${escapeHtml(invoice.companyName)}<br />` : ""}
      ${escapeHtml(invoice.customerEmail)}
    </div>

    <table>
      <thead>
        <tr><th>Description</th><th class="num">Qty</th><th class="num">Unit price</th><th class="num">Amount</th></tr>
      </thead>
      <tbody>${rows}</tbody>
      <tfoot>
        <tr><td colspan="3">Subtotal</td><td class="num">${minor(invoice.subtotalAmount, invoice.currency)}</td></tr>
        <tr><td colspan="3">Tax</td><td class="num">${minor(invoice.taxAmount, invoice.currency)}</td></tr>
        <tr class="total"><td colspan="3">Total</td><td class="num">${minor(invoice.totalAmount, invoice.currency)}</td></tr>
      </tfoot>
    </table>

    ${invoice.notes ? `<div class="notes">${escapeHtml(invoice.notes)}</div>` : ""}

    <footer>
      <span>Apex Global Tech Solution · info@apexgroupcompanies.com</span>
      <span>${escapeHtml(invoice.number)} · ${escapeHtml(invoice.currency)}</span>
    </footer>
  </div>
</body>
</html>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}