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

## Console steps (after provisioning)

1. Console → **Integrations → Hyperswitch**: paste Base URL, Profile ID, API
   key, publishable key, and the webhook signing secret.
2. Click **Test connection** — the console now also round-trips the webhook
   secret (signs a sample body and verifies it) so a mis-sealed secret is
   caught before production.
3. Point Hyperswitch's webhook at `<NEXT_PUBLIC_SITE_URL>/api/webhooks/hyperswitch`.

Nothing is written to `.env`; secrets are sealed at rest by the console.
