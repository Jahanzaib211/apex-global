/**
 * Top-level navigation and service catalogue — single source of truth.
 * Consumed by Navbar, services index page, home page, and footer.
 */

export type ServiceSlug =
  | "bpo"
  | "customer-experience"
  | "tele-sales"
  | "sales-development"
  | "digital-marketing"
  | "back-office"
  | "dedicated-teams"
  | "staffing";

export const SERVICE_SLUGS: readonly ServiceSlug[] = [
  "bpo",
  "customer-experience",
  "tele-sales",
  "sales-development",
  "digital-marketing",
  "back-office",
  "dedicated-teams",
  "staffing",
] as const;

export type ServiceNav = {
  slug: ServiceSlug;
  title: string;
  shortLabel: string;
  href: `/services/${ServiceSlug}`;
};

export const SERVICES: readonly ServiceNav[] = [
  { slug: "bpo", title: "Business Process Outsourcing", shortLabel: "BPO", href: "/services/bpo" },
  {
    slug: "customer-experience",
    title: "Customer Experience & Contact Center",
    shortLabel: "CX",
    href: "/services/customer-experience",
  },
  { slug: "tele-sales", title: "Telesales", shortLabel: "Telesales", href: "/services/tele-sales" },
  {
    slug: "sales-development",
    title: "Sales Development & Lead Generation",
    shortLabel: "Lead Gen",
    href: "/services/sales-development",
  },
  {
    slug: "digital-marketing",
    title: "Digital Marketing & Growth",
    shortLabel: "Digital",
    href: "/services/digital-marketing",
  },
  {
    slug: "back-office",
    title: "Back-Office Operations",
    shortLabel: "Back-Office",
    href: "/services/back-office",
  },
  {
    slug: "dedicated-teams",
    title: "Dedicated Remote Teams",
    shortLabel: "Dedicated Teams",
    href: "/services/dedicated-teams",
  },
  {
    slug: "staffing",
    title: "Staffing & Resource Solutions",
    shortLabel: "Staffing",
    href: "/services/staffing",
  },
] as const;

export type NavLink = {
  name: string;
  href: string;
  dropdown?: readonly ServiceNav[];
};

export const NAV_LINKS: readonly NavLink[] = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services", dropdown: SERVICES },
  { name: "Industries", href: "/industries" },
  { name: "Case Studies", href: "/case-studies" },
  { name: "About", href: "/about" },
  { name: "Careers", href: "/careers" },
  { name: "Insights", href: "/insights" },
] as const;

/** Path → per-route metadata overrides used by layout / page metadata. */
export const ROUTE_META: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Apex Global Outsourcing — People. Process. Performance. Global Scale.",
    description:
      "Scale sales, customer experience, marketing and back-office operations with dedicated global teams. BPO, CX, Telesales, lead generation and digital marketing.",
  },
  "/about": {
    title: "About Apex Global Outsourcing",
    description:
      "Apex is a global outsourcing partner built for outcomes — not headcount. Learn how we combine people, process and technology to deliver managed business operations.",
  },
  "/services": {
    title: "Services — Apex Global Outsourcing",
    description:
      "Eight service divisions covering BPO, customer experience, Telesales, sales development, digital marketing, back-office operations, dedicated remote teams and staffing.",
  },
  "/industries": {
    title: "Industries — Apex Global Outsourcing",
    description:
      "Outsourcing solutions for technology, e-commerce, healthcare, financial services, real estate, logistics, retail, hospitality and more.",
  },
  "/case-studies": {
    title: "Case Studies — Apex Global Outsourcing",
    description:
      "Real outsourcing engagements. Anonymized case studies available on request so we never compromise client confidentiality.",
  },
  "/careers": {
    title: "Careers — Apex Global Outsourcing",
    description:
      "Build your career at Apex. Open roles across customer experience, sales, marketing, operations and quality.",
  },
  "/insights": {
    title: "Insights — Apex Global Outsourcing",
    description:
      "Practical perspectives from operators running global sales, CX and marketing engagements at scale.",
  },
  "/contact": {
    title: "Contact Apex Global Outsourcing",
    description:
      "Tell us what you need to scale. We'll come back within one business day with a tailored proposal.",
  },
};
