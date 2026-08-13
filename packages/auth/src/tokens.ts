import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { jwtVerify, SignJWT } from "jose";

/**
 * Two kinds of tokens.
 *
 *  - JWT for short-lived session cookies, signed with AUTH_SECRET and read on
 *    every request — they encode only the user id, with permissions looked
 *    up live in the database (revoke a role and the cookie reflects it on
 *    next check, not when the token happens to expire).
 *
 *  - Opaque tokens for one-time use (magic-link, password reset, invitation).
 *    Plaintext is shown to the user in the URL; the database stores only
 *    a SHA-256 hash. Compared in constant time.
 */

const TOKEN_BYTES = 32;

export function generateOpaqueToken(): { raw: string; hash: string } {
  const raw = randomBytes(TOKEN_BYTES).toString("base64url");
  const hash = hashOpaqueToken(raw);
  return { raw, hash };
}

export function hashOpaqueToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

export function constantTimeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
  } catch {
    return false;
  }
}

export function verifyOpaqueToken(plain: string, hash: string): boolean {
  return constantTimeEquals(hashOpaqueToken(plain), hash);
}

interface JwtSecret {
  readonly alg: "HS256";
  readonly key: Uint8Array;
}

function secret(): JwtSecret {
  const value = process.env.AUTH_SECRET;
  if (!value) {
    throw new Error("AUTH_SECRET is not set. Generate one with `openssl rand -base64 32`.");
  }
  return { alg: "HS256", key: new TextEncoder().encode(value) };
}

export interface SessionClaims {
  /** User id. */
  sub: string;
  /** Issued at, seconds since epoch. */
  iat: number;
  /** Expires at, seconds since epoch. */
  exp: number;
}

export async function signSessionJwt(sub: string, ttlSeconds: number): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(sub)
    .setIssuedAt(now)
    .setExpirationTime(now + ttlSeconds)
    .sign(secret().key);
}

export async function verifySessionJwt(token: string): Promise<SessionClaims | null> {
  try {
    const { payload } = await jwtVerify(token, secret().key, { algorithms: ["HS256"] });
    if (typeof payload.sub !== "string") return null;
    if (typeof payload.iat !== "number") return null;
    if (typeof payload.exp !== "number") return null;
    return { sub: payload.sub, iat: payload.iat, exp: payload.exp };
  } catch {
    return null;
  }
}
