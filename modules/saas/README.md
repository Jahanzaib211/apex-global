# saas

**Status: active** · depends on: `core`, `cms`

## Purpose

The product catalogue. Designed so Apex can launch product number five without
the corporate site being rebuilt — a product is a record with its own pages,
pricing, docs and demo funnel.

## Data model

`SaasProduct` with `ProductFeature`, `ProductScreenshot`, `PricingPlan`
(+ `PlanFeature`), `ProductIntegration`, `DocPage`, `Faq`, `DemoRequest`.

## Permissions

`saas:read` · `saas:write`

## Routes

Products are managed under `/content` alongside every other publishable
record. A separate nav entry would be a link to a page that does not exist.

## Design decisions

- **A demo request is a lead with a product attached**, joining the same
  pipeline rather than sitting in a second inbox nobody checks.
- **`isShipped: false` features render separately**, under a heading that says
  "not yet available". The credibility audit refuses to publish an unshipped
  feature whose description does not admit it — a roadmap item presented as
  shipped is the fastest way to lose a technical evaluation.
- **`isRealCapture: false` screenshots must say so** in their caption.
- **Null price means "on application"**, never a fabricated number.
- **Provenance is mandatory**, same as technology-proof entries.

## Open questions

- Multi-tenant provisioning, subscription state and entitlement enforcement
  are not built — that is the `billing` module plus per-product work.
- `DocPage` exists but no docs renderer is built on the public site.
