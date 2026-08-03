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

`apps/portal` (customer accounts) joins the same data layer in Stage 9.

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
triggers a targeted revalidation, so content goes live in seconds without a deploy. The only client
components on the public site are the lead forms, the navigation disclosure and the 3D hero island —
everything else ships zero JavaScript.

## Data flow: a lead

```
form submit
  → Zod validation
  → honeypot + Turnstile + Redis rate-limit (per IP, per form)
  → Lead + Attribution rows written in one transaction
  → BullMQ: notify (email / WhatsApp / Telegram)
  → BullMQ: AI summarise + score  (draft only, never auto-actioned)
  → BullMQ: server-side conversion event (Meta CAPI / Google Ads)
  → redirect /thank-you
```

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
