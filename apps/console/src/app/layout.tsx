import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Apex Console", template: "%s · Apex Console" },
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
