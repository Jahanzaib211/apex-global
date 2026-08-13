# 🧭 APEX GLOBAL — Platform Frontends Quick Reference

**ADHD-friendly:** One line per surface, color-coded, skip what you don't need.  
**Source of truth:** `infra/MASTER-CREDENTIALS.md` (gitignored, contains real passwords) + verified routes.

---

## 🔐 LOGIN CARD — SCAN THIS FIRST

| Surface             | URL (Dev)                      | URL (Prod)                                   | Email                | Password       | Notes                                                                         |
| ------------------- | ------------------------------ | -------------------------------------------- | -------------------- | -------------- | ----------------------------------------------------------------------------- |
| **Public Website**  | `http://localhost:4300`        | `https://tech.apexgroupcompanies.com`        | —                    | —              | No login. Lead capture, marketing, Chatwoot widget. Phone: `+92-42-3229-4384` |
| **Console (Staff)** | `http://localhost:4301`        | _loopback/Tailscale only_                    | `alilabsx@gmail.com` | `Jatt@1234567` | PM2 `apex-global-console`. NOT on public tunnel.                              |
| **Client Portal**   | `http://localhost:4300/portal` | `https://tech.apexgroupcompanies.com/portal` | `alilabsx@gmail.com` | `Jatt@1234567` | Same identity (PortalUser OWNER). PM2 `apex-global-web`.                      |

> ⚠️ This file contains the real admin password. Keep it local. Do not commit. The gitignored `infra/MASTER-CREDENTIALS.md` is the canonical vault.

---

## 🖥️ CONSOLE PANELS (Admin / Internal)

All under `http://localhost:4301` (loopback only)

| Panel                  | Route                    | Purpose                                    |
| ---------------------- | ------------------------ | ------------------------------------------ |
| **Login**              | `/login`                 | Staff authentication                       |
| **Overview**           | `/`                      | Dashboard / quick stats                    |
| **Leads**              | `/leads`                 | List + pipeline                            |
|                        | `/leads/[id]`            | Lead detail + actions                      |
| **Accounts**           | `/accounts`              | Portal accounts list                       |
|                        | `/accounts/[id]`         | Account detail                             |
| **Billing — Quotes**   | `/billing/quotes`        | List quotes                                |
|                        | `/billing/quotes/new`    | Create quote                               |
|                        | `/billing/quotes/[id]`   | Quote detail                               |
| **Billing — Invoices** | `/billing/invoices`      | List invoices                              |
|                        | `/billing/invoices/new`  | Create invoice                             |
|                        | `/billing/invoices/[id]` | Invoice detail                             |
| **Support**            | `/support/inbox`         | Ticket inbox                               |
|                        | `/support/inbox/[id]`    | Ticket thread                              |
|                        | `/support/kb`            | Knowledge base articles                    |
| **Projects**           | `/projects`              | Project list                               |
|                        | `/projects/new`          | Create project                             |
|                        | `/projects/[id]`         | Project detail + tasks                     |
| **Integrations**       | `/integrations`          | Hyperswitch + Twenty config (vault-sealed) |
| **Partner**            | `/partner`               | Partner settings                           |
| **Content**            | `/content`               | CMS pages                                  |
| **Marketing**          | `/marketing/campaigns`   | Campaign list                              |
|                        | `/marketing/attribution` | Attribution reporting                      |
| **Audit**              | `/audit`                 | System audit trail                         |
| **Settings**           | `/settings`              | Global settings, SMTP, feature flags       |
| **Dev Tools**          | `/dev`                   | Ops index                                  |
|                        | `/dev/cache`             | Cache inspection                           |
|                        | `/dev/queues`            | BullMQ queues                              |
|                        | `/dev/env`               | Environment vars                           |
|                        | `/dev/errors`            | Error tracking                             |
|                        | `/dev/webhooks`          | Webhook logs                               |
|                        | `/dev/flags`             | Feature flags                              |
|                        | `/dev/maintenance`       | Maintenance mode                           |
|                        | `/dev/audit`             | Dev audit trail                            |

---

## 🌐 CLIENT PORTAL (Client-Facing)

All under `https://tech.apexgroupcompanies.com/portal` (same origin as web)

| Area                | Route                                          | Auth                  |
| ------------------- | ---------------------------------------------- | --------------------- |
| **Login**           | `/portal/(unauth)/login`                       | Public                |
| **Signup / Invite** | `/portal/(unauth)/signup`                      | Public                |
|                     | `/portal/(unauth)/accept-invitation/[token]`   | Public (invite flow)  |
| **Auth Callbacks**  | `/portal/(unauth)/auth/magic`                  | Magic link callback   |
|                     | `/portal/(unauth)/auth/verify-email`           | Email verification    |
|                     | `/portal/(unauth)/auth/[provider]`             | OAuth start           |
|                     | `/portal/(unauth)/auth/[provider]/callback`    | OAuth callback        |
|                     | `/portal/(unauth)/auth/[provider]/start`       | OAuth start alt       |
|                     | `/portal/(unauth)/logout`                      | Logout                |
| **Password Reset**  | `/portal/(unauth)/forgot-password`             | Public                |
|                     | `/portal/(unauth)/reset-password`              | Public                |
| **Dashboard**       | `/portal/(protected)`                          | ✅ Login              |
| **Invoices**        | `/portal/(protected)/invoices`                 | ✅ List               |
|                     | `/portal/(protected)/invoices/[id]`            | ✅ Detail             |
|                     | `/portal/(protected)/invoices/[id]/pay`        | ✅ Pay (Hyperswitch)  |
|                     | `/portal/(protected)/invoices/[id]/pay/return` | ✅ 3DS return         |
| **Projects**        | `/portal/(protected)/projects`                 | ✅ List               |
|                     | `/portal/(protected)/projects/[id]`            | ✅ Detail + tasks     |
| **Services**        | `/portal/(protected)/services`                 | ✅ Client services    |
| **Tickets**         | `/portal/(protected)/tickets`                  | ✅ List               |
|                     | `/portal/(protected)/tickets/new`              | ✅ Create             |
|                     | `/portal/(protected)/tickets/[id]`             | ✅ Thread             |
| **Documents**       | `/portal/(protected)/documents`                | ✅ List               |
|                     | `/portal/(protected)/api/documents`            | ✅ API                |
|                     | `/portal/(protected)/api/documents/[id]`       | ✅ API                |
| **Account**         | `/portal/(protected)/account`                  | ✅ Profile            |
|                     | `/portal/(protected)/account/security`         | ✅ 2FA / password     |
|                     | `/portal/(protected)/account/oauth`            | ✅ Connected accounts |

---

## 🌍 PUBLIC MARKETING SITE

All under `http://localhost:4300` (prod `https://tech.apexgroupcompanies.com`)

| Page              | Route                                                                                                                                                 | Purpose                         |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| **Home**          | `/`                                                                                                                                                   | Hero, stats, services, partners |
| **About**         | `/about`                                                                                                                                              | Team, capabilities              |
| **Services**      | `/services`                                                                                                                                           | Service catalog                 |
|                   | `/services/[slug]`                                                                                                                                    | Service detail                  |
| **Solutions**     | `/solutions`                                                                                                                                          | Solution categories             |
|                   | `/solutions/[slug]`                                                                                                                                   | Solution detail                 |
| **SaaS Products** | `/saas`                                                                                                                                               | Product catalog                 |
|                   | `/saas/[slug]`                                                                                                                                        | Product detail                  |
| **Industries**    | `/industries`                                                                                                                                         | Industry verticals              |
|                   | `/industries/[slug]`                                                                                                                                  | Industry detail                 |
| **Case Studies**  | `/case-studies`                                                                                                                                       | Portfolio                       |
|                   | `/case-studies/[slug]`                                                                                                                                | Case study detail               |
| **Insights**      | `/insights`                                                                                                                                           | Blog/articles                   |
|                   | `/insights/[slug]`                                                                                                                                    | Article detail                  |
| **Technology**    | `/technology`                                                                                                                                         | Engineering proof page          |
| **Careers**       | `/careers`                                                                                                                                            | Job listings                    |
| **Contact**       | `/contact`                                                                                                                                            | Contact form → leads API        |
| **Status**        | `/status`                                                                                                                                             | System status page              |
| **Legal Hub**     | `/legal`                                                                                                                                              | Legal index                     |
|                   | `/legal/terms`, `/privacy`, `/cookies`, `/acceptable-use`, `/accessibility`, `/data-processing`, `/subprocessors`, `/subscription`, `/user-agreement` | All legal pages                 |
| **Thank You**     | `/thank-you`                                                                                                                                          | Post-form redirect              |
| **Maintenance**   | `/maintenance`                                                                                                                                        | Maintenance mode                |

**API endpoints (public):**  
`POST /api/leads` — lead capture (with consent + Turnstile)  
`POST /api/demo-request` — demo request → lead + attribution  
`POST /api/webhooks/hyperswitch` — payment webhook (verified)  
`POST /api/webhooks/twenty` — CRM sync webhook  
`GET /api/health` — health check  
`POST /api/revalidate` — ISR cache purge (secret)

---

## 🎯 ONE-LINER CONTEXT PER SURFACE

- **Public Website** = Shopfront: marketing, SaaS/service pages, lead capture, Chatwoot widget, hosts the portal at `/portal`.
- **Console** = Back office: every enquiry lands here, CMS, billing (quotes/invoices), support (tickets/KB), projects, integrations (Hyperswitch/Twenty), partner, marketing, audit, settings, dev tooling. Loopback-only by design.
- **Client Portal** = Client self-service: invoices (pay via Hyperswitch), projects, services, tickets, documents, account/security. Same codebase as web (`apps/web`), different route group.

---

## 🚀 QUICK START (Operator)

```bash
# 1. Start dev (hot reload)
pnpm dev
# → Web: http://localhost:4300
# → Console: http://localhost:4301

# 2. Console login
# Email: alilabsx@gmail.com
# Password: Jatt@1234567

# 3. Portal login (same creds, PortalUser OWNER role)
# https://tech.apexgroupcompanies.com/portal

# 4. Hyperswitch secret key → mint in Control Center (http://127.0.0.1:9090)
#    → paste in Console → Integrations

# 5. Production publish
pnpm build && pm2 restart apex-global-web apex-global-console && pm2 save

# 6. Console is loopback-only — use Tailscale (or Cloudflare Access in prod).
```

---

## 📁 FILE LOCATIONS (If You Need to Edit)

```
apps/console/src/app/(app)/          # All console panels
apps/web/src/app/(site)/             # Public site pages
apps/web/src/app/(portal)/portal/    # Portal pages (protected + unauth)
apps/web/src/app/api/                # API routes
packages/module-kit/src/registry.ts  # Nav + permissions (single source of truth)
packages/db/prisma/schema/           # Database models
infra/MASTER-CREDENTIALS.md          # Canonical credentials (gitignored)
```

---

> **TL;DR** — Three surfaces, one identity. Console = loopback-only back office. Portal = client self-service on same origin as web. All routes verified against actual filesystem. No `:3000`, no `admin@...`, no `changeme123`.
