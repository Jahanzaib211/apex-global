import { beforeEach, describe, expect, it } from "vitest";
import { seal } from "./vault";
import { resolveProvider, type StoredIntegration } from "./runtime";

const KEY = "a".repeat(64);

function row(over: Partial<StoredIntegration> = {}): StoredIntegration {
  return {
    provider: "minimax",
    isEnabled: true,
    secretCiphertext: null,
    secretIv: null,
    secretTag: null,
    config: {},
    ...over,
  };
}

function sealed(provider: string, secret: string, config: unknown = {}): StoredIntegration {
  const s = seal(secret);
  return {
    provider,
    isEnabled: true,
    secretCiphertext: s.ciphertext,
    secretIv: s.iv,
    secretTag: s.tag,
    config,
  };
}

describe("resolveProvider", () => {
  beforeEach(() => {
    process.env.ENCRYPTION_KEY = KEY;
  });

  it("returns null when nothing is configured", () => {
    expect(resolveProvider([])).toBeNull();
  });

  it("ignores a provider that is configured but disabled", () => {
    const disabled = { ...sealed("minimax", "sk-live-key"), isEnabled: false };
    expect(resolveProvider([disabled])).toBeNull();
  });

  it("decrypts the key of an enabled provider", () => {
    const resolved = resolveProvider([sealed("minimax", "sk-live-abcd1234")]);
    expect(resolved?.id).toBe("minimax");
    expect(resolved?.apiKey).toBe("sk-live-abcd1234");
  });

  it("carries model and base URL through from config", () => {
    const resolved = resolveProvider([
      sealed("minimax", "sk-x", { model: "custom-model", baseUrl: "https://example.test/v1" }),
    ]);
    expect(resolved?.model).toBe("custom-model");
    expect(resolved?.baseUrl).toBe("https://example.test/v1");
  });

  it("allows self-hosted Ollama without a stored credential", () => {
    // Requiring a key here would make the private-inference path unreachable.
    const resolved = resolveProvider([row({ provider: "ollama", config: { model: "llama3.1:8b" } })]);
    expect(resolved?.id).toBe("ollama");
    expect(resolved?.apiKey).toBe("");
    expect(resolved?.model).toBe("llama3.1:8b");
  });

  it("skips an enabled hosted provider that has no credential", () => {
    expect(resolveProvider([row({ provider: "minimax" })])).toBeNull();
  });

  it("falls through to the next provider when a key cannot be decrypted", () => {
    // Simulates a key sealed under a rotated ENCRYPTION_KEY.
    const broken = sealed("minimax", "sk-x");
    broken.secretTag = Buffer.from("0".repeat(16)).toString("base64");

    const resolved = resolveProvider([broken, row({ provider: "ollama" })]);
    expect(resolved?.id).toBe("ollama");
  });

  it("returns null rather than throwing when every credential is unreadable", () => {
    const broken = sealed("minimax", "sk-x");
    broken.secretIv = Buffer.from("0".repeat(12)).toString("base64");
    expect(resolveProvider([broken])).toBeNull();
  });
});
