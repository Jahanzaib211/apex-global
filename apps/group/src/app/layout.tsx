import type { Metadata } from "next";
import { Inter, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import { AttributionCapture } from "@/lib/attribution";
import { ApexChat } from "@/components/ApexChat";
import { SITE_URL } from "@/lib/site-url";

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const editorial = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-editorial",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  title: "Apex Group of Companies | One Group. Multiple Businesses. One Vision.",
  description:
    "Apex Group of Companies brings together specialized businesses across technology, outsourcing, travel, real estate and financial consultancy.",
  icons: { icon: "/logo.png" },
  metadataBase: new URL(SITE_URL),
  // metadataBase alone does not emit <link rel="canonical">; without this the
  // site shipped no canonical tag on any page.
  alternates: { canonical: "/" },
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
