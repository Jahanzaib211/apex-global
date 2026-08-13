import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Request signing for the group sites posting into /api/leads/partner.
 *
 * These are server-to-server calls from the four Apex properties, so there is
 * no browser to challenge with Turnstile and no session to check. A shared
 * secret and an HMAC over the payload is what stands between this endpoint and
 * anyone who finds the URL.
 *
 * The signed string is `timestamp.site.body`, not the body alone. Signing the
 * body by itself would leave the `X-Apex-Site` header unauthenticated — a
 * captured Apex Tours request could be relabelled as Apex Holdings and land in
 * the wrong team's pipeline with a signature that still verified.
 */

/** Requests older than this are refused, so a captured call is not replayable forever. */
export const SIGNATURE_TOLERANCE_SECONDS = 300;

export function signaturePayload(timestamp: string, site: string, rawBody: string): string {
  return `${timestamp}.${site}.${rawBody}`;
}

export function sign(timestamp: string, site: string, rawBody: string, secret: string): string {
  return createHmac("sha256", secret)
    .update(signaturePayload(timestamp, site, rawBody))
    .digest("hex");
}

export type SignatureFailure = "missing" | "stale" | "mismatch";

export function verifyPartnerSignature(args: {
  rawBody: string;
  site: string;
  timestamp: string | null;
  signature: string | null;
  secret: string;
  now?: number;
}): { ok: true } | { ok: false; reason: SignatureFailure } {
  const { rawBody, site, timestamp, signature, secret } = args;

  if (!timestamp || !signature) return { ok: false, reason: "missing" };

  const sent = Number(timestamp);
  if (!Number.isFinite(sent)) return { ok: false, reason: "missing" };

  const now = args.now ?? Date.now();
  if (Math.abs(now / 1000 - sent) > SIGNATURE_TOLERANCE_SECONDS) {
    return { ok: false, reason: "stale" };
  }

  const expected = sign(timestamp, site, rawBody, secret);

  // timingSafeEqual throws on a length mismatch, which a malformed or
  // truncated header will produce — treat that as a failed comparison rather
  // than a 500.
  try {
    const a = Buffer.from(expected, "hex");
    const b = Buffer.from(signature, "hex");
    if (a.length !== b.length) return { ok: false, reason: "mismatch" };
    return timingSafeEqual(a, b) ? { ok: true } : { ok: false, reason: "mismatch" };
  } catch {
    return { ok: false, reason: "mismatch" };
  }
}
