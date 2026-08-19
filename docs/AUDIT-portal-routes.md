# Audit: Portal routes, auth boundaries and email routing

Date: 2026-08-18
Scope: `apps/web` (client portal + public site), `apps/console` (admin), `packages/auth` (identity + email)

---

## A. Portal route / auth audit — 11 findings

### 1. FIXED — Console dashboard was ungated

`apps/console/src/app/(app)/page.tsx` previously rendered lead counts and the
eight latest enquiries (name, company, email, message) with no `requirePermission`
call. Any signed-in console user — including a `viewer` or a user whose role had
no permissions — could read lead PII.

Fix: the page now calls `requirePermission("core:read")`, and every lead query
and lead widget is gated on `can(user, "crm:read")`. A `core:read`-only user
sees the greeting, the four count tiles (zeroed) and a placeholder explaining
that lead data requires CRM read access. No lead PII renders without `crm:read`.

### 2. FIXED — Wrong permission on the integrations page

`apps/console/src/app/(app)/integrations/page.tsx:39` gated a read-only page on
`partner:write`. The page only reads integrations for display; writes happen in
the server actions, which each call `requirePermission` themselves.

Fix: page gate is now `partner:read`; the `save*`/`test*` actions keep
`partner:write`.

### 3. FIXED — Settings page/action permission mismatch

`apps/console/src/app/(app)/settings/page.tsx` gated the page on `core:admin`
but its two server actions (`saveIntegration`, `testIntegration`) re-required
`ai:admin`. A user with `core:admin` but not `ai:admin` could load the page and
see "not authorised" on every save — or worse, the mismatch made the intent
unreadable. The AI providers section is part of the settings surface.

Fix: both actions now require `core:admin` to match the page.

### 4. FIXED — Audit-log gaps in five mutations

The following mutations ran without `audit()`:

- `projects/[id]/page.tsx` — `createTask` and `setTaskStatus` (task creation and
  every status change were invisible in the audit trail).
- `dev/page.tsx` — the refresh action is a no-op; added a comment instead.
- `integrations/page.tsx` — `verifySmtp` sent a real outbound email with no
  audit record; now `integration.tested` / `integration.test_failed` with the
  recipient and outcome.
- `settings/page.tsx` — `testIntegration` (AI provider connection tests) ran
  untracked; now audited the same way.

### 5. FIXED — OAuth unlink POST had no CSRF protection

`apps/web/src/app/api/portal/auth/oauth/unlink/[provider]/route.ts` accepted any
cross-origin form POST. A hostile page could submit
`<form method=post action="https://portal.example/api/portal/auth/oauth/unlink/google">`
and unlink the visitor's Google identity on load.

Fix: the route now requires the same signed `csrf` + `csrfSignature` pair used
by the sign-out route. The account page renders the pair as hidden inputs
(issued per-request in `account/page.tsx`). Cross-origin form posts cannot
forge the signature, so the unlink form is now inert from other origins.

### 6. DEFERRED (documented) — TOTP challenge is not wired

The sign-in route writes a `apex_portal_totp_pending` cookie when the account
has TOTP enabled, and the schema has `totpEnabledAt`. The `/portal/auth/totp`
challenge page does not exist yet, so a 2FA-enabled account cannot complete
sign-in in the current UI.

Decision: keep as a future feature — not a security hole (the account is not
signable-in via password at all), but documented so the flow is not forgotten.
When implemented: verify the pending cookie, verify the code, then issue the
portal session.

### 7. FIXED — `/portal/forgot-password` did not bounce signed-in users

Every other unauth page (login, signup, reset-password) calls
`redirectIfSignedIn`. Forgot-password now does the same.

### 8. FIXED — Misleading middleware constant name

`apps/web/src/middleware.ts` named its maintenance-exemption list
`PROTECTED_PATHS`. "Protected" normally means auth-gated, which is the opposite
of what the list does (paths that stay served during maintenance). Renamed to
`MAINTENANCE_EXEMPT_PATHS` and the comment explains the meaning.

### 9. FIXED (verified clean) — Orphan portal account

The orphan `portal_accounts.pipeline-test-co` row (zero `portal_users`, zero
`portal_invitations`) no longer exists — a previous test run's cleanup removed
it. Queries re-verified: no orphaned accounts remain in `portal_accounts`.

### 10. FIXED — OAuth callback comment drift + missing isActive check

`apps/web/src/app/(portal)/portal/(unauth)/auth/[provider]/callback/route.ts`
described the flow as "invitation-only", but the code accepts any existing
portal user (including self-serve signup users) — the email lookup is by
verified email, not by invitation. The comment now describes the real
behaviour, and an inactive user who signs in via a previously-linked OAuth
identity is refused with the deactivated-account error (previously only the
email-match branch checked `isActive`).

### 11. FIXED — `startsWith("/portal")` matched `/portalist`

`pathname.startsWith("/portal")` in the middleware treated any path beginning
with the string as portal traffic. `/portalist` (or `/portaless-…`) would have
been exempt from maintenance mode. The check now matches whole path segments
(`=== "/portal" || startsWith("/portal/")`), with the same tightening for the
other prefixes.

---

## B. Email routing audit — 8 flows verified, 4 fixes

### Verified correct (no change)

| Flow | Emitted from | Recipient | URL in email | Consumed at | Result |
|---|---|---|---|---|---|
| Email verification | `api/portal/auth/signup/route.ts:104` | `input.email` (the signup address) | `/portal/auth/verify-email?token=…` | `(unauth)/auth/verify-email` | ✓ |
| Sign-in magic link | `api/portal/auth/login/route.ts:108` | `user.email` (verified account) | `/portal/auth/magic?token=…` | `(unauth)/auth/magic` | ✓ |
| Password reset | `api/portal/auth/forgot-password/route.ts:106` | the submitted email, and only if `isActive && emailVerifiedAt` | `/portal/reset-password?token=…` | `(unauth)/reset-password` | ✓ |
| Invitation | `apps/console/src/lib/convert-lead.ts:96` and accept-page resend | `lead.email` / `invitation.email` | `/portal/accept-invitation/<token>` | `[token]` dynamic route | ✓ |
| New-lead notify | `apps/web/src/lib/ingest-lead.ts:228` | `notify.lead_to` setting → `LEAD_NOTIFY_TO` env → sales inbox | console link | n/a (internal ops) | ✓ |

All consumers look up by SHA-256 token hash, reject used/expired links, and
mark `usedAt` (or `acceptedAt`) so links are single-use. Reset tokens live in
the separate `portal_password_resets` table with a 1-hour TTL; sign-in and
verify tokens live in `portal_magic_links` with a 24-hour TTL. Reset
consumption revokes all other outstanding resets and every active session for
the user.

SMTP resolution order is correct: console-managed `Integration` (provider
`smtp`, AES-256-GCM-sealed password) wins; env vars (`SMTP_HOST`, `SMTP_FROM`)
fall back; a missing host falls back to a console printer (dev only). The
console's `/integrations` SMTP form field names (`host`, `port`, `user`,
`from`) match `email.ts`'s reader exactly.

### Fixed

1. **Token purpose cross-use** — `magic/page.tsx` and `verify-email/page.tsx`
   looked up tokens by hash alone, so a verify-email token pasted into
   `/portal/auth/magic` minted a session, and a sign-in token pasted into the
   verify URL marked the address verified. Both consumers now enforce
   `link.purpose === "sign-in"` / `=== "verify-email"`.
2. **OAuth dead end on the accept page** — "Continue with Google/Microsoft" was
   rendered even for invitees with no portal user yet, but the OAuth callback
   fails closed ("No portal account exists for that email"). The buttons now
   render only when a portal user already exists for the invitation email;
   fresh invitees are told to set a password first.
3. **SMTP "From" was a personal Gmail on the Brevo relay** — `.env` sent as
   `alilabsx@gmail.com` via `smtp-relay.brevo.com`. Brevo refuses or spam-flags
   sends from unverified senders, and a Gmail From cannot be DKIM-aligned. The
   From is now fully manageable from the console UI (`/integrations` → SMTP:
   host, port, user, From, Reply-To, password, enabled, test send), and the
   code fallback for an unset From was corrected from the invalid
   `no-reply@apexglobal.example` to `no-reply@apexgroupcompanies.com`.
4. **Lead-notification recipient is now UI-managed** — previously hard-coded
   fallback only. Added a `notify.lead_to` Setting, seeded to
   `sales@apexgroupcompanies.com`, editable from `/integrations` → "New-lead
   notifications", with the env var as the next fallback. `LEAD_NOTIFY_TO` set
   explicitly in `.env` for clarity.

---

## Verification

- `pnpm --filter @apex/web typecheck` ✓
- `pnpm --filter @apex/console typecheck` ✓
- `pnpm --filter @apex/web lint` ✓
- `pnpm --filter @apex/console lint` ✓
- `pnpm --filter @apex/auth test` — 35/35 ✓
- `pnpm --filter @apex/console test` — 12/12 ✓
- Playwright `--project=portal` — 9/9 ✓ (includes the session-switch
  regression pair added for the sign-in cache bug)
- Playwright console `auth.spec.ts` — 3 pass, 2 skipped (require seeded admin
  credentials)

Pre-existing, unrelated: `packages/integrations/src/hyperswitch.test.ts` fails
typecheck (TS2532 at lines 308/342) — present before this audit, untouched.
