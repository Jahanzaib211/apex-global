import { beforeEach, describe, expect, it } from "vitest";
import { open, redact, seal } from "./vault";
import { parseScore } from "./prompts";

const KEY = "a".repeat(64);

describe("vault", () => {
  beforeEach(() => {
    process.env.ENCRYPTION_KEY = KEY;
  });

  it("round-trips a secret", () => {
    const secret = "sk-live-abcdef1234567890";
    const sealed = seal(secret);
    expect(open(sealed)).toBe(secret);
  });

  it("never stores the plaintext in the sealed output", () => {
    const secret = "sk-live-abcdef1234567890";
    const sealed = seal(secret);
    expect(JSON.stringify(sealed)).not.toContain(secret);
  });

  it("keeps only the last four characters for recognition", () => {
    expect(seal("sk-live-abcdef1234567890").lastFour).toBe("7890");
  });

  it("produces different ciphertext for the same input each time", () => {
    // A fresh nonce per seal. Identical ciphertexts would leak that two
    // integrations share a key.
    const a = seal("same-secret-value");
    const b = seal("same-secret-value");
    expect(a.ciphertext).not.toBe(b.ciphertext);
    expect(a.iv).not.toBe(b.iv);
  });

  it("refuses to decrypt tampered ciphertext rather than returning garbage", () => {
    const sealed = seal("sk-live-abcdef1234567890");
    const tampered = { ...sealed, tag: Buffer.from("0".repeat(16)).toString("base64") };
    expect(() => open(tampered)).toThrow();
  });

  it("refuses to operate without a key", () => {
    delete process.env.ENCRYPTION_KEY;
    expect(() => seal("anything")).toThrow(/ENCRYPTION_KEY is not set/);
  });

  it("rejects a key of the wrong length instead of silently truncating", () => {
    process.env.ENCRYPTION_KEY = "abcd";
    expect(() => seal("anything")).toThrow(/32 bytes/);
  });

  it("refuses to seal an empty secret", () => {
    expect(() => seal("")).toThrow(/empty secret/);
  });
});

describe("redact", () => {
  it("shows enough to identify a key and not enough to use it", () => {
    expect(redact("sk-live-abcdef1234567890")).toBe("sk-…7890");
  });

  it("hides short values entirely", () => {
    expect(redact("short")).toBe("****");
  });
});

describe("parseScore", () => {
  it("extracts a valid score", () => {
    expect(parseScore("72")).toBe(72);
    expect(parseScore("Score: 85")).toBe(85);
  });

  it("rejects out-of-range values rather than clamping them", () => {
    // Clamping would turn a confused model into a confident 100.
    expect(parseScore("420")).toBeNull();
  });

  it("returns null when the model ignores the format", () => {
    expect(parseScore("This lead looks quite promising overall")).toBeNull();
    expect(parseScore("")).toBeNull();
  });

  it("accepts the boundaries", () => {
    expect(parseScore("0")).toBe(0);
    expect(parseScore("100")).toBe(100);
  });
});
