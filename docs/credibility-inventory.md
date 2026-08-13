# Credibility inventory — public-facing claims vs. source documents

> **This is a report only. No public content was edited.** The goal is to make
> every number on the public site traceable to a source document. Where a claim
> is currently unsourced, the recommendation is to _cite it_ (paste the inline
> citation) or _remove it_ — never to leave a bare number.

## Method

Scanned `apps/web/src` for numeric claims across the site shell, `(site)` pages,
components, `saas/[slug]`, `case-studies`, `industries`, `insights`, `about`,
and hero counters. Cross-checked each against the four supplied source docs:

- `AI Infrastructure Transformation Services — Global Market Analysis & Pricing Framework.pdf`
- `Modular AI Infrastructure Services — Productized Cloud Engineering at Cost-Leadership Pricing.pdf`
- `Genesis_X_Internal_Financial_Scoping.html` + `Genesis_X_Invoice.html`
- `Nova_Internal_Financial_Scoping.html` + `Nova_Invoice.html`

## Findings

### A. Claims already gated by `<Stat source="…">` (verifiable, keep)

| file:line                       | claim                                                  | value                | source documented                                   |
| ------------------------------- | ------------------------------------------------------ | -------------------- | --------------------------------------------------- |
| `app/(site)/page.tsx:192`       | Lines of original engineering on our AI agent platform | `+35,738`            | `git diff against the upstream release tag`         |
| `app/(site)/page.tsx:197`       | Open inbound ports on our production origin            | `0`                  | `Network configuration review, Aug 2026`            |
| `app/(site)/page.tsx:202`       | Response time measured on a live production endpoint   | `1.3s`               | `Direct HTTP request, Aug 2026`                     |
| `app/(site)/about/page.tsx:95`  | Areas of technology capability                         | `{solutions.length}` | `Published solution pages on this site`             |
| `app/(site)/about/page.tsx:100` | Systems you can visit and check right now              | `{liveSystems}`      | `Publicly reachable entries on our Technology page` |
| `app/(site)/about/page.tsx:105` | Lines of original engineering on our AI platform       | `+35,738`            | `git diff against the upstream release tag`         |

These satisfy the traceability bar. The sources are _how_ the number was produced
(git diff, live probe) rather than a market report, which is honest for
infrastructure facts. **Action: none** — but consider adding the date of the
git diff to make them reproducible.

### B. Decorative numbers that are NOT claims (no action)

- `components/hero.tsx` glyph-column positions (`6%`, `22%`, … `94%`) and
  `tech-stack-marquee.tsx` `translateX(-50%)` are pure CSS animation/positioning
  values, not factual assertions. **Action: none.**

### C. Potential gaps / unsourced claims to resolve

| file:line                                                            | what                                                      | status      | recommendation                                                                                                                                                   |
| -------------------------------------------------------------------- | --------------------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/(site)/case-studies/[slug]/page.tsx:104`                        | metric value rendered as `"0"`                            | placeholder | This is a template default, not a real customer metric. Either wire it to a sourced case-study dataset or remove the metric block so no fabricated number ships. |
| SaaS product pages (`app/(site)/saas/[slug]` + any `/pricing` route) | **no price tiers, no "X% cheaper / faster" claims found** | clean       | Good — no pricing claims to source. If pricing is added later, every figure must trace to the two pricing-framework PDFs (cost-leadership sheets).               |
| Testimonials / insights / industries                                 | **no quantified claims with numbers found**               | clean       | No `N% reduction` / `N hours saved` strings exist in the current tree. If added, cite the relevant client scoping doc (Genesis_X / Nova).                        |

### D. Cross-check against the four source documents

The two pricing-framework PDFs define the _cost-leadership_ positioning and the
modular-service pricing sheets. The current site does **not** assert any market
size, TAM, or "industry-average" comparison numbers, so there is nothing to
reconcile against those PDFs yet. The two client scoping/Invoice docs
(Genesis_X, Nova) describe internal financials, not published claims — they are
the _evidence_ to cite if/when a case-study metric is shown.

**Net:** the only concrete defect is the `case-studies` `"0"` placeholder
(finding C, row 1). Everything else that is a real number is already cited via
`<Stat source=…>`; everything else is decorative or absent.

## Operator decisions required

1. **Case-study metric:** replace the `"0"` placeholder with a properly sourced
   value (cite Genesis_X/Nova scoping doc), or delete the metric block.
2. **Dates on infrastructure Stats:** add the git-diff date / probe date to the
   existing `source` strings so they are reproducible.
3. **If pricing is published later:** every figure must cite one of the two
   pricing-framework PDFs; do not publish a number that isn't in those sheets.
