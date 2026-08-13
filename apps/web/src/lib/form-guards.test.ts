import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { rateLimited, resetRateLimits, verifyTurnstile } from "./form-guards";

describe("rateLimited", () => {
  beforeEach(() => resetRateLimits());

  it("allows the first five and refuses the sixth", () => {
    const key = "leads:198.51.100.1";
    for (let i = 0; i < 5; i++) {
      expect(rateLimited(key)).toBe(false);
    }
    expect(rateLimited(key)).toBe(true);
  });

  it("counts each key separately", () => {
    // The two public form endpoints prefix their own bucket, so a burst of
    // demo requests must not lock a different visitor out of the lead form.
    for (let i = 0; i < 6; i++) rateLimited("demo:198.51.100.2");
    expect(rateLimited("leads:198.51.100.2")).toBe(false);
  });

  it("forgets a caller once the window has passed", () => {
    vi.useFakeTimers();
    const key = "leads:198.51.100.3";
    for (let i = 0; i < 6; i++) rateLimited(key);
    expect(rateLimited(key)).toBe(true);

    vi.advanceTimersByTime(10 * 60 * 1000 + 1);
    expect(rateLimited(key)).toBe(false);
    vi.useRealTimers();
  });
});

describe("verifyTurnstile", () => {
  const originalFetch = global.fetch;
  const originalSecret = process.env.TURNSTILE_SECRET_KEY;

  afterEach(() => {
    global.fetch = originalFetch;
    if (originalSecret === undefined) delete process.env.TURNSTILE_SECRET_KEY;
    else process.env.TURNSTILE_SECRET_KEY = originalSecret;
  });

  it("fails open when no secret is configured", async () => {
    // Deliberate: rejecting every submission because a key is missing bins
    // real enquiries mid-campaign. The honeypot and rate limit still apply.
    delete process.env.TURNSTILE_SECRET_KEY;
    expect(await verifyTurnstile(undefined, "198.51.100.4")).toBe(true);
  });

  it("rejects a missing token once a secret is configured", async () => {
    process.env.TURNSTILE_SECRET_KEY = "secret";
    expect(await verifyTurnstile(undefined, "198.51.100.5")).toBe(false);
  });

  it("accepts a token Cloudflare confirms", async () => {
    process.env.TURNSTILE_SECRET_KEY = "secret";
    global.fetch = (async () =>
      new Response(JSON.stringify({ success: true }), {
        headers: { "content-type": "application/json" },
      })) as typeof fetch;
    expect(await verifyTurnstile("good-token", "198.51.100.6")).toBe(true);
  });

  it("rejects a token Cloudflare denies", async () => {
    process.env.TURNSTILE_SECRET_KEY = "secret";
    global.fetch = (async () =>
      new Response(JSON.stringify({ success: false }), {
        headers: { "content-type": "application/json" },
      })) as typeof fetch;
    expect(await verifyTurnstile("bad-token", "198.51.100.7")).toBe(false);
  });

  it("fails open when the challenge provider is unreachable", async () => {
    process.env.TURNSTILE_SECRET_KEY = "secret";
    global.fetch = (async () => {
      throw new Error("network down");
    }) as typeof fetch;
    expect(await verifyTurnstile("any-token", "198.51.100.8")).toBe(true);
  });
});
