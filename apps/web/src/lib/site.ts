/**
 * Site-level constants. Contact details and the canonical URL come from the
 * database at runtime (console → Settings), so nothing here is a hardcoded
 * business fact that would go stale.
 */

export const NAV = [
  { label: "SaaS", href: "/saas" },
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
  { label: "Industries", href: "/industries" },
  { label: "Technology", href: "/technology" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "About", href: "/about" },
  { label: "Insights", href: "/insights" },
  { label: "Careers", href: "/careers" },
] as const;

export const FOOTER_LEGAL = [
  { label: "Privacy", href: "/legal/privacy" },
  { label: "Terms", href: "/legal/terms" },
] as const;

export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:4300").replace(/\/$/, "");
}

export function absoluteUrl(path: string): string {
  return `${siteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}
