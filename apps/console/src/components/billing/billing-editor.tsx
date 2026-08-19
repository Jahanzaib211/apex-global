"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@apex/ui";
import { computeTotals, formatMinor } from "@/lib/billing/line-items";

type LineItemRow = { description: string; quantity: number; unitAmount: number };
type LeadOption = {
  id: string;
  name: string;
  email: string;
  companyName: string | null;
  interestSlug: string | null;
  stage: string;
  portalAccountName: string | null;
  defaultCurrency: string | null;
};
type CatalogEntry = {
  id: string;
  kind: "SERVICE" | "PRODUCT" | "CUSTOM";
  name: string;
  description: string | null;
  unitAmount: number | null;
  currency: string;
  source: "catalog" | "service" | "product";
};

export type BillingEditorProps = {
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
  dateField: { name: "dueDate" | "validUntil"; label: string };
  initial?: {
    customerName?: string;
    customerEmail?: string;
    companyName?: string;
    currency?: string;
    taxMajor?: number;
    date?: string;
    notes?: string;
    lineItems?: LineItemRow[];
    leadId?: string;
    initialLead?: Pick<LeadOption, "id" | "name" | "email" | "companyName" | "defaultCurrency"> | null;
  };
  cancelHref?: string;
};

const EMPTY_ROW: LineItemRow = { description: "", quantity: 1, unitAmount: 0 };

async function json<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`GET ${url} failed`);
  return (await res.json()) as T;
}

/**
 * The invoice/quote editor shared by the create and DRAFT-edit forms.
 *
 * Renders inside a native server-action form (the action arrives as a prop
 * from the server page), so the submission path is identical for create and
 * edit: named inputs → FormData → server action. Everything here is present-
 * ation: live totals, lead auto-fill and the price-module picker.
 */
export function BillingEditor({
  action,
  submitLabel,
  dateField,
  initial,
  cancelHref,
}: BillingEditorProps) {
  const [rows, setRows] = useState<LineItemRow[]>(
    initial?.lineItems?.length ? initial.lineItems : [EMPTY_ROW],
  );
  const [customerName, setCustomerName] = useState(initial?.customerName ?? "");
  const [customerEmail, setCustomerEmail] = useState(initial?.customerEmail ?? "");
  const [companyName, setCompanyName] = useState(initial?.companyName ?? "");
  const [currency, setCurrency] = useState(initial?.currency ?? "USD");
  const [taxMajor, setTaxMajor] = useState(initial?.taxMajor ?? 0);
  const [leadId, setLeadId] = useState(initial?.leadId ?? "");
  const [lead, setLead] = useState<LeadOption | null>(
    initial?.initialLead
      ? {
          id: initial.initialLead.id,
          name: initial.initialLead.name,
          email: initial.initialLead.email,
          companyName: initial.initialLead.companyName,
          interestSlug: null,
          stage: "",
          portalAccountName: null,
          defaultCurrency: initial.initialLead.defaultCurrency,
        }
      : null,
  );
  const [leadQuery, setLeadQuery] = useState("");
  const [leadResults, setLeadResults] = useState<LeadOption[]>([]);
  const [leadOpen, setLeadOpen] = useState(false);

  const [catalogRow, setCatalogRow] = useState<number | null>(null);
  const [catalogQuery, setCatalogQuery] = useState("");
  const [catalogEntries, setCatalogEntries] = useState<CatalogEntry[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const catalogDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leadDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  // The editor state is in major units (that is what the inputs show and the
  // catalogue picker stores), while computeTotals expects minor units — that
  // is the contract every server-side caller uses. Convert exactly once here
  // so the live preview agrees with what gets persisted.
  const totals = computeTotals(
    rows.map((r) => ({ quantity: r.quantity, unitAmount: Math.round(r.unitAmount * 100) })),
    taxMajor,
  );

  const searchLeads = useCallback(async (q: string) => {
    if (!q.trim()) {
      setLeadResults([]);
      return;
    }
    try {
      const data = await json<{ entries: LeadOption[] }>(
        `/api/console/leads-search?q=${encodeURIComponent(q.trim())}`,
      );
      setLeadResults(data.entries);
    } catch {
      setLeadResults([]);
    }
  }, []);

  const searchCatalog = useCallback(async (q: string) => {
    setCatalogLoading(true);
    try {
      const data = await json<{ entries: CatalogEntry[] }>(
        `/api/console/pricing-items?q=${encodeURIComponent(q.trim())}`,
      );
      setCatalogEntries(data.entries);
    } catch {
      setCatalogEntries([]);
    } finally {
      setCatalogLoading(false);
    }
  }, []);

  useEffect(() => {
    if (catalogRow === null) return;
    searchCatalog("");
  }, [catalogRow, searchCatalog]);

  const pickLead = (entry: LeadOption) => {
    setLead(entry);
    setLeadId(entry.id);
    setCustomerName(entry.name);
    setCustomerEmail(entry.email);
    setCompanyName(entry.companyName ?? "");
    if (entry.defaultCurrency) setCurrency(entry.defaultCurrency);
    setLeadOpen(false);
    setLeadQuery("");
  };

  const clearLead = () => {
    setLead(null);
    setLeadId("");
    setLeadOpen(false);
    setLeadQuery("");
  };

  const pickCatalog = (entry: CatalogEntry) => {
    if (catalogRow === null) return;
    setRows((prev) =>
      prev.map((r, i) =>
        i === catalogRow
          ? {
              ...r,
              description: entry.name,
              quantity: 1,
              unitAmount: (entry.unitAmount ?? 0) / 100,
            }
          : r,
      ),
    );
    if (entry.currency) setCurrency(entry.currency);
    setCatalogRow(null);
    setCatalogQuery("");
  };

  const updateRow = (i: number, patch: Partial<LineItemRow>) =>
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  return (
    <form
      action={action}
      className="mt-6 flex flex-col gap-5 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-6"
    >
      <input type="hidden" name="leadId" value={leadId} />

      <div className="relative">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Link to lead
          {lead ? (
            <span className="flex h-11 items-center justify-between rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal">
              <span>
                {lead.name}
                <span className="text-[var(--ink-muted)]"> ({lead.email})</span>
              </span>
              <button
                type="button"
                onClick={clearLead}
                className="text-xs text-[var(--ink-secondary)] underline-offset-2 hover:underline"
              >
                Remove
              </button>
            </span>
          ) : (
            <input
              value={leadQuery}
              onChange={(e) => {
                setLeadQuery(e.target.value);
                setLeadOpen(true);
                if (leadDebounce.current) clearTimeout(leadDebounce.current);
                leadDebounce.current = setTimeout(() => searchLeads(e.target.value), 200);
              }}
              onFocus={() => setLeadOpen(true)}
              placeholder="Search by name, email or company…"
              className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
            />
          )}
        </label>
        {leadOpen && !lead ? (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setLeadOpen(false)} />
            <div className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-raised)] shadow-[var(--shadow-md)]">
              {leadResults.length === 0 ? (
                <p className="px-3 py-2 text-sm text-[var(--ink-muted)]">
                  Type to search leads…
                </p>
              ) : (
                leadResults.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => pickLead(entry)}
                    className="block w-full px-3 py-2 text-left text-sm hover:bg-[var(--bg-sunken)]"
                  >
                    <span className="font-medium">{entry.name}</span>
                    <span className="text-[var(--ink-muted)]"> {entry.email}</span>
                    {entry.companyName ? (
                      <span className="text-[var(--ink-muted)]"> · {entry.companyName}</span>
                    ) : null}
                    {entry.portalAccountName ? (
                      <span className="text-[var(--ink-muted)]"> · portal: {entry.portalAccountName}</span>
                    ) : null}
                  </button>
                ))
              )}
            </div>
          </>
        ) : null}
        <p className="mt-1 text-xs text-[var(--ink-muted)]">
          Selecting a lead pre-fills the customer details below.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Customer name
          <input
            name="customerName"
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Customer email
          <input
            name="customerEmail"
            type="email"
            required
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Company (optional)
          <input
            name="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Currency
          <input
            name="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value.toUpperCase())}
            className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Tax amount (major units)
          <input
            name="taxAmount"
            type="number"
            step="0.01"
            min="0"
            value={taxMajor}
            onChange={(e) => setTaxMajor(Number(e.target.value) || 0)}
            className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          {dateField.label}
          <input
            name={dateField.name}
            type="date"
            defaultValue={initial?.date ?? ""}
            className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
          />
        </label>
      </div>

      <fieldset className="border-t border-[var(--border-subtle)] pt-4">
        <legend className="text-sm font-medium">Line items</legend>
        <div className="mt-3 space-y-3">
          {rows.map((row, i) => (
            <div key={i} className="relative grid gap-3 sm:grid-cols-12">
              <input
                name={`desc_${i}`}
                value={row.description}
                onChange={(e) => updateRow(i, { description: e.target.value })}
                placeholder="Description"
                className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal sm:col-span-5"
              />
              <input
                name={`qty_${i}`}
                type="number"
                step="1"
                min="1"
                value={row.quantity}
                onChange={(e) => updateRow(i, { quantity: Number(e.target.value) || 1 })}
                placeholder="Qty"
                className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal sm:col-span-2"
              />
              <input
                name={`amount_${i}`}
                type="number"
                step="0.01"
                min="0"
                value={row.unitAmount || ""}
                onChange={(e) => updateRow(i, { unitAmount: Number(e.target.value) || 0 })}
                placeholder="Unit (major)"
                className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal sm:col-span-3"
              />
              <div className="flex items-center gap-2 sm:col-span-2">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setCatalogRow(catalogRow === i ? null : i);
                    setCatalogQuery("");
                  }}
                >
                  {catalogRow === i ? "Close" : "Catalog"}
                </Button>
                {rows.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => setRows((prev) => prev.filter((_, idx) => idx !== i))}
                    className="text-sm text-[var(--ink-secondary)] underline-offset-2 hover:text-[var(--ink-primary)] hover:underline"
                  >
                    Remove
                  </button>
                ) : null}
              </div>
              {catalogRow === i ? (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setCatalogRow(null)} />
                  <div className="absolute top-12 right-0 z-20 w-full max-w-sm rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-3 shadow-[var(--shadow-md)] sm:col-span-12">
                    <input
                      value={catalogQuery}
                      onChange={(e) => {
                        setCatalogQuery(e.target.value);
                        if (catalogDebounce.current) clearTimeout(catalogDebounce.current);
                        catalogDebounce.current = setTimeout(() => searchCatalog(e.target.value), 200);
                      }}
                      placeholder="Search price modules…"
                      className="h-9 w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm"
                    />
                    <div className="mt-2 max-h-56 overflow-auto">
                      {catalogLoading ? (
                        <p className="px-2 py-2 text-sm text-[var(--ink-muted)]">Loading…</p>
                      ) : catalogEntries.length === 0 ? (
                        <p className="px-2 py-2 text-sm text-[var(--ink-muted)]">
                          No matching modules. Type a description and amount directly.
                        </p>
                      ) : (
                        catalogEntries.map((entry) => (
                          <button
                            key={entry.id}
                            type="button"
                            onClick={() => pickCatalog(entry)}
                            className="block w-full px-2 py-2 text-left text-sm hover:bg-[var(--bg-sunken)]"
                          >
                            <span className="flex items-center justify-between gap-2">
                              <span className="font-medium">{entry.name}</span>
                              <span className="shrink-0 text-[var(--ink-muted)]">
                                {entry.unitAmount != null
                                  ? formatMinor(entry.unitAmount, entry.currency)
                                  : "Contact us"}
                              </span>
                            </span>
                            {entry.description ? (
                              <span className="text-xs text-[var(--ink-muted)]">
                                {entry.description}
                              </span>
                            ) : null}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setRows((prev) => [...prev, { ...EMPTY_ROW }])}
          className="mt-3 text-sm text-[var(--ink-secondary)] underline-offset-2 hover:text-[var(--ink-primary)] hover:underline"
        >
          + Add line item
        </button>
      </fieldset>

      <div className="ml-auto w-full max-w-xs space-y-1 border-t border-[var(--border-subtle)] pt-4 text-sm">
        <div className="flex justify-between">
          <span className="text-[var(--ink-secondary)]">Subtotal</span>
          <span>{formatMinor(totals.subtotalAmount, currency)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--ink-secondary)]">Tax</span>
          <span>{formatMinor(totals.taxAmount, currency)}</span>
        </div>
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>{formatMinor(totals.totalAmount, currency)}</span>
        </div>
      </div>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Notes
        <textarea
          name="notes"
          rows={3}
          defaultValue={initial?.notes ?? ""}
          className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 py-2 text-sm font-normal"
        />
      </label>

      <div className="flex items-center gap-3">
        <Button type="submit" size="lg">
          {submitLabel}
        </Button>
        {cancelHref ? (
          <a
            href={cancelHref}
            className="text-sm text-[var(--ink-secondary)] underline-offset-2 hover:underline"
          >
            Cancel
          </a>
        ) : null}
      </div>
    </form>
  );
}