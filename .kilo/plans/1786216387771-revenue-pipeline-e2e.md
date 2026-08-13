# Implementation Plan — Apex end-to-end revenue pipeline (Phases 0–7)

This is the **implementation** plan that replaces the original skeleton. It is
derived from the handover in `1786216387771-...md` and a fresh read of the
current code. Decisions confirmed with the operator:

- **Sequencing:** all phases in dependency order, each slice ending with
  `pnpm -r typecheck && pnpm -r lint && pnpm -r test` green (Phase 3 still gated).
- **Invoice schema:** add `lineItems Json?` to `Invoice` in the same migration as
  the Hyperswitch webhook columns.
- **Hyperswitch provisioning:** a repeatable, idempotent **provisioning script**
  (`scripts/provision-hyperswitch.mjs`) that drives the router admin API and
  prints `merchant_id` / `profile_id` / `api_key` for the operator to paste into
  the console (sealed at rest). No secrets written to `.env`.
- **Phase 3:** produce an **inventory report only** (`docs/credibility-inventory.md`),
  no edits to public content.

## Codebase realities verified during planning

- `prisma migrate status` → DB at `localhost:5437` (`apex`/`public`) has 64 tables
  and **no `_prisma_migrations` table** (was built with `db push`). `apex` role is
  superuser + `createdb`, so the shadow DB that `migrate dev` spins up will work.
- Migrations folder must be `packages/db/prisma/**schema**/migrations` (we use a
  schema _folder_; `prismaSchemaFolder` is enabled because `datasource` is under
  `schema/schema.prisma`).
- Console nav is **hard-coded** in `apps/console/src/app/(app)/layout.tsx`. The
  module registry (`packages/module-kit/src/registry.ts`) already declares
  `billing`, `support`, `projects`, `client-portal` nav + permission keys, and the
  seed already grants `billing:write` etc. Confirmed `billing:read`,
  `billing:write`, `support:write`, `projects:write` exist.
- `Invoice` has **no `lineItems`** (only `Quote`). Portal `invoices/page.tsx:12`
  joins `lead.portalAccounts` — so the fix is purely to populate `PortalAccount.leadId`
  and `Invoice.leadId`; the query is already correct.
- `s3.ts` hash is already `createHash("sha256")`. The remaining prod bug is that
  `presignedGetUrl` signs `config.endpoint` host but emits `config.publicUrl`
  (which in prod is `endpoint/bucket`) → **host AND path-prefix** mismatch → 403.
- `hyperswitch.ts:84` throws on empty `profileId` in the constructor (→ 500).
  `confirmPayment` (`:119`) has zero callers. `clientFromConfig` does not pass
  `webhookSecret` into the route's client.
- `twenty.resolveCompanyId` (`:173`) **throws** when the company is missing,
  breaking `upsertPerson`. `upsertPerson`/`upsertCompany` **drop** `city`,
  `country`, `source`, `notes`, `industry`, `employees` even though they're in
  the input types — the upstream call does not send them.
- Public site already enforces traceability via `<Stat source=…>` (card.tsx:45).
  Phase 3 targets the numbers that _bypass_ `Stat` (hero counters, product copy,
  pricing), not the `Stat` block.
- `apps/console` does **not** depend on `@apex/module-kit` or `@apex/auth`. To make
  nav registry-driven and to send emails (invoice/invitation) from the console,
  add both as console dependencies (`workspace:*`).

---

## Phase 0 — Preconditions (already partly done; verify, don't re-edit)

- `.env`: leave `NEXT_PUBLIC_SITE_URL` as `https://tech.apexgroupcompanies.com`
  (already correct). Do **not** edit `.env` for the site URL.
- `s3.ts:55-57` hash already fixed — leave it.
- Add `prismaSchemaFolder` confirmation: `packages/db/prisma/schema/schema.prisma`
  already uses a folder; ensure `prisma` reads it (it does — `migrate status` worked).

## Phase 1a — Hyperswitch webhook secret + merchant (the money-path blocker)

### 1. Schema + migrations (dependency order is critical — see note below)

- `packages/db/prisma/schema/core.prisma`, model `PartnerIntegration` (~line 183):
  add `webhookCiphertext String?`, `webhookIv String?`, `webhookTag String?`,
  `webhookLastFour String?` (reuse the existing `secret*` envelope shape).
- `packages/db/prisma/schema/billing.prisma`, model `Invoice` (~line 63): add
  `lineItems Json?` (`[{ description, quantity, unitAmount, currency }]`, mirrors `Quote`).
- **Migration ordering (must be done before any other schema edit):**
  1. With the schema still at "current prod shape" (just these two additions are
     fine too, but do baseline BEFORE feature migrations), run:
     ```
     pnpm --filter @apex/db -- prisma migrate diff \
       --from-empty \
       --to-schema-datamodel ./packages/db/prisma/schema/schema.prisma \
       --script > ./packages/db/prisma/schema/migrations/00000000000000_baseline/migration.sql
     pnpm --filter @apex/db -- prisma migrate resolve --applied 00000000000000_baseline
     ```
     (Baseline captures the 64 existing tables — it must be generated from the
     datamodel exactly as the DB is _now_, so generate it first, resolve it, then
     immediately create the first real feature migration against it.)
  2. Then `pnpm --filter @apex/db -- prisma migrate dev --name add_hyperswitch_webhook_secret`
     (generates + applies the `webhook*` columns + `Invoice.lineItems`).
  3. `pnpm --filter @apex/db generate`.
- **CRITICAL:** because the DB was `db push`-built (no migration history), the
  baseline is the only thing keeping `migrate dev` from trying to recreate tables.
  Do **not** run `migrate dev` before `migrate resolve --applied <baseline>`.
  After baseline, every subsequent schema change is its own `migrate dev`, run
  **one per feature** so each diff is small and verifiable. Each run regenerates
  the client — run `pnpm -r typecheck` after each to catch drift.

### 2. `hyperswitch.ts` — stop throwing on empty `profileId`

- Remove the `if (!cfg.profileId) throw …` from the constructor (`:84`).
- Add a private guard used by `createPayment`: if `!this.cfg.profileId` throw a
  typed `HyperswitchError("Hyperswitch profileId is not configured", 503)` (so the
  route returns 503, not 500). `verifyWebhookSignature` / `testConnection` must
  still work without a profileId.
- `clientFromConfig` already accepts `webhookSecret` — good. Keep it.

### 3. Console persist (`apps/console/src/app/(app)/integrations/page.tsx`)

- In `saveHyperswitch`, replace the comment-only block `:88-96` and the second
  `webhookLastFour`-only `update` `:115-129` with: write
  `webhookCiphertext/Iv/Tag/webhookLastFour` into the new columns in **both** the
  `upsert.create` and `upsert.update` branches when `sealedWebhook` is set.
  Remove the `webhookLastFour` key from `config` (it's now a real column).
- Add a webhook-secret "Test" / verify path: reuse `testHyperswitch` to also
  exercise `verifyWebhookSignature` round-trip (sign a sample body with the
  stored secret in-memory and verify). Keep `lastTestNote` truthful.

### 4. Webhook route (`apps/web/src/app/api/webhooks/hyperswitch/route.ts`)

- After opening `secret*`, also `open()` `webhookCiphertext/Iv/Tag` when present.
- Change webhook-secret resolution to prefer the stored sealed secret, fallback to
  env:
  `const webhookSecret = (storedWebhookSecret || process.env.HYPERSWITCH_WEBHOOK_SECRET || "")`.
  (Use truthiness, not `??`, so an empty `.env.example` value doesn't shadow a
  stored secret.)
- Pass `webhookSecret` into `clientFromConfig({ …, webhookSecret })`.
- The existing 503-on-missing-secret guard stays.

### 5. `confirmPayment` return leg (3DS)

- Add `apps/web/src/app/(portal)/portal/(protected)/invoices/[id]/pay/return/route.ts`
  (`runtime=nodejs`, `dynamic=force-dynamic`):
  - Read return params from the query: `payment_id | payment_intent_id |
redirect_status | client_secret`.
  - Load the invoice scoped to the signed-in account.
  - Prefer the gateway-returned `client_secret`; if absent, use `invoice.paymentRef`
    and skip the `confirm` call.
  - Call `client.confirmPayment(id, secret)` when a secret is present; on any
    error fall back to `client.retrievePayment(id)` (the webhook is the source of
    truth, but a direct reconcile here improves perceived latency).
  - Redirect to `/portal/invoices/{id}` (which already shows the live status).
  - Keep this route defensive: unknown param names must not crash it (hyperswitch
    param naming is confirmed against the live merchant profile during operator
    QA — note in the operator checklist).
- Update `pay/route.ts:76` `returnUrl` to `…/invoices/{id}/pay/return`.
- **Don't** let `pay/route.ts` orphan invoices in `PROCESSING`: instead of
  setting `PROCESSING` on create, set a new `status` only after the gateway
  confirms action; keep it `SENT`/`OVERDUE` until the webhook flips it. Simplest
  correct behaviour: do **not** change status on create (leave it payable); the
  webhook/reconcile path sets `PROCESSING`/`PAID`. Revert the `:82-85` status write.

### 6. Provisioning script (operator, documented)

- Create `scripts/provision-hyperswitch.mjs`:
  - Reads `HYPERSWITCH_ADMIN_API_KEY`, router base (`HYPERSWITCH_ROUTER_URL` env
    or default `http://127.0.0.1:8084`), an org name + merchant name (argv or env).
  - Flow (against confirmed live endpoints): `POST /organization` →
    `POST /accounts` → `POST /account/{id}/business_profile` →
    `POST /api_keys/{id}` (or the merchant's key endpoint). Capture
    `organization_id`, `merchant_id`, `profile_id`, `api_key`.
  - **Idempotent:** if `organization_id` already known (env), skip creation; reuse.
  - Prints the captured values and exact console fields to paste. Uses
    `fetch` + `Authorization: api-key`. Fails loud on non-2xx with the body.
- Add an npm script `provision:hyperswitch` in root `package.json` (or `db`).
- Document the endpoints/payloads in `docs/hyperswitch-provisioning.md` (the
  router admin API, not Control Center which 404s on `/api/v1/auth/*`).
- **Run it during implementation** (local router is healthy) to produce real
  `profile_id`/`api_key`, then store via the console integrations form (sealed).
  This makes the webhook _actually_ verifiable end-to-end.

### 7. Test additions

- `packages/integrations/src/hyperswitch.test.ts`: sign/verify round-trip
  (`seal` a secret → `verifyWebhookSignature(signedBody, header)` true; tamper →
  false); `confirmPayment` mocked fetch returns a payment; constructor no longer
  throws on empty `profileId`.
- `apps/web` e2e (playwright) optional dry-run: webhook with a real stored secret
  returns 200 and flips an invoice.

## Phase 1b — Twenty, email, Chatwoot, console flash

### Twenty (`packages/integrations/src/twenty.ts`)

- `resolveCompanyId` (`:157`): return `undefined` when not found (don't throw).
- `upsertPerson` / `upsertCompany`: send the fields already in the input types but
  currently dropped — `city`, `country`, `source`, `notes` (Person) and
  `industry`, `employees` (Company) — but **only** when the workspace actually has
  those fields. Implement a safe-payload helper: build the variables with known
  core fields always; wrap optional custom fields and, on a GraphQL error
  mentioning an unknown field, retry without them. (Avoids breaking on a vanilla
  Twenty workspace.)
- Add `TWENTY_WEBHOOK_SECRET` support: the webhook route already reads
  `process.env.TWENTY_WEBHOOK_SECRET`; add a console section to store it into the
  same new `webhook*` columns on the `twenty-crm` `PartnerIntegration` row, and a
  verify test. (Reuse the columns added in 1a.)
- `twenty.test.ts`: add a test that `resolveCompanyId` returns undefined for a
  missing company (mock gql empty edges); test that dropped fields are included in
  the variables when present.

### Email (`packages/auth/src/email.ts` + console)

- `loadSmtpConfig`: first read a `core.Integration` row where `provider = "smtp"`
  and `isEnabled` (columns `secret*` hold the password sealed; `config` holds
  `{ host, port, user, from }`); fall back to env vars when absent. This makes SMTP
  console-configurable and DB-backed, not env-only.
- Console SMTP section: new `provider: "smtp"` management on
  `apps/console/src/app/(app)/integrations/page.tsx` (or a new `settings`
  subsection). Fields: host, port, user, from, password(secret). Actions:
  `saveSmtp`, `verifySmtp` (sends a test mail via `sendEmail`). Uses `seal`/`open`
  like the AI provider section in `settings/page.tsx`.
- `lead notify`: after a lead commits in `apps/web/src/app/api/leads/route.ts`,
  fire `notifyNewLead(lead)` (new helper in `packages/integrations` or `apps/web/lib`)
  that sends a templated email to the ops address (setting `org.ops_email` or env
  `LEAD_NOTIFY_TO`) — fire-and-forget, never fails the capture. Reuses
  `sendEmail`.
- Add `@apex/auth` to `apps/console` deps so the console can `sendEmail`
  (invoice link / invitation).

### Chatwoot

- Console section on the partner page (or integrations): save
  `chatwoot.base_url`, `chatwoot.token`, `chatwoot.enabled`, `org.whatsapp` to
  `Setting` rows (group `partner`/`chatwoot`), matching keys the public
  `ChatLauncherGate` already reads. Add a `saveChatwoot` server action + flash.
- No relay service needed: the public widget talks browser→Chatwoot directly and
  the launcher already gates on settings. (Drop the `host.docker.internal` relay
  idea — it was speculative.)
- Surface Chatwoot + SMTP + Hyperswitch + Twenty flash banners on
  `integrations/page.tsx` (reuse the `flash.*` pattern from `settings/page.tsx`).

## Phase 2a — Billing schema surface (console)

Note: the registry already routes `/billing/quotes` and `/billing/invoices`. Build
those exact paths. Add `@apex/module-kit` + `@apex/auth` to console deps.

- `apps/console/src/app/(app)/billing/quotes/page.tsx` (`billing:read`):
  list `Quote`s (status, number, customer, total, lead). Server action
  `createQuote` (`billing:write`): fields customerName/email, companyName,
  leadId (picker), serviceSlug/productSlug, lineItems (repeatable rows),
  currency, taxAmount, validUntil, notes. Number via
  `nextSequential("quotes","QT-",prisma)` (transaction + unique-retry, mirror
  `tickets/new/page.tsx:27-35`). Compute `subtotal/total` server-side. Set
  `leadId` (portal visibility). Audit.
- `apps/console/src/app/(app)/billing/quotes/[id]/page.tsx`: view; actions
  `setQuoteStatus` (DRAFT→SENT→ACCEPTED/REJECTED/EXPIRED) and `convertToInvoice`.
- `apps/console/src/app/(app)/billing/invoices/page.tsx` + `[id]/page.tsx`
  (`billing:read`): list/detail `Invoice`. Server actions `createInvoice`
  (`billing:write`, same shape + `leadId`), `sendInvoice` (status→SENT + email the
  portal link), `markPaidManual` (status→PAID, paymentProvider="manual"),
  `cancelInvoice` (CANCELLED). On `sendInvoice` use `sendEmail` with the portal
  invoice URL and a Hosted-PDF-ish note (no PDF generator required in v1).
- Shared `nextSequential` helper in `apps/console/src/lib/numbers.ts`
  (reused by quotes+invoices).
- Detail pages render `lineItems` from the JSON.

## Phase 2b — Lead → customer conversion (structural fix)

- New `apps/console/src/lib/convert-lead.ts` exporting idempotent
  `convertLeadToCustomer(leadId, actor)`:
  - Load lead incl `portalAccounts`.
  - If `lead.portalAccounts` non-empty → return it (idempotent).
  - Else find a `PortalAccount` whose `slug`/`name` matches the lead email
    (self-serve holding account from `signup/route.ts`) → adopt it: set
    `leadId = lead.id`; return it.
  - Else create `PortalAccount { slug: slugify(lead.name)+rand, name: companyName ?? name, leadId }`;
    create `PortalInvitation { email: lead.email, role: OWNER, portalAccountId }`;
    send invitation via `sendInvitation({ to, inviterName: actor.name, organisation: name, url: invitationUrl(token), ttlDays })` (invitation URL must use the **web** `NEXT_PUBLIC_SITE_URL`, not console).
  - Write `leadActivity` (type `conversion`) + `audit({ action: "lead.converted" })`.
  - Wrap in `$transaction`.
- `leads/[id]/page.tsx` `updateLead`: when `stage` transitions to `CUSTOMER`,
  call `convertLeadToCustomer(id, actor)` inside the transaction (auto-create).
- Add a manual **"Convert to customer"** button on the lead page → server action
  `convertToCustomer` that sets `stage=CUSTOMER` if not already and calls the same
  helper (re-runnable; safe if already converted).
- This makes `invoices/page.tsx:12` resolve: an invoice with `leadId` of a lead
  whose `portalAccounts` includes the signed-in account becomes visible.

## Phase 2c — Support, projects, documents, accounts

### Support (registry routes exist)

- `apps/console/src/app/(app)/support/inbox/page.tsx` (`support:read`): list
  `Ticket`s, filter by status/assignee; link to detail.
- `apps/console/src/app/(app)/support/inbox/[id]/page.tsx`: view thread
  (`ticket.comments`). Server actions (all `support:write`): `addReply` (public
  comment + email the client optionally), `addInternalNote` (`isInternal: true`,
  never shown to client), `setStatus`, `assignTicket`. Write `TicketComment` +
  audit.
- `apps/console/src/app/(app)/support/kb/page.tsx`: list `KbArticle`s; minimal
  create + `publish/unpublish` (status DRAFT↔PUBLISHED). (KB is secondary; keep
  lean.)

### Projects / tasks (registry route `/projects`)

- `apps/console/src/app/(app)/projects/page.tsx` (`projects:read`): list
  `Project`s (status, lead). `createProject` (`projects:write`): name, summary,
  leadId (picker), portalAccountId (optional), budget, dates.
- `apps/console/src/app/(app)/projects/[id]/page.tsx`: project + tasks board.
  `createTask`, `setTaskStatus`. Set `Project.portalAccountId` so the portal
  `projects/page.tsx` (already queries `portalAccountId`) shows it; link `leadId`
  for attribution.

### Documents upload (console) + S3 fix (see Phase 5)

- `s3.ts`: add `presignedPutUrl(key, opts, env)` — same SigV4 build as GET but
  method `PUT`, `X-Amz-Expires` capped at 604800, host derived from the **serve
  base** (see Phase 5).
- New console **Accounts** surface (needed to host uploads + show conversion
  result): `apps/console/src/app/(app)/accounts/page.tsx` (`portal:read`) listing
  `PortalAccount`s, and `accounts/[id]/page.tsx` (`portal:admin`) with:
  - **Document upload**: server action `uploadDocument` that takes a `File` from
    `FormData`, computes `key = normalizeObjectKey(\`team/${accountId}/${file.name}\`)`,
gets `presignedPutUrl`, and does a **server-side `fetch`PUT** of the bytes
(avoids MinIO CORS), then`ClientDocument.create({ portalAccountId, filename,
    key, mimeType, bytes, title, publishedAt: now, uploadedByKind: "team",
    uploadedById: actor.id })`. Audit.
  - **Invite user**: `invitePortalUser(accountId, email, role)` reusing
    `invitationUrl`/`sendInvitation`.
  - Show linked `lead` (proves conversion wiring).
- Register `Accounts` nav in the console layout (or via module-kit — see nav note
  below). Add `clientPortal` nav entry `{ label: "Accounts", href: "/accounts",
permission: "portal:read" }` to `registry.ts`.

### Nav (console) — registry-driven

- Add `@apex/module-kit` to console deps; replace the hard-coded `NAV` in
  `apps/console/src/app/(app)/layout.tsx` with `modules.flatMap(m => m.nav)`,
  filtered by the user's permissions (mirrors the existing `visible` filter). This
  automatically surfaces Billing/Support/Projects/Accounts without per-page nav
  edits. Keep the `Overview`/login entries as fixed.

### Portal documents download (no route change)

- `documents/[id]/route.ts` already calls `presignedGetUrl` with `publicUrl`. Once
  Phase 5 fixes the host/path, downloads flip 403→200. No edit needed here.

## Phase 5 — S3 host + path fix (prod 403)

- `s3.ts` `presignedGetUrl` + new `presignedPutUrl`:
  - Define `serveBase = config.publicUrl ?? \`${config.endpoint}/${config.bucket}\``.
  - Derive the **signed host** from `new URL(serveBase).host` (so it matches the
    Host header the browser sends for `publicUrl`).
  - Derive the **canonical path** as `new URL(serveBase).pathname.replace(/\/$/,"") + "/" + encodedKey`
    — so the signed path equals the emitted path (fixes the `publicUrl` =
    `endpoint/bucket` case where path-prefix was previously unsigned).
  - `X-Amz-SignedHeaders=host`, `UNSIGNED-PAYLOAD`, `X-Amz-Expires` default 900,
    cap 604800.
  - `base` for emission = `serveBase.replace(/\/$/,"") + "/" + encodedKey`.
- `s3.test.ts`: **replace** the URL-shape-only assertions with an **AWS SigV4
  known-good vector** test. Refactor the signing into a small internal pure
  function `sign({ method, host, canonicalPath, amzDate, region, bucket, key,
accessKey, secretKey, expires })` returning `{ canonicalRequest, stringToSign,
signature }`, and assert against the AWS-published example:
  - AWS docs "Authenticating Requests: Using Query Parameters" —
    `GET /test.txt` on `examplebucket.s3.amazonaws.com`,
    `AKIAIOSFODNN7EXAMPLE` / `wJalrXUtnFEMI/K7MDENG+bPxRfiCYEXAMPLEKEY`,
    `us-east-1`, `20130524T000000Z`, `X-Amz-Expires=86400`.
  - Expected `stringToSign` hash = `3bfa292879f6447bbcda7001decf97f4a54dc650c8942174ae0a9121cf58ad04`
    and signature = `3ed0be64024db54d5574a27da223529635c383f911f80e636f0ccc13890053d2`
    (both verified by hand against AWS's test vectors during planning — the old
    `createHmac("sha256","")` bug fails this). This makes the host/path class of
    bug impossible to pass again.
  - Keep a regression test that a URL emitted for `{endpoint, bucket}` and for
    `{publicUrl: endpoint/bucket}` produces a signature valid for the **same host
    and path** (i.e. the two configs must sign identically) — this is the exact
    prod scenario.

## Phase 3 — Honest pricing / sourced benchmarks (inventory only)

- New script/agent pass: scan every public-facing number (stats, testimonials,
  case-study metrics, pricing tiers, market-size claims) across
  `apps/web/src/app/(site)`, `components`, `saas/[slug]`, `case-studies`,
  `industries`, `insights`, `about`, hero counters.
- Produce `docs/credibility-inventory.md`: a table with columns
  `file:line | claim | value | source doc (PDF/HTML) | status (sourced / unsourced)`.
  Cross-check each against the four provided source docs:
  - `AI Infrastructure Transformation Services — Global Market Analysis & Pricing Framework.pdf`
  - `Modular AI Infrastructure Services — Productized Cloud Engineering at Cost-Leadership Pricing.pdf`
  - `Genesis_X_Internal_Financial_Scoping.html` + `Genesis_X_Invoice.html`
  - `Nova_Internal_Financial_Scoping.html` + `Nova_Invoice.html`
- **No edits** to public content are made by this implementation. The report is
  handed to the operator for sign-off: cite inline or remove. (The existing
  `<Stat source=…>` already enforces this for the Stat block; the inventory covers
  everything that bypasses it.)

---

## Validation (run after each phase slice)

- `pnpm -r typecheck` — catches Prisma client drift after each `migrate dev`.
- `pnpm -r lint`.
- `pnpm -r test` (vitest): integrations SigV4 known-vector + HS sign/verify +
  twenty resolveCompanyId; db/console unit tests pass.
- `pnpm --filter @apex/integrations test` (fast loop for S3/HS/twenty).
- Migration sanity: `pnpm --filter @apex/db -- prisma migrate status` reports the
  applied migrations with no drift.
- E2E dry run (staging): lead capture → sync to Twenty → console convert to
  CUSTOMER (PortalAccount.leadId set + invite sent) → issue invoice (invoice.leadId
  set) → client pays via Hyperswitch (real `profile_id` from the provision script)
  → webhook verifies (real stored secret) → `Invoice` flips PAID → invoice visible
  in portal → document upload + download works (host fix).
- Rebuild both apps and `pm2 reload` (NEXT_PUBLIC vars are inlined at build).

## Operator checklist (hand-off, not autonomous)

1. Run `scripts/provision-hyperswitch.mjs` → paste `profile_id` + `api_key` +
   `webhookSecret` into the console Integrations form (sealed).
2. Confirm the Hyperswitch merchant profile's 3DS return params against
   `invoices/[id]/pay/return/route.ts` (adjust param names if the profile differs).
3. Supply real Twenty CRM key + `TWENTY_WEBHOOK_SECRET` via console.
4. Configure SMTP + Chatwoot via console; verify SMTP sends.
5. Rebuild `apps/web` + `apps/console` and `pm2 reload` (fixes the stale `.next`
   `cloud.` host; `.env` is already correct — do NOT re-edit it).
6. Review `docs/credibility-inventory.md`; decide cite-or-remove per row.

## Risks

- **Migration baseline** on a populated DB: handled by baseline + `migrate resolve`
  before any `migrate dev`. Confirmed the `apex` role can create the shadow DB.
- **Real credentials** (HS/Twenty/Chatwoot keys, HS merchant) are operator-supplied
  — code changes don't invent them; provision script makes supplying them trivial.
- **3DS return flow** depends on the live merchant profile's redirect shape —
  handler is written defensively and flagged for operator QA.
- **Phase 3** is gated — inventory only, no content edits.
