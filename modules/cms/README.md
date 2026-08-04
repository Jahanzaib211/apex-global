# cms

**Status: active** · depends on: `core`

## Purpose

Everything the public site renders. Content is data, so a new solution page,
case study or landing page is a record rather than a deploy.

## Data model

`Page`, `Solution`, `Industry`, `CaseStudy` (+ `CaseStudyMetric`), `Insight`,
`Testimonial`, `JobPosting`, `Faq`, `LandingPage`, `TechProofEntry`
(+ `TechProofEvidence`), `Seo`.

Every publishable entity carries `status` (`DRAFT` / `LIVE` / `INTERNAL` /
`ARCHIVED`) and `publishedAt`. Only `LIVE` reaches the public site, enforced in
the read layer (`apps/web/src/lib/content.ts`) rather than by remembering a
where clause at each call site.

## Permissions

`cms:read` · `cms:write` · `cms:publish` (publishing is separable from editing
on purpose — an editor can draft without being able to put it live)

## Routes

`/content` — publish state for every content type.

## Design decisions

- **Provenance is a required field**, not a convention. `TechProofEntry` and
  `SaasProduct` carry `origin` (`BUILT_BY_APEX` / `OPERATED_BY_APEX` /
  `THIRD_PARTY_OSS`), rendered inline with the claim.
- **Client names need recorded consent.** `CaseStudy.clientName` only renders
  when `clientConsent` is true with a dated `consentRecordedAt`; otherwise the
  study publishes under `anonymousLabel`.
- **Metrics require a `source`.** A number with no traceable origin cannot be
  constructed, so it cannot be published.

See `docs/CREDIBILITY.md` for the rules and `packages/db/prisma/credibility.ts`
for the assertions that enforce them.

## Open questions

- Field-level editing UI is not built — only publish control. Editing happens
  through the seed today.
- No media upload UI yet; `MediaAsset` and the MinIO bucket exist.
