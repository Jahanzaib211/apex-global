# Audit remediation — status and running order

> Plain-English companion for non-engineers: [WHAT-WE-FIXED.md](WHAT-WE-FIXED.md)

Front-end audit of all seven surfaces (five brand sites, console, client portal),
2026-08-19. Ordered by dependency: each phase assumes the one above it has landed.

Legend: **DONE** · **IN PROGRESS** · **TODO**

---

## Phase A — indexing and secrets

| # | Item | Depends on | Status |
|---|---|---|---|
| A1 | Commit outstanding source (Hyperswitch, portal invoices, console billing) | — | **DONE** `d1318ab` |
| A2 | Canonical: each page canonicalises to itself | A1 | **DONE** `99cdd14` |
| A3 | Rotate credentials exposed in git history | A1 | **TODO** |
| A4 | `chmod 600` the `.env` backups | — | **DONE** `88d449e` |

A3 is low-risk: the Hyperswitch credentials are **sandbox**, no live payments.

## Phase B — make the sites findable

Every item here depends on A2: unique titles are wasted while every page
canonicalises to the homepage.

| # | Item | Depends on | Status |
|---|---|---|---|
| B1 | Metadata on 51 public pages | A2 | **DONE** `74c5e40` `d7dd2e8` |
| B2 | Sitemaps cover every route; generate the ones that grow | A2 | **DONE** `39b69b2` |
| B3 | JSON-LD on tours and holdings | B1 | **DONE** `3bc2a45` |
| B4 | Search Console verification | — | **DONE** `47fa277` `3002501` — **verified** |
| B5 | OG images on tours, holdings, group | — | **DONE** `47fa277` |
| B6 | Submit sitemaps + request indexing in Search Console | B4 | **TODO** (user, UI-only) |
| B7 | JSON-LD on the Tech site's index pages | B3 | **TODO** |

B4 landed better than planned. Rather than four per-site HTML-tag tokens, the
whole estate is verified by a single **Domain property** on
`apexgroupcompanies.com`, authorised through Cloudflare — one DNS TXT record
covering every subdomain, current and future. Confirmed independently against
the Cloudflare API and public DNS, not just the Search Console UI. The Tech
site additionally keeps an HTML file and a meta tag, so it has three
independent proofs.

B6 cannot be done from this repo, and not by any API either: the URL Inspection
API is read-only, and the Indexing API only accepts JobPosting and
BroadcastEvent. Requesting indexing is permanently a UI action.

## Phase C — security

| # | Item | Depends on | Status |
|---|---|---|---|
| C1 | CSP for `apps/web` and `apps/console` | — | **DONE** `dc90411` |
| C2 | Drop Google font hosts from every CSP | C4 | **DONE** `e75d6cc` |
| C3 | TOTP challenge page + recovery codes | — | **TODO** |
| C4 | Self-host fonts on holdings and outsourcing | — | **DONE** `e75d6cc` |
| C5 | Purge git history, force-push | A3 | **TODO** |
| C6 | Delete the `.env` backups | A3, A4 | **TODO** — 4 files, now 0600 |

C2 depended on C4: the hosts could only leave the CSP once nothing fetched
from them. C5 depends on A3 — purging history does not invalidate a key that
is already public, so rotation comes first.

## Phase D — reliability and performance

| # | Item | Depends on | Status |
|---|---|---|---|
| D1 | BullMQ worker tier, Redis rate limiter, DLQ | — | **TODO** |
| D2 | Lighthouse CI for the other six surfaces | B1, C4 | **DONE** `62350f1` |
| D3 | Resolve `images: { unoptimized: true }` | D2 | **DONE** `62350f1` |
| D4 | One ESLint toolchain across all six apps | — | **DONE** `af53a2f` |
| D5 | Skip links, `<main>` landmark, portal mobile nav | — | **DONE** `88d449e` |
| D6 | De-duplicate drifted shared code into site-kit | — | **TODO** |
| D7 | Enable Twenty CRM sync | D1 | **TODO** |
| D8 | Meta CAPI + Google Ads server-side conversions | D1 | **TODO** |
| D9 | Build or delete `modules/hr` | — | **TODO** |
| D10 | LOW items (loading.tsx, no-console, tours `<img>`) | D4 | **DONE** `af53a2f` |

D2 is the item that keeps Phase B fixed — `categories:seo: minScore 1` would
have caught the canonical and duplicate-title bugs the day they shipped. It is
sequenced after B1/C4 so the sites can actually pass it.

D7 and D8 depend on D1: both are retryable background work, and putting them
on the current fire-and-forget path repeats the bug D1 exists to fix.

## Phase E — cleanup

Last on purpose: A1 must have landed so nothing uncommitted is at risk.

| # | Item | Depends on | Status |
|---|---|---|---|
| E1 | Move business collateral out of the repo root | A1 | **TODO** |
| E2 | Delete ~368 MB of regenerable artefacts | A1 | **TODO** |

## Phase F — needs the owner, not the repo

Content and credibility items. Verified live on 20 Aug; none can be closed from
code because each needs real information or a judgement call.

| # | Item | Where | Why it cannot be automated |
|---|---|---|---|
| F1 | Submit sitemaps, request indexing | Search Console | UI-only (see B6) |
| F2 | "Sample" testimonials, publicly credited to "Developer Partner · Sample" and "Investor · Sample" | `apps/holdings/src/data/content.ts` | Needs real quotes and consent. Fabricated reviews are a manual-action risk |
| F3 | Placeholder phone `+92 300 0000000` | `apps/holdings/src/data/site.ts` | Needs the real number. Deliberately omitted from JSON-LD rather than published into a knowledge panel |
| F4 | "Map to be added by Apex" rendering as visible copy | `apps/tours` home + contact | Needs the map, or a decision to hide the block |
| F5 | "Rate on request" on every vehicle and transfer page | `apps/tours` | Blocks `Offer` schema, forfeits price queries, reads as thin. Needs indicative figures |
| F6 | 14 business documents in the repo root, including client invoices | repo root | Needs a destination. Will not be deleted without a verified copy |

---

## Verified non-issues

Recorded so they are not re-investigated:

- Missing `<h1>` on holdings `/services/*` — rendered via `ServiceDetail` → `PageBanner`.
- Two `<h1>`s in `holdings/projects/[slug]` — mutually exclusive 404 branch.
- Unlabelled group form controls — `Field` wraps children in `<label>`.
- `continue-on-error` on the Semgrep step — a later step reads the SARIF and
  fails the build; the pattern distinguishes a scanner outage from a finding.
- `apps/outsourcing` metadata — its careers and contact routes already declare
  metadata in layouts; only the homepage lacks it, which is correct.

## Corrections to the original plan

- **A2 was specified wrong.** The plan said to delete `alternates: { canonical: "/" }`.
  Deleting it emits *no* canonical: `resolveAlternates` returns null when the key
  is absent. The fix is a URL **instance**, which Next resolves against the
  current pathname. The repo's original comment was right.
