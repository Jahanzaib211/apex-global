import { describe, expect, it } from "vitest";
import {
  generateOpaqueToken,
  hashOpaqueToken,
  signSessionJwt,
  verifyOpaqueToken,
  verifySessionJwt,
} from "../tokens";

describe("opaque tokens", () => {
  it("generates a 32-byte base64url token", () => {
    const { raw, hash } = generateOpaqueToken();
    expect(raw).toMatch(/^[A-Za-z0-9_-]{43,44}$/);
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it("verifies the same token against its own hash", () => {
    const { raw, hash } = generateOpaqueToken();
    expect(verifyOpaqueToken(raw, hash)).toBe(true);
  });

  it("rejects a different token", () => {
    const a = generateOpaqueToken();
    const b = generateOpaqueToken();
    expect(verifyOpaqueToken(a.raw, b.hash)).toBe(false);
  });

  it("hashes match the SHA-256 hex digest", () => {
    const { raw, hash } = generateOpaqueToken();
    expect(hashOpaqueToken(raw)).toBe(hash);
  });
});

describe("session JWT", () => {
  // AUTH_SECRET must be set for the JWT helpers; tests stub it.
  const ORIGINAL_SECRET = process.env.AUTH_SECRET;
  // Use a 64-char base64 string to satisfy any length checks.
  process.env.AUTH_SECRET = "a".repeat(64);

  it("round-trips a sub claim", async () => {
    const token = await signSessionJwt("user_123", 3600);
    const claims = await verifySessionJwt(token);
    expect(claims?.sub).toBe("user_123");
    expect(claims?.exp).toBeGreaterThan(claims!.iat);
  });

  it("rejects a tampered token", async () => {
    const token = await signSessionJwt("user_123", 3600);
    const tampered = token.slice(0, -2) + "AA";
    expect(await verifySessionJwt(tampered)).toBeNull();
  });

  it("rejects an expired token", async () => {
    const token = await signSessionJwt("user_123", -10);
    expect(await verifySessionJwt(token)).toBeNull();
  });

  process.env.AUTH_SECRET = ORIGINAL_SECRET;
});
