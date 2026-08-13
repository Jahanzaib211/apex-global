import { describe, expect, it } from "vitest";
import { checkPasswordStrength, hashPassword, verifyPassword } from "../passwords";

describe("passwords", () => {
  it("hashes and verifies a strong password", async () => {
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
