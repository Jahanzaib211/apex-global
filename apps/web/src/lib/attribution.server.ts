import "server-only";
import { createHash } from "node:crypto";

/**
 * Server-side attribution helpers. Kept apart from the client-safe module so
 * node:crypto never reaches the browser bundle.
 */

/**
 * Hash the client address rather than storing it.
 *
 * We need to rate-limit and to spot duplicate submissions, and neither needs a
 * reversible address. Rotating the salt daily means the hash is not a stable
 * identifier across days either.
 */
export function hashIp(ip: string): string {
  const day = new Date().toISOString().slice(0, 10);
  const salt = process.env.AUTH_SECRET ?? "apex";
  return createHash("sha256").update(`${salt}:${day}:${ip}`).digest("hex").slice(0, 32);
}

/** Best-effort client address behind a proxy or CDN. */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return headers.get("cf-connecting-ip") ?? headers.get("x-real-ip") ?? "unknown";
}

/** Cloudflare sets this at the edge; more reliable than a form field. */
export function clientCountry(headers: Headers): string | undefined {
  return headers.get("cf-ipcountry") ?? undefined;
}

/**
 * Deduplication key: same site, same email, same day.
 *
 * A double-tap on a slow mobile connection would otherwise create two leads and
 * two notifications, and sales would call the same person twice.
 *
 * The site is part of the key because five Apex properties now share this
 * pipeline. Keyed on email alone, someone who enquired at Apex Tours in the
 * morning and at Apex Tech in the afternoon would have the second enquiry
 * folded into the first as a note — a different business, a different team,
 * and a real opportunity quietly lost. Scoping the window per site keeps the
 * double-tap protection while letting genuinely distinct intents through.
 */
export function dedupeKey(email: string, sourceSite: string): string {
  const day = new Date().toISOString().slice(0, 10);
  return createHash("sha256")
    .update(`${sourceSite}:${email.toLowerCase()}:${day}`)
    .digest("hex")
    .slice(0, 32);
}
