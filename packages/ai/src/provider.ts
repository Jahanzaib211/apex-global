/**
 * Provider-agnostic AI interface.
 *
 * The application talks to this, never to a vendor SDK. Model quality, pricing
 * and availability all move, and an app wired directly into one vendor
 * inherits every one of those movements. Swapping provider should be a
 * settings change, not a refactor.
 */

export interface CompletionRequest {
  system?: string;
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  /** Overrides the provider's configured default. */
  model?: string;
}

export interface CompletionResult {
  text: string;
  model: string;
  provider: string;
  /** Null when the provider does not report usage. Never guessed. */
  inputTokens: number | null;
  outputTokens: number | null;
  latencyMs: number;
}

export interface ProviderConfig {
  apiKey: string;
  baseUrl?: string;
  model?: string;
}

export interface AiProvider {
  readonly id: string;
  readonly label: string;
  readonly defaultModel: string;
  readonly defaultBaseUrl: string;
  complete(request: CompletionRequest, config: ProviderConfig): Promise<CompletionResult>;
  /** Cheapest possible round trip, used by the console's "Test connection". */
  test(config: ProviderConfig): Promise<{ ok: boolean; detail: string }>;
}

export class AiError extends Error {
  constructor(
    message: string,
    readonly provider: string,
    readonly status?: number,
    readonly retryable = false,
  ) {
    super(message);
    this.name = "AiError";
  }
}

/** Every provider call is bounded. A hung model must not hang a request. */
export const DEFAULT_TIMEOUT_MS = 30_000;

export async function withTimeout<T>(
  promise: (signal: AbortSignal) => Promise<T>,
  ms: number = DEFAULT_TIMEOUT_MS,
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await promise(controller.signal);
  } finally {
    clearTimeout(timer);
  }
}
