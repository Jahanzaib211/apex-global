# billing

**Status: active** · depends on: `core`, `crm`

## Purpose

Quotes, invoices, payments and subscriptions. Turns a won opportunity into
money collected, and gives the client portal something to show.

## Data model (proposed)

`Quote`, `Invoice` (+ `InvoiceLine`), `Payment`, `Subscription`,
`PaymentProvider`, `TaxRate`, `DunningEvent`.

Money is stored as an **integer in minor units** with an explicit currency.
Floating point does not appear anywhere near a balance.

## Permissions

`billing:read` · `billing:write` · `billing:admin`

## Routes

Customer-facing today, in the portal: `/portal/invoices` ·
`/portal/invoices/[id]` · `POST /portal/invoices/[id]/pay` (Hyperswitch), with
payment state reconciled by `POST /api/webhooks/hyperswitch`. See
[docs/API.md](../../docs/API.md).

Proposed console routes: `/billing/invoices` · `/billing/invoices/[id]` ·
`/billing/subscriptions`.

## Jobs (proposed)

`invoice.send`, `invoice.remind` (scheduled), `payment.reconcile`,
`subscription.renew` (scheduled).

## Open questions

- Which payment providers? Local gateways matter more than Stripe for the
  Pakistani market, and the two have very different reconciliation models.
- Invoice numbering must be gapless per financial year for tax purposes —
  that constrains how records can be created and voided.
- Tax handling for international clients is unresolved.

## Definition of done

An invoice can be raised from a won opportunity, sent, paid, and reconciled,
with a full audit trail and an export the accountant accepts.
