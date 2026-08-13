import { describe, expect, it } from "vitest";
import {
  verifyCode,
  generateSecret,
  provisioningUri,
  encryptTotpSecret,
  decryptTotpSecret,
} from "../totp";

describe("TOTP", () => {
  it("generates a 32-char base32 secret", () => {
    const secret = generateSecret();
    expect(secret).toMatch(/^[A-Z2-7]{32}$/);
  });

  it("returns an otpauth:// provisioning URI", () => {
    const secret = generateSecret();
    const uri = provisioningUri({ email: "a@b.com", secret });
    expect(uri.startsWith("otpauth://totp/")).toBe(true);
    expect(uri).toContain(encodeURIComponent("Apex Global Tech Solution"));
    expect(uri).toContain(encodeURIComponent("a@b.com"));
  });

  it("verifies the current code", () => {
    const secret = generateSecret();
    // Compute the current code from the same secret.
    // (We do this via a TOTP library round-trip in the test.)
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const OTPAuth = require("otpauth");
    const totp = new OTPAuth.TOTP({
      issuer: "Apex Global Tech Solution",
      label: "a@b.com",
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(secret),
    });
    const code = totp.generate();
    expect(verifyCode(secret, code)).toBe(true);
  });

  it("rejects an obviously wrong code", () => {
    const secret = generateSecret();
    expect(verifyCode(secret, "000000")).toBe(false);
    expect(verifyCode(secret, "abcdef")).toBe(false);
    expect(verifyCode(secret, "12345")).toBe(false); // 5 digits not accepted
  });
});

describe("TOTP secret encryption", () => {
  it("encrypts and decrypts round-trip", () => {
    process.env.ENCRYPTION_KEY = "a".repeat(64);
    const secret = generateSecret();
    const sealed = encryptTotpSecret(secret);
    expect(sealed.ciphertext).not.toContain(secret);
    expect(decryptTotpSecret(sealed)).toBe(secret);
  });
});
