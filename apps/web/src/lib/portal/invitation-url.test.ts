import { describe, expect, it, vi } from "vitest";

// `invitations.ts` pulls in Prisma and @apex/auth for the redemption half. Only
// the URL builders are under test here, so the heavy imports are stubbed.
vi.mock("@apex/db", () => ({ prisma: {} }));
vi.mock("@apex/auth", () => ({
  checkPasswordStrength: () => ({ ok: true, reasons: [] }),
  hashPassword: async () => "",
  revokeAllPortalSessionsForUser: async () => undefined,
}));
vi.mock("@/lib/site", () => ({ siteUrl: () => "https://example.com" }));

const { invitationPath, invitationUrl } = await import("./invitations");

describe("invitation links", () => {
  // The page is a `[token]` dynamic route, so the token is a path segment. The
  // `?token=` query form every emitter used to build matched no route at all
  // and sent invitees to a 404.
  it("puts the token in the path, not the query string", () => {
    expect(invitationPath("abc123")).toBe("/portal/accept-invitation/abc123");
    expect(invitationPath("abc123")).not.toContain("?token=");
  });

  it("builds an absolute URL on the configured site origin", () => {
    expect(invitationUrl("abc123")).toBe("https://example.com/portal/accept-invitation/abc123");
  });

  it("encodes tokens so a stray slash cannot forge a path segment", () => {
    expect(invitationPath("a/b")).toBe("/portal/accept-invitation/a%2Fb");
  });
});
