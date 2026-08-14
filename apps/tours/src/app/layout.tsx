import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AttributionCapture } from "@/lib/attribution";
import { ApexChat } from "@/components/ApexChat";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
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
