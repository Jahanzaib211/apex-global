# Architecture

## Shape

```
                         Cloudflare CDN + WAF
                                  │
             ┌────────────────────┴────────────────────┐
             │                                         │
       apps/web (:4300)                        apps/console (:4301)
       public site, SaaS pages,                admin: CMS, leads,
       landing pages, lead forms               settings, AI config
             │                                         │
             └──────────────┬──────────────────────────┘
                            │
                   packages/db (Prisma)
                            │
        ┌───────────┬───────┴────────┬──────────────┐
        │           │                │              │
   PostgreSQL     Redis            MinIO       Meilisearch
   (:5437)      (:6381)          (:9020)         (:7701)
   content,     queues,          media,          product &
   leads,       cache,           documents       insight search
   audit        rate limit
                            │
                     BullMQ workers
              notifications · AI jobs · conversions
```

`apps/web` hosts both the marketing site (`(site)` route group) and the
client portal (`(portal)/portal` route group) so a single deploy carries
both surfaces. The console is `apps/console`, ops + admin.

## Why a monorepo

The public site, the console and the portal share a content model, a design system and an auth model.
Splitting them into separate repos would mean versioning those three things across repo boundaries for
no benefit. Turborepo caches per-package builds so CI stays fast.

## Module system

Business capability lives in `modules/*`, not in the apps. A module is a folder with:

| File | Purpose |
|---|---|
| `README.md` | The spec: purpose, data model, permissions, routes, jobs, status |
| `module.ts` | `defineModule()` registration |
| `prisma/<slug>.prisma` | Its slice of the schema |
| `src/` | Server logic, queries, jobs |
| `console/` | Its console routes and components |

`apps/console` builds navigation, the dashboard and the RBAC permission catalogue **from the
registry**. Adding a module is one folder plus one line in the registry — never a refactor of the
core. Modules that are specified but not built ship their README with `status: "planned"` and
contribute no navigation.

## Rendering strategy

Public pages are server components reading through `packages/db` with ISR. Publishing in the console
posts to `/api/revalidate` on the web app, so content goes live in seconds without a deploy — the two
apps are separate processes, and a local `revalidatePath` in the console cannot reach this cache. The
only client
components on the public site are the lead forms, the navigation disclosure and the 3D hero island —
everything else ships zero JavaScript.

## Data flow: a lead

Three entry points, all documented in [API.md](API.md):

| Route | Source |
|---|---|
| `POST /api/leads` | this site's forms |
| `POST /api/demo-request` | this site, when the enquiry names a SaaS product |
| `POST /api/leads/partner` | the other four Apex properties, server-to-server, HMAC-signed |

All three converge on one function — `ingestLead()` in `apps/web/src/lib/ingest-lead.ts` — so the
group shares a single pipeline rather than four that drift apart:

```
form submit (or signed partner POST)
  → Zod validation
  → honeypot + Turnstile + in-process rate-limit (per IP, per endpoint)
      · partner route instead verifies HMAC over `timestamp.site.body`
  → Lead + Attribution + Activity rows written in one transaction
      · sourceSite recorded; dedupe key is sourceSite:email:day
  → Twenty CRM sync            ← NOT CURRENTLY ACTIVE, see below
  → fire-and-forget: AI summarise + score  (draft only, never auto-actioned)
  → fire-and-forget: notifyNewLead — email carrying site name + AI score
  → redirect /thank-you
```

> **Twenty sync is wired but not configured.** `syncLeadToTwenty()`
> (`packages/integrations/src/sync.ts`) reads its base URL and API key from an
> `Integration` row, with the secret encrypted in the vault — not from env. As
> of 2026-08-13 the `Integration` table is **empty**, so every call returns
> `{ ok: false, detail: "Twenty CRM integration is not enabled" }` and no lead
> has ever reached Twenty. The Twenty app itself runs on `127.0.0.1:3008`; only
> the integration record is missing. Configure it in the console under
> Settings → Integrations. Nothing is lost meanwhile — Postgres is the system of
> record and the sync is a downstream copy — but any statement that leads "land
> in the Twenty pipeline automatically" is not true today.

`sourceSite` is what keeps five brands' demand separable in one pipeline, and it is in the dedupe key
deliberately: the same person enquiring at tours *and* at tech on one day is two intents, and hashing
on email alone would silently collapse them into one lead.

**The worker tier is still not built.** Enrichment, notification and the Twenty sync all run as
un-awaited promises in the request handler, and the rate limiter is an in-process map, so it counts
per replica. Server-side conversion events (Meta CAPI / Google Ads) are specified in
[`modules/crm`](../modules/crm/README.md) and remain unimplemented. All of it moves onto BullMQ —
with retries and a dead-letter queue — when that tier lands.

One honest consequence: an earlier version of this document argued that losing an advisory AI summary
to a recycled process is acceptable but losing a notification is not, and that notifications should
therefore wait for the queue. `notifyNewLead` shipped in `80ba62a` on the fire-and-forget path
anyway. The lead row itself is committed before any of these run, so nothing is lost from the CRM —
but a crash between commit and send drops the alert silently, and nothing retries it. That is the
trade as it actually stands today, and it is the strongest argument for building the worker tier.

Attribution is captured at first touch and stored on the lead: `utm_*`, `gclid`, `fbclid`, referrer,
landing path, user agent, country, consent state. That is what makes
`spend → lead → opportunity → customer → revenue` answerable later.

## Environments

| Environment | Runs on | Deploys when |
|---|---|---|
| dev | local, `pnpm dev` + compose services | — |
| staging | homelab | merge to `main` |
| production | managed VPS behind Cloudflare | tagged release |

Migrations are forward-only. Every migration is applied to staging first, and the rollback path is
tested there before a production tag is cut.

## Security posture

TLS everywhere; Auth.js v5 sessions with TOTP 2FA on the console; RBAC checked on every mutation, not
just in the UI; an audit log row for every privileged action; Zod at every boundary; CSP with no
external script hosts (fonts and analytics are self-hosted or consent-gated first-party); secrets
encrypted with AES-256-GCM at rest and never returned to a client; per-route rate limiting; nightly
encrypted offsite backups with a documented, tested restore.
