import { describe, expect, it } from "vitest";
import { checkLimit, issueCsrfToken, signCsrf, verifyCsrf, __resetLimits } from "../rate-limit";

describe("rate limiter", () => {
  beforeEach(() => __resetLimits());

  it("allows up to max hits within the window", () => {
    for (let i = 0; i < 5; i++) {
      const r = checkLimit({ key: "k1", max: 5, windowMs: 60_000 });
      expect(r.ok).toBe(true);
    }
    const blocked = checkLimit({ key: "k1", max: 5, windowMs: 60_000 });
    expect(blocked.ok).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it("isolates keys", () => {
    for (let i = 0; i < 3; i++) {
      checkLimit({ key: "a", max: 3, windowMs: 60_000 });
    }
    const r = checkLimit({ key: "b", max: 3, windowMs: 60_000 });
    expect(r.ok).toBe(true);
  });

  it("resets after the window expires", () => {
    checkLimit({ key: "k", max: 1, windowMs: 1 });
    const blocked = checkLimit({ key: "k", max: 1, windowMs: 1 });
    expect(blocked.ok).toBe(false);
    return new Promise<void>((resolve) =>
      setTimeout(() => {
        const ok = checkLimit({ key: "k", max: 1, windowMs: 1 });
        expect(ok.ok).toBe(true);
        resolve();
      }, 5),
    );
  });
});

describe("CSRF double-submit", () => {
  it("issues and verifies a signed token", () => {
    process.env.AUTH_SECRET = "a".repeat(64);
    const token = issueCsrfToken();
    const sig = signCsrf(token);
    expect(verifyCsrf(token, sig)).toBe(true);
    expect(verifyCsrf(token, "wrong")).toBe(false);
  });
});
