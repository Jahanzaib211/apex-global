/**
 * Prompt registry.
 *
 * Versioned in code and reviewed like code, because a prompt change alters
 * product behaviour as surely as a code change does. Every prompt here is
 * advisory: output lands as a draft or a suggestion, and a person decides.
 */

export interface PromptDefinition {
  id: string;
  version: number;
  system: string;
  build: (input: Record<string, string>) => string;
}

export const LEAD_SUMMARY: PromptDefinition = {
  id: "lead.summary",
  version: 1,
  system:
    "You summarise inbound sales enquiries for a technology company. Be terse and factual. " +
    "Never invent detail that is not in the enquiry. If something important is missing, say " +
    "what is missing rather than guessing. Do not use marketing language.",
  build: ({ name, company, country, interest, budget, timeline, message }) =>
    `Summarise this enquiry in two sentences, then list on separate lines: what they appear to need, ` +
    `what is missing that we should ask, and one specific opening question for the first call.\n\n` +
    `Name: ${name}\nCompany: ${company || "not given"}\nCountry: ${country || "not given"}\n` +
    `Interest: ${interest || "not specified"}\nBudget: ${budget || "not given"}\n` +
    `Timeline: ${timeline || "not given"}\n\nMessage:\n${message || "(no message)"}`,
};

export const LEAD_SCORE: PromptDefinition = {
  id: "lead.score",
  version: 1,
  system:
    "You score inbound enquiries for a technology services and SaaS company. " +
    "Respond with a single integer from 0 to 100 and nothing else. " +
    "Score on fit and buying signal, not on enthusiasm. A detailed technical problem from a " +
    "mid-sized company scores higher than an eager one-line message with no company. " +
    "Missing information should lower the score rather than being assumed favourably.",
  build: ({ company, country, interest, budget, timeline, companySize, message }) =>
    `Company: ${company || "not given"}\nSize: ${companySize || "not given"}\n` +
    `Country: ${country || "not given"}\nInterest: ${interest || "not specified"}\n` +
    `Budget: ${budget || "not given"}\nTimeline: ${timeline || "not given"}\n\n` +
    `Message:\n${message || "(no message)"}`,
};

export const CONTENT_DRAFT: PromptDefinition = {
  id: "content.draft",
  version: 1,
  system:
    "You draft copy for a technology company that positions itself on verifiable capability. " +
    "Rules, without exception: no superlatives, no 'industry-leading', no 'cutting-edge', " +
    "no guarantees about uptime or security, no invented statistics, no client names. " +
    "State capability precisely instead of claiming excellence. Prefer plain words. " +
    "British spelling. Output is a draft for a human to edit, not final copy.",
  build: ({ kind, topic, notes }) =>
    `Draft ${kind} about: ${topic}.\n\nFacts available (use only these):\n${notes}`,
};

export const PROMPTS = [LEAD_SUMMARY, LEAD_SCORE, CONTENT_DRAFT];

/**
 * Model output is untrusted input. A score is only usable if it is a number in
 * range, so anything else is discarded rather than coerced into a plausible
 * value that would quietly mis-rank a lead.
 */
export function parseScore(raw: string): number | null {
  const match = raw.match(/\b(\d{1,3})\b/);
  if (!match) return null;
  const value = Number.parseInt(match[1]!, 10);
  return value >= 0 && value <= 100 ? value : null;
}
