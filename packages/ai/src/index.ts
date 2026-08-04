import { minimax } from "./providers/minimax";
import { ollama } from "./providers/ollama";
import type { AiProvider } from "./provider";

export * from "./provider";
export * from "./vault";
export * from "./prompts";
export * from "./runtime";
export { minimax } from "./providers/minimax";
export { ollama } from "./providers/ollama";

const REGISTRY: Record<string, AiProvider> = {
  [minimax.id]: minimax,
  [ollama.id]: ollama,
};

export function getProvider(id: string): AiProvider {
  const provider = REGISTRY[id];
  if (!provider) {
    throw new Error(
      `Unknown AI provider "${id}". Available: ${Object.keys(REGISTRY).join(", ")}.`,
    );
  }
  return provider;
}

export function listProviders(): AiProvider[] {
  return Object.values(REGISTRY);
}
