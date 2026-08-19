import type { Metadata } from "next";

/**
 * Metadata for /saudi-car-rental/madinah.
 *
 * The page is a client component — the enquiry modal holds state — and a
 * client component cannot export `metadata`. Without this the page served
 * the root layout's title, which is the one thing a city landing page
 * cannot afford: these routes exist to rank on city-level search intent.
 */
export const metadata: Metadata = {
  title: "Madinah Car Rental",
  description:
    "Car rental in Madinah for ziyarat, prayer visits and family stays. Licensed drivers for Masjid an-Nabawi and MED airport pickups.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
