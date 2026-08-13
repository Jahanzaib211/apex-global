import { describe, expect, it } from "vitest";
import { portalOAuthRedirectUri } from "./oauth";

describe("portalOAuthRedirectUri", () => {
  // The route file is (portal)/portal/(unauth)/auth/[provider]/callback/route.ts.
  // Once the route groups drop out that is /portal/auth/<provider>/callback.
  // The reversed form — /portal/auth/callback/<provider> — matches no route and
  // sent every OAuth sign-in to a 404 after consent.
  it("puts the provider before the callback segment", () => {
    expect(portalOAuthRedirectUri("google", "https://example.com")).toBe(
      "https://example.com/portal/auth/google/callback",
    );
    expect(portalOAuthRedirectUri("microsoft", "https://example.com")).toBe(
      "https://example.com/portal/auth/microsoft/callback",
    );
  });

  it("never emits the reversed form", () => {
    for (const provider of ["google", "microsoft"] as const) {
      expect(portalOAuthRedirectUri(provider, "https://example.com")).not.toContain(
        `/portal/auth/callback/${provider}`,
      );
    }
  });

  it("keeps the origin verbatim so authorise and token exchange agree", () => {
    // Any difference between the two calls, down to the scheme, makes the
    // provider reject the exchange.
    expect(portalOAuthRedirectUri("google", "http://localhost:4300")).toBe(
      "http://localhost:4300/portal/auth/google/callback",
    );
  });
});
