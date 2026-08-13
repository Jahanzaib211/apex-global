import { expect, test } from "@playwright/test";

/**
 * Route-level regression cover for the API surface documented in docs/API.md.
 *
 * Each test here pins a defect that shipped: a redirect URI that matched no
 * route, webhook guards that accepted unsigned payloads, and a public form
 * endpoint with none of the defences its sibling had.
 *
 * The public form endpoints rate-limit per IP, so every test that hits one
 * spoofs its own `x-forwarded-for`, as `money-path.spec.ts` does.
 */

/** A random pseudo-client IP per call (benchmarking range, 198.18/16 — kept
    clear of `money-path.spec.ts`, which uses 198.19/16). Random rather than a
    counter: the rate limiter is in-process and outlives a test run, so a fixed
    sequence replays the same buckets and the next run starts at 429. */
function testIp(): string {
  const seed = Math.floor(Math.random() * 4294967295);
  return `198.18.${(seed >> 16) & 0xff}.${(seed >> 8) & 0xff}`;
}

const uniqueEmail = () => `api-routes-${Date.now()}-${Math.floor(Math.random() * 1e6)}@example.com`;

test.describe("health", () => {
  test("reports a reachable database", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.status()).toBe(200);

    const body = (await response.json()) as { ok?: boolean; db?: string };
    expect(body.ok).toBe(true);
    expect(body.db).toBe("up");
  });
});

test.describe("OAuth start", () => {
  // The route file is auth/[provider]/callback, so the URI must be
  // /portal/auth/<provider>/callback. The reversed form matched no route and
  // sent every sign-in to a 404 after the user consented at the provider.
  for (const provider of ["google", "microsoft"]) {
    test(`${provider} sends a redirect_uri that resolves to a real route`, async ({ request }) => {
      const response = await request.get(`/portal/auth/${provider}/start`, {
        maxRedirects: 0,
      });

      // Unconfigured providers bounce to the login page with an error; that is
      // a legitimate outcome and carries no redirect_uri to check.
      const location = response.headers()["location"] ?? "";
      test.skip(location.startsWith("/portal/login"), `${provider} OAuth is not configured`);

      const redirectUri = new URL(location).searchParams.get("redirect_uri") ?? "";
      expect(redirectUri).toContain(`/portal/auth/${provider}/callback`);
      expect(redirectUri).not.toContain(`/portal/auth/callback/${provider}`);
    });
  }
});

test.describe("webhook receivers", () => {
  // These routes mutate money and pipeline state — an unsigned payload used to
  // be enough to mark an invoice PAID or move a lead to CUSTOMER, because the
  // signature check was skipped whenever no secret was configured.
  for (const path of ["/api/webhooks/hyperswitch", "/api/webhooks/twenty"]) {
    test(`${path} refuses an unsigned payload`, async ({ request }) => {
      const response = await request.post(path, {
        data: { type: "payment.succeeded", data: { id: "pay_x", status: "succeeded" } },
      });

      expect(response.status()).not.toBe(200);
      expect([401, 503]).toContain(response.status());

      const body = await response.text();
      expect(body).not.toContain("received");
    });
  }
});

test.describe("revalidate", () => {
  test("refuses a request with no secret", async ({ request }) => {
    const response = await request.post("/api/revalidate", {
      data: { paths: ["/"] },
    });
    expect([403, 503]).toContain(response.status());
  });

  test("refuses a wrong secret", async ({ request }) => {
    const response = await request.post("/api/revalidate", {
      headers: { "x-revalidate-secret": "not-the-secret" },
      data: { paths: ["/"] },
    });
    expect([403, 503]).toContain(response.status());
  });
});

test.describe("demo requests", () => {
  // This endpoint accepted a turnstileToken it never verified and had no rate
  // limit, which made it the softer of the two public form endpoints.
  test("rejects a body that fails validation", async ({ request }) => {
    const response = await request.post("/api/demo-request", {
      headers: { "x-forwarded-for": testIp() },
      data: { name: "No Product", email: uniqueEmail() },
    });
    expect(response.status()).toBe(422);
  });

  test("gives a bot that fills the honeypot a normal-looking success", async ({ request }) => {
    const response = await request.post("/api/demo-request", {
      headers: { "x-forwarded-for": testIp() },
      data: {
        name: "Bot",
        email: uniqueEmail(),
        productSlug: "anything",
        consentContact: true,
        company_website: "http://spam.example",
      },
    });

    expect(response.status()).toBe(201);
    expect(await response.json()).toEqual({ ok: true });
  });

  test("rate-limits a burst from one address", async ({ request }) => {
    const ip = testIp();
    const send = () =>
      request.post("/api/demo-request", {
        headers: { "x-forwarded-for": ip },
        data: { name: "Burst", email: uniqueEmail(), productSlug: "unknown-product" },
      });

    // Five are allowed per ten minutes; the sixth must be refused.
    for (let i = 0; i < 5; i++) await send();
    expect((await send()).status()).toBe(429);
  });
});
