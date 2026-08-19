import type { Metadata } from "next";
import { ROUTE_META } from "@/lib/nav";

export const metadata: Metadata = {
  title: ROUTE_META["/careers"]!.title,
  description: ROUTE_META["/careers"]!.description,
  alternates: { canonical: "/careers" },
  openGraph: {
    // Declaring openGraph replaces the root layout\'s entire node, which
    // dropped its image. The generated card lives at /opengraph-image.
    images: ["/opengraph-image"],
    title: ROUTE_META["/careers"]!.title,
    description: ROUTE_META["/careers"]!.description,
    url: "/careers",
  },
};

export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
