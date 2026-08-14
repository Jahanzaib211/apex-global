import type { Metadata } from "next";
import { ROUTE_META } from "@/lib/nav";

export const metadata: Metadata = {
  title: ROUTE_META["/contact"]!.title,
  description: ROUTE_META["/contact"]!.description,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: ROUTE_META["/contact"]!.title,
    description: ROUTE_META["/contact"]!.description,
    url: "/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
