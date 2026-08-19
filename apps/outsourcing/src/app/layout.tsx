import type { Metadata, Viewport } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import "./globals.css";
import { BRAND, absoluteUrl } from "@/lib/brand";
import { AttributionCapture } from "@/lib/attribution";
import { ApexChat } from "@/components/ApexChat";
import { APEX_SOCIALS } from "@apex/site-kit/social";
import { jsonLdProps } from "@apex/site-kit/json-ld";

/*
 * Fonts are self-hosted rather than pulled from fonts.googleapis.com.
 *
 * The three <link> tags this replaces sat in <head> and blocked first paint on
 * a third-party round trip — against the mobile LCP budget in README.md — and
 * sent every visitor to a Google domain. They each carried an eslint-disable
 * for `no-page-custom-font`, which was the rule correctly reporting this.
 * Same latin-subset files apps/tours and apps/group already commit.
 */
const sans = localFont({
  src: "../fonts/inter-100-900-latin.woff2",
  weight: "100 900",
  variable: "--font-sans",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});
const display = localFont({
  src: "../fonts/manrope-400-800-latin.woff2",
  weight: "400 800",
  variable: "--font-display",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.siteUrl),
  // Each site is its own Search Console property, so each needs its own
  // token — one shared value cannot verify five hostnames. Left undefined
  // when unset so no empty meta tag is emitted.
  verification: process.env.GOOGLE_SITE_VERIFICATION_OUTSOURCING
    ? { google: process.env.GOOGLE_SITE_VERIFICATION_OUTSOURCING }
    : undefined,
  title: {
    default: `${BRAND.name} — ${BRAND.tagline}`,
    template: `%s — ${BRAND.name}`,
  },
  description: BRAND.description,
  keywords: [...BRAND.keywords],
  applicationName: BRAND.name,
  authors: [{ name: BRAND.legalName }],
  creator: BRAND.legalName,
  publisher: BRAND.legalName,
  // See the note in the sibling sites: a URL instance canonicalises each page
  // to itself, the string "/" pointed every page at the site root.
  alternates: { canonical: new URL(BRAND.siteUrl) },
  icons: { icon: "/favicon.ico", apple: "/logo.png" },
  openGraph: {
    type: "website",
    locale: BRAND.locale,
    url: BRAND.siteUrl,
    siteName: BRAND.name,
    title: `${BRAND.name} — ${BRAND.tagline}`,
    description: BRAND.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name} — ${BRAND.tagline}`,
    description: BRAND.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5A623" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0E1A" },
  ],
  colorScheme: "light",
};

const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: BRAND.legalName,
  alternateName: BRAND.name,
  url: BRAND.siteUrl,
  logo: absoluteUrl("/logo.png"),
  description: BRAND.description,
  sameAs: APEX_SOCIALS.map((s) => s.href),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="text-navy bg-white">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <div id="main-content" tabIndex={-1}>
          {children}
        </div>
        <Script
          id="ld-json-org"
          type="application/ld+json"
          strategy="afterInteractive"
          {...jsonLdProps(ORG_JSONLD)}
        />
        <AttributionCapture />
        <ApexChat />
      </body>
    </html>
  );
}
