/**
 * Shared guards for the public, unauthenticated form endpoints.
 *
 * `/api/leads` and `/api/demo-request` take the same kind of traffic and need
 * the same defences. They were not sharing them: demo-request accepted a
 * `turnstileToken` it never verified and had no rate limit at all, so the
 * quieter of the two endpoints was the softer target.
 */

/** Requests per window, per address. Generous for humans, useless for a bot. */
const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };

/**
 * In-process limiter, keyed by caller-supplied bucket so the two endpoints
 * count separately. Correct for a single instance and honest about its limits:
 * behind more than one replica this becomes per-replica, so the Redis counter
 * in `modules/crm` supersedes it when the worker tier lands.
 */
const attempts = new Map<string, { count: number; resetAt: number }>();

export function rateLimited(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + RATE_LIMIT.windowMs });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT.max;
}

/** Test seam: drop all counters. Not used by the routes. */
export function resetRateLimits(): void {
  attempts.clear();
}

export async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    // Fail open, loudly. Rejecting every submission because a key was not
    // configured would silently bin real enquiries in the middle of a paid
    // campaign — far more damaging than the spam the challenge prevents, and
    // much harder to notice. The honeypot and rate limit still apply.
    if (process.env.NODE_ENV === "production") {
      console.error(
        "TURNSTILE_SECRET_KEY is not set in production. Form submissions are accepted " +
          "without a human-verification challenge. Configure it.",
      );
    }
    return true;
  }

  if (!token) return false;

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(5000),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    // A challenge provider outage must not stop us taking business. Log and
    // let it through; the honeypot and rate limit still apply.
    console.warn("Turnstile verification unavailable — allowing submission");
    return true;
  }
}
