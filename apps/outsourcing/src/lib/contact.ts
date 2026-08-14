/**
 * Contact information — single source of truth for email, phone, and address.
 * Used by Footer, Contact page, JSON-LD LocalBusiness schema.
 */

export const CONTACT = {
  email: "hello@apexglobaloutsourcing.com",
  /** Display format with spaces and dashes. */
  phoneDisplay: "+92 300 000 0000",
  /** tel: URI — E.164 without separators. */
  phoneTel: "+923000000000",
  address: {
    line1: "Global Headquarters",
    line2: "Pakistan",
    region: "Delivering across North America, Europe, Middle East & Asia-Pacific",
  },
  responseTime: "Within 1 business day",
  responseTimeDetail: "For complex requirements we schedule a discovery call within 48 hours.",
  hours: "24/7 Global Operations",
} as const;

export const CONTACT_LINKS = {
  mailto: `mailto:${CONTACT.email}`,
  tel: `tel:${CONTACT.phoneTel}`,
} as const;
