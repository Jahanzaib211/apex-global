import type { Metadata } from "next";
import { jsonLdProps } from "@apex/site-kit/json-ld";
import { breadcrumbs, carRentalService } from "@/lib/structured-data";

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

const service = carRentalService({
  name: "Madinah Car Rental",
  description:
    "Car rental in Madinah for ziyarat, prayer visits and family stays, including MED airport pickups.",
  city: "Madinah",
  country: "Saudi Arabia",
  path: "/saudi-car-rental/madinah",
});

const trail = breadcrumbs([{ name: "Saudi Car Rental", path: "/saudi-car-rental" }, { name: "Madinah", path: "/saudi-car-rental/madinah" }]);

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" {...jsonLdProps(service)} />
      <script type="application/ld+json" {...jsonLdProps(trail)} />
      {children}
    </>
  );
}
