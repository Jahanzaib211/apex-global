# Tech Site (`@apex/web`) Gaps Against the docx

Generated: 2026-08-13. Mapping every "Tech Solution" and cross-cutting
docx item to a concrete file in `APEX GLOBAL/apps/web/src/`.

## Docx items that touch `@apex/web` directly

1. **"No Major Tweaks – Suggestion for adding certifications like HIPAA, SOC
   Type II, etc."**
   - Today: `apps/web/src/components/tech-stack-marquee.tsx` renders a
     tech-stack marquee. The word "Certif" appears twice in the served
     HTML (`/home/jahanzaib/Desktop/APEX GLOBAL` audit, 2026-08-13),
     suggesting a section with the word "Certifications" exists but
     no badges do.
   - Fix: add `apps/web/src/components/compliance-strip.tsx` and wire
     it into `apps/web/src/app/(site)/page.tsx` after the marquee.
     Surface only the certifications Apex actually holds — open
     question Q1 below.
   - Reference: `apps/web/src/lib/tech-stack.ts` (donor's `TECH_STACK`
     const is the obvious home for the badge metadata).

2. **Same-Tab / Explore More bug on Tech (broken; Holdings + Tours ok)**
   - Today: `apps/web/src/app/(site)/page.tsx` does not render a
     `href="/companies/*"` link in the audit's curl probe. The
     `Companies` section uses an in-page anchor or a separate page.
   - Fix: read both `apps/web/src/app/(site)/page.tsx` and the four
     sibling companies blocks (`apex-group/src/components/companies/`,
     `apex-tours/src/app/(default)/page.tsx`'s tour types cards, etc.)
     and unify on whichever pattern works.

3. **Footer LinkedIn / Facebook / Instagram — Tech works**
   - Today: `apps/web/src/components/site-footer.tsx` lines 28–56 lists
     the three. Proven by curl probe.
   - Fix: nothing to do here — but **promote** the hard-coded array into
     `@apex/site-kit/social.ts` so the four migrated siblings can
     consume the same `SOCIALS` and not hand-roll their own footer
     links (the audit showed Holdings has placeholder `facebook.com`
     root URLs, and Tours/Outsourcing/Group have **zero** social
     links).

## Cross-cutting items the migration must fix

4. **Footer socials inconsistency across sites**
   - Per audit (2026-08-13): Holdings has placeholder
     `https://facebook.com` (root); Tours, Main, Outsourcing have
     **zero** social links; Tech is the only fully-populated one.
   - Fix: land `@apex/site-kit/social.ts` during Phase 2 and rewire
     all five footers through it in Phase 4.

5. **Six `[Placeholder]` cards on the Main Site careers page**
   - Tech has no careers page; this lands in `apps/group/` when Group
     migrates in Phase 4. The donor's pattern (`apps/web`'s careers
     page) treats the page as static text rather than a CMS-backed
     list — copy that.

6. **Header / footer logo mismatches on the Main Site**
   - Audit found `<img alt="Apex Group" ... src="/logo.png"/>` and
     `<img alt="Apex Group of Companies" ... src="/logo.png"/>` on the
     same page — text in `alt` does not match the rendered label.
   - Fix: introduce `@apex/site-kit/brand.ts` carrying
     `{ name, shortLabel, logoSrc, logoAlt }`. Each site picks its own
     copy in its `BRAND.json`. The donor's `apps/web/src/lib/site.ts`
     does not have a `BRAND` constant; add one.

## Items resolved by the migration itself (no extra design needed)

- **"Our Companies TAB is just hovering the companies with redirection"**
  on Main Site. The Tech site already has the right pattern (`NAV` +
  footer with `GROUP_COMPANIES`), so a migrated `apps/group/` will
  inherit it.

- **Blogs required for News and Insights** (Main Site and Tours). The
  Tech site has `/insights` already wired but it is contentless.
  Migrated apps don't need to add a blog engine; they inherit the
  donor's content shape when wired to `@apex/site-kit`.

## Not addressed by anything in this plan (deferred to user input)

- **"Content Improvement in Case Studies"** (Main Site) — copy.
- **"Example Breakdown for Hajj and Umrah have one spelling mistake in
  conditions section as image attached above"** (Tours) — needs the
  docx-attached image.
- **"Spelling correction on first page"** (Holdings) — needs the image
  referenced by the docx.
- **"Active Offices reflects Karachi, Lahore and Riyadh"** — both the
  Main Site and Tours list cities; the docx uses one phrasing for
  Main and a separate "HQ City needs updation" line under Tours. The
  implementer must confirm which one.
- **"Linkedin, Facebook and Insta links needs to be added as button
  brings you on top"** (Tours) — Q2 in the plan; the implementer
  must adopt the canonical URLs the user provides.
