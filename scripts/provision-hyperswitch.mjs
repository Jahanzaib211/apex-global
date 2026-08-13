#!/usr/bin/env node
/**
 * Provision a Hyperswitch merchant + profile via the router ADMIN API.
 *
 * The Hyperswitch merchant is NOT provisioned through the Control Center UI's
 * private endpoints (the published `nighterswitch-router:nightly-standalone`
 * image 404s on `/api/v1/auth/*`). It is provisioned through the router's admin
 * API, which is what this script drives.
 *
 * Flow (verified against the live router's request validation):
 *   1. POST /organization          — create the tenant org (idempotent: pass
 *                                     HS_ORG_ID to reuse an existing one).
 *   2. POST /accounts              — create the merchant account. The router
 *                                     returns `merchant_id` (this *is* the
 *                                     profile id the SDK sends as `profile_id`)
 *                                     and a `publishable_key`.
 *
 * Idempotent: set HS_ORG_ID / HS_MERCHANT_ID to reuse existing resources; the
 * script never duplicates.
 *
 * Output: prints the console fields to paste — Base URL, Profile ID
 * (`merchant_id`), Publishable key, and instructions for the **secret** API key
 * (which the admin API cannot mint without a merchant-scoped key — generate it
 * in the Control Center UI). Nothing is written to `.env`; secrets are sealed at
 * rest by the console Integrations form.
 *
 * PREREQUISITE (infra, one-time): the router's Postgres must be migrated. If you
 * see `relation "organization" does not exist` / `HE_00`, apply the Hyperswitch
 * router migrations to `hyperswitch-postgres` and restart the router. See
 * docs/hyperswitch-provisioning.md.
 *
 * Usage:
 *   HYPERSWITCH_ADMIN_API_KEY=... HYPERSWITCH_ROUTER_URL=http://127.0.0.1:8084 \
 *     node scripts/provision-hyperswitch.mjs "Apex Global Revenue"
 */

const ADMIN_KEY = process.env.HYPERSWITCH_ADMIN_API_KEY;
const ROUTER_URL = (process.env.HYPERSWITCH_ROUTER_URL ?? "http://127.0.0.1:8084").replace(/\/$/, "");
const ORG_ID = process.env.HS_ORG_ID;
const MERCHANT_ID = process.env.HS_MERCHANT_ID;
const MERCHANT_NAME = process.argv[2] ?? "Apex Global Revenue";

if (!ADMIN_KEY) {
  console.error("HYPERSWITCH_ADMIN_API_KEY is required (router admin API key).");
  process.exit(1);
}

async function api(path, method, body) {
  const res = await fetch(`${ROUTER_URL}${path}`, {
    method,
    headers: {
      "api-key": ADMIN_KEY,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const parsed = text ? safeJson(text) : undefined;
  if (!res.ok) {
    const msg = parsed?.error?.message ?? text.slice(0, 200);
    throw new Error(`${method} ${path} → ${res.status}: ${msg}`);
  }
  return parsed;
}

function safeJson(s) {
  try {
    return JSON.parse(s);
  } catch {
    return undefined;
  }
}

async function main() {
  let orgId = ORG_ID;
  if (!orgId) {
    // Hyperswitch assigns the org id server-side; the admin API only takes a name.
    const org = await api("/organization", "POST", { organization_name: MERCHANT_NAME });
    orgId = org.organization_id;
    console.log(`Created organization: ${orgId}`);
  } else {
    console.log(`Reusing organization: ${orgId} (HS_ORG_ID set).`);
  }

  let merchantId = MERCHANT_ID;
  let publishableKey;
  let profileId;
  if (!merchantId) {
    const created = await api("/accounts", "POST", {
      merchant_id: `apex_revenue_${Date.now()}`,
      merchant_name: MERCHANT_NAME,
      organization_id: orgId,
      primary_business_details: [{ business: MERCHANT_NAME, country: "US" }],
    });
    merchantId = created.merchant_id;
    publishableKey = created.publishable_key;
    // `default_profile` is the profile_id the SDK must send on each payment.
    profileId = created.default_profile ?? merchantId;
  } else {
    console.log(`Reusing merchant: ${merchantId} (HS_MERCHANT_ID set).`);
    const m = await api(`/accounts/${encodeURIComponent(merchantId)}`, "GET", null).catch(() => null);
    if (m) {
      publishableKey = m.publishable_key;
      profileId = m.default_profile ?? merchantId;
    }
  }

  console.log("\n────────────────────────────────────────────────────────────");
  console.log("Hyperswitch merchant provisioned. Paste these into the console");
  console.log("Integrations → Hyperswitch form (sealed at rest on save):");
  console.log("────────────────────────────────────────────────────────────");
  console.log(`Base URL (router/sandbox):  ${ROUTER_URL}`);
  console.log(`Profile ID (merchant_id):   ${profileId}`);
  console.log(`Publishable key:            ${publishableKey ?? "(reuse existing)"}`);
  console.log("\nSecret API key: mint it in the Hyperswitch Control Center UI");
  console.log("  (http://127.0.0.1:9090 → merchant → API keys), then paste it");
  console.log("  into the console's API key field. The admin API cannot mint a");
  console.log("  merchant-scoped secret key without one already existing.");
  console.log("\nWebhook signing secret: generate one (e.g. `openssl rand -hex 24`)");
  console.log("  and set it in BOTH the console (webhook secret field) AND the");
  console.log("  Hyperswitch webhook config pointing at:");
  console.log(`    <NEXT_PUBLIC_SITE_URL>/api/webhooks/hyperswitch`);
  if (!MERCHANT_ID) {
    console.log("\nTip: re-run with HS_ORG_ID and HS_MERCHANT_ID set to reuse these.");
  }
}

main().catch((err) => {
  console.error("\nProvisioning failed:");
  console.error(err.message);
  if (/relation .* does not exist|HE_00/.test(err.message)) {
    console.error(
      "\nINFRA BLOCKER: the router's Postgres is not migrated (no `organization` table).",
    );
    console.error("Apply the Hyperswitch router migrations to `hyperswitch-postgres` and");
    console.error("restart the router, then re-run. See docs/hyperswitch-provisioning.md.");
  }
  process.exit(1);
});
