# Apex Global Tech Solution

The corporate site, SaaS product platform and internal operations console for **Apex Global Tech
Solution** — a global SaaS and technology company.

Apex builds and operates software, develops SaaS products, and delivers AI, cloud, cybersecurity,
managed IT and technology consulting to businesses worldwide.

## Quick start

```bash
cp .env.example .env    # generate AUTH_SECRET and ENCRYPTION_KEY — see docs/RUNBOOK.md
pnpm install
pnpm services:up
pnpm db:migrate && pnpm db:seed
pnpm dev
```

- Public site → http://localhost:4300
- Console → http://localhost:4301

## Layout

| Path | What it is |
|---|---|
| `apps/web` | Public site: marketing, SaaS product pages, ad landing pages |
| `apps/console` | Internal admin: CMS, leads, settings, module host |
| `packages/ui` | Design system — brand tokens, primitives, motion, diagrams |
| `packages/db` | Prisma client and schema (one file per module) |
| `packages/ai` | Provider-agnostic AI interface and encrypted key vault |
| `packages/analytics` | Consent manager, GA4 / Meta / Ads events, server-side conversions |
| `packages/module-kit` | `defineModule()` contract and registry loader |
| `modules/*` | Business capability, each with its own spec and schema |
| `infra/` | Compose stack, deployment configuration, backups |
| `docs/` | Architecture, brand, modules, credibility, runbook, SEO |

## Read first

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — how the system fits together
- [docs/CREDIBILITY.md](docs/CREDIBILITY.md) — **what may and may not be published, enforced in CI**
- [docs/MODULES.md](docs/MODULES.md) — the module registry and how to add one
- [docs/BRAND.md](docs/BRAND.md) — palette, type, mark, usage discipline
- [docs/RUNBOOK.md](docs/RUNBOOK.md) — setup, deploys, incidents, backups
- [docs/SEO.md](docs/SEO.md) — international SEO and attribution

## Non-negotiables

**Performance.** Mobile LCP ≤ 2.0 s throttled, landing-page initial JS ≤ 180 KB, Lighthouse ≥ 95.
Enforced in CI. The 3D hero loads after the poster paints and disables itself on weak devices. If a
visual effect breaks the budget, the effect is removed.

**Credibility.** Every proof entry declares whether Apex built it, operates it, or deploys it as
third-party open source. Named clients require recorded consent. Metrics need a traceable source.
`pnpm audit:credibility` fails the build otherwise.

**Security.** RBAC on every mutation, audit log on every privileged action, secrets encrypted at rest
and never returned to a client, no external script hosts in the CSP.
