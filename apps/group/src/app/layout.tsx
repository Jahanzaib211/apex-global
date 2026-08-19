import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import { AttributionCapture } from "@/lib/attribution";
import { ApexChat } from "@/components/ApexChat";
import { SITE_URL } from "@/lib/site-url";

/*
 * Fonts are self-hosted rather than fetched through `next/font/google`.
 *
 * `next/font/google` downloads the woff2 files from fonts.gstatic.com at build
 * time, which makes the build depend on a third-party network. It timed out on
 * the CI runner (ETIMEDOUT after three retries) and failed the whole build.
 * These are the same latin-subset files Google serves, committed alongside the
 * app, so the build is hermetic and no visitor request reaches a Google domain.
 */
const display = localFont({
  src: "../fonts/playfair-display-400-900-latin.woff2",
  weight: "400 900",
  variable: "--font-display",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});
const editorial = localFont({
  // Google now serves one variable file for every Cormorant weight — the four
  // per-weight URLs returned byte-identical files.
  src: "../fonts/cormorant-garamond-400-700-latin.woff2",
  weight: "400 700",
  variable: "--font-editorial",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});
const body = localFont({
  src: "../fonts/inter-100-900-latin.woff2",
  weight: "100 900",
  variable: "--font-body",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
});

export const metadata: Metadata = {
  // A string title here is 68 characters — Google truncates around 60 — and
  // declares no template, so every child page rendered with no brand suffix.
  title: {
    default: "Apex Group of Companies — One Group. One Vision.",
    template: "%s · Apex Group",
  },
  description:
    "Apex Group of Companies brings together specialized businesses across technology, outsourcing, travel, real estate and financial consultancy.",
  icons: { icon: "/logo.png" },
  metadataBase: new URL(SITE_URL),
  // metadataBase alone does not emit <link rel="canonical">; without this the
  // site shipped no canonical tag on any page.
  // A URL *instance* (not the string "/") is the fix: Next resolves an
  // instance against the current pathname (`new URL(pathname, url)` in
  // resolvers/resolve-basics.js), so every page canonicalises to itself.
  // The string "/" resolved to the site root on all of them, telling Google
  // every page was a duplicate of the homepage. Removing the key entirely is
  // not the fix either — resolveAlternates returns null and no tag is emitted.
  alternates: { canonical: new URL(SITE_URL) },
  openGraph: {
    title: "Apex Group of Companies",
    description: "One Group. Multiple Businesses. One Vision.",
    type: "website",
    url: SITE_URL,
    siteName: "Apex Group of Companies",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${editorial.variable} ${body.variable}`}>
      <body className="bg-cream text-charcoal font-body">
        <Header />
        {children}
        <Footer />
        <CookieConsentBanner />
        <AttributionCapture />
        <ApexChat />
      </body>
    </html>
  );
}
