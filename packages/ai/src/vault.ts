import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

/**
 * AES-256-GCM vault for third-party credentials.
 *
 * Provider keys are pasted into the console and must never come back out to a
 * browser. Everything here is server-only: the console shows the last four
 * characters and a connection-test result, and nothing else.
 *
 * GCM rather than CBC because it authenticates as well as encrypts — a
 * tampered ciphertext fails to decrypt instead of yielding garbage that some
 * downstream code then treats as a key.
 */

const ALGORITHM = "aes-256-gcm";
const IV_BYTES = 12; // 96-bit nonce, the size GCM is specified for

export interface SealedSecret {
  ciphertext: string;
  iv: string;
  tag: string;
  lastFour: string;
}

function key(): Buffer {
  const hex = process.env.ENCRYPTION_KEY;
  if (!hex) {
    throw new Error(
      "ENCRYPTION_KEY is not set. Generate one with `openssl rand -hex 32`. " +
        "Refusing to store credentials unencrypted.",
    );
  }
  const buf = Buffer.from(hex, "hex");
  if (buf.length !== 32) {
    throw new Error(`ENCRYPTION_KEY must be 32 bytes (64 hex chars); got ${buf.length} bytes.`);
  }
  return buf;
}

export function seal(plaintext: string): SealedSecret {
  if (!plaintext) throw new Error("Refusing to seal an empty secret.");

  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv(ALGORITHM, key(), iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);

  return {
    ciphertext: ciphertext.toString("base64"),
    iv: iv.toString("base64"),
    tag: cipher.getAuthTag().toString("base64"),
    // Enough for an operator to recognise which key is installed, useless to
    // anyone who obtains it.
    lastFour: plaintext.slice(-4),
  };
}

export function open(sealed: Omit<SealedSecret, "lastFour">): string {
  const decipher = createDecipheriv(ALGORITHM, key(), Buffer.from(sealed.iv, "base64"));
  decipher.setAuthTag(Buffer.from(sealed.tag, "base64"));

  return Buffer.concat([
    decipher.update(Buffer.from(sealed.ciphertext, "base64")),
    decipher.final(),
  ]).toString("utf8");
}

/** Never log a secret. Use this when a value has to appear in a message. */
export function redact(secret: string): string {
  if (secret.length <= 8) return "****";
  return `${secret.slice(0, 3)}…${secret.slice(-4)}`;
}
