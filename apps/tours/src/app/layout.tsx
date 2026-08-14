import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
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
const inter = localFont({
  src: "../fonts/inter-100-900-latin.woff2",
  weight: "100 900",
  variable: "--font-sans",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
});
const playfair = localFont({
  src: "../fonts/playfair-display-400-900-latin.woff2",
  weight: "400 900",
  variable: "--font-display",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

export const metadata: Metadata = {
  // Without metadataBase no canonical tag was emitted at all and every
  // relative OpenGraph URL resolved against nothing.
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  title: {
    default: "Apex Global Tours & Travels — Travel. Mobility. Pilgrimage.",
    template: "%s | Apex Global Tours & Travels",
  },
  description:
    "Apex Global Tours & Travels — premium car rental in Pakistan & Saudi Arabia plus carefully organized Hajj and Umrah packages. Your Journey. Our Responsibility.",
  keywords: [
    "Pakistan car rental",
    "Saudi Arabia car rental",
    "Makkah car rental",
    "Madinah car rental",
    "Jeddah car rental",
    "Hajj packages",
    "Umrah packages",
    "custom Umrah package",
    "group Hajj package",
    "Makkah to Jeddah transport",
  ],
  openGraph: {
    title: "Apex Global Tours & Travels",
    description: "Travel. Mobility. Pilgrimage.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        {/* FloatingWhatsApp removed 2026-08-13 — it was `fixed bottom-5 right-5
            z-50`, sitting directly on top of Chatwoot's launcher (z-40) in the
            same corner. Chatwoot is the group's single support channel: it has
            per-brand inboxes, history and routing. The enquiry modal still
            hands off to WhatsApp after recording the lead — that is a
            deliberate step in a flow, not a competing floating button. */}
        <AttributionCapture />
        <ApexChat />
      </body>
    </html>
  );
}
