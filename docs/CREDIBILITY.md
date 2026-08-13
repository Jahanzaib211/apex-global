# Credibility Rules

**These are enforced by code, not by good intentions.** `scripts/credibility-audit.mjs` runs in CI
and in the seed pipeline; a violation fails the build.

Our competitive advantage is real engineering capability. A technical buyer can verify most claims on
this site in about five minutes, and being caught inflating a portfolio costs more than the contract
it wins. Every published statement must be defensible.

---

## 1. Origin is mandatory and public

Every technology-proof entry and every SaaS product carries a required `origin` field:

| Value              | Meaning                                        | How it renders                                            |
| ------------------ | ---------------------------------------------- | --------------------------------------------------------- |
| `BUILT_BY_APEX`    | Apex designed and wrote it                     | "Built by Apex"                                           |
| `OPERATED_BY_APEX` | Apex deploys, configures, secures and runs it  | "Operated by Apex"                                        |
| `THIRD_PARTY_OSS`  | Someone else's software; we run it for clients | "Third-party open source — deployed and operated by Apex" |

Derived work additionally sets `upstreamName`, `upstreamUrl` and `upstreamLicense`. The public page
renders the attribution inline — not in a footnote, not in a tooltip.

## 2. Publication gates

- Only `status = LIVE` content renders publicly. `DRAFT` and `INTERNAL` never leak to `apps/web`.
- A named client requires `clientConsent = true`, recorded with `consentRecordedAt` and
  `consentReference`. Without it the case study renders anonymised
  ("a European logistics operator", not the company name).
- A third party's customers are never presented, implied or arranged so as to suggest they are Apex's
  customers.

## 3. Metrics must trace to something checkable

Every published number carries a `source` describing where it came from and when it was measured.
Forbidden without evidence: uptime percentages, client counts, headcount, revenue figures,
"years of experience", awards, certifications, partnerships.

## 4. Language bans

The audit fails on these in publishable content:

- `100% secure`, `unhackable`, `bank-grade security`, `military-grade`
- `world's best`, `#1`, `industry-leading` (unqualified superlatives)
- `guaranteed` applied to uptime, security or results
- Invented client logos or testimonials of any kind

## 5. Secrets never reach published content

The audit scans for the demo credentials that exist in local development READMEs and for anything
matching common key patterns. Any hit in a publishable record fails the build.

## 6. Permanently excluded from this site

| Excluded                                       | Why                                                  |
| ---------------------------------------------- | ---------------------------------------------------- |
| The cloned third-party AGPL financial terminal | Not authored here — a clone with no authored history |
| Ownership claims over upstream security tools  | We deploy and operate them; we did not write them    |
| Trading bots and market experiments            | Regulatory exposure, no client relevance             |
| Dispatch / transport / logistics material      | Out of brand by decision                             |
| BPO / call-centre positioning                  | Out of brand by decision — Apex is technology-first  |

## 7. What we _can_ say, and how

| Instead of                     | Say                                                                                                                            |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| "We are experts in cloud"      | "We run a Kubernetes cluster with GitOps deployment, Prometheus/Grafana/Loki observability and nightly restore-tested backups" |
| "Trusted by leading companies" | Named clients with recorded consent, or nothing                                                                                |
| "Enterprise-grade security"    | The specific controls: RBAC, audit logging, 2FA, encrypted secrets, rate limiting                                              |
| "We built an AI platform"      | "We built an AI agent platform on the open-source DeerFlow harness (MIT) — 35,738 lines of original work across 338 files"     |

Capability, stated precisely, is more persuasive than a superlative. It is also true.
