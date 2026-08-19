import type { Metadata } from "next";

/**
 * Metadata for /saudi-car-rental/riyadh.
 *
 * The page is a client component — the enquiry modal holds state — and a
 * client component cannot export `metadata`. Without this the page served
 * the root layout's title, which is the one thing a city landing page
 * cannot afford: these routes exist to rank on city-level search intent.
 */
export const metadata: Metadata = {
  title: "Riyadh Car Rental",
  description:
    "Car rental in Riyadh for business and family travel. Self-drive and chauffeur options in the Kingdom's capital, confirmed at enquiry.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
