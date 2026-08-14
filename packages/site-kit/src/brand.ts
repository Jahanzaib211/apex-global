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
  /**
   * This site's public hostname, no scheme — `tours.apexgroupcompanies.com`.
   *
   * Must equal `APEX_PUBLIC_HOSTNAMES[siteId]`; a test pins that. The field
   * used to mean the registrable domain for four entries
   * (`apexgroupcompanies.com`) and a full host for the fifth
   * (`apexholdings.pk`, which is not even where Holdings serves any more), so
   * it could not be used for anything without checking which sense applied.
   */
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
  /**
   * WhatsApp number in wa.me form — digits only, country code first, no `+`.
   *
   * Optional on purpose. `org.whatsapp` is empty in the live settings, and a
   * WhatsApp CTA pointing at a number nobody answers is worse than no CTA, so
   * consumers gate the button on this being non-empty rather than shipping a
   * made-up number (it was `923001234567`).
   */
  readonly whatsapp?: string;
  /** Human-formatted rendering of `whatsapp`, e.g. `+92 306 642 2442`. */
  readonly whatsappDisplay?: string;
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
/**
 * The group's real, published contact facts.
 *
 * Single source of truth is the Tech app's `settings` table — `org.phone` and
 * `org.address`, edited from the console and read at runtime by `apps/web`.
 * The four marketing sites are statically built and have no database, so the
 * values are mirrored here rather than fetched; update both together.
 *
 * They replace `+92 300 123 4567`, which was on three sites and is not a real
 * number. There is deliberately no `contactEmail`: `org.email` is empty in the
 * live settings, and inventing one is exactly the mistake being corrected.
 */
const GROUP_PHONE = "+92 42 3229 4384";
const GROUP_ADDRESS = "31-20, Sector CCD Main Blvd, Sector M7 Lake City, Lahore, Pakistan";

/**
 * wa.me form: country code first, digits only, no `+`.
 *
 * `org.whatsapp` is currently empty in the live settings, but this number is
 * the one seeded in `packages/db/prisma/content/site.ts` and confirmed as
 * Apex's real WhatsApp — it was cleared from the database, not retired. Restore
 * `org.whatsapp` in the console so the Tech site and these four agree.
 */
const GROUP_WHATSAPP = "923066422442";
const GROUP_WHATSAPP_DISPLAY = "+92 306 642 2442";

export const DEFAULT_BRANDS: Readonly<Record<string, Brand>> = {
  "apex-group": {
    name: "Apex Group of Companies",
    shortLabel: "Apex Group",
    hostname: "apex.apexgroupcompanies.com",
    tagline: "Six companies. One operating group.",
    logoSrc: "/logo.png",
    logoAlt: "Apex Group of Companies",
    primaryColor: "#0b1d3a",
    accentColor: "#c89b3c",
    contactPhone: GROUP_PHONE,
    contactAddress: GROUP_ADDRESS,
    whatsapp: GROUP_WHATSAPP,
    whatsappDisplay: GROUP_WHATSAPP_DISPLAY,
  },
  "apex-tech": {
    name: "Apex Global Tech Solution",
    shortLabel: "Apex Tech",
    hostname: "tech.apexgroupcompanies.com",
    tagline: "We build and operate SaaS products and deliver technology solutions.",
    logoSrc: "/logo.png",
    logoAlt: "Apex Global Tech Solution",
    primaryColor: "#0b1d3a",
    accentColor: "#c89b3c",
  },
  "apex-tours": {
    name: "Apex Global Tours & Travels (Pvt) Ltd",
    shortLabel: "Apex Tours",
    hostname: "tours.apexgroupcompanies.com",
    tagline: "Your Journey. Our Responsibility.",
    logoSrc: "/logo.png",
    logoAlt: "Apex Global Tours & Travels",
    primaryColor: "#0b1d3a",
    accentColor: "#c89b3c",
    contactPhone: GROUP_PHONE,
    contactAddress: GROUP_ADDRESS,
    whatsapp: GROUP_WHATSAPP,
    whatsappDisplay: GROUP_WHATSAPP_DISPLAY,
  },
  "apex-outsourcing": {
    name: "Apex Global Outsourcing",
    shortLabel: "Apex Outsourcing",
    hostname: "outsourcing.apexgroupcompanies.com",
    tagline: "BPO and back-office teams, end to end.",
    logoSrc: "/logo.png",
    logoAlt: "Apex Global Outsourcing",
    primaryColor: "#0b1d3a",
    accentColor: "#c89b3c",
  },
  "apex-holdings": {
    name: "Apex Holdings",
    shortLabel: "Apex Holdings",
    hostname: "holdings.apexgroupcompanies.com",
    tagline: "Real estate and property development across Pakistan.",
    logoSrc: "/logo.png",
    logoAlt: "Apex Holdings",
    primaryColor: "#0b1d3a",
    accentColor: "#c89b3c",
    contactPhone: GROUP_PHONE,
    contactAddress: GROUP_ADDRESS,
    whatsapp: GROUP_WHATSAPP,
    whatsappDisplay: GROUP_WHATSAPP_DISPLAY,
  },
} as const;
