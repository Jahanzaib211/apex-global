import type { Metadata, Viewport } from "next";
import { getSettings } from "@/lib/content";
import { siteUrl } from "@/lib/site";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();

  return {
    metadataBase: new URL(siteUrl()),
    title: {
      default: s["seo.defaultTitle"] ?? "Apex Global Tech Solution",
      template: "%s | Apex Global Tech Solution",
    },
    description: s["seo.defaultDescription"] ?? "",
    applicationName: "Apex Global Tech Solution",
    // No city, no country qualifier. The audience is international and
    // geographic keywords read as "local shop" to an enterprise buyer.
    keywords: [
      "SaaS development",
      "software engineering",
      "AI automation",
      "cloud migration",
      "cybersecurity",
      "managed IT",
      "DevOps",
      "technology consulting",
    ],
    openGraph: {
      type: "website",
      siteName: "Apex Global Tech Solution",
      title: s["seo.defaultTitle"] ?? "Apex Global Tech Solution",
      description: s["seo.defaultDescription"] ?? "",
      url: siteUrl(),
    },
    twitter: { card: "summary_large_image" },
    robots: { index: true, follow: true },
    verification: process.env.GOOGLE_SITE_VERIFICATION
      ? { google: process.env.GOOGLE_SITE_VERIFICATION }
      : undefined,
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F6F8F7" },
    { media: "(prefers-color-scheme: dark)", color: "#0F101B" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Chrome lives in (site)/layout.tsx so that /lp campaign pages can opt out
  // of navigation entirely.
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
