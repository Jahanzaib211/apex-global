import { describe, expect, it } from "vitest";
import { issueMagicLink, magicLinkUrl, verifyMagicLinkToken } from "../magic-link";

describe("magic-link", () => {
  it("issues a token with a hash and expiry", () => {
    const link = issueMagicLink({ email: "a@b.com", purpose: "sign-in" });
    expect(link.raw).toMatch(/^[A-Za-z0-9_-]{43,44}$/);
    expect(link.hash).toMatch(/^[0-9a-f]{64}$/);
    const ageMs = link.expiresAt.getTime() - Date.now();
    expect(ageMs).toBeGreaterThan(23 * 60 * 60 * 1000);
    expect(ageMs).toBeLessThan(25 * 60 * 60 * 1000);
  });

  it("issues a password-reset token with ~1h expiry", () => {
    const link = issueMagicLink({ email: "a@b.com", purpose: "reset" });
    const ageMs = link.expiresAt.getTime() - Date.now();
    expect(ageMs).toBeLessThan(61 * 60 * 1000);
  });

  it("builds a URL the user can click", () => {
    const link = issueMagicLink({ email: "a@b.com" });
    const url = magicLinkUrl(link.raw, "https://example.com", "/portal/");
    expect(url).toContain("https://example.com/portal/auth/magic");
    expect(url).toContain("token=");
    expect(url).toContain("next=%2Fportal%2F");
  });

  it("verifies the issued token and rejects a tampered one", () => {
    const link = issueMagicLink({ email: "a@b.com" });
    expect(verifyMagicLinkToken(link.raw, link.hash, link.expiresAt)).toBe(true);
    expect(verifyMagicLinkToken(link.raw, link.hash, new Date(0))).toBe(false);
    expect(verifyMagicLinkToken("nope", link.hash, link.expiresAt)).toBe(false);
  });
});
