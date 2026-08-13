/**
 * Credential vault for partner integrations.
 *
 * AES-256-GCM encryption, shared with `core.Integration` for AI providers.
 * The plaintext never leaves this module — callers receive a sealed envelope
 * or the four-character tail, never the secret itself.
 *
 * The key comes from `ENCRYPTION_KEY` (32-byte hex). Losing it costs every
 * stored credential, which is why backups of it live outside the server.
 */

import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const ALG = "aes-256-gcm";

function key(): Buffer {
  const value = process.env.ENCRYPTION_KEY;
  if (!value || value.length !== 64) {
    throw new Error(
      "ENCRYPTION_KEY must be a 64-character hex string (32 bytes). Generate with `openssl rand -hex 32`.",
    );
  }
  return Buffer.from(value, "hex");
}

export interface SealedEnvelope {
  ciphertext: string;
  iv: string;
  tag: string;
  lastFour: string;
}

export function seal(plaintext: string): SealedEnvelope {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALG, key(), iv);
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    ciphertext: enc.toString("base64"),
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
    lastFour: plaintext.slice(-4),
  };
}

export function open(envelope: { ciphertext: string; iv: string; tag: string }): string {
  const decipher = createDecipheriv(ALG, key(), Buffer.from(envelope.iv, "base64"));
  decipher.setAuthTag(Buffer.from(envelope.tag, "base64"));
  const dec = Buffer.concat([
    decipher.update(Buffer.from(envelope.ciphertext, "base64")),
    decipher.final(),
  ]);
  return dec.toString("utf8");
}

/** Mask an opaque token for display: keep first 4 and last 4, mask the rest. */
export function mask(value: string): string {
  if (value.length <= 8) return "•".repeat(value.length);
  return `${value.slice(0, 4)}${"•".repeat(Math.max(4, value.length - 8))}${value.slice(-4)}`;
}
