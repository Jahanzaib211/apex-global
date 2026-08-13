import { generateOpaqueToken, hashOpaqueToken, verifyOpaqueToken } from "./tokens";

/**
 * Magic-link authentication.
 *
 * Two flavours:
 *   - sign-in: 24h expiry, single use, the same email gets fresh tokens
 *     (the older one is invalidated the moment a new row is written)
 *   - password reset: 1h expiry, single use, issued per request
 *
 * The plaintext token is what gets emailed and what the URL carries. The
 * database only ever sees the hash, and the comparison is constant-time.
 */

export interface MagicLinkInput {
  email: string;
  ip?: string | undefined;
  /** "sign-in" (24h) or "reset" (1h) — anything else falls back to sign-in. */
  purpose?: "sign-in" | "reset";
}

export interface IssuedMagicLink {
  raw: string; // only returned once at issue time
  hash: string;
  expiresAt: Date;
}

const ONE_HOUR_MS = 60 * 60 * 1000;
const ONE_DAY_MS = 24 * ONE_HOUR_MS;

export function issueMagicLink(input: MagicLinkInput): IssuedMagicLink {
  const { raw, hash } = generateOpaqueToken();
  const ttlMs = input.purpose === "reset" ? ONE_HOUR_MS : ONE_DAY_MS;
  return {
    raw,
    hash,
    expiresAt: new Date(Date.now() + ttlMs),
  };
}

/** Construct the URL the user clicks in their email. */
export function magicLinkUrl(raw: string, baseUrl: string, next?: string): string {
  const url = new URL("/portal/auth/magic", baseUrl);
  url.searchParams.set("token", raw);
  if (next) url.searchParams.set("next", next);
  return url.toString();
}

/**
 * Verify a magic-link token against its stored hash. Returns true only on
 * exact match and within the expiry window. Constant-time comparison.
 */
export function verifyMagicLinkToken(
  presented: string,
  storedHash: string,
  expiresAt: Date,
  now: Date = new Date(),
): boolean {
  if (now > expiresAt) return false;
  return verifyOpaqueToken(presented, storedHash);
}

/** Expose the hash for storage so callers don't accidentally persist the raw token. */
export function hashMagicLink(raw: string): string {
  return hashOpaqueToken(raw);
}
