import type { Metadata } from "next";

/**
 * Metadata for /vehicles.
 *
 * The page is a client component — the enquiry modal holds state — and a
 * client component cannot export `metadata`. Without this the page served
 * the root layout's title, which is the one thing a city landing page
 * cannot afford: these routes exist to rank on city-level search intent.
 */
export const metadata: Metadata = {
  title: "Our Vehicle Fleet",
  description:
    "The Apex vehicle fleet for Pakistan and Saudi Arabia — sedans, SUVs, vans and coaches. Categories and availability confirmed at enquiry.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
