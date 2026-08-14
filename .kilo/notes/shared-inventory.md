# Shared Inventory — `Apex Web Tweaks` migration phase 1

Generated: 2026-08-13. Audit of the four sibling repos
(`apex-group`, `apex-tours`, `apex-holdings`, `apex-outsourcing`) against
the donor `@apex/web` in `APEX GLOBAL/apps/web`.

## Byte-for-byte or near-identical across siblings

These files exist in 3+ siblings with changes confined to a single
constant (typically the SITE name). Promote to `@apex/site-kit`.

| File (relative to each repo root) | apex-group | apex-tours           | apex-holdings | apex-outsourcing       | Diff to donor                                                                                                                                                                                                                                                                                    |
| --------------------------------- | ---------- | -------------------- | ------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/lib/apex-group.ts`           | 46 lines   | 46 lines             | 46 lines      | 46 lines               | All four differ only in which entry has `self: true` (lines 19, 34, 44). Donor (`apps/web/src/lib/site.ts`, the `GROUP_COMPANIES` const) holds six entries including Cloud; siblings match.                                                                                                      |
| `src/lib/apex-lead.ts`            | 218 lines  | 218 lines            | 218 lines     | 221 lines              | apex-outsourcing imports its own `lib/logger` and uses `log.warn/error`; the other three use `console.warn/error`. Logic is identical. Donor has the **better** split (`attribution.ts` client-safe + `attribution.server.ts` node-only); siblings have one combined `'use client'` file.        |
| `src/lib/attribution.ts`          | 88 lines   | 88 lines             | 88 lines      | 88 lines               | All four are byte-identical with `'use client'` and `useEffect`. Donor has split into two server-only files plus a pure-TS client module.                                                                                                                                                        |
| `src/lib/lead-schema.ts`          | absent     | absent               | absent        | absent                 | Donor-only. There is **no Zod schema in any sibling** — they validate ad-hoc in the route handler. **Promote the donor schema; siblings get a tested validator for free.**                                                                                                                       |
| `src/lib/form-guards.ts`          | absent     | absent               | absent        | `form-guards.ts` later | Donor pattern: rate-limit + Turnstile in one module. Outsourcing has its own `rate-limit.ts` (Map, no Redis) + `csrf.ts`. Holdings has `http.ts` + `submissions.ts`. Tours has nothing.                                                                                                          |
| `src/lib/social.ts`               | absent     | absent               | absent        | 12 lines               | Donor has the socials inlined inside `components/site-footer.tsx` (`SOCIALS` const, lines 28-56). Outsourcing is the only sibling with a dedicated module, and it ships only a `{ facebook, instagram, linkedin, twitter }` record. **Promote a single `@apex/site-kit/social` registry.**       |
| `src/lib/brand.ts`                | absent     | 60 lines             | absent        | 82 lines               | Tours and Outsourcing carry `{ name, tagline, primaryColor, accentColor, phone, email, whatsapp, address }` constants; the other two carry them inline in each page. Donor has none of these — it pulls from DB via `lib/content.ts`. **Promote a typed `Brand` record + per-site JSON loader.** |
| `src/components/ApexChat.tsx`     | present    | absent (header only) | present       | present                | All four have their own copy. Donor has a `chat-launcher.tsx` + `chat-launcher-gate.tsx`. Outsourcing's is the most complete; tours has no chat widget at all.                                                                                                                                   |

## Donor-only files (Tech has the most infra, siblings don't have it)

These live in `@apex/web` today and represent work the siblings did not
do. Promote where they apply cross-site; keep Tech-only when they don't.

| Donor file                                 | Promote? | Reason                                                                                                                                        |
| ------------------------------------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/web/src/lib/site.ts`                 | Yes      | Houses `GROUP_COMPANIES`, `FOOTER_LEGAL`, `NAV` (10 nav items, 17 child items for Solutions / Services). Cross-site by definition.            |
| `apps/web/src/lib/attribution.ts` (client) | Yes      | The pure-TS client half is reusable. Replaces the siblings' `'use client'`/React-hook version that can't live in a TS-only library.           |
| `apps/web/src/lib/attribution.server.ts`   | Yes      | `hashIp`, `clientIp`, `clientCountry`, `dedupeKey`. All four siblings need this for rate-limiting.                                            |
| `apps/web/src/lib/partner-signature.ts`    | Yes      | `sign`, `verifyPartnerSignature`. Today the four siblings inline the same HMAC code inside their `apex-lead.ts`. Promote to one place.        |
| `apps/web/src/lib/lead-schema.ts`          | Yes      | The Zod schema is the only validated contract. Siblings get schema validation for free.                                                       |
| `apps/web/src/lib/form-guards.ts`          | Yes      | `rateLimited`, `verifyTurnstile`. Siblings have nothing identical (Outsourcing has a different Map-based limiter; three have nothing at all). |
| `apps/web/src/lib/tech-stack.ts`           | No       | Tech-site only; describes clouds + databases the Tech site sells. Don't pollute the shared namespace.                                         |
| `apps/web/src/lib/repo-graph.ts`           | No       | Reads the donor's `repo-graph.json`, which describes this monorepo.                                                                           |
| `apps/web/src/lib/content.ts`              | No       | Donor-only DB-backed Settings loader. Migrated siblings stay file-based (per Phase 2 decision).                                               |
| `apps/web/src/lib/portal/*`                | No       | Donor-only client portal OAuth flow.                                                                                                          |

## Sibling-only behaviour worth keeping

These are features the donor does not have but the siblings do. Add
them back into the migrated apps from the sibling sources; do not break
them in the move.

| Source (sibling)                                                    | Feature                                                                                                                                                                               |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apex-tours/src/components/site-header.tsx`, `site-footer.tsx`      | Header drop-down with _Vehicles_, _Packages_, _Services_ + Country/HQ selectors and a WhatsApp CTA.                                                                                   |
| `apex-tours/src/components/enquire-button.tsx`, `enquiry-modal.tsx` | Floating "Send an enquiry" launcher wired into every page; this is the very behaviour the docx says is broken on the Saudia car rental page (`/saudi-car-rental`).                    |
| `apex-outsourcing/lib/nav.ts` (133 lines)                           | Full nav array with descriptions used in cards. Replace the donor's `NAV` shape with a typed `NavItemWithDescription` that supports both.                                             |
| `apex-outsourcing/lib/csrf.ts`                                      | Per-session CSRF token used in the contact form. Different from Turnstile; both should coexist.                                                                                       |
| `apex-outsourcing/components/Navbar.tsx`                            | Top nav with multi-level dropdown + CTA button. Donor has it but it's site-specific. Migrated apps keep their own.                                                                    |
| `apex-holdings/src/components/ProjectCard.tsx`                      | Property listing card with image, title, location, status, cta. The docx flags the Projects tab scroll bug, which is most likely the `<section>` height containment around this card. |

## Test inventory

| Repo                           | Test files present      | Notes                                                                                                                                                     |
| ------------------------------ | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `APEX GLOBAL/apps/web` (donor) | **7 files / 41 tests**  | `site.test.ts`, `partner-signature.test.ts`, `tech-stack.test.ts`, `invitation-url.test.ts`, `form-guards.test.ts`, `oauth.test.ts`, `repo-graph.test.ts` |
| `apex-outsourcing`             | 1 (`tests/e2e.spec.ts`) | Playwright. The only sibling with any tests at all.                                                                                                       |
| `apex-group`                   | 0                       | None.                                                                                                                                                     |
| `apex-tours`                   | 0                       | None.                                                                                                                                                     |
| `apex-holdings`                | 0                       | None.                                                                                                                                                     |

Promote tests for promoted code: `attribution.test.ts`, `partner-signature.test.ts`,
`lead-schema.test.ts`, `form-guards.test.ts`, `social.test.ts`, `site.test.ts`,
`brand.test.ts` to `@apex/site-kit/src/*.test.ts`. Each migrator app gets a
`src/lib/site.test.ts` asserting its own entry in `GROUP_COMPANIES` has
`self: true`.

The user said **"all tests pass across repos"**. That mandates **adding**
tests to the three siblings that have none — Holdings, Tours, Group —
during their Phase 4 migration. Baseline per site:

- `src/lib/site.test.ts` — asserts the site's `self: true` entry is present.
- At least one route-shape test (`*.test.tsx` rendered with vitest).
- One behaviour test for one of the docx items (Tours: "Telesales" appears
  in `/services/tele-sales`; Holdings: `ProjectCard.test.tsx` renders the
  status badge; Group: `vehicle-portfolio.test.tsx` asserts each of the
  four cards mounts).
