/**
 * Brand constants — single source of truth for marketing copy and metadata.
 * Used by metadata, sitemap, JSON-LD, OG image generation, and components.
 */

const LOCAL_FALLBACK = "http://127.0.0.1:3100";

/**
 * The site's public base URL, or a hard failure.
 *
 * Local development keeps the loopback default. Anything else — a production
 * build, or CI — must supply NEXT_PUBLIC_SITE_URL, because the value is baked
 * into canonical tags, og:url, og:image and JSON-LD at build time and shipped
 * to crawlers. Failing the build is the cheap outcome; publishing a loopback
 * canonical is not.
 */
function resolveSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL is required for a production build. Without it the " +
        `canonical URL, og:image and JSON-LD would be published as ${LOCAL_FALLBACK}, ` +
        "which no crawler can reach. Set it in .env and rebuild — it is inlined " +
        "at build time, so a restart alone will not pick it up.",
    );
  }
  return LOCAL_FALLBACK;
}

export const BRAND = {
  name: "Apex Global Outsourcing",
  legalName: "Apex Global Outsourcing (Pvt) Ltd.",
  shortName: "Apex",
  tagline: "People. Process. Performance. Global Scale.",
  description:
    "Apex Global Outsourcing helps businesses scale sales, customer experience, marketing and back-office operations with dedicated global teams. BPO, CX, Telesales, lead generation and digital marketing.",
  keywords: [
    "global outsourcing",
    "BPO",
    "customer experience outsourcing",
    "Telesales outsourcing",
    "lead generation services",
    "digital marketing outsourcing",
    "dedicated remote teams",
    "back-office outsourcing",
    "sales outsourcing",
    "call center outsourcing",
  ],
  /** ISO 3166-1 alpha-2 — used in JSON-LD LocalBusiness. */
  country: "PK",
  /** Locale used for OG and hreflang. */
  locale: "en_US",
  /**
   * Base URL — set per environment via NEXT_PUBLIC_SITE_URL.
   *
   * This must never silently fall back in production. It did, and the loopback
   * default was published to the internet: on 2026-08-13 the live site carried
   * `<link rel="canonical" href="http://127.0.0.1:3100"/>` plus an og:image and
   * a JSON-LD `url` on the same host — 10 occurrences in the served HTML. A
   * canonical pointing at an address no crawler can reach tells Google the page
   * it just fetched is not the real one, which is a deindexing risk rather than
   * a cosmetic bug.
   *
   * It is a *build-time* value: `NEXT_PUBLIC_*` is inlined by Next, so setting
   * the variable without rebuilding changes nothing. resolveSiteUrl() therefore
   * fails the build rather than letting a bad value reach a page.
   */
  siteUrl: resolveSiteUrl(),
  /** Default OG image path under /public. */
  ogImage: "/og-image.png",
  /** Twitter handle, without @. Leave empty if none. */
  twitter: "",
} as const;

/** Derived absolute URL helpers. */
export const absoluteUrl = (path: string): string => {
  const base = BRAND.siteUrl.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
};
