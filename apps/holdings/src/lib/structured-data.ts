import { site, socials } from "@/data/site";
import { SITE_URL, url } from "@/lib/site-url";
import type { JsonLdValue } from "@apex/site-kit/json-ld";

/**
 * Structured data for the holdings site, which shipped none.
 *
 * Deliberately omitted: `telephone`. `site.phone` is "+92 300 0000000" and
 * `site.whatsapp` is "923000000000" — both placeholders. Publishing a
 * placeholder number as structured data feeds it straight into Google's
 * knowledge panel, which is worse than publishing nothing and is exactly what
 * docs/CREDIBILITY.md exists to prevent. Add `telephone` here once a real
 * number is in `src/data/site.ts`.
 */

/** `RealEstateAgent` is the LocalBusiness subtype that matches this business. */
export const organizationSchema: JsonLdValue = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "@id": `${SITE_URL}/#organization`,
  name: site.name,
  url: SITE_URL,
  slogan: site.tagline,
  description: site.description,
  email: site.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Office 1201, Block B, Business Tower, Main Boulevard, Gulberg III",
    addressLocality: "Lahore",
    addressCountry: "PK",
  },
  areaServed: { "@type": "Country", name: "Pakistan" },
  openingHours: "Mo-Sa 10:00-19:00",
  sameAs: socials.map((s) => s.href),
};

export const websiteSchema: JsonLdValue = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: site.name,
  publisher: { "@id": `${SITE_URL}/#organization` },
};

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

export function articleSchema(input: {
  title: string;
  excerpt: string;
  author: string;
  date: string;
  slug: string;
}): JsonLdValue {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.excerpt,
    datePublished: input.date,
    author: { "@type": "Person", name: input.author },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: url(`/insights/${input.slug}`),
  };
}

export function jobPostingSchema(input: {
  title: string;
  summary: string;
  department: string;
  location: string;
  type: string;
  slug: string;
}): JsonLdValue {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: input.title,
    description: input.summary,
    employmentType: input.type.toUpperCase().replace(/[\s-]+/g, "_"),
    occupationalCategory: input.department,
    hiringOrganization: { "@id": `${SITE_URL}/#organization` },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: input.location,
        addressCountry: "PK",
      },
    },
    url: url(`/careers/${input.slug}`),
  };
}

export function eventSchema(input: {
  title: string;
  description: string;
  date: string;
  location: string;
  slug: string;
}): JsonLdValue {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: input.title,
    description: input.description,
    startDate: input.date,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: input.location,
      address: { "@type": "PostalAddress", addressLocality: input.location, addressCountry: "PK" },
    },
    organizer: { "@id": `${SITE_URL}/#organization` },
    url: url(`/events/${input.slug}`),
  };
}

/**
 * A marketed project.
 *
 * `Residence` rather than `Product`: these are not items sold from stock, and
 * `price` is a range string ("PKR 2.5 Cr onwards") that no `Offer` can honestly
 * represent — so no `offers` node is emitted rather than a fabricated one.
 */
export function projectSchema(input: {
  name: string;
  summary: string;
  city: string;
  slug: string;
}): JsonLdValue {
  return {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: input.name,
    description: input.summary,
    url: url(`/projects/${input.slug}`),
    address: {
      "@type": "PostalAddress",
      addressLocality: input.city,
      addressCountry: "PK",
    },
  };
}
