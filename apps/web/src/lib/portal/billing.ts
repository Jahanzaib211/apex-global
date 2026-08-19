import "server-only";
import type { InvoiceStatus } from "@apex/db";

export type InvoiceHeadingRecord = {
  quote?: { serviceSlug?: string | null; productSlug?: string | null } | null;
  lead?: { interestSlug?: string | null } | null;
  lineItems?: unknown;
};

function isLineItemsArray(value: unknown): value is Array<{ description: string }> {
  return (
    Array.isArray(value) &&
    value.every((l) => typeof l === "object" && l !== null && typeof (l as { description?: unknown }).description === "string")
  );
}

/**
 * What a customer sees as the invoice title. Falls down the chain:
 * quote's service slug → quote's product slug → lead's interest slug → the
 * first line item's description → a neutral fallback. Never "Custom
 * engagement" when we already know what the engagement is.
 */
export function invoiceHeading(inv: InvoiceHeadingRecord): string {
  if (inv.quote?.serviceSlug) return inv.quote.serviceSlug;
  if (inv.quote?.productSlug) return inv.quote.productSlug;
  if (inv.lead?.interestSlug) return inv.lead.interestSlug;
  if (isLineItemsArray(inv.lineItems) && inv.lineItems[0]?.description) {
    return inv.lineItems[0].description;
  }
  return "Custom engagement";
}

/**
 * Display order for the portal invoice list: what needs attention first.
 * OVERDUE beats SENT beats DRAFT beats in-flight PROCESSING, then settled
 * states, then dead states.
 */
const RANK: Record<InvoiceStatus, number> = {
  OVERDUE: 0,
  SENT: 1,
  DRAFT: 2,
  PROCESSING: 3,
  PAID: 4,
  FAILED: 5,
  CANCELLED: 6,
  WRITE_OFF: 7,
};

export function invoiceSortRank(status: InvoiceStatus): number {
  return RANK[status] ?? 8;
}