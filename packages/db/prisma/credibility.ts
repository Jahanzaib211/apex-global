import type { PrismaClient } from "../generated/client/index.js";

/**
 * Credibility assertions — the executable half of docs/CREDIBILITY.md.
 *
 * Runs in the seed and in CI (`pnpm audit:credibility`). A violation fails the
 * build, because the rules only mean something if they cannot be forgotten.
 */

export interface Violation {
  rule: string;
  entity: string;
  detail: string;
}

/** Superlatives and absolutes we cannot substantiate, so we do not use them. */
const BANNED_PHRASES: Array<{ pattern: RegExp; why: string }> = [
  { pattern: /\b100%\s*secure\b/i, why: "nothing is 100% secure; claiming it discredits everything else" },
  { pattern: /\bunhackable\b/i, why: "unsubstantiable" },
  { pattern: /\bbank[-\s]grade\s+security\b/i, why: "meaningless — say which controls" },
  { pattern: /\bmilitary[-\s]grade\b/i, why: "marketing language with no technical meaning" },
  { pattern: /\bworld'?s\s+(best|leading|number\s*one)\b/i, why: "unqualified superlative" },
  { pattern: /\bindustry[-\s]leading\b/i, why: "unqualified superlative" },
  { pattern: /\bcutting[-\s]edge\b/i, why: "filler; describe the capability instead" },
  { pattern: /\bguarantee(d)?\s+(uptime|security|results|roi)\b/i, why: "unsupportable guarantee" },
  { pattern: /\bbest[-\s]in[-\s]class\b/i, why: "unqualified superlative" },
  { pattern: /\bzero\s+downtime\b/i, why: "absolute claim; state the measured availability instead" },
];

/**
 * Credentials that exist in local development READMEs on the build machine.
 * If any of these ever appear in publishable content, something has been
 * copy-pasted that should not have been.
 */
const LEAKED_CREDENTIAL_PATTERNS: RegExp[] = [
  /TestPass123!/,
  /FoxAdmin123!/,
  /testuser@example\.com/i,
  /\bsk-[a-zA-Z0-9]{16,}/,
  /AKIA[0-9A-Z]{16}/,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
];

/** Other brands that must never appear in Apex-published content. */
const FOREIGN_BRAND_PATTERNS: RegExp[] = [/alilabs/i, /ali\s*labs/i, /alilabsx/i];

export function scanText(
  entity: string,
  field: string,
  text: string | null | undefined,
): Violation[] {
  if (!text) return [];
  const out: Violation[] = [];

  for (const { pattern, why } of BANNED_PHRASES) {
    const match = text.match(pattern);
    if (match) {
      out.push({
        rule: "banned-language",
        entity: `${entity}.${field}`,
        detail: `"${match[0]}" — ${why}`,
      });
    }
  }

  for (const pattern of LEAKED_CREDENTIAL_PATTERNS) {
    if (pattern.test(text)) {
      out.push({
        rule: "credential-leak",
        entity: `${entity}.${field}`,
        detail: "content matches a known credential pattern",
      });
    }
  }

  for (const pattern of FOREIGN_BRAND_PATTERNS) {
    if (pattern.test(text)) {
      out.push({
        rule: "foreign-brand",
        entity: `${entity}.${field}`,
        detail: "references a brand that is not Apex",
      });
    }
  }

  return out;
}

export async function assertCredibility(prisma: PrismaClient): Promise<Violation[]> {
  const violations: Violation[] = [];

  // ── Technology proof ────────────────────────────────────────────────────
  const entries = await prisma.techProofEntry.findMany({
    where: { status: "LIVE" },
    include: { evidence: true },
  });

  for (const e of entries) {
    const id = `TechProofEntry(${e.slug})`;

    // Derived or third-party work must name its upstream. Without this the
    // page implies authorship by omission.
    if (e.origin === "THIRD_PARTY_OSS" && !e.upstreamName) {
      violations.push({
        rule: "missing-attribution",
        entity: id,
        detail: "origin is THIRD_PARTY_OSS but no upstream project is named",
      });
    }
    if (e.upstreamName && !e.upstreamLicense) {
      violations.push({
        rule: "missing-licence",
        entity: id,
        detail: `credits "${e.upstreamName}" but states no licence`,
      });
    }

    // Claiming public reachability without a URL, or advertising a URL for
    // something private, both mislead a buyer who tries to verify it.
    if (e.isPubliclyReachable && !e.publicUrl) {
      violations.push({
        rule: "unverifiable-claim",
        entity: id,
        detail: "marked publicly reachable but has no public URL to check",
      });
    }
    if (!e.isPubliclyReachable && e.publicUrl) {
      violations.push({
        rule: "misleading-url",
        entity: id,
        detail: "has a public URL but is not marked publicly reachable",
      });
    }

    if (e.evidence.length === 0) {
      violations.push({ rule: "no-evidence", entity: id, detail: "published with no evidence" });
    }
    for (const ev of e.evidence) {
      if (!ev.source?.trim()) {
        violations.push({
          rule: "unsourced-metric",
          entity: `${id}.evidence["${ev.label}"]`,
          detail: "metric has no source",
        });
      }
    }

    violations.push(...scanText(id, "summary", e.summary), ...scanText(id, "detail", e.detail));
  }

  // ── SaaS products ───────────────────────────────────────────────────────
  const liveProducts = await prisma.saasProduct.findMany({
    where: { status: "LIVE" },
    include: { features: true, screenshots: true },
  });

  for (const p of liveProducts) {
    const id = `SaasProduct(${p.slug})`;

    if (p.upstreamName && !p.upstreamLicense) {
      violations.push({
        rule: "missing-licence",
        entity: id,
        detail: `credits "${p.upstreamName}" but states no licence`,
      });
    }
    if (p.isPubliclyReachable && !p.publicUrl) {
      violations.push({
        rule: "unverifiable-claim",
        entity: id,
        detail: "marked publicly reachable but has no public URL",
      });
    }

    // A roadmap item rendered beside shipped features reads as available.
    // Allowed in the data, but it must be explicit, never the default.
    for (const f of p.features.filter((x) => !x.isShipped)) {
      if (!/roadmap|planned|coming/i.test(f.description)) {
        violations.push({
          rule: "unshipped-feature",
          entity: `${id}.feature["${f.title}"]`,
          detail: "not shipped, but the description does not say so",
        });
      }
    }

    for (const s of p.screenshots.filter((x) => !x.isRealCapture)) {
      if (!/mock|illustrat|representat/i.test(s.caption ?? "")) {
        violations.push({
          rule: "staged-screenshot",
          entity: `${id}.screenshot`,
          detail: "not a real capture and the caption does not say so",
        });
      }
    }

    violations.push(
      ...scanText(id, "summary", p.summary),
      ...scanText(id, "problem", p.problem),
      ...scanText(id, "solution", p.solution),
      ...scanText(id, "securityNotes", p.securityNotes),
    );
  }

  // ── Case studies ────────────────────────────────────────────────────────
  const studies = await prisma.caseStudy.findMany({
    where: { status: "LIVE" },
    include: { metrics: true },
  });

  for (const c of studies) {
    const id = `CaseStudy(${c.slug})`;

    // The consent rule. A name may only appear with permission on record.
    if (c.clientName && !c.clientConsent) {
      violations.push({
        rule: "missing-consent",
        entity: id,
        detail: `names "${c.clientName}" without recorded consent`,
      });
    }
    if (c.clientConsent && !c.consentRecordedAt) {
      violations.push({
        rule: "unrecorded-consent",
        entity: id,
        detail: "consent is claimed but not dated",
      });
    }
    if (!c.clientName && !c.anonymousLabel?.trim()) {
      violations.push({
        rule: "missing-label",
        entity: id,
        detail: "anonymous study has no descriptive label",
      });
    }

    for (const m of c.metrics) {
      if (!m.source?.trim()) {
        violations.push({
          rule: "unsourced-metric",
          entity: `${id}.metric["${m.label}"]`,
          detail: "metric has no source",
        });
      }
    }

    for (const [field, text] of Object.entries({
      summary: c.summary,
      challenge: c.challenge,
      strategy: c.strategy,
      technology: c.technology,
      implementation: c.implementation,
      result: c.result,
    })) {
      violations.push(...scanText(id, field, text));
    }
  }

  // ── Testimonials ────────────────────────────────────────────────────────
  const testimonials = await prisma.testimonial.findMany({ where: { status: "LIVE" } });
  for (const t of testimonials) {
    if (!t.consent) {
      violations.push({
        rule: "missing-consent",
        entity: `Testimonial(${t.authorName})`,
        detail: "published without recorded consent",
      });
    }
  }

  // ── Everything else that renders publicly ───────────────────────────────
  const solutions = await prisma.solution.findMany({ where: { status: "LIVE" } });
  for (const s of solutions) {
    violations.push(
      ...scanText(`Solution(${s.slug})`, "summary", s.summary),
      ...scanText(`Solution(${s.slug})`, "body", s.body),
      ...scanText(`Solution(${s.slug})`, "tagline", s.tagline),
    );
  }

  const posts = await prisma.insight.findMany({ where: { status: "LIVE" } });
  for (const p of posts) {
    violations.push(
      ...scanText(`Insight(${p.slug})`, "excerpt", p.excerpt),
      ...scanText(`Insight(${p.slug})`, "body", p.body),
    );
  }

  const pages = await prisma.landingPage.findMany({ where: { status: "LIVE" } });
  for (const l of pages) {
    violations.push(
      ...scanText(`LandingPage(${l.slug})`, "headline", l.headline),
      ...scanText(`LandingPage(${l.slug})`, "subheadline", l.subheadline),
      ...scanText(`LandingPage(${l.slug})`, "body", l.body),
    );
  }

  return violations;
}
