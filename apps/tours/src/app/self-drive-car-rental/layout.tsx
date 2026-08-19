import type { Metadata } from "next";

/**
 * Metadata for /self-drive-car-rental.
 *
 * The page is a client component — the enquiry modal holds state — and a
 * client component cannot export `metadata`. Without this the page served
 * the root layout's title, which is the one thing a city landing page
 * cannot afford: these routes exist to rank on city-level search intent.
 */
export const metadata: Metadata = {
  title: "Self-Drive Car Rental in Pakistan",
  description:
    "Self-drive car rental in Pakistan. Clean, inspected vehicles with terms, deposit and coverage confirmed by Apex in writing before you book.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
