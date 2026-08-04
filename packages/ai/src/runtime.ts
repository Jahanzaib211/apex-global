import "server-only";
import { LEAD_SCORE, LEAD_SUMMARY, parseScore } from "./prompts";
import { getProvider } from "./index";
import { open } from "./vault";
import type { CompletionResult } from "./provider";

/**
 * Runtime AI helpers.
 *
 * Everything here degrades to `null` rather than throwing. An AI enrichment
 * failure must never lose a lead — the enquiry is already saved by the time
 * these run, and a summary is a convenience, not the record.
 */

/** Structural shape of the integration row, so this package need not import Prisma. */
export interface StoredIntegration {
  provider: string;
  isEnabled: boolean;
  secretCiphertext: string | null;
  secretIv: string | null;
  secretTag: string | null;
  config: unknown;
}

export interface ResolvedProvider {
  id: string;
  apiKey: string;
  model?: string;
  baseUrl?: string;
}

/**
 * Pick the enabled provider to use, decrypting its key.
 *
 * Ollama is allowed through without a stored credential — a self-hosted model
 * has no API key, and requiring one would make the private-inference path
 * unreachable.
 */
export function resolveProvider(integrations: StoredIntegration[]): ResolvedProvider | null {
  const enabled = integrations.filter((i) => i.isEnabled);
  if (enabled.length === 0) return null;

  for (const row of enabled) {
    const config = (row.config ?? {}) as { model?: string; baseUrl?: string };

    if (row.provider === "ollama") {
      return { id: row.provider, apiKey: "", model: config.model, baseUrl: config.baseUrl };
    }

    if (!row.secretCiphertext || !row.secretIv || !row.secretTag) continue;

    try {
      return {
        id: row.provider,
        apiKey: open({
          ciphertext: row.secretCiphertext,
          iv: row.secretIv,
          tag: row.secretTag,
        }),
        model: config.model,
        baseUrl: config.baseUrl,
      };
    } catch {
      // A key sealed under a rotated ENCRYPTION_KEY cannot be opened. Skip it
      // and try the next provider rather than failing the whole enrichment.
      continue;
    }
  }

  return null;
}

export interface LeadFacts {
  name: string;
  company?: string | null;
  country?: string | null;
  interest?: string | null;
  budget?: string | null;
  timeline?: string | null;
  companySize?: string | null;
  message?: string | null;
}

export interface LeadEnrichment {
  summary: string | null;
  score: number | null;
  model: string | null;
}

function facts(lead: LeadFacts): Record<string, string> {
  return {
    name: lead.name,
    company: lead.company ?? "",
    country: lead.country ?? "",
    interest: lead.interest ?? "",
    budget: lead.budget ?? "",
    timeline: lead.timeline ?? "",
    companySize: lead.companySize ?? "",
    message: lead.message ?? "",
  };
}

/**
 * Summarise and score a lead.
 *
 * Both calls are advisory. The score is discarded unless it parses to an
 * integer in range — a model that answers "quite promising" must not become
 * a confident number that silently mis-ranks someone's pipeline.
 */
export async function enrichLead(
  lead: LeadFacts,
  provider: ResolvedProvider,
): Promise<LeadEnrichment> {
  const definition = getProvider(provider.id);
  const config = { apiKey: provider.apiKey, model: provider.model, baseUrl: provider.baseUrl };
  const input = facts(lead);

  const settle = async (p: Promise<CompletionResult>) => {
    try {
      return await p;
    } catch (error) {
      console.warn("AI enrichment call failed:", error instanceof Error ? error.message : error);
      return null;
    }
  };

  const [summary, score] = await Promise.all([
    settle(
      definition.complete(
        { system: LEAD_SUMMARY.system, prompt: LEAD_SUMMARY.build(input), maxTokens: 400 },
        config,
      ),
    ),
    settle(
      definition.complete(
        { system: LEAD_SCORE.system, prompt: LEAD_SCORE.build(input), maxTokens: 8, temperature: 0 },
        config,
      ),
    ),
  ]);

  return {
    summary: summary?.text.trim() ?? null,
    score: score ? parseScore(score.text) : null,
    model: summary?.model ?? score?.model ?? null,
  };
}
