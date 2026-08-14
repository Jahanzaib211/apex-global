import { describe, expect, it } from "vitest";
import {
  COMPLIANCE_BADGES,
  resolvedComplianceBadges,
  verifiedComplianceBadges,
} from "./compliance";

describe("compliance programme", () => {
  it("documents every candidate badge Apex may one day claim", () => {
    const ids = COMPLIANCE_BADGES.map((b) => b.id);
    expect(ids).toContain("soc-2-type-ii");
    expect(ids).toContain("iso-27001");
    expect(ids).toContain("hipaa");
    expect(ids).toContain("gdpr");
  });

  it("renders every badge by default — never silently invisible", () => {
    const resolved = resolvedComplianceBadges();
    expect(resolved.length).toBe(COMPLIANCE_BADGES.length);
    // Default state has no env flags set → in_progress for all.
    expect(resolved.every((b) => b.status === "in_progress")).toBe(true);
  });

  it("verifiedComplianceBadges returns only the env-flipped subset", () => {
    expect(verifiedComplianceBadges().length).toBe(0);

    process.env.NEXT_PUBLIC_VERIFY_SOC2 = "true";
    delete process.env.NEXT_PUBLIC_VERIFY_ISO27001;
    delete process.env.NEXT_PUBLIC_VERIFY_HIPAA;
    delete process.env.NEXT_PUBLIC_VERIFY_GDPR;
    const verified = verifiedComplianceBadges();
    expect(verified.map((b) => b.id)).toEqual(["soc-2-type-ii"]);
    expect(verified.every((b) => b.status === "verified")).toBe(true);
    delete process.env.NEXT_PUBLIC_VERIFY_SOC2;
  });

  it("verified badge href points at the audit doc, not the home page", () => {
    process.env.NEXT_PUBLIC_VERIFY_SOC2 = "true";
    const soc2 = resolvedComplianceBadges().find((b) => b.id === "soc-2-type-ii");
    expect(soc2?.status).toBe("verified");
    expect(soc2?.href).toMatch(/\/legal\/security/);
    delete process.env.NEXT_PUBLIC_VERIFY_SOC2;
  });

  it("in_progress badge is honest — never marked verified without the env flag", () => {
    const hipaa = resolvedComplianceBadges().find((b) => b.id === "hipaa");
    expect(hipaa?.status).toBe("in_progress");
  });
});
