import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AttributionCapture } from "@/lib/attribution";
import { ApexChat } from "@/components/ApexChat";

export const metadata: Metadata = {
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
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Cormorant+Garamond:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
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
