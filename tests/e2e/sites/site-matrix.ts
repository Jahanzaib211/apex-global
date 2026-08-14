/**
 * The four public marketing sites, their loopback ports, and the routes each
 * one publishes.
 *
 * Ports match `infra/ecosystem.config.cjs` and `.kilo/notes/port-and-tunnel-map.md`
 * so a spec run locally exercises the same binding the Cloudflare tunnel hits
 * in production.
 *
 * `routes` is deliberately hand-maintained rather than crawled: the point is to
 * catch a page that stopped being reachable, and a crawler that starts from the
 * nav would not notice a route the nav no longer links to.
 */
export interface SiteSpec {
  /** Workspace package name, minus the @apex/ prefix. */
  readonly id: "group" | "holdings" | "outsourcing" | "tours";
  readonly label: string;
  /** Production loopback port, behind the Cloudflare tunnel. Never bound here. */
  readonly port: number;
  /**
   * Port this suite binds.
   *
   * Deliberately NOT the production port. The first run of this suite bound
   * nothing and silently reused the live PM2 processes already listening on
   * 3001/3100/3102/3103 — so it tested production instead of the build under
   * test, and reported the old sites' bugs as though they were the new build's.
   */
  readonly testPort: number;
  /** Canonical public hostname; every canonical tag must name this host. */
  readonly host: string;
  readonly routes: readonly string[];
}

export const SITES: readonly SiteSpec[] = [
  {
    id: "group",
    label: "Apex Group of Companies",
    port: 3103,
    testPort: 4903,
    host: "apex.apexgroupcompanies.com",
    routes: [
      "/",
      "/about",
      "/careers",
      "/companies",
      "/companies/holdings",
      "/companies/outsourcing",
      "/companies/tech-solution",
      "/companies/tours-travels",
      "/consultancy",
      "/contact",
      "/cookies",
      "/disclaimer",
      "/ecosystem",
      "/events",
      "/gallery",
      "/insights",
      "/leadership",
      "/partnerships",
      "/privacy",
      "/search",
      "/terms",
      "/insights/apex-group-2026-outlook",
      "/events/apex-group-summit-2026",
    ],
  },
  {
    id: "holdings",
    label: "Apex Holdings",
    port: 3102,
    testPort: 4902,
    host: "holdings.apexgroupcompanies.com",
    routes: [
      "/",
      "/about",
      "/about/leadership",
      "/about/vision",
      "/about/why-apex",
      "/careers",
      "/contact",
      "/developments",
      "/developments/future-pipeline",
      "/developments/owned-projects",
      "/developments/vision",
      "/events",
      "/gallery",
      "/insights",
      "/partner",
      "/projects",
      "/projects/commercial",
      "/projects/mixed-use",
      "/projects/plots-apartments",
      "/projects/residential",
      "/services",
      "/site-visit",
      "/testimonials",
      "/projects/avenue-residences",
      "/insights/why-marketing-matters-in-pakistan-real-estate",
      "/events/pre-launch-skyline-heights",
      "/careers/property-consultant",
      "/services/real-estate-marketing",
    ],
  },
  {
    id: "outsourcing",
    label: "Apex Global Outsourcing",
    port: 3100,
    testPort: 4900,
    host: "outsourcing.apexgroupcompanies.com",
    routes: [
      "/",
      "/about",
      "/careers",
      "/case-studies",
      "/contact",
      "/industries",
      "/insights",
      "/services",
      "/services/bpo",
      "/services/tele-sales",
      "/services/customer-experience",
      "/services/dedicated-teams",
    ],
  },
  {
    id: "tours",
    label: "Apex Global Tours & Travels",
    port: 3001,
    testPort: 4901,
    host: "tours.apexgroupcompanies.com",
    routes: [
      "/",
      "/about",
      "/blog",
      "/careers",
      "/car-rental-with-driver",
      "/contact",
      "/custom-package",
      "/destinations",
      "/disclaimer",
      "/gallery",
      "/group-package",
      "/hajj-packages",
      "/hajj-umrah",
      "/hajj-umrah/guide",
      "/pakistan-car-rental",
      "/privacy",
      "/saudi-car-rental",
      "/saudi-car-rental/jeddah",
      "/saudi-car-rental/madinah",
      "/saudi-car-rental/makkah",
      "/saudi-car-rental/riyadh",
      "/self-drive-car-rental",
      "/terms",
      "/umrah-packages",
      "/vehicles",
    ],
  },
];

export const siteById = (id: SiteSpec["id"]): SiteSpec => {
  const found = SITES.find((s) => s.id === id);
  if (!found) throw new Error(`Unknown site: ${id}`);
  return found;
};

export const baseUrlFor = (site: SiteSpec): string => `http://127.0.0.1:${site.testPort}`;
