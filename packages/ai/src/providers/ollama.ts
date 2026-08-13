import {
  AiError,
  withTimeout,
  type AiProvider,
  type CompletionRequest,
  type CompletionResult,
  type ProviderConfig,
} from "../provider";

interface OllamaResponse {
  message?: { content?: string };
  model?: string;
  prompt_eval_count?: number;
  eval_count?: number;
  error?: string;
}

/**
 * Self-hosted models over Ollama.
 *
 * Present so that "your data never leaves your infrastructure" is a
 * configuration choice rather than a sales claim — an air-gapped client can
 * run the same features with no outbound request. Needs no API key.
 */
export const ollama: AiProvider = {
  id: "ollama",
  label: "Ollama (self-hosted)",
  defaultModel: "llama3.1:8b",
  defaultBaseUrl: "http://localhost:11434",

  async complete(request: CompletionRequest, config: ProviderConfig): Promise<CompletionResult> {
    const baseUrl = (config.baseUrl || this.defaultBaseUrl).replace(/\/$/, "");
    const model = request.model ?? config.model ?? this.defaultModel;
    const startedAt = Date.now();

    const response = await withTimeout(
      (signal) =>
        fetch(`${baseUrl}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model,
            stream: false,
            messages: [
              ...(request.system ? [{ role: "system", content: request.system }] : []),
              { role: "user", content: request.prompt },
            ],
            options: {
              temperature: request.temperature ?? 0.3,
              num_predict: request.maxTokens ?? 1024,
            },
          }),
          signal,
        }),
      // Local inference on modest hardware is slower than a hosted API, and a
      // premature timeout here looks like a broken feature.
      120_000,
    );

    if (!response.ok) {
      throw new AiError(
        `Ollama returned HTTP ${response.status}`,
        this.id,
        response.status,
        response.status >= 500,
      );
    }

    const body = (await response.json()) as OllamaResponse;
    if (body.error)
      throw new AiError(`Ollama error: ${body.error}`, this.id, response.status, false);

    const text = body.message?.content;
    if (!text) throw new AiError("Ollama returned no content", this.id, response.status, true);

    return {
      text,
      model: body.model ?? model,
      provider: this.id,
      inputTokens: body.prompt_eval_count ?? null,
      outputTokens: body.eval_count ?? null,
      latencyMs: Date.now() - startedAt,
    };
  },

  async test(config: ProviderConfig) {
    const baseUrl = (config.baseUrl || this.defaultBaseUrl).replace(/\/$/, "");
    try {
      const response = await withTimeout(
        (signal) => fetch(`${baseUrl}/api/tags`, { signal }),
        5000,
      );
      if (!response.ok) {
        return { ok: false, detail: `Ollama responded with HTTP ${response.status}.` };
      }
      const body = (await response.json()) as { models?: Array<{ name: string }> };
      const names = body.models?.map((m) => m.name) ?? [];
      return {
        ok: true,
        detail: names.length
          ? `Connected. ${names.length} model(s) available: ${names.slice(0, 3).join(", ")}.`
          : "Connected, but no models are pulled yet.",
      };
    } catch (error) {
      return {
        ok: false,
        detail: error instanceof Error ? error.message : "Could not reach Ollama.",
      };
    }
  },
};
