// Apex Holdings — site-wide config
export const site = {
  name: "Apex Holdings",
  tagline: "Building Value. Creating Opportunities.",
  subTagline: "Marketing & Developments",
  description:
    "A Pakistan-based real estate company connecting customers and investors with carefully selected property opportunities while building toward a future of developing landmark projects of our own.",
  phone: "+92 300 0000000",
  whatsapp: "923000000000",
  email: "info@holdings.apexgroupcompanies.com",
  /**
   * Office Address — Apex Holdings 2026-08-13 update (Apex Web Tweaks):
   * Listed the named building, block, street and Lahore as the primary
   * office. Karachi and Islamabad offices listed as additional presence.
   */
  address:
    "Office 1201, Block B, Business Tower, Main Boulevard, Gulberg III, Lahore, Pakistan · Offices also in Karachi and Islamabad",
  hours: "Mon – Sat · 10:00 – 19:00 PKT",
  whatsappMessage: "Hi Apex Holdings, I would like to enquire about a property opportunity.",
  url: "https://holdings.apexgroupcompanies.com",
};

export const nav = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Projects",
    href: "/projects",
    children: [
      { label: "All Projects", href: "/projects" },
      { label: "Residential", href: "/projects/residential" },
      { label: "Commercial", href: "/projects/commercial" },
      { label: "Mixed-Use", href: "/projects/mixed-use" },
      { label: "Plots & Apartments", href: "/projects/plots-apartments" },
    ],
  },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Real Estate Marketing", href: "/services/real-estate-marketing" },
      { label: "Project Marketing", href: "/services/project-marketing" },
      { label: "Sales & Lead Generation", href: "/services/sales-lead-generation" },
      { label: "Digital Marketing", href: "/services/digital-marketing" },
    ],
  },
  {
    label: "Apex Developments",
    href: "/developments",
    children: [
      { label: "Vision", href: "/developments/vision" },
      { label: "Future Pipeline", href: "/developments/future-pipeline" },
      { label: "Owned Projects", href: "/developments/owned-projects" },
    ],
  },
  {
    label: "Gallery",
    href: "/gallery",
  },
  {
    label: "Insights",
    href: "/insights",
  },
  {
    label: "Careers",
    href: "/careers",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

export const footerNav = [
  {
    title: "Company",
    items: [
      { label: "About", href: "/about" },
      { label: "Leadership", href: "/about/leadership" },
      { label: "Vision & Mission", href: "/about/vision" },
      { label: "Why Apex", href: "/about/why-apex" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    title: "Projects",
    items: [
      { label: "All Projects", href: "/projects" },
      { label: "Residential", href: "/projects/residential" },
      { label: "Commercial", href: "/projects/commercial" },
      { label: "Mixed-Use", href: "/projects/mixed-use" },
      { label: "Plots & Apartments", href: "/projects/plots-apartments" },
    ],
  },
  {
    title: "Services",
    items: [
      { label: "Real Estate Marketing", href: "/services/real-estate-marketing" },
      { label: "Project Marketing", href: "/services/project-marketing" },
      { label: "Sales & Lead Gen", href: "/services/sales-lead-generation" },
      { label: "Digital Marketing", href: "/services/digital-marketing" },
      { label: "Partner With Us", href: "/partner" },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "Gallery", href: "/gallery" },
      { label: "Events", href: "/events" },
      { label: "Insights", href: "/insights" },
      { label: "Testimonials", href: "/testimonials" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

/**
 * Footer socials — Apex Holdings 2026-08-13 update (Apex Web Tweaks):
 * Replaced placeholder root URLs (`https://facebook.com` etc.) with the
 * canonical handles from `@apex/site-kit/social`.
 *
 * The YouTube row used to be kept with an empty href "so the footer layout
 * doesn't shift when the handle is added". That rendered `<a href="">` on every
 * page of the site — a link that reloads the current page and reads to a screen
 * reader as a real destination. A row is only published once its handle exists.
 */
import { APEX_SOCIALS, type SocialEntry } from "@apex/site-kit/social";

function entry(platform: "facebook" | "instagram" | "linkedin" | "youtube"): SocialEntry | null {
  const found = APEX_SOCIALS.find((s) => s.platform === platform);
  if (found) return found;
  // YouTube handle is intentionally empty until Apex publishes one.
  if (platform === "youtube") return null;
  return null;
}

export const socials = [entry("linkedin"), entry("facebook"), entry("instagram")].filter(
  (s): s is SocialEntry => s !== null && s.href.length > 0,
);
