# ai-assist

**Status: active** · depends on: `core`, `crm`

## Purpose

A provider-agnostic AI layer. The application talks to an interface, never to a
vendor SDK, so switching provider is a settings change rather than a refactor.

## Data model

No tables of its own. Credentials live in `core.Integration`; output lands on
`Lead.aiSummary` / `aiScore` / `aiScoredAt` / `aiModel` and on the activity
timeline.

## Permissions

`ai:read` · `ai:admin` (the vault is administrator-only)

## Routes

`/settings` — paste a key, choose a model, test the connection.

## Jobs

| Queue         | Trigger                               |
| ------------- | ------------------------------------- |
| `lead.enrich` | New lead → summarise, score, classify |

## Providers

| id        | Notes                                                                                                                           |
| --------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `minimax` | Hosted, OpenAI-compatible chat completions                                                                                      |
| `ollama`  | Self-hosted. No API key — required so "your data never leaves your infrastructure" is a configuration choice, not a sales claim |

## Design decisions

- **Model output is untrusted input.** A score is used only if it parses to an
  integer in 0–100; anything else is discarded rather than coerced into a
  plausible-looking number that would silently mis-rank a pipeline.
- **Every call is bounded** by a timeout, and enrichment failure is swallowed
  and logged. The lead is committed before enrichment runs, so a provider
  outage costs a summary, never an enquiry.
- **Nothing is auto-actioned.** AI drafts, summarises, scores and classifies;
  a person decides, and the audit log records who.
- **Prompts are versioned in code** and reviewed like code — a prompt change
  alters product behaviour as surely as a code change.
- **MiniMax can return HTTP 200 with an error in the body**, so `base_resp` is
  checked explicitly; trusting the status code alone surfaces an auth failure
  as an empty completion.

## Open questions

- Content drafting is specified with a prompt but has no console UI yet.
- No per-operation cost accounting; token counts are captured but unused.
