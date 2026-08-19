import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AttributionCapture } from "@/lib/attribution";
import { ApexChat } from "@/components/ApexChat";
import { SITE_URL } from "@/lib/site-url";
import { jsonLdProps } from "@apex/site-kit/json-ld";
import { organizationSchema, websiteSchema } from "@/lib/structured-data";

/*
 * Fonts are self-hosted rather than pulled from fonts.googleapis.com.
 *
 * This site injected a <link rel="stylesheet"> for three families in fifteen
 * weights into <head>, which blocks the first paint on a third-party round
 * trip — against the mobile LCP budget in README.md — and sent every visitor
 * to a Google domain. apps/tours and apps/group already solved this with
 * next/font/local; these are the same latin-subset files they use.
 */
const sans = localFont({
  src: "../fonts/inter-100-900-latin.woff2",
  weight: "100 900",
  variable: "--font-sans",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
});
const serif = localFont({
  src: "../fonts/cormorant-garamond-400-700-latin.woff2",
  weight: "400 700",
  variable: "--font-serif",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});
const display = localFont({
  src: "../fonts/playfair-display-400-900-latin.woff2",
  weight: "400 900",
  variable: "--font-display",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

export const metadata: Metadata = {
  // Without metadataBase every relative OpenGraph and canonical URL resolved
  // against nothing, and no canonical tag was emitted at all.
  metadataBase: new URL(SITE_URL),
  // Each site is its own Search Console property, so each needs its own
  // token — one shared value cannot verify five hostnames. Left undefined
  // when unset so no empty meta tag is emitted.
  verification: process.env.GOOGLE_SITE_VERIFICATION_HOLDINGS
    ? { google: process.env.GOOGLE_SITE_VERIFICATION_HOLDINGS }
    : undefined,
  // A URL *instance* (not the string "/") is the fix: Next resolves an
  // instance against the current pathname (`new URL(pathname, url)` in
  // resolvers/resolve-basics.js), so every page canonicalises to itself.
  // The string "/" resolved to the site root on all of them, telling Google
  // every page was a duplicate of the homepage. Removing the key entirely is
  // not the fix either — resolveAlternates returns null and no tag is emitted.
  alternates: { canonical: new URL(SITE_URL) },
  title: {
    default: "Apex Holdings — Building Value. Creating Opportunities.",
    template: "%s · Apex Holdings",
  },
  description:
    "Apex Holdings is a Pakistan-based real estate company connecting customers and investors with carefully selected property opportunities while building toward a future of developing landmark projects of our own.",
  keywords: [
    "Apex Holdings",
    "Pakistan real estate",
    "real estate projects",
    "property marketing",
    "investment opportunities",
    "Lahore real estate",
    "Karachi real estate",
    "Islamabad real estate",
  ],
  authors: [{ name: "Apex Holdings" }],
  openGraph: {
    title: "Apex Holdings — Building Value. Creating Opportunities.",
    description:
      "A Pakistan-based real estate firm with a broad portfolio of projects and a long-term vision for development and ownership.",
    type: "website",
    locale: "en_PK",
    url: SITE_URL,
    siteName: "Apex Holdings",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} ${display.variable}`}>
      <head>
        {/* The site shipped no structured data. Organization and WebSite
            belong once at the root; per-page schemas sit with their route. */}
        <script type="application/ld+json" {...jsonLdProps(organizationSchema)} />
        <script type="application/ld+json" {...jsonLdProps(websiteSchema)} />
      </head>
      <body className="bg-white font-sans text-slate-700 antialiased">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        {/* WhatsAppFab removed 2026-08-13 — it was `fixed bottom-6 right-6`,
            the exact spot Chatwoot's launcher occupies, so the two bubbles
            overlapped. Chatwoot is the group's single support channel: it has
            per-brand inboxes, history and routing. WhatsApp remains available
            as an in-page link (see src/data/site.ts). */}
        <AttributionCapture />
        <ApexChat />
      </body>
    </html>
  );
}
