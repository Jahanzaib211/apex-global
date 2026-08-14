import * as OTPAuth from "otpauth";
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

/**
 * TOTP (RFC 6238) for optional 2FA on portal accounts.
 *
 * Setup:
 *   - generateSecret() — produces a base32 secret the user scans into their
 *     authenticator app
 *   - provisioningUri() — wraps the secret in an otpauth:// URL with the
 *     issuer + label so the app pre-fills the form
 * Verification:
 *   - verifyCode() — accepts the 6-digit code with a ±1 step window (the
 *     standard allowance for clock skew)
 *
 * The secret is stored encrypted on the user row via `core.Integration`
 * style AES-256-GCM. Helpers for encrypt/decrypt are exposed as
 * `encryptTotpSecret` / `decryptTotpSecret`.
 */

const ISSUER = "Apex Global Tech Solution";
const PERIOD = 30;
const DIGITS = 6;
const ALGORITHM = "SHA1" as const;

export function generateSecret(): string {
  return new OTPAuth.Secret({ size: 20 }).base32;
}

export interface ProvisioningInput {
  email: string;
  secret: string;
}

export function provisioningUri(input: ProvisioningInput): string {
  const totp = new OTPAuth.TOTP({
    issuer: ISSUER,
    label: input.email,
    algorithm: ALGORITHM,
    digits: DIGITS,
    period: PERIOD,
    secret: OTPAuth.Secret.fromBase32(input.secret),
  });
  return totp.toString();
}

export function verifyCode(secret: string, code: string, now: Date = new Date()): boolean {
  if (!/^\d{6}$/.test(code)) return false;
  const totp = new OTPAuth.TOTP({
    issuer: ISSUER,
    algorithm: ALGORITHM,
    digits: DIGITS,
    period: PERIOD,
    secret: OTPAuth.Secret.fromBase32(secret),
  });
  const delta = totp.validate({ token: code, timestamp: now.getTime() });
  return delta !== null;
}

// ── Encryption at rest for the stored secret ─────────────────────────────

function key(): Buffer {
  const value = process.env.ENCRYPTION_KEY;
  if (!value || value.length !== 64) {
    throw new Error(
      "ENCRYPTION_KEY must be a 64-character hex string. Generate with `openssl rand -hex 32`.",
    );
  }
  return Buffer.from(value, "hex");
}

export interface SealedTotpSecret {
  ciphertext: string;
  iv: string;
  tag: string;
}

// GCM's authentication tag is the whole point of choosing GCM, and Node will
// accept a truncated one — 4, 8, 12, 13, 14 or 15 bytes — unless it is told
// what length to expect. A shorter tag is exponentially cheaper to forge, so
// an attacker who can influence the stored envelope could downgrade the
// integrity guarantee to nothing while decryption still reports success.
// Pinning it to the full 16 bytes makes anything else fail closed.
const TAG_BYTES = 16;

export function encryptTotpSecret(plaintext: string): SealedTotpSecret {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv, { authTagLength: TAG_BYTES });
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  return {
    ciphertext: enc.toString("base64"),
    iv: iv.toString("base64"),
    tag: cipher.getAuthTag().toString("base64"),
  };
}

export function decryptTotpSecret(sealed: SealedTotpSecret): string {
  const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(sealed.iv, "base64"), {
    authTagLength: TAG_BYTES,
  });
  decipher.setAuthTag(Buffer.from(sealed.tag, "base64"));
  return Buffer.concat([
    decipher.update(Buffer.from(sealed.ciphertext, "base64")),
    decipher.final(),
  ]).toString("utf8");
}
