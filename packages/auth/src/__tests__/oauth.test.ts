import { describe, expect, it } from "vitest";
import {
  buildAuthorizeUrl,
  exchangeCodeForTokens,
  fetchUserInfo,
  getProvider,
  newNonce,
  signState,
  verifyState,
} from "../oauth";

describe("OAuth state signing", () => {
  it("round-trips signed state", () => {
    process.env.AUTH_SECRET = "a".repeat(64);
    const state = signState({
      provider: "google",
      next: "/portal/",
      nonce: newNonce(),
      issuedAt: Date.now(),
    });
    const parsed = verifyState(state);
    expect(parsed?.provider).toBe("google");
    expect(parsed?.next).toBe("/portal/");
  });

  it("rejects a state signed with a different secret", () => {
    process.env.AUTH_SECRET = "a".repeat(64);
    const state = signState({ provider: "google", next: "/", nonce: "n", issuedAt: Date.now() });
    process.env.AUTH_SECRET = "b".repeat(64);
    expect(verifyState(state)).toBeNull();
  });

  it("rejects a state whose issuedAt is older than 10 minutes", () => {
    process.env.AUTH_SECRET = "a".repeat(64);
    const state = signState({
      provider: "google",
      next: "/",
      nonce: "n",
      issuedAt: Date.now() - 11 * 60 * 1000,
    });
    expect(verifyState(state)).toBeNull();
  });
});

describe("OAuth provider config", () => {
  it("throws on missing Google credentials", () => {
    const prevId = process.env.GOOGLE_CLIENT_ID;
    const prevSecret = process.env.GOOGLE_CLIENT_SECRET;
    delete process.env.GOOGLE_CLIENT_ID;
    delete process.env.GOOGLE_CLIENT_SECRET;
    expect(() => getProvider("google")).toThrow();
    process.env.GOOGLE_CLIENT_ID = prevId;
    process.env.GOOGLE_CLIENT_SECRET = prevSecret;
  });

  it("builds a Google authorize URL with the expected parameters", () => {
    process.env.GOOGLE_CLIENT_ID = "test-id";
    process.env.GOOGLE_CLIENT_SECRET = "test-secret";
    const url = new URL(
      buildAuthorizeUrl({
        provider: "google",
        redirectUri: "https://example.com/portal/auth/google/callback",
        state: "abc",
      }),
    );
    expect(url.origin).toBe("https://accounts.google.com");
    expect(url.searchParams.get("client_id")).toBe("test-id");
    expect(url.searchParams.get("state")).toBe("abc");
    expect(url.searchParams.get("scope")).toContain("email");
    // The provider segment comes before `callback`, matching the route file.
    // The reversed form shipped once and left the callback unreachable.
    expect(url.searchParams.get("redirect_uri")).toBe(
      "https://example.com/portal/auth/google/callback",
    );
  });
});

describe("OAuth token exchange (mocked)", () => {
  it("POSTs the correct body and parses the response", async () => {
    process.env.GOOGLE_CLIENT_ID = "test-id";
    process.env.GOOGLE_CLIENT_SECRET = "test-secret";

    const originalFetch = global.fetch;
    global.fetch = (async (url: unknown, init?: RequestInit) => {
      const body = String(init?.body ?? "");
      expect(body).toContain("grant_type=authorization_code");
      expect(body).toContain("code=the-code");
      expect(body).toContain("redirect_uri=https%3A%2F%2Fexample.com%2Fcb");
      expect(body).toContain("client_id=test-id");
      expect(body).toContain("client_secret=test-secret");
      expect(String(url)).toBe("https://oauth2.googleapis.com/token");
      return new Response(
        JSON.stringify({
          access_token: "at",
          refresh_token: "rt",
          expires_in: 3600,
          id_token: "id",
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    }) as typeof fetch;

    const result = await exchangeCodeForTokens({
      provider: "google",
      code: "the-code",
      redirectUri: "https://example.com/cb",
    });
    expect(result.accessToken).toBe("at");
    expect(result.refreshToken).toBe("rt");
    expect(result.expiresAt.getTime() - Date.now()).toBeGreaterThan(3500 * 1000);

    global.fetch = originalFetch;
  });
});

describe("OAuth userinfo (mocked)", () => {
  it("reads the userinfo fields from the provider response", async () => {
    process.env.GOOGLE_CLIENT_ID = "test-id";
    process.env.GOOGLE_CLIENT_SECRET = "test-secret";

    const originalFetch = global.fetch;
    global.fetch = (async () => {
      return new Response(
        JSON.stringify({
          sub: "google-user-1",
          email: "a@b.com",
          email_verified: true,
          name: "A B",
          picture: "https://example.com/p.png",
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    }) as typeof fetch;

    const profile = await fetchUserInfo("google", "at");
    expect(profile.providerAccountId).toBe("google-user-1");
    expect(profile.email).toBe("a@b.com");
    expect(profile.emailVerified).toBe(true);
    expect(profile.name).toBe("A B");

    global.fetch = originalFetch;
  });
});
