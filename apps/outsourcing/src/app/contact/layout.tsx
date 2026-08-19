import type { Metadata } from "next";
import { ROUTE_META } from "@/lib/nav";

export const metadata: Metadata = {
  title: ROUTE_META["/contact"]!.title,
  description: ROUTE_META["/contact"]!.description,
  alternates: { canonical: "/contact" },
  openGraph: {
    // Declaring openGraph replaces the root layout\'s entire node, which
    // dropped its image. The generated card lives at /opengraph-image.
    images: ["/opengraph-image"],
    title: ROUTE_META["/contact"]!.title,
    description: ROUTE_META["/contact"]!.description,
    url: "/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
