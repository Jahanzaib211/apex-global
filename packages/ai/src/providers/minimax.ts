import {
  AiError,
  withTimeout,
  type AiProvider,
  type CompletionRequest,
  type CompletionResult,
  type ProviderConfig,
} from "../provider";

interface ChatResponse {
  choices?: Array<{ message?: { content?: string } }>;
  usage?: { prompt_tokens?: number; completion_tokens?: number };
  model?: string;
  base_resp?: { status_code?: number; status_msg?: string };
}

/**
 * MiniMax, spoken to over its OpenAI-compatible chat completions endpoint.
 *
 * Note the `base_resp` check: MiniMax can return HTTP 200 with an error inside
 * the body. Trusting the status code alone would surface an auth failure as an
 * empty completion, which is a genuinely confusing thing to debug.
 */
export const minimax: AiProvider = {
  id: "minimax",
  label: "MiniMax",
  defaultModel: "MiniMax-Text-01",
  defaultBaseUrl: "https://api.minimax.io/v1",

  async complete(request: CompletionRequest, config: ProviderConfig): Promise<CompletionResult> {
    const baseUrl = (config.baseUrl || this.defaultBaseUrl).replace(/\/$/, "");
    const model = request.model ?? config.model ?? this.defaultModel;
    const startedAt = Date.now();

    const messages = [
      ...(request.system ? [{ role: "system", content: request.system }] : []),
      { role: "user", content: request.prompt },
    ];

    const response = await withTimeout((signal) =>
      fetch(`${baseUrl}/text/chatcompletion_v2`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: request.maxTokens ?? 1024,
          temperature: request.temperature ?? 0.3,
        }),
        signal,
      }),
    );

    if (!response.ok) {
      throw new AiError(
        `MiniMax returned HTTP ${response.status}`,
        this.id,
        response.status,
        // 429 and 5xx are worth retrying; a 401 will fail identically forever.
        response.status === 429 || response.status >= 500,
      );
    }

    const body = (await response.json()) as ChatResponse;

    if (body.base_resp?.status_code && body.base_resp.status_code !== 0) {
      throw new AiError(
        `MiniMax error ${body.base_resp.status_code}: ${body.base_resp.status_msg ?? "unknown"}`,
        this.id,
        response.status,
        false,
      );
    }

    const text = body.choices?.[0]?.message?.content;
    if (!text) {
      throw new AiError("MiniMax returned no completion text", this.id, response.status, true);
    }

    return {
      text,
      model: body.model ?? model,
      provider: this.id,
      inputTokens: body.usage?.prompt_tokens ?? null,
      outputTokens: body.usage?.completion_tokens ?? null,
      latencyMs: Date.now() - startedAt,
    };
  },

  async test(config: ProviderConfig) {
    try {
      const result = await this.complete(
        { prompt: "Reply with the single word: ready", maxTokens: 8, temperature: 0 },
        config,
      );
      return {
        ok: true,
        detail: `Connected. Model ${result.model} replied in ${result.latencyMs}ms.`,
      };
    } catch (error) {
      return {
        ok: false,
        detail: error instanceof Error ? error.message : "Connection failed for an unknown reason.",
      };
    }
  },
};
