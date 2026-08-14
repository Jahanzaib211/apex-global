import type { Metadata } from "next";
import { ROUTE_META } from "@/lib/nav";

export const metadata: Metadata = {
  title: ROUTE_META["/careers"]!.title,
  description: ROUTE_META["/careers"]!.description,
  alternates: { canonical: "/careers" },
  openGraph: {
    title: ROUTE_META["/careers"]!.title,
    description: ROUTE_META["/careers"]!.description,
    url: "/careers",
  },
};

export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
