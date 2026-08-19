export type LineItem = {
  description: string;
  quantity: number;
  unitAmount: number;
  currency: string;
};

export type LineItemDraft = {
  description: string;
  quantity: number;
  unitAmount: number;
};

/**
 * Parse the `desc_N` / `qty_N` / `amount_N` field triples out of a form.
 *
 * Input amounts are major units ("500.00"); they are converted to minor units
 * here, exactly once, so the client preview and the persisted record can never
 * disagree. A blank description terminates the loop (rows are contiguous), so
 * the editor can append rows freely without the server caring how many there
 * are.
 */
export function parseLineItems(formData: FormData, currency: string): LineItem[] {
  const items: LineItem[] = [];
  for (let i = 0; ; i++) {
    const description = String(formData.get(`desc_${i}`) ?? "").trim();
    if (!description) break;
    const quantity = Math.max(1, Number(formData.get(`qty_${i}`) ?? 1) || 1);
    const unitAmount = Math.round(Number(formData.get(`amount_${i}`) ?? 0) * 100);
    if (!Number.isInteger(unitAmount) || unitAmount < 0) continue;
    items.push({ description, quantity, unitAmount, currency });
  }
  return items;
}

/** Subtotal / tax / total in minor units. Tax is given in major units. */
export function computeTotals(
  items: Pick<LineItem, "quantity" | "unitAmount">[],
  taxMajor = 0,
): { subtotalAmount: number; taxAmount: number; totalAmount: number } {
  const subtotalAmount = items.reduce((s, l) => s + l.unitAmount * l.quantity, 0);
  const taxAmount = Math.round(Number(taxMajor) * 100) || 0;
  return { subtotalAmount, taxAmount, totalAmount: subtotalAmount + taxAmount };
}

/** Minor units → "1,234.56". */
export function formatMinor(amount: number, currency = "USD"): string {
  return `${currency} ${(amount / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function isLineItemsArray(value: unknown): value is LineItem[] {
  return (
    Array.isArray(value) &&
    value.every(
      (l) =>
        typeof l === "object" &&
        l !== null &&
        typeof (l as LineItem).description === "string" &&
        typeof (l as LineItem).quantity === "number" &&
        typeof (l as LineItem).unitAmount === "number",
    )
  );
}

export type HeadingRecord = {
  serviceSlug?: string | null;
  productSlug?: string | null;
  lead?: { interestSlug?: string | null } | null;
  lineItems?: unknown;
};

/**
 * The human title for a billing record, falling down the chain:
 * quote's service slug → quote's product slug → lead's interest slug → first
 * line item → neutral fallback.
 */
export function invoiceHeading(record: HeadingRecord): string {
  if (record.serviceSlug) return record.serviceSlug;
  if (record.productSlug) return record.productSlug;
  if (record.lead?.interestSlug) return record.lead.interestSlug;
  if (isLineItemsArray(record.lineItems) && record.lineItems[0]?.description) {
    return record.lineItems[0].description;
  }
  return "Custom engagement";
}