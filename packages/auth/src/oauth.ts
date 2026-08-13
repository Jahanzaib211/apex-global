import { createHash, randomBytes } from "node:crypto";

/**
 * OAuth2 / OIDC client for Google and Microsoft (Azure AD / Entra ID).
 *
 * We do not pull in `next-auth` or `@auth/core` — the surface we use is
 * small (authorization URL, code exchange, userinfo) and a typed wrapper
 * we own is easier to audit. Adding Slack, GitHub, or any other OIDC
 * provider is a config change.
 *
 * State parameter is signed with HMAC-SHA256 using AUTH_SECRET so the
 * callback can reject tampered values.
 */

import { createHmac, timingSafeEqual } from "node:crypto";

export type OAuthProvider = "google" | "microsoft";

export interface OAuthProviderConfig {
  /** Provider id passed in the `state` parameter. */
  id: OAuthProvider;
  /** OIDC authorisation endpoint. */
  authorizeUrl: string;
  /** OIDC token endpoint. */
  tokenUrl: string;
  /** Userinfo endpoint. */
  userinfoUrl: string;
  /** OAuth client id. */
  clientId: string;
  /** OAuth client secret. */
  clientSecret: string;
  /** Space-separated scopes. `openid email profile` is the minimum. */
  scope: string;
  /** Display name. */
  label: string;
  /**
   * The JSON path inside the userinfo response that holds the stable
   * provider user id (for Google's `sub`, for Microsoft Graph's `sub`).
   * Defaults to `sub`.
   */
  providerAccountIdPath?: string;
}

export function googleConfig(): OAuthProviderConfig {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set to use Google sign-in.");
  }
  return {
    id: "google",
    authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    userinfoUrl: "https://openidconnect.googleapis.com/v1/userinfo",
    clientId,
    clientSecret,
    scope: "openid email profile",
    label: "Google",
  };
}

export function microsoftConfig(): OAuthProviderConfig {
  const tenant = process.env.AZURE_AD_TENANT_ID ?? "common";
  const clientId = process.env.AZURE_AD_CLIENT_ID;
  const clientSecret = process.env.AZURE_AD_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error(
      "AZURE_AD_CLIENT_ID and AZURE_AD_CLIENT_SECRET must be set to use Microsoft sign-in.",
    );
  }
  return {
    id: "microsoft",
    authorizeUrl: `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize`,
    tokenUrl: `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`,
    userinfoUrl: "https://graph.microsoft.com/oidc/userinfo",
    clientId,
    clientSecret,
    scope: "openid email profile User.Read",
    label: "Microsoft",
  };
}

export function getProvider(id: OAuthProvider): OAuthProviderConfig {
  if (id === "google") return googleConfig();
  if (id === "microsoft") return microsoftConfig();
  throw new Error(`Unknown OAuth provider: ${id}`);
}

/** All providers that have credentials configured. */
export function configuredProviders(): OAuthProviderConfig[] {
  const out: OAuthProviderConfig[] = [];
  try {
    out.push(googleConfig());
  } catch {
    // not configured
  }
  try {
    out.push(microsoftConfig());
  } catch {
    // not configured
  }
  return out;
}

export interface AuthorizeUrlInput {
  provider: OAuthProvider;
  redirectUri: string;
  state: string;
  /** Optional nonce for replay-protection. */
  nonce?: string;
}

export function buildAuthorizeUrl(input: AuthorizeUrlInput): string {
  const cfg = getProvider(input.provider);
  const url = new URL(cfg.authorizeUrl);
  url.searchParams.set("client_id", cfg.clientId);
  url.searchParams.set("redirect_uri", input.redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", cfg.scope);
  url.searchParams.set("state", input.state);
  if (input.nonce) url.searchParams.set("nonce", input.nonce);
  // PKCE for public clients — we keep it simple here since the portal
  // server-side handles the callback, but the auth code is short-lived
  // and bound to the redirect URI.
  url.searchParams.set("access_type", "online");
  return url.toString();
}

export interface TokenExchangeInput {
  provider: OAuthProvider;
  code: string;
  redirectUri: string;
}

export interface TokenSet {
  accessToken: string;
  refreshToken?: string;
  expiresAt: Date;
  idToken?: string;
}

export async function exchangeCodeForTokens(input: TokenExchangeInput): Promise<TokenSet> {
  const cfg = getProvider(input.provider);
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code: input.code,
    redirect_uri: input.redirectUri,
    client_id: cfg.clientId,
    client_secret: cfg.clientSecret,
  });

  const res = await fetch(cfg.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body: body.toString(),
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) {
    throw new Error(`OAuth token exchange failed: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    id_token?: string;
  };

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: new Date(Date.now() + data.expires_in * 1000),
    idToken: data.id_token,
  };
}

export interface OidcProfile {
  providerAccountId: string;
  email: string;
  emailVerified: boolean;
  name: string | null;
  pictureUrl: string | null;
}

function readPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export async function fetchUserInfo(
  provider: OAuthProvider,
  accessToken: string,
): Promise<OidcProfile> {
  const cfg = getProvider(provider);
  const res = await fetch(cfg.userinfoUrl, {
    headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" },
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) {
    throw new Error(`Userinfo fetch failed: ${res.status}`);
  }
  const raw = (await res.json()) as Record<string, unknown>;

  const path = cfg.providerAccountIdPath ?? "sub";
  const providerAccountId = String(readPath(raw, path) ?? "");
  const email = String(raw.email ?? "");
  const emailVerified = Boolean(raw.email_verified ?? raw.verified_email ?? false);

  if (!providerAccountId || !email) {
    throw new Error(`OAuth userinfo missing required fields for ${provider}`);
  }

  return {
    providerAccountId,
    email,
    emailVerified,
    name: typeof raw.name === "string" ? raw.name : null,
    pictureUrl: typeof raw.picture === "string" ? raw.picture : null,
  };
}

// ── State signing ─────────────────────────────────────────────────────────

const STATE_TTL_MS = 10 * 60 * 1000;

export interface SignedState {
  provider: OAuthProvider;
  next: string;
  nonce: string;
  issuedAt: number;
}

export function signState(payload: SignedState): string {
  const json = JSON.stringify(payload);
  const body = Buffer.from(json, "utf8").toString("base64url");
  const sig = sign(body);
  return `${body}.${sig}`;
}

export function verifyState(presented: string, now: number = Date.now()): SignedState | null {
  const idx = presented.lastIndexOf(".");
  if (idx < 0) return null;
  const body = presented.slice(0, idx);
  const sig = presented.slice(idx + 1);
  if (!constantTimeHexEquals(sig, sign(body))) return null;
  let parsed: SignedState;
  try {
    parsed = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SignedState;
  } catch {
    return null;
  }
  if (now - parsed.issuedAt > STATE_TTL_MS) return null;
  return parsed;
}

function sign(body: string): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not set; cannot sign OAuth state.");
  }
  return createHmac("sha256", secret).update(body).digest("base64url");
}

function constantTimeHexEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
}

/** A random nonce used inside the signed state payload. */
export function newNonce(): string {
  return randomBytes(16).toString("base64url");
}

/** Stable hash for a provider user id when we want a deterministic key. */
export function stableHash(...parts: string[]): string {
  return createHash("sha256").update(parts.join("|")).digest("hex");
}
