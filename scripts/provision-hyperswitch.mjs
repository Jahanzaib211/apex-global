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
const ROUTER_URL = (process.env.HYPERSWITCH_ROUTER_URL ?? "http://127.0.0.1:8084").replace(
  /\/$/,
  "",
);
const ORG_ID = process.env.HS_ORG_ID;
const MERCHANT_ID = process.env.HS_MERCHANT_ID;

// Subcommand dispatch. With no subcommand the script keeps its original
// behaviour (provision org + merchant), so existing docs and muscle memory
// still work; `connector` attaches a payment processor to an existing profile.
const SUBCOMMAND = process.argv[2] === "connector" ? "connector" : "merchant";
const MERCHANT_NAME = (SUBCOMMAND === "merchant" ? process.argv[2] : null) ?? "Apex Global Revenue";

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

/**
 * Attach a payment processor to an existing profile.
 *
 * Hyperswitch is a router: without a connector it has nothing to route to and
 * every payment fails regardless of how the app is configured. This is the step
 * that makes the gateway able to actually move money.
 *
 * Idempotent: pass HS_CONNECTOR_ID to update an existing connector in place
 * rather than creating a duplicate.
 *
 *   HYPERSWITCH_ADMIN_API_KEY=… \
 *   HS_MERCHANT_ID=apex_revenue_1786220515 \
 *   HS_PROFILE_ID=pro_NdMxeMPvwA7fL4iC5fL1 \
 *   STRIPE_SECRET_KEY=sk_test_… \
 *     node scripts/provision-hyperswitch.mjs connector
 */
async function provisionConnector() {
  const merchantId = MERCHANT_ID;
  const profileId = process.env.HS_PROFILE_ID;
  const connectorName = process.env.HS_CONNECTOR_NAME ?? "stripe";
  const connectorId = process.env.HS_CONNECTOR_ID;
  const secretKey = process.env.STRIPE_SECRET_KEY;
  // Default to test mode. Going live must be a deliberate act, never a default.
  const testMode = process.env.HS_TEST_MODE !== "false";

  if (!merchantId) throw new Error("HS_MERCHANT_ID is required (the Hyperswitch merchant).");
  if (!profileId) throw new Error("HS_PROFILE_ID is required (the business profile).");
  if (!secretKey) throw new Error("STRIPE_SECRET_KEY is required (sk_test_… or sk_live_…).");

  // The Stripe CLI stores a *restricted* key (rk_…) that expires after 90 days.
  // It is scoped for CLI use and will not carry the full payment lifecycle, so
  // refuse it here rather than let it fail confusingly at charge time.
  if (secretKey.startsWith("rk_")) {
    throw new Error(
      "STRIPE_SECRET_KEY looks like a restricted key (rk_…). The connector needs a\n" +
        "full secret key from Stripe Dashboard → Developers → API keys (sk_test_… / sk_live_…).",
    );
  }
  if (testMode && secretKey.startsWith("sk_live_")) {
    throw new Error("Refusing to attach a LIVE Stripe key in test mode. Set HS_TEST_MODE=false.");
  }

  const body = {
    connector_type: "payment_processor",
    connector_name: connectorName,
    connector_account_details: { auth_type: "HeaderKey", api_key: secretKey },
    profile_id: profileId,
    test_mode: testMode,
    disabled: false,
    payment_methods_enabled: [
      {
        payment_method: "card",
        payment_method_types: [
          {
            payment_method_type: "credit",
            card_networks: ["Visa", "Mastercard", "AmericanExpress"],
            minimum_amount: 1,
            maximum_amount: 68607706,
            recurring_enabled: true,
            installment_payment_enabled: false,
          },
          {
            payment_method_type: "debit",
            card_networks: ["Visa", "Mastercard"],
            minimum_amount: 1,
            maximum_amount: 68607706,
            recurring_enabled: true,
            installment_payment_enabled: false,
          },
        ],
      },
    ],
  };

  const base = `/account/${encodeURIComponent(merchantId)}/connectors`;
  const result = connectorId
    ? await api(`${base}/${encodeURIComponent(connectorId)}`, "POST", body)
    : await api(base, "POST", body);

  const id = result.merchant_connector_id ?? connectorId;

  console.log("\n────────────────────────────────────────────────────────────");
  console.log(`Connector ${connectorId ? "updated" : "created"}: ${connectorName}`);
  console.log("────────────────────────────────────────────────────────────");
  console.log(`merchant_connector_id: ${id}`);
  console.log(`profile_id:            ${profileId}`);
  console.log(`test_mode:             ${testMode}`);
  console.log(`\nRe-run with HS_CONNECTOR_ID=${id} to update this connector in place.`);
  console.log("\nNext: point Stripe's webhooks at");
  console.log(`  <public router>/webhooks/${merchantId}/${connectorName}`);
  console.log("For local testing, bridge them with the Stripe CLI:");
  console.log(`  stripe listen --forward-to ${ROUTER_URL}/webhooks/${merchantId}/${connectorName}`);
}

async function main() {
  if (SUBCOMMAND === "connector") return provisionConnector();

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
    const m = await api(`/accounts/${encodeURIComponent(merchantId)}`, "GET", null).catch(
      () => null,
    );
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
