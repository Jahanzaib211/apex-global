/**
 * Site-level constants. Contact details and the canonical URL come from the
 * database at runtime (console → Settings), so nothing here is a hardcoded
 * business fact that would go stale.
 */

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

/**
 * The Apex group of companies.
 *
 * The single source of truth for the group cross-links, published in this
 * site's footer and mirrored in the footers of the other four properties.
 * Five sites listing each other from five hand-maintained copies is how a
 * dead link ends up on every one of them at once.
 *
 * `self` marks the entry for the site doing the rendering, which links to `/`
 * rather than out to itself.
 *
 * Apex Cloud (cloud.apexgroupcompanies.com) is deliberately absent: it returns
 * 502 — mailcow's mariadb cannot write its PID file — and its reachability
 * check in tests/e2e is already failing. Restore the entry once the host
 * answers; linking a dead property from five footers only multiplies the
 * damage.
 */
export const GROUP_COMPANIES = [
  { label: "Apex Group of Companies", href: "https://apex.apexgroupcompanies.com" },
  { label: "Apex Global Tech Solution", href: "https://tech.apexgroupcompanies.com", self: true },
  { label: "Apex Tours", href: "https://tours.apexgroupcompanies.com" },
  { label: "Apex Outsourcing", href: "https://outsourcing.apexgroupcompanies.com" },
  { label: "Apex Holdings", href: "https://holdings.apexgroupcompanies.com" },
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

export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:4300").replace(/\/$/, "");
}

export function absoluteUrl(path: string): string {
  return `${siteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}
