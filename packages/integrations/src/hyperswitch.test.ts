import { afterEach, describe, expect, it } from "vitest";
import { createHmac } from "node:crypto";
import { HyperswitchClient, clientFromConfig, parseWebhookEvent } from "./hyperswitch";

/**
 * Pure unit tests for the Hyperswitch client's signature verification and the
 * constructor/guard contract. No network — we verify the HMAC round-trip that
 * the webhook route depends on, plus the fact that the client can be built from
 * a partially configured integration (only baseUrl + apiKey) without throwing.
 *
 * The signing scheme here is not a guess: it was captured from a live
 * `nightly-standalone` router on 2026-08-17 and the digest reproduced offline.
 * Hyperswitch sends a bare hex HMAC-SHA512 of the raw body in
 * `x-webhook-signature-512`, keyed by the business profile's
 * `payment_response_hash_key`.
 */

function sign(secret: string, body: string): string {
  return createHmac("sha512", secret).update(body).digest("hex");
}

describe("verifyWebhookSignature", () => {
  it("accepts a correctly signed body", () => {
    const client = clientFromConfig({
      baseUrl: "https://sandbox.hyperswitch.io",
      apiKey: "sk_test",
      publishableKey: "pk_test",
      profileId: "pro_1",
      webhookSecret: "whsec_test",
    });
    const body = JSON.stringify({ type: "payment.succeeded", data: { id: "pay_1" } });
    expect(client.verifyWebhookSignature(body, sign("whsec_test", body))).toBe(true);
  });

  it("rejects a tampered body", () => {
    const client = clientFromConfig({
      baseUrl: "https://sandbox.hyperswitch.io",
      apiKey: "sk_test",
      publishableKey: "pk_test",
      profileId: "pro_1",
      webhookSecret: "whsec_test",
    });
    const body = JSON.stringify({ type: "payment.succeeded", data: { id: "pay_1" } });
    const tampered = JSON.stringify({ type: "payment.succeeded", data: { id: "pay_2" } });
    expect(client.verifyWebhookSignature(tampered, sign("whsec_test", body))).toBe(false);
  });

  it("rejects a wrong secret", () => {
    const client = clientFromConfig({
      baseUrl: "https://sandbox.hyperswitch.io",
      apiKey: "sk_test",
      publishableKey: "pk_test",
      profileId: "pro_1",
      webhookSecret: "whsec_right",
    });
    const body = JSON.stringify({ type: "payment.succeeded" });
    expect(client.verifyWebhookSignature(body, sign("whsec_wrong", body))).toBe(false);
  });

  it("returns false when no secret is configured", () => {
    const client = clientFromConfig({
      baseUrl: "https://sandbox.hyperswitch.io",
      apiKey: "sk_test",
      publishableKey: "pk_test",
      profileId: "pro_1",
    });
    const body = JSON.stringify({ type: "payment.succeeded" });
    expect(client.verifyWebhookSignature(body, sign("anything", body))).toBe(false);
  });
});

describe("webhook signature scheme (regression guards)", () => {
  const client = clientFromConfig({
    baseUrl: "https://router.test",
    apiKey: "sk_test",
    publishableKey: "pk_test",
    profileId: "pro_1",
    webhookSecret: "profile_hash_key",
  });
  const body = JSON.stringify({ event_type: "payment_succeeded" });

  it("rejects the Stripe-style t=,v1= header this used to expect", () => {
    // The old implementation parsed exactly this and nothing else. Hyperswitch
    // never sends it, which is why every webhook 401'd.
    const ts = String(Math.floor(Date.now() / 1000));
    const legacy = createHmac("sha256", "profile_hash_key").update(`${ts}.${body}`).digest("hex");
    expect(client.verifyWebhookSignature(body, `t=${ts},v1=${legacy}`)).toBe(false);
  });

  it("rejects a SHA-256 digest of the right body", () => {
    const wrongAlg = createHmac("sha256", "profile_hash_key").update(body).digest("hex");
    expect(client.verifyWebhookSignature(body, wrongAlg)).toBe(false);
  });

  it("rejects a correctly-signed body under the wrong key", () => {
    expect(client.verifyWebhookSignature(body, sign("merchant_hash_key", body))).toBe(false);
  });

  it("rejects non-hex and truncated signatures without throwing", () => {
    expect(client.verifyWebhookSignature(body, "not-a-signature")).toBe(false);
    expect(client.verifyWebhookSignature(body, sign("profile_hash_key", body).slice(0, 64))).toBe(
      false,
    );
  });
});

describe("parseWebhookEvent", () => {
  // Field-for-field the envelope a live router sent on 2026-08-17.
  const real = JSON.stringify({
    merchant_id: "apex_revenue_1786220515",
    event_id: "evt_01a010935bc375009faa873426f6ed4a",
    event_type: "payment_failed",
    content: {
      type: "payment_details",
      object: {
        payment_id: "pay_Wwku8my8rysPiDb8hQGd",
        status: "failed",
        amount: 4200,
        currency: "USD",
        error_message: "card declined",
        metadata: { invoiceId: "inv_1", invoiceNumber: "INV-0001" },
      },
    },
  });

  it("reads the nested envelope the router actually sends", () => {
    const event = parseWebhookEvent(real)!;
    expect(event.eventType).toBe("payment_failed");
    expect(event.paymentId).toBe("pay_Wwku8my8rysPiDb8hQGd");
    expect(event.status).toBe("failed");
    // Reconciliation keys off this — if it is ever undefined, invoices strand.
    expect(event.metadata?.invoiceId).toBe("inv_1");
    expect(event.eventId).toBe("evt_01a010935bc375009faa873426f6ed4a");
  });

  it("does not read the flat {type,data} shape this used to assume", () => {
    const flat = JSON.stringify({ type: "payment.succeeded", data: { id: "pay_1" } });
    const event = parseWebhookEvent(flat)!;
    expect(event.paymentId).toBeUndefined();
    expect(event.eventType).toBeUndefined();
  });

  it("returns null on malformed JSON rather than throwing", () => {
    expect(parseWebhookEvent("{not json")).toBeNull();
    expect(parseWebhookEvent("null")).toBeNull();
  });

  it("survives an envelope with no content object", () => {
    const event = parseWebhookEvent(JSON.stringify({ event_type: "payment_succeeded" }))!;
    expect(event.eventType).toBe("payment_succeeded");
    expect(event.paymentId).toBeUndefined();
  });
});

describe("HyperswitchClient construction", () => {
  it("does NOT throw on a missing profileId (webhook route builds without it)", () => {
    expect(
      () =>
        new HyperswitchClient({
          baseUrl: "https://sandbox.hyperswitch.io",
          apiKey: "sk_test",
          publishableKey: "pk_test",
          profileId: "",
        }),
    ).not.toThrow();
  });

  it("throws on a missing baseUrl or apiKey", () => {
    expect(
      () =>
        new HyperswitchClient({ baseUrl: "", apiKey: "sk", publishableKey: "pk", profileId: "p" }),
    ).toThrow();
    expect(
      () =>
        new HyperswitchClient({ baseUrl: "b", apiKey: "", publishableKey: "pk", profileId: "p" }),
    ).toThrow();
  });
});

/**
 * The router speaks snake_case and calls the id `payment_id`. These tests pin
 * the translation, because every caller reads `.id` / `.clientSecret` /
 * `.nextAction` — returning the raw body left all three undefined, which would
 * have surfaced as a 502 "gateway did not return a payment target" on the very
 * first real payment.
 */
function stubFetch(body: unknown, status = 200) {
  const calls: Array<{ url: string; init: RequestInit }> = [];
  const fn = async (url: string | URL, init: RequestInit = {}) => {
    calls.push({ url: String(url), init });
    return new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  };
  return { fn: fn as unknown as typeof fetch, calls };
}

const cfg = {
  baseUrl: "https://router.test",
  apiKey: "sk_test",
  publishableKey: "pk_test",
  profileId: "pro_1",
};

const payInput = {
  amount: 5000,
  currency: "USD",
  customerEmail: "a@b.com",
  description: "Invoice INV-1",
  returnUrl: "https://tech.apexgroupcompanies.com/return",
  idempotencyKey: "invoice-1",
};

describe("payment response mapping", () => {
  const original = globalThis.fetch;
  afterEach(() => {
    globalThis.fetch = original;
  });

  it("maps payment_id, client_secret and next_action into the public shape", async () => {
    const { fn } = stubFetch({
      payment_id: "pay_abc",
      status: "requires_confirmation",
      amount: 5000,
      currency: "usd",
      client_secret: "pay_abc_secret_xyz",
      next_action: { type: "redirect_to_url", redirect_to_url: "https://3ds.test/go" },
      created: "2026-08-17T00:00:00Z",
    });
    globalThis.fetch = fn;

    const payment = await clientFromConfig(cfg).createPayment(payInput);

    expect(payment.id).toBe("pay_abc");
    expect(payment.clientSecret).toBe("pay_abc_secret_xyz");
    expect(payment.nextAction?.redirectUrl).toBe("https://3ds.test/go");
    expect(payment.currency).toBe("USD");
    expect(payment.status).toBe("requires_confirmation");
  });

  it("leaves nextAction undefined when next_action carries no redirect", async () => {
    const { fn } = stubFetch({
      payment_id: "pay_qr",
      status: "requires_action",
      next_action: { type: "display_qr_code" },
    });
    globalThis.fetch = fn;

    const payment = await clientFromConfig(cfg).createPayment(payInput);
    expect(payment.nextAction).toBeUndefined();
  });

  it("sends routing as a tagged object, not a bare array", async () => {
    const { fn, calls } = stubFetch({ payment_id: "pay_1", status: "succeeded" });
    globalThis.fetch = fn;

    await clientFromConfig({ ...cfg, routing: ["stripe", "adyen"] }).createPayment(payInput);

    // An array of {type, connector} pairs is rejected with 400 IR_06
    // "Invalid straight through routing rules format".
    expect(JSON.parse(String(calls[0]!.init.body)).routing).toEqual({
      type: "priority",
      data: [{ connector: "stripe" }, { connector: "adyen" }],
    });
  });

  it("omits routing entirely when none is configured", async () => {
    const { fn, calls } = stubFetch({ payment_id: "pay_1", status: "succeeded" });
    globalThis.fetch = fn;

    await clientFromConfig(cfg).createPayment(payInput);

    // Absent, not null — so the merchant's own default routing applies.
    expect(JSON.parse(String(calls[0]!.init.body))).not.toHaveProperty("routing");
  });

  it("sends the currency uppercase", async () => {
    const { fn, calls } = stubFetch({ payment_id: "pay_1", status: "succeeded" });
    globalThis.fetch = fn;

    await clientFromConfig(cfg).createPayment({ ...payInput, currency: "usd" });

    // The router deserialises this into an enum of uppercase ISO codes and
    // answers 400 IR_06 "unknown variant `usd`" for anything else.
    expect(JSON.parse(String(calls[0]!.init.body)).currency).toBe("USD");
  });

  it("authenticates with a bare api-key header", async () => {
    const { fn, calls } = stubFetch({ payment_id: "pay_1", status: "succeeded" });
    globalThis.fetch = fn;

    await clientFromConfig(cfg).createPayment(payInput);

    const headers = calls[0]!.init.headers as Record<string, string>;
    // The router reads `api-key` and nothing else. Sending the credential as
    // `Authorization: api-key=…` (as this once did) returns 401 IR_01 on every
    // call, no matter how valid the key is.
    expect(headers["api-key"]).toBe("sk_test");
    expect(headers.Authorization).toBeUndefined();
  });

  it("sends the idempotency key so a double-submit cannot double-charge", async () => {
    const { fn, calls } = stubFetch({ payment_id: "pay_1", status: "succeeded" });
    globalThis.fetch = fn;

    await clientFromConfig(cfg).createPayment(payInput);
    expect((calls[0].init.headers as Record<string, string>)["Idempotency-Key"]).toBe("invoice-1");
  });
});

describe("createPaymentLink", () => {
  const original = globalThis.fetch;
  afterEach(() => {
    globalThis.fetch = original;
  });

  it("returns the hosted link and carries branding + invoice metadata", async () => {
    const { fn, calls } = stubFetch({
      payment_id: "pay_link",
      status: "requires_payment_method",
      amount: 5000,
      currency: "usd",
      payment_link: {
        link: "https://router.test/payment_link/pay_link",
        payment_link_id: "plink_1",
        secure_link: "https://router.test/secure/plink_1",
      },
    });
    globalThis.fetch = fn;

    const link = await clientFromConfig(cfg).createPaymentLink({
      ...payInput,
      metadata: { invoiceId: "inv_1" },
      branding: { merchantName: "Apex Global", themeColor: "#34385B" },
    });

    expect(link.url).toBe("https://router.test/payment_link/pay_link");
    expect(link.secureUrl).toBe("https://router.test/secure/plink_1");
    expect(link.paymentId).toBe("pay_link");

    const sent = JSON.parse(String(calls[0].init.body));
    expect(sent.payment_link).toBe(true);
    expect(sent.payment_link_config.seller_name).toBe("Apex Global");
    expect(sent.payment_link_config.theme).toBe("#34385B");
    // The webhook handler reconciles off metadata.invoiceId — links must carry
    // it or an emailed payment can never settle its invoice.
    expect(sent.metadata.invoiceId).toBe("inv_1");
    // A link mailed to a customer has to outlive Hyperswitch's 15-minute default.
    expect(sent.session_expiry).toBeGreaterThan(60 * 60);
  });

  it("throws a clear error when the router returns no link", async () => {
    const { fn } = stubFetch({ payment_id: "pay_x", status: "requires_payment_method" });
    globalThis.fetch = fn;

    await expect(clientFromConfig(cfg).createPaymentLink(payInput)).rejects.toThrow(
      /did not return a payment link/,
    );
  });

  it("refuses to build a link without a profileId", async () => {
    await expect(
      clientFromConfig({ ...cfg, profileId: "" }).createPaymentLink(payInput),
    ).rejects.toThrow(/profileId is not configured/);
  });
});
