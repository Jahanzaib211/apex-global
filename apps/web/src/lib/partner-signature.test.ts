import { describe, expect, it } from "vitest";
import { sign, verifyPartnerSignature, SIGNATURE_TOLERANCE_SECONDS } from "./partner-signature";

const SECRET = "test-secret-value";
const SITE = "apex-tours";
const BODY = JSON.stringify({ name: "Ada", email: "ada@example.com" });

/** Fixed clock so the tolerance tests do not depend on wall time. */
const NOW = 1_760_000_000_000;
const TS = String(Math.floor(NOW / 1000));

function verify(over: Partial<Parameters<typeof verifyPartnerSignature>[0]> = {}) {
  return verifyPartnerSignature({
    rawBody: BODY,
    site: SITE,
    timestamp: TS,
    signature: sign(TS, SITE, BODY, SECRET),
    secret: SECRET,
    now: NOW,
    ...over,
  });
}

describe("verifyPartnerSignature", () => {
  it("accepts a correctly signed request", () => {
    expect(verify()).toEqual({ ok: true });
  });

  it("rejects a tampered body", () => {
    const rawBody = JSON.stringify({ name: "Mallory", email: "ada@example.com" });
    expect(verify({ rawBody })).toEqual({ ok: false, reason: "mismatch" });
  });

  it("rejects a request relabelled as another site", () => {
    // The whole point of signing the site: a captured Apex Tours submission
    // must not be replayable as Apex Holdings.
    expect(verify({ site: "apex-holdings" })).toEqual({ ok: false, reason: "mismatch" });
  });

  it("rejects a signature made with a different secret", () => {
    expect(verify({ signature: sign(TS, SITE, BODY, "wrong-secret") })).toEqual({
      ok: false,
      reason: "mismatch",
    });
  });

  it("rejects a missing signature or timestamp", () => {
    expect(verify({ signature: null })).toEqual({ ok: false, reason: "missing" });
    expect(verify({ timestamp: null })).toEqual({ ok: false, reason: "missing" });
    expect(verify({ timestamp: "not-a-number" })).toEqual({ ok: false, reason: "missing" });
  });

  it("rejects a replay outside the tolerance window, in both directions", () => {
    const stale = String(Math.floor(NOW / 1000) - SIGNATURE_TOLERANCE_SECONDS - 1);
    expect(verify({ timestamp: stale, signature: sign(stale, SITE, BODY, SECRET) })).toEqual({
      ok: false,
      reason: "stale",
    });

    // A clock-skewed future timestamp is equally suspect.
    const future = String(Math.floor(NOW / 1000) + SIGNATURE_TOLERANCE_SECONDS + 1);
    expect(verify({ timestamp: future, signature: sign(future, SITE, BODY, SECRET) })).toEqual({
      ok: false,
      reason: "stale",
    });
  });

  it("accepts a retry inside the tolerance window", () => {
    // The sending sites retry on 5xx; that retry must still verify.
    const recent = String(Math.floor(NOW / 1000) - (SIGNATURE_TOLERANCE_SECONDS - 5));
    expect(verify({ timestamp: recent, signature: sign(recent, SITE, BODY, SECRET) })).toEqual({
      ok: true,
    });
  });

  it("does not throw on a malformed or truncated signature header", () => {
    expect(verify({ signature: "zzzz" })).toEqual({ ok: false, reason: "mismatch" });
    expect(verify({ signature: "abcd" })).toEqual({ ok: false, reason: "mismatch" });
    expect(verify({ signature: "" })).toEqual({ ok: false, reason: "missing" });
  });
});
