import type { Metadata } from "next";

/**
 * Metadata for /saudi-car-rental/jeddah.
 *
 * The page is a client component — the enquiry modal holds state — and a
 * client component cannot export `metadata`. Without this the page served
 * the root layout's title, which is the one thing a city landing page
 * cannot afford: these routes exist to rank on city-level search intent.
 */
export const metadata: Metadata = {
  title: "Jeddah Car Rental",
  description:
    "Car rental in Jeddah — JED airport transfers, hotel pickups and a reliable Jeddah to Makkah intercity service with licensed drivers.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
