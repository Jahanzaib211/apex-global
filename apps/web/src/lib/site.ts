/**
 * Site-level constants — Tech-specific nav and footer legal paths.
 *
 * Cross-site constants (GROUP_COMPANIES, siteUrl, absoluteUrl) live in
 * `@apex/site-kit/site` so the five Apex sites cannot drift apart. Anything
 * unique to the Tech site stays here.
 *
 * Contact details (phone, email, address) come from the database at runtime
 * (console → Settings), so nothing here is a hardcoded business fact that
 * would go stale.
 */

import {
  type GroupCompany,
  siteUrl as _siteUrl,
  absoluteUrl as _absoluteUrl,
  withSelf,
} from "@apex/site-kit/site";

/** Re-export the cross-site helpers so existing imports keep working. */
export const siteUrl = _siteUrl;
export const absoluteUrl = _absoluteUrl;

/** Six entries; the row for `apex-tech` is marked `self: true`. */
export const GROUP_COMPANIES: readonly GroupCompany[] = withSelf("apex-tech");

export const NAV = [
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Architecture & Design", href: "/services/architecture-design" },
      { label: "Kubernetes Migration", href: "/services/kubernetes-migration" },
      { label: "Gateway & Scaling", href: "/services/gateway-scaling" },
      { label: "CI/CD & GitOps", href: "/services/ci-cd-gitops" },
      { label: "Observability Stack", href: "/services/observability-stack" },
      { label: "Security Hardening", href: "/services/security-hardening" },
      { label: "Helm Charts & Automation", href: "/services/helm-automation" },
      { label: "Documentation & Runbooks", href: "/services/documentation-runbooks" },
    ],
  },
  {
    label: "Solutions",
    href: "/solutions",
    children: [
      { label: "SaaS Development & Products", href: "/solutions/saas-development" },
      { label: "Software Development", href: "/solutions/software-development" },
      { label: "AI & Automation", href: "/solutions/ai-automation" },
      { label: "Cloud Solutions", href: "/solutions/cloud-solutions" },
      { label: "Cybersecurity", href: "/solutions/cybersecurity" },
      { label: "Managed IT", href: "/solutions/managed-it" },
      { label: "DevOps & Infrastructure", href: "/solutions/devops-infrastructure" },
      { label: "Digital Transformation", href: "/solutions/digital-transformation" },
      { label: "Technology Consulting", href: "/solutions/technology-consulting" },
    ],
  },
  { label: "SaaS", href: "/saas" },
  { label: "Industries", href: "/industries" },
  { label: "Technology", href: "/technology" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "About", href: "/about" },
  { label: "Insights", href: "/insights" },
  { label: "Careers", href: "/careers" },
  { label: "Client login", href: "/portal/login" },
] as const;

export const FOOTER_LEGAL = [
  { label: "Privacy", href: "/legal/privacy" },
  { label: "Terms", href: "/legal/terms" },
  { label: "User agreement", href: "/legal/user-agreement" },
  { label: "Cookies", href: "/legal/cookies" },
  { label: "Data processing", href: "/legal/data-processing" },
  { label: "Accessibility", href: "/legal/accessibility" },
  { label: "All legal documents", href: "/legal" },
] as const;
