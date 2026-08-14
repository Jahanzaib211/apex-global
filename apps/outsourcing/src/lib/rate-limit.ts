/**
 * Token-bucket rate limiter, in-memory. Per-process — sufficient for a single
 * PM2 fork instance. For multi-instance setups, swap for a Redis-backed
 * implementation behind the same interface.
 */

type Bucket = { tokens: number; resetAt: number };

export type RateLimitConfig = {
  /** Max requests per window. */
  limit: number;
  /** Window in milliseconds. */
  windowMs: number;
};

export type RateLimitResult =
  | { allowed: true; remaining: number; resetAt: number }
  | { allowed: false; remaining: 0; resetAt: number; retryAfterMs: number };

const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, cfg: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || now >= b.resetAt) {
    const resetAt = now + cfg.windowMs;
    buckets.set(key, { tokens: cfg.limit - 1, resetAt });
    return { allowed: true, remaining: cfg.limit - 1, resetAt };
  }
  if (b.tokens <= 0) {
    return { allowed: false, remaining: 0, resetAt: b.resetAt, retryAfterMs: b.resetAt - now };
  }
  b.tokens -= 1;
  return { allowed: true, remaining: b.tokens, resetAt: b.resetAt };
}

/** Identify a request by IP + path. Honor X-Forwarded-For when behind a proxy. */
export function clientKey(req: Request, scope: string): string {
  const xff = req.headers.get("x-forwarded-for");
  const ip = (xff ? xff.split(",")[0]!.trim() : null) ?? req.headers.get("x-real-ip") ?? "unknown";
  return `${scope}:${ip}`;
}
