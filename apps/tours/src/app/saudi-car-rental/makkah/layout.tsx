import type { Metadata } from "next";
import { jsonLdProps } from "@apex/site-kit/json-ld";
import { breadcrumbs, carRentalService } from "@/lib/structured-data";

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

const service = carRentalService({
  name: "Makkah Car Rental",
  description:
    "Car rental in Makkah for Umrah, ziyarat and family visits, with licensed drivers and Makkah to Jeddah transfers.",
  city: "Makkah",
  country: "Saudi Arabia",
  path: "/saudi-car-rental/makkah",
});

const trail = breadcrumbs([{ name: "Saudi Car Rental", path: "/saudi-car-rental" }, { name: "Makkah", path: "/saudi-car-rental/makkah" }]);

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" {...jsonLdProps(service)} />
      <script type="application/ld+json" {...jsonLdProps(trail)} />
      {children}
    </>
  );
}
