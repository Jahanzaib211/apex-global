import { describe, expect, it, beforeEach } from "vitest";
import { mask, open, seal } from "./vault";

/**
 * The vault is where partner credentials encrypt and decrypt, and the whole
 * point is that a change here can silently break every stored key. These
 * tests pin the round-trip, the tamper detection, and the masking behaviour
 * that surfaces in the console UI.
 */

const KEY = "000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f";

describe("seal / open", () => {
  beforeEach(() => {
    process.env.ENCRYPTION_KEY = KEY;
  });

  it("round-trips a secret", () => {
    const envelope = seal("sk-live-super-secret-42");
    expect(open(envelope)).toBe("sk-live-super-secret-42");
  });

  it("is non-deterministic across seals (fresh IV each time)", () => {
    const a = seal("same-secret");
    const b = seal("same-secret");
    expect(a.ciphertext).not.toBe(b.ciphertext);
    expect(a.iv).not.toBe(b.iv);
  });

  it("reports the last four characters without exposing the secret", () => {
    const envelope = seal("sk-live-abcd1234");
    expect(envelope.lastFour).toBe("1234");
  });

  it("rejects tampered ciphertext", () => {
    const envelope = seal("sk-live-abcd1234");
    const corrupted = { ...envelope, ciphertext: `AAAA${envelope.ciphertext.slice(4)}` };
    expect(() => open(corrupted)).toThrow();
  });

  it("rejects a ciphertext encrypted with a different key", () => {
    const envelope = seal("sk-live-abcd1234");
    process.env.ENCRYPTION_KEY = "f" + KEY.slice(1);
    expect(() => open(envelope)).toThrow();
  });
});

describe("mask", () => {
  it("masks everything for short tokens", () => {
    expect(mask("abcdef")).toBe("••••••");
  });

  it("keeps the first and last four for long tokens", () => {
    // "sk-live-abcdefgh" → first 4 kept, middle (16-8=8) masked, last 4 kept.
    expect(mask("sk-live-abcdefgh")).toBe("sk-l••••••••efgh");
  });

  it("never leaks characters between the kept head and tail", () => {
    const m = mask("sk-live-abcdefgh");
    expect(m).not.toContain("abcdef");
    expect(m).not.toContain("live");
  });

  it("never leaks a full secret", () => {
    const m = mask("very-long-secret-value-123456");
    expect(m).not.toContain("123456");
  });
});
