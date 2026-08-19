import type { Metadata } from "next";
import { jsonLdProps } from "@apex/site-kit/json-ld";
import { breadcrumbs, carRentalService } from "@/lib/structured-data";

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

const service = carRentalService({
  name: "Self-Drive Car Rental in Pakistan",
  description:
    "Self-drive car rental in Pakistan with clean, inspected vehicles and terms confirmed in writing before booking.",
  city: "Pakistan",
  country: "Pakistan",
  path: "/self-drive-car-rental",
});

const trail = breadcrumbs([{ name: "Pakistan Car Rental", path: "/pakistan-car-rental" }, { name: "Self-Drive", path: "/self-drive-car-rental" }]);

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" {...jsonLdProps(service)} />
      <script type="application/ld+json" {...jsonLdProps(trail)} />
      {children}
    </>
  );
}
