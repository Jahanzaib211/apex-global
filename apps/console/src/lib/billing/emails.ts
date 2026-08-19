import "server-only";
import { sendEmail } from "@apex/auth";
import { invoiceHeading, isLineItemsArray } from "./line-items";

const siteUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://tech.apexgroupcompanies.com";

type BillingRecord = {
  id: string;
  number: string;
  customerName: string;
  customerEmail: string;
  currency: string;
  totalAmount: number;
  dueDate?: Date | null;
  serviceSlug?: string | null;
  productSlug?: string | null;
  lineItems?: unknown;
  lead?: { interestSlug?: string | null } | null;
};

export async function sendInvoiceEmail(invoice: BillingRecord) {
  const link = `${siteUrl()}/portal/invoices/${invoice.id}`;
  await sendEmail({
    to: invoice.customerEmail,
    subject: `Invoice ${invoice.number} from Apex Global Tech Solution`,
    text: [
      `Hi ${invoice.customerName},`,
      "",
      `Your invoice ${invoice.number} for ${(invoice.totalAmount / 100).toLocaleString()} ${invoice.currency} is ready.`,
      "You can view and pay it here:",
      link,
      "",
      invoiceHeading(invoice),
    ].join("\n"),
  });
}

export async function sendInvoiceReminderEmail(invoice: BillingRecord) {
  const link = `${siteUrl()}/portal/invoices/${invoice.id}`;
  await sendEmail({
    to: invoice.customerEmail,
    subject: `Reminder: Invoice ${invoice.number} from Apex Global Tech Solution`,
    text: [
      `Hi ${invoice.customerName},`,
      "",
      `A friendly reminder that invoice ${invoice.number} for ${(invoice.totalAmount / 100).toLocaleString()} ${invoice.currency} is due.`,
      invoice.dueDate ? `It was due on ${invoice.dueDate.toLocaleDateString("en-GB")}.` : "",
      "You can view and pay it here:",
      link,
      "",
      "If you have already paid, thank you — please ignore this message.",
    ]
      .filter(Boolean)
      .join("\n"),
  });
}

export async function sendInvoiceCancelledEmail(invoice: BillingRecord) {
  await sendEmail({
    to: invoice.customerEmail,
    subject: `Invoice ${invoice.number} cancelled`,
    text: [
      `Hi ${invoice.customerName},`,
      "",
      `Invoice ${invoice.number} from Apex Global Tech Solution has been cancelled.`,
      "No payment is due. If you have any questions, reply to this email.",
    ].join("\n"),
  });
}

export async function sendQuoteEmail(quote: BillingRecord) {
  const lines = isLineItemsArray(quote.lineItems)
    ? quote.lineItems
        .map((l) => `  · ${l.description} × ${l.quantity} — ${(l.unitAmount * l.quantity / 100).toLocaleString()} ${quote.currency}`)
        .join("\n")
    : "";
  await sendEmail({
    to: quote.customerEmail,
    subject: `Quote ${quote.number} from Apex Global Tech Solution`,
    text: [
      `Hi ${quote.customerName},`,
      "",
      `Your quote ${quote.number} for ${(quote.totalAmount / 100).toLocaleString()} ${quote.currency} is ready.`,
      lines ? ["", "What it includes:", lines].join("\n") : "",
      "",
      "Reply to this email to accept the quote, or ask for changes.",
    ]
      .filter(Boolean)
      .join("\n"),
  });
}