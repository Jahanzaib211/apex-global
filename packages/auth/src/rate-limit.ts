import { createHmac, randomBytes } from "node:crypto";

/**
 * In-memory rate limiter for auth endpoints.
 *
 * Sliding window per (key, action). Correct for a single instance; the
 * `crm` module notes the same caveat — when the worker tier lands, swap
 * this for a Redis-backed counter.
 *
 * Keys are arbitrary strings. The callers compose them from IP + email +
 * action so that "10 failed logins from this email" and "100 from this IP"
 * are tracked independently.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export interface LimitConfig {
  /** Identifier (e.g. "ip:1.2.3.4" or "email:a@b.com"). */
  key: string;
  /** Maximum hits within `windowMs`. */
  max: number;
  /** Sliding window length in milliseconds. */
  windowMs: number;
}

export interface LimitResult {
  ok: boolean;
  remaining: number;
  resetAt: number;
}

export function checkLimit(cfg: LimitConfig): LimitResult {
  const now = Date.now();
  const entry = buckets.get(cfg.key);
  if (!entry || now > entry.resetAt) {
    buckets.set(cfg.key, { count: 1, resetAt: now + cfg.windowMs });
    return { ok: true, remaining: cfg.max - 1, resetAt: now + cfg.windowMs };
  }
  entry.count += 1;
  const ok = entry.count <= cfg.max;
  return { ok, remaining: Math.max(0, cfg.max - entry.count), resetAt: entry.resetAt };
}

/** Clear all buckets. Test-only. */
export function __resetLimits(): void {
  buckets.clear();
}

// ── Preset policies ────────────────────────────────────────────────────────

/** IP-based: too many sign-in attempts regardless of email. */
export const signInAttemptPolicy: Omit<LimitConfig, "key"> = {
  max: 10,
  windowMs: 10 * 60 * 1000,
};

/** Email-based: too many attempts at one address — slow brute force. */
export const signInEmailPolicy: Omit<LimitConfig, "key"> = {
  max: 5,
  windowMs: 10 * 60 * 1000,
};

/** Password reset request: spam-resistant. */
export const passwordResetPolicy: Omit<LimitConfig, "key"> = {
  max: 3,
  windowMs: 30 * 60 * 1000,
};

/** Magic-link request: same. */
export const magicLinkPolicy: Omit<LimitConfig, "key"> = {
  max: 3,
  windowMs: 30 * 60 * 1000,
};

/** Invitation acceptance: throttle per email. */
export const invitationPolicy: Omit<LimitConfig, "key"> = {
  max: 5,
  windowMs: 60 * 60 * 1000,
};

// ── Lightweight CSRF double-submit helper ───────────────────────────────────

/** Issues a random token that can be stashed in a hidden form field. */
export function issueCsrfToken(): string {
  return randomBytes(24).toString("base64url");
}

/** HMAC-sign a CSRF token against the session so a stolen form value alone is not enough. */
export function signCsrf(token: string): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET required for CSRF signing");
  return createHmac("sha256", secret).update(token).digest("base64url");
}

/** Constant-time check. */
export function verifyCsrf(token: string, signature: string): boolean {
  const expected = signCsrf(token);
  if (expected.length !== signature.length) return false;
  // timingSafeEqual works on Buffers
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  let acc = 0;
  for (let i = 0; i < a.length; i++) acc |= (a[i] ?? 0) ^ (b[i] ?? 0);
  return acc === 0;
}
