# Hyperswitch merchant provisioning

The Hyperswitch merchant (and its `profile_id`) is provisioned through the
**router admin API**, not the Control Center UI. The published
`nightly-standalone` router image 404s on `/api/v1/auth/*`, so the Control
Center "create merchant" flow is unusable.

A repeatable, idempotent script drives the admin API:

```bash
HYPERSWITCH_ADMIN_API_KEY=<router admin key> \
HYPERSWITCH_ROUTER_URL=http://127.0.0.1:8084 \
  node scripts/provision-hyperswitch.mjs "Apex Global Revenue"
```

It creates `POST /accounts`, then mints `POST /accounts/{id}/api_keys`, and
prints the exact console fields to paste: **Base URL**, **Profile ID**
(`merchant_id`), **API key**, and a generated **webhook signing secret**.

> Pass `HS_MERCHANT_ID=...` to reuse an existing merchant instead of creating
> one.

## PREREQUISITE — migrate the router Postgres

If the script fails with `relation "organization" does not exist` / `HE_00`,
the router's database has never been migrated. The router image ships its
migrations; apply them to `hyperswitch-postgres` and restart the router before
re-running:

```bash
# Example — exact command depends on how the router was deployed.
docker exec hyperswitch-router \
  ./migrate -database "$HYPERSWITCH_DATABASE_URL" up
docker restart hyperswitch-router
```

`scripts/provision-hyperswitch.mjs` only drives the API; it cannot migrate the
database for you.

## Attach a payment processor (REQUIRED — nothing works without this)

Hyperswitch is a _router_. With no connector attached it has nothing to route
to, and every payment fails no matter how the app is configured. A merchant
without a connector is the most common reason "the gateway is set up" but no
payment ever succeeds.

Get a full secret key from Stripe Dashboard → Developers → API keys
(`sk_test_…`). **The Stripe CLI's stored key will not do** — `stripe login`
saves a _restricted_ key (`rk_…`) that is scoped for CLI use and expires after
90 days. The provisioning script rejects it explicitly.

```bash
HYPERSWITCH_ADMIN_API_KEY=<router admin key> \
HS_MERCHANT_ID=apex_revenue_1786220515 \
HS_PROFILE_ID=pro_NdMxeMPvwA7fL4iC5fL1 \
STRIPE_SECRET_KEY=sk_test_… \
  node scripts/provision-hyperswitch.mjs connector
```

Idempotent: re-run with `HS_CONNECTOR_ID=<id>` to update in place. Defaults to
test mode; `HS_TEST_MODE=false` is required to attach a live key, and attaching
an `sk_live_` key in test mode is refused.

Verify:

```bash
docker exec hyperswitch-postgres psql -U hyperswitch -d hyperswitch \
  -c "select connector_name, disabled, test_mode from merchant_connector_account;"
```

## Webhooks — two hops, easily conflated

1. **Stripe → Hyperswitch** tells the router what the processor did:
   `<public router>/webhooks/apex_revenue_1786220515/stripe`.
   Before the router is publicly reachable, bridge it with the Stripe CLI:

   ```bash
   stripe listen --forward-to \
     http://127.0.0.1:8084/webhooks/apex_revenue_1786220515/stripe
   ```

2. **Hyperswitch → Apex** tells the platform to settle the invoice:
   `https://tech.apexgroupcompanies.com/api/webhooks/hyperswitch`. Set it on the
   _profile_ (`business_profile.webhook_details`).

Both are needed. With only the second, the router never learns the payment
succeeded, so it has nothing to forward.

### The outgoing signature scheme (measured, not assumed)

Captured from this router on 2026-08-17 and reproduced offline:

|              |                                                        |
| ------------ | ------------------------------------------------------ |
| Header       | `x-webhook-signature-512`                              |
| Algorithm    | **HMAC-SHA512**                                        |
| Signed input | the **raw request body**, nothing prepended            |
| Key          | the **business profile's** `payment_response_hash_key` |

Three consequences that are easy to get wrong:

- **The webhook secret is not yours to invent.** It must be the profile's
  existing `payment_response_hash_key`. Pasting a fresh `openssl rand` value
  into the console makes every webhook fail signature verification.

  ```bash
  docker exec hyperswitch-postgres psql -U hyperswitch -d hyperswitch -t -A -c \
    "select payment_response_hash_key from business_profile
       where profile_id='pro_NdMxeMPvwA7fL4iC5fL1';"
  ```

- **Signing must be switched on**, or webhooks go out unsigned and the Apex
  handler rejects them (it refuses unsigned traffic by design):
  `merchant_account.enable_payment_response_hash = true`.

- **The payload is an envelope**, not a flat object:
  `{ event_type, content: { object: { payment_id, status, metadata } } }`.
  Reading `type` / `data.id` yields `undefined` for everything. Use
  `parseWebhookEvent()` from `@apex/integrations/hyperswitch`.

Note also that the router authenticates on a bare **`api-key`** header —
`Authorization: api-key=<key>` is ignored and returns 401 `IR_01`.

## Console steps (after provisioning)

1. Console → **Integrations → Hyperswitch**: paste Base URL, Profile ID, API
   key, publishable key, and the webhook signing secret — which is the
   profile's `payment_response_hash_key`, read with the query above, **not** a
   freshly generated value.
2. Click **Test connection** — the console now also round-trips the webhook
   secret (signs a sample body and verifies it) so a mis-sealed secret is
   caught before production.
3. Point Hyperswitch's webhook at `<NEXT_PUBLIC_SITE_URL>/api/webhooks/hyperswitch`.

Nothing is written to `.env`; secrets are sealed at rest by the console.

## How customers pay

Two flows, one reconciliation path — both carry `metadata.invoiceId`, so
`apps/web/src/app/api/webhooks/hyperswitch/route.ts` settles either one without
knowing which was used.

- **Portal (embedded)** — `/portal/invoices/[id]/pay` creates the payment and
  redirects to `/pay/checkout`, which mounts the Hyperswitch Web SDK themed with
  the Apex tokens. Card fields stay in Hyperswitch's iframes, so the portal
  remains in PCI SAQ-A scope. Do not replace them with raw inputs.
- **Payment link (hosted)** — console → invoice → **Create payment link**, for
  customers with no portal login. Stored on `Invoice.paymentLinkUrl`.
  Set `NEXT_PUBLIC_BRAND_LOGO_URL` to a real, absolute HTTPS image to brand the
  hosted page; it is omitted rather than pointed at a 404 by default.

## Known constraints of this router build

`juspaydotin/hyperswitch-router:nightly-standalone`:

- **Payouts are not compiled in** — `/payouts` 404s while every other route
  answers 401. Paying vendors or contractors needs a different image.
- The router serves no OpenAPI spec; probe routes directly (401 = exists,
  404 = absent) rather than trusting docs against this build.
- `GET /accounts` is admin-scoped and answers 405, so it cannot be used as a
  connectivity check. The client uses `GET /payments/list?limit=1`, which is
  merchant-scoped and succeeds with an empty list.
