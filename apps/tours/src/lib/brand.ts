import { DEFAULT_BRANDS } from "@apex/site-kit/brand";

/**
 * Contact facts come from `@apex/site-kit/brand`, which mirrors the Tech app's
 * `settings` table (console → Settings) — the group's single source of truth.
 * They used to be hard-coded here as `+92 300 123 4567`, which is not a real
 * number and was on three sites at once.
 *
 * Everything above `phone` is genuine per-site copy and stays local.
 */
const SHARED = DEFAULT_BRANDS["apex-tours"]!;

export const BRAND = {
  name: "Apex Global Tours & Travels",
  short: "Apex Tours & Travels",
  legal: "Apex Global Tours & Travels (Pvt) Ltd",
  tagline: "Travel. Mobility. Pilgrimage.",
  promise: "Your Journey. Our Responsibility.",
  support: "Trust. Comfort. Transparency. Reliability. Convenience.",
  whatsapp: SHARED.whatsapp ?? "",
  whatsappDisplay: SHARED.whatsappDisplay ?? "",
  phone: SHARED.contactPhone!,
  email: "support@apexgroupcompanies.com",
  hqCity: "Karachi, Lahore & Riyadh",
  address: "Pakistan · Saudi Arabia · offices in Karachi, Lahore, and Riyadh",
};

/** True when a WhatsApp number is published; gates every WhatsApp CTA. */
export const HAS_WHATSAPP = BRAND.whatsapp.length > 0;

export const NAV = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Car Rentals",
    href: "/pakistan-car-rental",
    children: [
      { label: "Pakistan Car Rental", href: "/pakistan-car-rental" },
      { label: "With Driver", href: "/car-rental-with-driver" },
      { label: "Self-Drive", href: "/self-drive-car-rental" },
      { label: "Saudi Arabia", href: "/saudi-car-rental" },
      { label: "Vehicle Fleet", href: "/vehicles" },
    ],
  },
  {
    label: "Hajj & Umrah",
    href: "/hajj-umrah",
    children: [
      { label: "Overview", href: "/hajj-umrah" },
      { label: "Umrah Packages", href: "/umrah-packages" },
      { label: "Hajj Packages", href: "/hajj-packages" },
      { label: "Custom Package", href: "/custom-package" },
      { label: "Group Packages", href: "/group-package" },
    ],
  },
  {
    label: "Destinations",
    href: "/destinations",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Gallery",
    href: "/gallery",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

export const WHATSAPP_LINK = (msg: string) =>
  `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(msg)}`;
