import { describe, expect, it } from "vitest";
import { assertCredibility, scanText, type Violation } from "./credibility";

/**
 * The credibility engine is the control that keeps unverifiable claims off the
 * public site, so its own failure modes matter. These tests assert that each
 * rule fires — a gate that silently passes everything is worse than no gate.
 */

const rules = (v: Violation[]) => v.map((x) => x.rule);

describe("scanText", () => {
  it("rejects absolute security claims", () => {
    expect(rules(scanText("X", "body", "Our platform is 100% secure."))).toContain("banned-language");
    expect(rules(scanText("X", "body", "An unhackable system."))).toContain("banned-language");
  });

  it("rejects unqualified superlatives", () => {
    expect(rules(scanText("X", "body", "The world's best consultancy."))).toContain("banned-language");
    expect(rules(scanText("X", "body", "Our industry-leading platform."))).toContain("banned-language");
    expect(rules(scanText("X", "body", "A best-in-class approach."))).toContain("banned-language");
  });

  it("rejects unsupportable guarantees", () => {
    expect(rules(scanText("X", "body", "We guarantee uptime."))).toContain("banned-language");
    expect(rules(scanText("X", "body", "Zero downtime migrations."))).toContain("banned-language");
  });

  it("catches leaked development credentials", () => {
    expect(rules(scanText("X", "body", "login with TestPass123!"))).toContain("credential-leak");
    expect(rules(scanText("X", "body", "key sk-abcdefghijklmnopqrstuv"))).toContain("credential-leak");
    expect(rules(scanText("X", "body", "-----BEGIN RSA PRIVATE KEY-----"))).toContain("credential-leak");
  });

  it("permits the sister front's brand and domains", () => {
    // Apex and Fox Hosting are two fronts of one company, so naming Fox
    // Hosting or linking to its live services is not a foreign-brand leak.
    // The rule that used to block this was removed by decision; the mechanism
    // remains for genuinely unrelated brands.
    const copy = "Fox Hosting runs on this platform — see it live at client.alilabsx.com.";
    expect(rules(scanText("X", "body", copy))).not.toContain("foreign-brand");
  });

  it("permits precise, defensible capability language", () => {
    const copy =
      "We run a Kubernetes cluster with GitOps delivery, Prometheus and Loki observability, " +
      "and nightly backups verified by periodic restore drills.";
    expect(scanText("X", "body", copy)).toHaveLength(0);
  });

  it("treats absent text as clean rather than throwing", () => {
    expect(scanText("X", "body", null)).toHaveLength(0);
    expect(scanText("X", "body", undefined)).toHaveLength(0);
  });

  it("reports the offending phrase so the fix is obvious", () => {
    const [violation] = scanText("Solution(x)", "body", "We are industry-leading.");
    expect(violation?.entity).toBe("Solution(x).body");
    expect(violation?.detail).toContain("industry-leading");
  });
});

/**
 * A structural stub standing in for PrismaClient. Only the finders the engine
 * calls are implemented, which keeps these tests free of a live database.
 */
function stubPrisma(overrides: Record<string, unknown[]> = {}) {
  const empty = () => Promise.resolve([]);
  const from = (key: string) => () => Promise.resolve(overrides[key] ?? []);

  return {
    techProofEntry: { findMany: from("techProofEntry") },
    saasProduct: { findMany: from("saasProduct") },
    caseStudy: { findMany: from("caseStudy") },
    testimonial: { findMany: from("testimonial") },
    solution: { findMany: from("solution") },
    insight: { findMany: empty },
    landingPage: { findMany: empty },
     
  } as any;
}

describe("assertCredibility", () => {
  it("passes when nothing is published", async () => {
    expect(await assertCredibility(stubPrisma())).toHaveLength(0);
  });

  it("blocks a named client without recorded consent", async () => {
    const violations = await assertCredibility(
      stubPrisma({
        caseStudy: [
          {
            slug: "acme",
            clientName: "Acme Corporation",
            clientConsent: false,
            anonymousLabel: "a manufacturer",
            metrics: [],
            summary: "",
            challenge: "",
            strategy: "",
            technology: "",
            implementation: "",
            result: "",
          },
        ],
      }),
    );

    expect(rules(violations)).toContain("missing-consent");
    expect(violations[0]?.detail).toContain("Acme Corporation");
  });

  it("allows a named client once consent is on record", async () => {
    const violations = await assertCredibility(
      stubPrisma({
        caseStudy: [
          {
            slug: "acme",
            clientName: "Acme Corporation",
            clientConsent: true,
            consentRecordedAt: new Date(),
            anonymousLabel: "a manufacturer",
            metrics: [],
            summary: "",
            challenge: "",
            strategy: "",
            technology: "",
            implementation: "",
            result: "",
          },
        ],
      }),
    );

    expect(rules(violations)).not.toContain("missing-consent");
  });

  it("blocks third-party software published without attribution", async () => {
    const violations = await assertCredibility(
      stubPrisma({
        techProofEntry: [
          {
            slug: "scanner",
            origin: "THIRD_PARTY_OSS",
            upstreamName: null,
            isPubliclyReachable: false,
            publicUrl: null,
            evidence: [{ label: "x", value: "y", source: "z" }],
            summary: "",
            detail: "",
          },
        ],
      }),
    );

    expect(rules(violations)).toContain("missing-attribution");
  });

  it("requires a licence wherever an upstream project is credited", async () => {
    const violations = await assertCredibility(
      stubPrisma({
        techProofEntry: [
          {
            slug: "agent",
            origin: "BUILT_BY_APEX",
            upstreamName: "DeerFlow",
            upstreamLicense: null,
            isPubliclyReachable: false,
            publicUrl: null,
            evidence: [{ label: "x", value: "y", source: "z" }],
            summary: "",
            detail: "",
          },
        ],
      }),
    );

    expect(rules(violations)).toContain("missing-licence");
  });

  it("blocks a public-reachability claim with no URL to check", async () => {
    const violations = await assertCredibility(
      stubPrisma({
        techProofEntry: [
          {
            slug: "platform",
            origin: "BUILT_BY_APEX",
            isPubliclyReachable: true,
            publicUrl: null,
            evidence: [{ label: "x", value: "y", source: "z" }],
            summary: "",
            detail: "",
          },
        ],
      }),
    );

    expect(rules(violations)).toContain("unverifiable-claim");
  });

  it("blocks a metric with no source", async () => {
    const violations = await assertCredibility(
      stubPrisma({
        techProofEntry: [
          {
            slug: "platform",
            origin: "BUILT_BY_APEX",
            isPubliclyReachable: false,
            publicUrl: null,
            evidence: [{ label: "Uptime", value: "99.99%", source: "  " }],
            summary: "",
            detail: "",
          },
        ],
      }),
    );

    expect(rules(violations)).toContain("unsourced-metric");
  });

  it("blocks a published entry that offers no evidence at all", async () => {
    const violations = await assertCredibility(
      stubPrisma({
        techProofEntry: [
          {
            slug: "claim",
            origin: "BUILT_BY_APEX",
            isPubliclyReachable: false,
            publicUrl: null,
            evidence: [],
            summary: "",
            detail: "",
          },
        ],
      }),
    );

    expect(rules(violations)).toContain("no-evidence");
  });

  it("blocks an unshipped feature that does not admit it", async () => {
    const violations = await assertCredibility(
      stubPrisma({
        saasProduct: [
          {
            slug: "p",
            isPubliclyReachable: false,
            publicUrl: null,
            upstreamName: null,
            features: [{ title: "SSO", description: "Single sign-on.", isShipped: false }],
            screenshots: [],
            summary: "",
            problem: "",
            solution: "",
          },
        ],
      }),
    );

    expect(rules(violations)).toContain("unshipped-feature");
  });

  it("accepts an unshipped feature that is labelled as roadmap", async () => {
    const violations = await assertCredibility(
      stubPrisma({
        saasProduct: [
          {
            slug: "p",
            isPubliclyReachable: false,
            publicUrl: null,
            upstreamName: null,
            features: [{ title: "SSO", description: "On the roadmap for Q4.", isShipped: false }],
            screenshots: [],
            summary: "",
            problem: "",
            solution: "",
          },
        ],
      }),
    );

    expect(rules(violations)).not.toContain("unshipped-feature");
  });

  it("blocks a testimonial published without consent", async () => {
    const violations = await assertCredibility(
      stubPrisma({ testimonial: [{ authorName: "A. Person", consent: false }] }),
    );

    expect(rules(violations)).toContain("missing-consent");
  });
});
