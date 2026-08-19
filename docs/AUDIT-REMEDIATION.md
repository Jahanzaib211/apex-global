# Audit remediation — status and running order

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
| A4 | `chmod 600` the `.env` backups | — | **TODO** |

A3 is low-risk: the Hyperswitch credentials are **sandbox**, no live payments.

## Phase B — make the sites findable

Every item here depends on A2: unique titles are wasted while every page
canonicalises to the homepage.

| # | Item | Depends on | Status |
|---|---|---|---|
| B1 | Metadata on 51 public pages | A2 | **DONE** `74c5e40` `d7dd2e8` |
| B2 | Sitemaps cover every route; generate the ones that grow | A2 | **DONE** `39b69b2` |
| B3 | JSON-LD on tours and holdings | B1 | **DONE** `3bc2a45` |
| B4 | Search Console verification tokens | — | **DONE** `47fa277` |
| B5 | OG images on tours, holdings, group | — | **DONE** `47fa277` |
| B6 | Submit sitemaps + request indexing in Search Console | B1–B5 deployed | **TODO** (manual) |

B6 is the only step that cannot be done from this repo — it needs the tokens
from B4 pasted into Search Console after a deploy.

## Phase C — security

| # | Item | Depends on | Status |
|---|---|---|---|
| C1 | CSP for `apps/web` and `apps/console` | — | **DONE** `dc90411` |
| C2 | Drop Google font hosts from every CSP | C4 | **DONE** `e75d6cc` |
| C3 | TOTP challenge page + recovery codes | — | **TODO** |
| C4 | Self-host fonts on holdings and outsourcing | — | **DONE** `e75d6cc` |
| C5 | Purge git history, force-push | A3 | **TODO** |
| C6 | Delete the `.env` backups | A3, A4 | **TODO** |

C2 depended on C4: the hosts could only leave the CSP once nothing fetched
from them. C5 depends on A3 — purging history does not invalidate a key that
is already public, so rotation comes first.

## Phase D — reliability and performance

| # | Item | Depends on | Status |
|---|---|---|---|
| D1 | BullMQ worker tier, Redis rate limiter, DLQ | — | **TODO** |
| D2 | Lighthouse CI for the other six surfaces | B1, C4 | **TODO** |
| D3 | Resolve `images: { unoptimized: true }` | D2 | **TODO** |
| D4 | Next ESLint plugin for web and console | — | **TODO** |
| D5 | Skip links, `<main>` landmark, portal mobile nav | — | **TODO** |
| D6 | De-duplicate drifted shared code into site-kit | — | **TODO** |
| D7 | Enable Twenty CRM sync | D1 | **TODO** |
| D8 | Meta CAPI + Google Ads server-side conversions | D1 | **TODO** |
| D9 | Build or delete `modules/hr` | — | **TODO** |
| D10 | LOW items (loading.tsx, no-console, tours `<img>`) | D4 | **TODO** |

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
