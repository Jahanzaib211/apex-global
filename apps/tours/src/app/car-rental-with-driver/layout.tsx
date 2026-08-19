import type { Metadata } from "next";
import { jsonLdProps } from "@apex/site-kit/json-ld";
import { breadcrumbs, carRentalService } from "@/lib/structured-data";

/**
 * Metadata for /car-rental-with-driver.
 *
 * The page is a client component — the enquiry modal holds state — and a
 * client component cannot export `metadata`. Without this the page served
 * the root layout's title, which is the one thing a city landing page
 * cannot afford: these routes exist to rank on city-level search intent.
 */
export const metadata: Metadata = {
  title: "Car Rental With Driver in Pakistan",
  description:
    "Chauffeur-driven car rental across Pakistan — airport runs, intercity trips, corporate days and family travel with a vetted driver.",
};

const service = carRentalService({
  name: "Car Rental With Driver in Pakistan",
  description:
    "Chauffeur-driven car rental across Pakistan for airport runs, intercity trips, corporate days and family travel.",
  city: "Pakistan",
  country: "Pakistan",
  path: "/car-rental-with-driver",
});

const trail = breadcrumbs([{ name: "Pakistan Car Rental", path: "/pakistan-car-rental" }, { name: "With Driver", path: "/car-rental-with-driver" }]);

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" {...jsonLdProps(service)} />
      <script type="application/ld+json" {...jsonLdProps(trail)} />
      {children}
    </>
  );
}
