import { describe, expect, it } from "vitest";
import { checkPasswordStrength, hashPassword, verifyPassword } from "../passwords";

describe("passwords", () => {
  // bcrypt at cost 12 is deliberately slow, and this does three of them: one
  // hash and two verifies. Under v8 coverage instrumentation on a CI runner
  // that comfortably exceeds vitest's 5s default and the test timed out on
  // every run. The cost factor is a security parameter and is not the thing to
  // change; the budget for a test that runs a KDF three times is.
  it("hashes and verifies a strong password", { timeout: 30_000 }, async () => {
    const hash = await hashPassword("Correct-Horse-Battery-Staple-9!");
    expect(hash).toMatch(/^\$2[aby]\$12\$/);
    expect(await verifyPassword("Correct-Horse-Battery-Staple-9!", hash)).toBe(true);
    expect(await verifyPassword("wrong", hash)).toBe(false);
  });

  it("rejects passwords that are too short", () => {
    const r = checkPasswordStrength("Ab1!");
    expect(r.ok).toBe(false);
    expect(r.reasons.some((s) => s.includes("12"))).toBe(true);
  });

  it("rejects passwords missing character classes", () => {
    const r = checkPasswordStrength("alllowerchars");
    expect(r.ok).toBe(false);
    expect(r.reasons.some((s) => s.toLowerCase().includes("mix"))).toBe(true);
  });

  it("rejects repeated characters", () => {
    expect(checkPasswordStrength("aaaaaaaaaa1A!").ok).toBe(false);
  });

  it("rejects 12345 sequences", () => {
    expect(checkPasswordStrength("MyNameIs12345!").ok).toBe(false);
  });

  it("accepts a long mixed password", () => {
    expect(checkPasswordStrength("Apricot-Violet-Sunset-7!").ok).toBe(true);
  });
});
