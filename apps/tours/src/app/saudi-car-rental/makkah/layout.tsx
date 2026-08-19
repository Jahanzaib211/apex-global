import type { Metadata } from "next";

/**
 * Metadata for /saudi-car-rental/makkah.
 *
 * The page is a client component — the enquiry modal holds state — and a
 * client component cannot export `metadata`. Without this the page served
 * the root layout's title, which is the one thing a city landing page
 * cannot afford: these routes exist to rank on city-level search intent.
 */
export const metadata: Metadata = {
  title: "Makkah Car Rental",
  description:
    "Car rental in Makkah for Umrah, ziyarat and family visits. Licensed drivers for the holy city plus Makkah to Jeddah transfers.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
