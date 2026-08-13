# crm

**Status: active** · depends on: `core`

## Purpose

The commercial spine: every enquiry, where it came from, and what happened to
it. Without attribution captured at submission, advertising spend cannot be
judged — and it cannot be reconstructed afterwards.

## Data model

| Entity          | Notes                                                                                                                                 |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `Lead`          | The enquiry. `stage` drives the pipeline: `NEW → QUALIFIED → OPPORTUNITY → CUSTOMER` (or `LOST`).                                     |
| `Attribution`   | One per lead, written in the same transaction. `utm_*`, `gclid`, `fbclid`, referrer, landing path, country, consent state, hashed IP. |
| `LeadActivity`  | Timeline: stage changes, assignment, notes, AI summaries.                                                                             |
| `CampaignSpend` | Spend per platform/campaign/period, so cost can be divided by outcomes.                                                               |

## Permissions

`crm:read` · `crm:write` · `crm:admin`

## Routes

`/leads` inbox · `/leads/[id]` detail

## Jobs

| Queue             | Trigger                                                       |
| ----------------- | ------------------------------------------------------------- |
| `lead.notify`     | New lead → email / WhatsApp / Telegram                        |
| `lead.conversion` | New lead → server-side conversion to Meta CAPI and Google Ads |

**Neither runs as a queue yet.** `lead.notify` exists in substance —
`notifyNewLead` (`packages/auth/src/email.ts`) ships email and is called from
`ingestLead()` — but as an un-awaited promise in the request handler, not a job:
nothing retries it, and a crash between commit and send drops the alert
silently. WhatsApp and Telegram are unbuilt. `lead.conversion` is unbuilt
entirely. Both move onto BullMQ with the worker tier, for retries and a
dead-letter queue.

What the lead path does today — validate, write in one transaction, record
`sourceSite`, sync to Twenty, enrich and notify fire-and-forget — is described in
[docs/API.md](../../docs/API.md) and
[docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md).

## Design decisions

- **Lead and attribution are written in one transaction.** A lead without its
  attribution cannot be tied to spend, which defeats the point of collecting it.
- **The IP is hashed with a daily-rotating salt**, never stored. Enough to
  rate-limit and deduplicate; not a stable identifier across days.
- **Same site, same email, same day appends** to the existing lead rather than
  creating a second one — a double-tap on a slow connection should not make
  sales call the same person twice. The key is `sourceSite:email:day`, not
  `email:day`: with five properties on one pipeline, hashing on email alone
  would collapse a tours enquiry and a tech enquiry from the same person on the
  same day into one lead and lose the second intent.
- **Click-to-call and WhatsApp taps are tracked conversions.** In several of
  our markets they outnumber form fills, and a funnel that only counts forms
  will under-report demand and mis-optimise the spend.

## Open questions

- The rate limiter is in-process. Correct for one instance; behind more than
  one replica it becomes per-replica and needs the Redis counter.
- `Company` / `Contact` / `Opportunity` entities are specified but not built —
  today a lead carries its company as a string.
