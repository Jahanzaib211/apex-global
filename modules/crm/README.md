# crm

**Status: active** · depends on: `core`

## Purpose

The commercial spine: every enquiry, where it came from, and what happened to
it. Without attribution captured at submission, advertising spend cannot be
judged — and it cannot be reconstructed afterwards.

## Data model

| Entity | Notes |
|---|---|
| `Lead` | The enquiry. `stage` drives the pipeline: `NEW → QUALIFIED → OPPORTUNITY → CUSTOMER` (or `LOST`). |
| `Attribution` | One per lead, written in the same transaction. `utm_*`, `gclid`, `fbclid`, referrer, landing path, country, consent state, hashed IP. |
| `LeadActivity` | Timeline: stage changes, assignment, notes, AI summaries. |
| `CampaignSpend` | Spend per platform/campaign/period, so cost can be divided by outcomes. |

## Permissions

`crm:read` · `crm:write` · `crm:admin`

## Routes

`/leads` inbox · `/leads/[id]` detail

## Jobs

| Queue | Trigger |
|---|---|
| `lead.notify` | New lead → email / WhatsApp / Telegram |
| `lead.conversion` | New lead → server-side conversion to Meta CAPI and Google Ads |

Both are still inline TODOs in the API route; they move onto BullMQ with the
worker tier for retries and a dead-letter queue.

## Design decisions

- **Lead and attribution are written in one transaction.** A lead without its
  attribution cannot be tied to spend, which defeats the point of collecting it.
- **The IP is hashed with a daily-rotating salt**, never stored. Enough to
  rate-limit and deduplicate; not a stable identifier across days.
- **Same email, same day appends** to the existing lead rather than creating a
  second one — a double-tap on a slow connection should not make sales call
  the same person twice.
- **Click-to-call and WhatsApp taps are tracked conversions.** In several of
  our markets they outnumber form fills, and a funnel that only counts forms
  will under-report demand and mis-optimise the spend.

## Open questions

- The rate limiter is in-process. Correct for one instance; behind more than
  one replica it becomes per-replica and needs the Redis counter.
- `Company` / `Contact` / `Opportunity` entities are specified but not built —
  today a lead carries its company as a string.
