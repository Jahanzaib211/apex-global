/**
 * Compliance programme — surfaced under the marquee on the Tech site.
 *
 * Apex Web Tweaks 2026-08-13 flagged the absence of a compliance strip.
 * Each entry below has one of two states:
 *
 *   - **in_progress** — Apex has signed up for or is pursuing this
 *     audit/framework; the pill renders in the strip with a clear
 *     "In progress" status. Showing this is honest, not a marketing
 *     claim of completion.
 *   - **verified** — Apex's audit closed. Set the corresponding
 *     `NEXT_PUBLIC_VERIFY_<X>=true` env var at build time to flip
 *     the pill; the strip then renders it as "Verified" and the badge
 *     href points at the audit doc.
 *
 * The component itself never claims an audit has closed unless one
 * of the env vars is explicitly set. Without flags, the strip says
 * "Compliance programme — In progress", which is a true statement
 * from the moment a vendor NDA or audit-engagement letter exists.
 */

export type ComplianceStatus = "in_progress" | "verified";

export interface ComplianceBadge {
  readonly id: string;
  readonly name: string;
  readonly href: string;
  /** What the strip should say about this badge. */
  readonly status: ComplianceStatus;
  /** Env var that flips the badge from "in_progress" to "verified". */
  readonly verifyEnvVar: string;
}

export const COMPLIANCE_BADGES: readonly ComplianceBadge[] = [
  {
    id: "soc-2-type-ii",
    name: "SOC 2 Type II",
    href: "/legal/security#soc2",
    status: "in_progress",
    verifyEnvVar: "NEXT_PUBLIC_VERIFY_SOC2",
  },
  {
    id: "iso-27001",
    name: "ISO 27001",
    href: "/legal/security#iso27001",
    status: "in_progress",
    verifyEnvVar: "NEXT_PUBLIC_VERIFY_ISO27001",
  },
  {
    id: "hipaa",
    name: "HIPAA",
    href: "/legal/security#hipaa",
    status: "in_progress",
    verifyEnvVar: "NEXT_PUBLIC_VERIFY_HIPAA",
  },
  {
    id: "gdpr",
    name: "GDPR",
    href: "/legal/data-processing",
    status: "in_progress",
    verifyEnvVar: "NEXT_PUBLIC_VERIFY_GDPR",
  },
];

export function resolvedComplianceBadges(): ComplianceBadge[] {
  return COMPLIANCE_BADGES.map((b) => {
    const flag = process.env[b.verifyEnvVar];
    return { ...b, status: flag === "true" ? "verified" : "in_progress" } as ComplianceBadge;
  });
}

/**
 * Backwards-compat: returns the subset of badges that have been flipped to
 * verified via env. Old callers (and the test suite) check the verified
 * list specifically.
 */
export function verifiedComplianceBadges(): ComplianceBadge[] {
  return resolvedComplianceBadges().filter((b) => b.status === "verified");
}
