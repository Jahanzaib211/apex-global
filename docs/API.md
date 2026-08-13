# API reference

Every HTTP route handler in the system, what calls it, and how it is authenticated.

All 19 routes live in `apps/web`. The console has none — it mutates through inline server actions,
which is why `apps/console/src` contains no `route.ts` at all. Credentials for the live services are
in `infra/MASTER-CREDENTIALS.md`, gitignored and never to be committed; nothing here repeats them.

**A route with no caller does not belong in the codebase.** Every row below names the code that
calls it. When you add a route, add its caller to this table in the same change; when you delete the
last caller, delete the route. Two routes were once orphaned this way — `/api/revalidate`, which
meant published content never reached the public site, and `/api/portal/auth/logout`, whose logic had
quietly diverged from the server action that replaced it.

Verified against the source on 13 Aug 2026. That pass found two handlers missing from this table —
`/api/leads/partner`, shipped in `80ba62a`, and `/portal/invoices/[id]/pay/return` — which is exactly
the drift the rule above exists to prevent. The count and the inventory now match
`find apps/web/src/app -name route.ts`.

## Inventory

| Route                                      | Method | Auth                                    | Caller                                           |
| ------------------------------------------ | ------ | --------------------------------------- | ------------------------------------------------ |
| `/api/health`                              | GET    | none                                    | `scripts/smoke-test.mjs`, deploy workflow        |
| `/api/leads`                               | POST   | none — honeypot, rate limit, Turnstile  | `components/lead-form.tsx`                       |
| `/api/demo-request`                        | POST   | none — honeypot, rate limit, Turnstile  | `(site)/saas/[slug]/page.tsx`                    |
| `/api/leads/partner`                       | POST   | HMAC `x-apex-signature` + `x-apex-site` | `lib/apex-lead.ts` in the four sibling sites     |
| `/api/revalidate`                          | POST   | `x-revalidate-secret`                   | `apps/console/src/lib/revalidate.ts`             |
| `/api/webhooks/hyperswitch`                | POST   | HMAC `x-webhook-signature`              | Hyperswitch gateway                              |
| `/api/webhooks/twenty`                     | POST   | HMAC `x-twenty-signature`               | Twenty CRM                                       |
| `/api/portal/auth/signup`                  | POST   | none                                    | `(unauth)/signup/signup-form.tsx`                |
| `/api/portal/auth/login`                   | POST   | none — issues the session               | `(unauth)/login/login-form.tsx`                  |
| `/api/portal/auth/logout`                  | POST   | session cookie + CSRF pair              | `(protected)/layout.tsx` sign-out                |
| `/api/portal/auth/forgot-password`         | POST   | none — rate limited per email           | `(unauth)/forgot-password/forgot-form.tsx`       |
| `/api/portal/auth/reset-password`          | POST   | bearer-of-token                         | `(unauth)/reset-password/reset-form.tsx`         |
| `/api/portal/auth/accept-invitation`       | POST   | bearer-of-token                         | programmatic; the page calls the lib directly    |
| `/api/portal/auth/oauth/unlink/[provider]` | POST   | session cookie                          | `(protected)/account/page.tsx`                   |
| `/portal/api/documents/[id]`               | GET    | session cookie                          | `(protected)/documents/page.tsx`                 |
| `/portal/invoices/[id]/pay`                | POST   | session cookie                          | `(protected)/invoices/[id]/page.tsx`             |
| `/portal/invoices/[id]/pay/return`         | GET    | session cookie                          | the Hyperswitch redirect, returning the customer |
| `/portal/auth/[provider]/start`            | GET    | none — entry point                      | login page, account page, invitation page        |
| `/portal/auth/[provider]/callback`         | GET    | signed state + nonce cookie             | the OAuth provider                               |

Route groups do not appear in URLs. `(portal)/portal/(protected)/invoices/[id]/pay/route.ts` serves
`/portal/invoices/<id>/pay`, and the OAuth callback file resolves to `/portal/auth/<provider>/callback`
— the provider segment comes first. Registering the reversed URI in the Google or Microsoft console
sends every sign-in to a 404 after consent.

## Authentication

Four mechanisms, easy to confuse and worth naming separately.

| Mechanism             | Used by                    | How it works                                                                |
| --------------------- | -------------------------- | --------------------------------------------------------------------------- |
| Portal session cookie | portal routes              | `apex_portal_session`, httpOnly, checked in-handler by `lib/portal/auth.ts` |
| Bearer-of-token       | invitation, password reset | possession of a token whose SHA-256 hash is stored; no session needed       |
| Webhook HMAC          | the two webhook receivers  | signature over the raw body, refused outright when no secret is configured  |
| Shared secret         | `/api/revalidate`          | `x-revalidate-secret`, compared in constant time                            |

**`apps/web/src/middleware.ts` is a maintenance-mode gate, not an auth gate.** Its `PROTECTED_PATHS`
list means "exempt from the maintenance redirect" — the opposite of the usual reading — and it never
looks at the session cookie. Portal authorisation happens entirely inside the handlers, via
`requirePortalUser`, `requirePortalUserAccount` or `currentPortalUser`. Nothing at the edge protects
a portal route; if a handler forgets to call one of those three, the route is public.

One consequence worth knowing: the two `(portal)` API routes answer an unauthenticated request with a
303 to the HTML login page rather than a 401, because `requirePortalUserAccount` redirects. That is
right for a browser following a link and wrong for a programmatic client.

## Public form endpoints

Both take unauthenticated traffic from the marketing site and share their defences via
`apps/web/src/lib/form-guards.ts`: an in-process rate limit of 5 requests per 10 minutes per address,
a honeypot field, and Cloudflare Turnstile.

The rate limiter is per-replica and says so in its own comment; the Redis counter in `modules/crm`
supersedes it when the worker tier lands. Turnstile **fails open** when `TURNSTILE_SECRET_KEY` is
unset or the challenge provider is unreachable, and logs loudly in production when it does. This is
deliberate: binning real enquiries mid-campaign because a key was missing costs more than the spam
the challenge stops, and it is far harder to notice.

### `POST /api/leads`

General contact and enquiry capture. Validated by `lib/lead-schema.ts`. Writes `Lead`,
`LeadAttribution` and `LeadActivity` in one transaction, deduplicating on a hash of the email — a
repeat submission from the same address appends an activity row rather than creating a second lead
for sales to call twice.

`201 {ok, id}` · `400` malformed · `403` failed challenge · `422 {error, fields}` · `429` rate limited

A filled honeypot returns `201 {ok: true}` and writes nothing. Naming the trap field in a validation
error would tell the bot exactly which input to leave alone next time.

### `POST /api/demo-request`

The same pipeline plus a `DemoRequest` row linking the lead to a SaaS product, so demo requests join
the CRM pipeline instead of a separate inbox. Requires a `productSlug` that resolves to a `LIVE`
product; anything else is `404`. Same status codes as `/api/leads`, plus `404 {error}`.

## Group partner ingress

### `POST /api/leads/partner`

The other four Apex properties — group, holdings, outsourcing, tours — post their enquiries here, so
the whole group shares one pipeline instead of four disconnected inboxes. Called server-to-server by
`lib/apex-lead.ts` on each sibling site; **never from a browser**. There is no CORS header and no
public key in any client bundle, because nothing in a browser is meant to reach it.

Three headers are required:

| Header             | Meaning                                                                                 |
| ------------------ | --------------------------------------------------------------------------------------- |
| `x-apex-site`      | which property: `tech`, `apex-group`, `apex-holdings`, `apex-outsourcing`, `apex-tours` |
| `x-apex-timestamp` | unix seconds, refused beyond ±300 s (`SIGNATURE_TOLERANCE_SECONDS`)                     |
| `x-apex-signature` | HMAC-SHA256, hex, keyed on `PARTNER_LEAD_SECRET`                                        |

**The signed string is `timestamp.site.rawBody`, not the body alone** — see
`lib/partner-signature.ts`. Signing only the body would leave `x-apex-site` unauthenticated, and a
captured Apex Tours request could be relabelled as Apex Holdings and land in the wrong team's
pipeline with a signature that still verified. The comparison is `timingSafeEqual`, with a length
check first because it throws on mismatched lengths.

The body is `lead-schema.ts` minus `turnstileToken` — there is no browser to challenge — and keeps
the honeypot. Everything lands through the same `ingestLead()` as the public forms, so the four
sites get identical dedupe, attribution and Twenty sync. The lead's `sourceSite` is taken from the
header, and the dedupe key is `sourceSite:email:day` rather than `email:day`, so the same person
enquiring at tours _and_ at tech on one day is two leads with two intents, not one collapsed row.

`201 {ok, id, wasNew}` · `400` unknown site or malformed body · `401` bad, missing or stale
signature · `422 {error, fields}` · `500` · `503` when `PARTNER_LEAD_SECRET` is unset — the endpoint
refuses to run unauthenticated rather than fall open, which is the opposite of the Turnstile choice
above and correct for the opposite reason: this one has a shared secret to rely on.

A filled honeypot returns `201 {ok: true}` and writes nothing, same as `/api/leads`.

## Cache invalidation

### `POST /api/revalidate`

Purges this app's ISR cache. Header `x-revalidate-secret`, body `{paths?: string[], tags?: string[]}`.
Always revalidates the root layout as well, so changed content reaches every page sharing its chrome.

`200 {revalidated}` · `403` wrong secret · `503` when `REVALIDATE_SECRET` is unset

**The console cannot purge this cache by calling `revalidatePath`.** Console and web are separate
processes with separate caches, so a local call there clears only the console's own. Publishing in the
console goes through `apps/console/src/lib/revalidate.ts`, which posts here. Both apps read the same
`REVALIDATE_SECRET` from the repo-root `.env`; the purge is best-effort and never fails the publish
that triggered it.

```bash
curl -sS -X POST "$WEB_ORIGIN/api/revalidate" \
  -H 'content-type: application/json' \
  -H "x-revalidate-secret: $REVALIDATE_SECRET" \
  -d '{"paths":["/","/solutions"]}'
```

## Webhook receivers

Both verify an HMAC signature over the **raw** request body, look up their `PartnerIntegration` row,
decrypt the stored API key through the vault, and stamp `lastEventAt` / `lastEventKind`.

**Neither accepts an unsigned payload.** Both guards once ran only when a secret happened to be
configured, so an unconfigured deployment would take an anonymous POST and act on it — enough to mark
an invoice `PAID` or move a lead to `CUSTOMER`. An unconfigured webhook is a broken webhook, not an
open one, and both now answer `503` rather than trusting the body.

| Route                       | Header                | Secret                                                 | Effect                                    |
| --------------------------- | --------------------- | ------------------------------------------------------ | ----------------------------------------- |
| `/api/webhooks/hyperswitch` | `x-webhook-signature` | `HYPERSWITCH_WEBHOOK_SECRET` or the integration config | maps payment status onto `Invoice.status` |
| `/api/webhooks/twenty`      | `x-twenty-signature`  | `TWENTY_WEBHOOK_SECRET`                                | maps CRM stage onto `Lead.stage`          |

`200 {received: true}` · `400` malformed · `401` bad signature · `503` not configured

Register the public URLs in each provider's own settings; nothing in `infra/` configures them.

## Portal authentication

### `POST /api/portal/auth/login`

Two modes. `{magic: true}` emails a sign-in link and always answers `{ok: true}`, so the response
cannot be used to discover which addresses have accounts. Password mode verifies the password, locks
the account for 15 minutes after 5 failures, then issues a `PortalSession` and sets the cookie.

Rate limited per IP **and** per email — a single IP limit does nothing against a distributed guess at
one account. Returns `{ok, requiresTotp: true}` and a 5-minute pending cookie when TOTP is enabled.

`200` · `401` bad credentials · `403` deactivated or unverified · `422` · `423` locked · `429`

### `POST /api/portal/auth/signup`

Self-serve signup. Creates a placeholder `PortalAccount`, a `MEMBER` `PortalUser` and a 24-hour
verification link. An address that already exists gets `{ok: true}` with nothing written. The
verification email is sent **after** the transaction commits — sending inside it held a database
transaction open for an SMTP round trip and rolled the account back when a send failed.

### `POST /api/portal/auth/logout`

Revokes the session, writes a `user.signed_out` audit row and clears the cookie. Form posts must
carry a `csrf` / `csrfSignature` pair; without it any site could sign a user out with a hidden form.
Answers `303` to `/portal/login` for form posts and `{ok: true}` for JSON callers.

Shares one implementation — `destroyPortalSession()` in `lib/portal/auth.ts` — with the
`signOutPortal` server action used by `/portal/logout`.

### `POST /api/portal/auth/forgot-password` · `reset-password`

Forgot-password answers `{ok: true}` unconditionally and rate-limits per email. It reaches the
database through a raw `pg.Pool` rather than Prisma, deliberately: the comment in the handler records
the engine conflict that forced it. Its `500` body carries no detail — the route is unauthenticated,
and database error codes describe the schema to anyone willing to provoke a failure.

Reset consumes a token by hash, checks `usedAt` and `expiresAt`, sets the new password and revokes
every session for the user.

### `POST /api/portal/auth/accept-invitation`

Redeems an invitation. Accepts JSON or form encoding. The accept page calls
`redeemInvitation()` in `lib/portal/invitations.ts` directly rather than fetching this route over the
network, and this route is the programmatic entry point to the same function.

Invitation links put the token in the **path** — `/portal/accept-invitation/<token>` — because the
page is a `[token]` dynamic route. Build them with `invitationPath()` or `invitationUrl()`; the
`?token=` query form matches no route.

Issue one with:

```bash
pnpm --filter @apex/db invite -- someone@example.com [account-slug] [OWNER|ADMIN|MEMBER]
```

### `POST /api/portal/auth/oauth/unlink/[provider]`

Removes a `PortalOAuthAccount` for the signed-in user. `google` and `microsoft` only. Refuses with
`409` when it would remove the last remaining sign-in method.

## Portal resources

### `GET /portal/api/documents/[id]`

Redirects (`303`) to a 5-minute presigned S3 URL. The document lookup is scoped to the caller's
`portalAccountId` and to published documents, so an id from another account simply does not exist.

### `POST /portal/invoices/[id]/pay`

Creates a Hyperswitch payment for an invoice the caller's account owns, in status `SENT` or
`OVERDUE`, sets the invoice to `PROCESSING` and redirects to the gateway. Idempotency key
`invoice-<id>`. `503` when the gateway is not configured, `404` when the invoice is not payable by
this caller, `502` when the gateway returns no payment target.

## OAuth

`GET /portal/auth/[provider]/start` mints a nonce, signs it into the state, stores it in a 10-minute
cookie and redirects to the provider. `GET /portal/auth/[provider]/callback` verifies the state
against that cookie, exchanges the code, and requires a provider-verified email.

**The callback never creates a user.** An email with no portal user is refused, so OAuth links
identities to accounts an operator has already invited — it is not a signup path.

Both routes derive the redirect URI from `portalOAuthRedirectUri()` in `lib/portal/oauth.ts`. Deriving
it twice is how the two once drifted apart, and the provider rejects a token exchange whose
`redirect_uri` differs by even a character from the one used at authorisation. The value registered
in the provider console must be:

```
https://tech.apexgroupcompanies.com/portal/auth/google/callback
https://tech.apexgroupcompanies.com/portal/auth/microsoft/callback
```

## Health

### `GET /api/health`

`200 {ok, version, db, latencyMs, now}` when the process is up and `SELECT 1` succeeds, `503`
otherwise. A health check that reports healthy while the database is unreachable tells you nothing
worth knowing, which is why this does not simply return a constant.

Used by `pnpm smoke` and by the deploy workflow, which previously had nothing better to poll than the
homepage — and a cached homepage returns 200 long after the database has gone.

## Testing

| Suite        | Command                                  | Covers                                                     |
| ------------ | ---------------------------------------- | ---------------------------------------------------------- |
| Unit         | `pnpm test`                              | redirect URI and invitation URL builders, form guards      |
| API routes   | `pnpm test:e2e --project=public-desktop` | `tests/e2e/public/api-routes.spec.ts`                      |
| Portal flows | `pnpm test:e2e --project=portal`         | sign-in, sign-out through the route, invitation page       |
| Smoke        | `pnpm smoke`                             | homepage, health, lead validation against a running origin |
