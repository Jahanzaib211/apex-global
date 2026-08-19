import { BRAND } from "@/lib/brand";
import { SITE_URL, url } from "@/lib/site-url";
import { APEX_SOCIALS } from "@apex/site-kit/social";
import type { JsonLdValue } from "@apex/site-kit/json-ld";

/**
 * Structured data for the tours site.
 *
 * This site shipped none at all, which mattered more here than anywhere else
 * in the estate: the city car-rental pages and the Hajj/Umrah package pages
 * target exactly the queries Google answers with rich results, and without
 * markup they compete as plain blue links.
 *
 * Everything is built from `BRAND` and `@apex/site-kit/social` so the facts
 * cannot drift from what the pages and the footer render.
 */

/** `TravelAgency` is the LocalBusiness subtype that matches this business. */
export const organizationSchema: JsonLdValue = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  "@id": `${SITE_URL}/#organization`,
  name: BRAND.name,
  legalName: BRAND.legal,
  url: SITE_URL,
  slogan: BRAND.tagline,
  description:
    "Premium car rental in Pakistan and Saudi Arabia, plus carefully organised Hajj and Umrah packages.",
  telephone: BRAND.phone,
  areaServed: [
    { "@type": "Country", name: "Pakistan" },
    { "@type": "Country", name: "Saudi Arabia" },
  ],
  address: {
    "@type": "PostalAddress",
    addressCountry: "PK",
    addressLocality: "Karachi",
  },
  sameAs: APEX_SOCIALS.map((s) => s.href),
};

export const websiteSchema: JsonLdValue = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: BRAND.name,
  publisher: { "@id": `${SITE_URL}/#organization` },
};

/**
 * A car-rental offering in one city.
 *
 * `areaServed` is the field that earns these pages their local relevance —
 * it is the difference between "a car rental company" and "car rental in
 * Makkah".
 */
export function carRentalService(input: {
  name: string;
  description: string;
  city: string;
  country: "Pakistan" | "Saudi Arabia";
  path: string;
}): JsonLdValue {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Car rental with driver",
    name: input.name,
    description: input.description,
    url: url(input.path),
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: {
      "@type": "City",
      name: input.city,
      containedInPlace: { "@type": "Country", name: input.country },
    },
  };
}

/** Breadcrumbs for a nested route; `trail` excludes Home, which is added here. */
export function breadcrumbs(trail: { name: string; path: string }[]): JsonLdValue {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: url(item.path),
    })),
  };
}
