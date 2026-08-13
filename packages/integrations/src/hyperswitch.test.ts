import { describe, expect, it } from "vitest";
import { createHmac } from "node:crypto";
import { HyperswitchClient, clientFromConfig } from "./hyperswitch";

/**
 * Pure unit tests for the Hyperswitch client's signature verification and the
 * constructor/guard contract. No network — we verify the HMAC round-trip that
 * the webhook route depends on, plus the fact that the client can be built from
 * a partially configured integration (only baseUrl + apiKey) without throwing.
 */

function sign(secret: string, body: string): string {
  const ts = String(Math.floor(Date.now() / 1000));
  const sig = createHmac("sha256", secret).update(`${ts}.${body}`).digest("hex");
  return `t=${ts},v1=${sig}`;
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
