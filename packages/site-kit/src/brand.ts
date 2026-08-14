/**
 * Per-site `Brand` record.
 *
 * The four sibling repos used to hard-code their own tagline, primary colour,
 * accent colour, contact phone/email/address, and WhatsApp CTA as inline
 * constants in every page; the donor `@apex/web` pulls the same facts from
 * the database. For the migration we land at a typed `Brand` record loaded
 * from a per-site `BRAND.json` next to the migrated app, and the DB-backed
 * pattern remains only for `@apex/web`.
 */

export interface Brand {
  /** Full legal/operational name. e.g. "Apex Global Tours & Travels (Pvt) Ltd". */
  readonly name: string;
  /** Short label used in compact contexts (footer copyright, mobile nav). */
  readonly shortLabel: string;
  /** Public hostname with no scheme — `apexgroupcompanies.com` style. */
  readonly hostname: string;
  /** One-line tagline used in the hero, footer, og:description, etc. */
  readonly tagline: string;
  /** Path under `public/` to the logomark asset. */
  readonly logoSrc: string;
  /** Alt text for the logo. Tests assert the alt includes the site's short label. */
  readonly logoAlt: string;
  /** Primary brand colour, used by the Tailwind config + OG card. Hex with `#`. */
  readonly primaryColor: string;
  /** Accent / highlight colour. Hex with `#`. */
  readonly accentColor: string;
  /** Public phone number, displayed in contact card. Format with the country's dialling prefix. */
  readonly contactPhone?: string;
  /** Public email. `info@` is the convention. */
  readonly contactEmail?: string;
  /** Single-line postal address. */
  readonly contactAddress?: string;
  /** WhatsApp CTA — full `https://wa.me/...` URL with prefilled text. */
  readonly whatsappHref?: string;
}

/**
 * Helper: build a Brand record from a plain object, asserting only that
 * required fields are present. Lets each migrated app pass a JSON file
 * straight through without hand-typing the assertion.
 */
export function defineBrand(input: Brand): Brand {
  return input;
}

/**
 * Brand records for the five Apex sites — the snapshot at the migration
 * date. Each migrated app reads from its own `BRAND.json`, but this const
 * keeps the canonical spelling of names / cities / handles in one file
 * rather than five hand-maintained copies.
 *
 * Each migrated app overrides the relevant fields in its own BRAND.json;
 * this const is the **default** the migrated app falls back to when the
 * JSON file is missing (a fresh checkout before configuration).
 */
export const DEFAULT_BRANDS: Readonly<Record<string, Brand>> = {
  "apex-group": {
    name: "Apex Group of Companies",
    shortLabel: "Apex Group",
    hostname: "apexgroupcompanies.com",
    tagline: "Six companies. One operating group.",
    logoSrc: "/logo.png",
    logoAlt: "Apex Group of Companies",
    primaryColor: "#0b1d3a",
    accentColor: "#c89b3c",
    contactPhone: "+92 300 123 4567",
    contactEmail: "[email protected]",
    contactAddress: "Karachi · Lahore · Riyadh",
  },
  "apex-tech": {
    name: "Apex Global Tech Solution",
    shortLabel: "Apex Tech",
    hostname: "apexgroupcompanies.com",
    tagline: "We build and operate SaaS products and deliver technology solutions.",
    logoSrc: "/logo.png",
    logoAlt: "Apex Global Tech Solution",
    primaryColor: "#0b1d3a",
    accentColor: "#c89b3c",
  },
  "apex-tours": {
    name: "Apex Global Tours & Travels (Pvt) Ltd",
    shortLabel: "Apex Tours",
    hostname: "apexgroupcompanies.com",
    tagline: "Your Journey. Our Responsibility.",
    logoSrc: "/logo.png",
    logoAlt: "Apex Global Tours & Travels",
    primaryColor: "#0b1d3a",
    accentColor: "#c89b3c",
    contactPhone: "+92 300 123 4567",
    contactAddress: "Pakistan · Saudi Arabia",
  },
  "apex-outsourcing": {
    name: "Apex Global Outsourcing",
    shortLabel: "Apex Outsourcing",
    hostname: "apexgroupcompanies.com",
    tagline: "BPO and back-office teams, end to end.",
    logoSrc: "/logo.png",
    logoAlt: "Apex Global Outsourcing",
    primaryColor: "#0b1d3a",
    accentColor: "#c89b3c",
  },
  "apex-holdings": {
    name: "Apex Holdings",
    shortLabel: "Apex Holdings",
    hostname: "apexholdings.pk",
    tagline: "Real estate and property development across Pakistan.",
    logoSrc: "/logo.png",
    logoAlt: "Apex Holdings",
    primaryColor: "#0b1d3a",
    accentColor: "#c89b3c",
    contactPhone: "+92 300 123 4567",
    contactAddress: "Lahore, Pakistan",
  },
} as const;
