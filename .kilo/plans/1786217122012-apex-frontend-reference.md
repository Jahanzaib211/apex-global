# Plan: Fix Chatwoot visibility + Mailcow login + Hyperswitch login

Three independent login/visibility fixes, to be done together.

---

## A. Chatwoot — agent can't see widget conversations (root cause FOUND)

**Diagnosis (verified):** Widget messages DO arrive — conversation 14 in inbox
**"Apex Global Live Chat" (id 1)** contains the visitor's `"hi"` + Chatwoot templates. But
`inbox_members` is **empty (0 rows)** and it is the only inbox. Chatwoot scopes an agent's
Conversations view to inboxes they belong to, so with no members the conversation is invisible in
the agent's default view (and no one is notified).

**Fix:** add the agent(s) to inbox 1.

- Preferred: Chatwoot UI (superadmin → Settings → Inboxes → "Apex Global Live Chat" → Add agent
  `alilabsx@gmail.com`) or API `POST /api/v1/accounts/1/inboxes/1/assignments` `{"user_id":1}`.
- Deterministic fallback (DB): `INSERT INTO inbox_members (user_id, inbox_id, created_at,
updated_at) VALUES (1,1,now(),now());` on `chatwoot-postgres` (db `chatwoot`), then reload the
  Chatwoot worker so the membership cache refreshes.
- `users`: id 1 = `alilabsx@gmail.com` (SuperAdmin). Add any other agents if they exist.
  **Verify:** `SELECT count(*) FROM inbox_members WHERE inbox_id=1;` ≥ 1; conversation 14 visible in
  agent Conversations; a fresh widget message appears.

---

## B. Mailcow admin login (root cause: master password not applied)

**Diagnosis (verified):** `admin` account is **active + superadmin**; `/api/v1/*` returns 200 at
every layer (loopback nginx :8080, caddy :8085, public tunnel). The 404 on `/api/v1/login` was only
my probe lacking the CSRF token (login page is a SPA). Recorded password is
`Apex-Mailcow-Admin!2026` (last modified 2026-08-08). Your failure is because you're trying the
**master password `Jatt@1234567`** — from our earlier plan, which was never executed.

**Fix:** set the mailcow admin password to the master password `Jatt@1234567` (unify credentials).

- Preferred: log in with current `Apex-Mailcow-Admin!2026` → Admin → change password to
  `Jatt@1234567`.
- Deterministic if UI blocked: update the `password` hash in mailcow MySQL `admin` table
  (`mailcowdockerized-mysql-mailcow-1`, db `mailcow`) to a PHP `password_hash` of `Jatt@1234567`
  (e.g. `htpasswd -b -B -n x Jatt@1234567` → bcrypt `$2y$…`, which PHP `password_verify` accepts).
- Update `infra/MASTER-CREDENTIALS.md` (mailcow admin pass → `Jatt@1234567`, user `admin`).
- Update Playwright defaults: `tests/e2e/surfaces/signs.spec.ts:15` and
  `tests/e2e/portal/mailcow-admin.spec.ts:16` → `?? "Jatt@1234567"`.
  **Verify:** log in at `https://cloud.apexgroupcompanies.com/admin/` with `admin` / `Jatt@1234567`
  (superadmin dashboard). Playwright `mailcow-admin` test green with no env override.

---

## C. Hyperswitch Control Center login (root cause: no owner account)

**Diagnosis (verified):** `user_authentication_methods` = **0 rows** (no owner) while
`merchant_account` = 2 (merchant provisioned). Router is still
`juspaydotin/hyperswitch-router:nightly-standalone`, so `/api/v1/auth/register` → **404** — the
Control Center "Register" (which creates the login user) cannot run. Hence login fails (no account).

**Fix:** enable the user service, then register the owner.

1. Switch the router image in `infra/docker-compose.hyperswitch.yml:108` from `nightly-standalone`
   to a **release tag that bundles the user service** (implementation agent must pick a concrete
   `juspaydotin/hyperswitch-router:<release>` tag; the `nightly-standalone` build is the blocker).
   Postgres uses named volume `hyperswitch_pgdata`, so the merchant/org persists across the swap.
2. `docker compose -f infra/docker-compose.hyperswitch.yml up -d hyperswitch-router`. If router
   now 404s on `/organization` or `HE_00`, apply router migrations per
   `docs/hyperswitch-provisioning.md`, then re-run `scripts/provision-hyperswitch.mjs` if the
   merchant was lost.
3. Register the Control Center owner `alilabsx@gmail.com` / `Jatt@1234567` at
   `http://127.0.0.1:9090/dashboard/register` (one-time seed). Confirm `/api/v1/auth/register`
   now returns non-404.
4. Update `tests/e2e/surfaces/signs.spec.ts` "hyperswitch control center" test to **actually log
   in** (fill `alilabsx@gmail.com` / `Jatt@1234567`, click Sign in, assert post-login dashboard)
   instead of only rendering the form.
   **Verify:** `curl -s -o /dev/null -w '%{http_code}' -X POST http://127.0.0.1:8084/api/v1/auth/register`
   → non-404; CC login succeeds; Playwright hyperswitch test logs in for real.

---

## Validation (all three)

- Chatwoot: `inbox_members` ≥ 1 for inbox 1; agent sees conversation 14 + new messages.
- Mailcow: `admin`/`Jatt@1234567` logs into superadmin dashboard; Playwright green.
- Hyperswitch: owner exists (`user_authentication_methods` ≥ 1); CC login works; Playwright logs in.
- `pnpm exec playwright test --project=surfaces --reporter=list` (signs + reachability) green.

## Risks / open questions

- **Mailcow**: if the current `Apex-Mailcow-Admin!2026` ALSO fails in the real UI (not just
  wrong-password), investigate the caddy/mailcow nginx `/api` forwarding — but GET `/api/v1/get/version`
  is 200 everywhere, so the endpoint is healthy; the cause is almost certainly the password.
- **Hyperswitch image tag**: the exact release tag that includes the user service must be confirmed
  by the implementation agent (check `juspaydotin/hyperswitch-router` tags); wrong tag = same
  blocker. DB migrations may be required after the swap (`HE_00` → apply migrations).
- **DB-member cache**: Chatwoot direct `inbox_members` insert may need a worker reload to show.
- Secrets (`Jatt@1234567` now used for mailcow + hyperswitch too) are fine for a homelab; rotate
  before any public exposure (already noted in MASTER-CREDENTIALS).
