# SEO & Acquisition

The audience is international technology buyers. Nothing here targets a city.

## Positioning in copy

Write "technology solutions for businesses worldwide", never "best IT company in Lahore". Location
appears on the contact page and in the `Organization` schema, and nowhere else. Geographic
qualifiers in titles and headings are a downgrade for this brand — they tell an enterprise buyer we
are a local shop.

## Page inventory and intent

| Page type              | Intent                    | Primary schema                            |
| ---------------------- | ------------------------- | ----------------------------------------- |
| Home                   | Brand, orientation        | `Organization`, `WebSite`                 |
| SaaS product           | Product evaluation, trial | `SoftwareApplication`, `Offer`, `FAQPage` |
| Solution (×9)          | Service research          | `Service`, `FAQPage`                      |
| Industry               | Vertical fit              | `Service`, `BreadcrumbList`               |
| Case study             | Proof, comparison         | `Article`, `BreadcrumbList`               |
| Technology             | Technical due diligence   | `Article`                                 |
| Insight                | Top-of-funnel discovery   | `Article`, `Person`                       |
| Landing page (`/lp/*`) | Paid conversion only      | none — `noindex`                          |
| Careers                | Recruitment               | `JobPosting`                              |

Landing pages are excluded from the sitemap and marked `noindex`: they exist for ad traffic, they
duplicate solution-page content, and letting them into the index competes with the pages that should
rank.

## Technical requirements

- One `h1` per page; heading order never skips a level.
- Canonical URL on every page; parameters stripped.
- Titles ≤ 60 characters, descriptions ≤ 155, both authored in the CMS — never auto-generated from
  the first paragraph.
- `sitemap.xml` generated from published content only, with real `lastModified` values.
- OG image per page, generated from the content at build time.
- Internal linking is structural: every solution links to relevant industries and case studies; every
  case study links back to the solutions it used. This is the main thing that gets deeper pages
  crawled.
- Core Web Vitals are a ranking input and a conversion input at once — see the performance budget in
  the architecture doc. Slow pages lose ad money before they lose rankings.

## Attribution

Every form submission stores `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`,
`gclid`, `fbclid`, referrer, landing path and country. Conversions are sent server-side (Meta CAPI,
Google Ads) as well as client-side, because ad blockers and ITP eat a large share of browser-side
events — server-side is the copy that survives.

Click-to-call and WhatsApp taps are tracked conversions. In several of our markets those outnumber
form fills, and a funnel that only counts forms will under-report real demand and mis-optimise the
ad spend.

Analytics tags load only after consent. Umami, self-hosted and first-party, records traffic
regardless so the baseline is never lost.
