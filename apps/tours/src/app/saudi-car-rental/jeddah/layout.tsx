import type { Metadata } from "next";
import { jsonLdProps } from "@apex/site-kit/json-ld";
import { breadcrumbs, carRentalService } from "@/lib/structured-data";

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

const service = carRentalService({
  name: "Jeddah Car Rental",
  description:
    "Car rental in Jeddah with JED airport transfers, hotel pickups and a Jeddah to Makkah intercity service.",
  city: "Jeddah",
  country: "Saudi Arabia",
  path: "/saudi-car-rental/jeddah",
});

const trail = breadcrumbs([{ name: "Saudi Car Rental", path: "/saudi-car-rental" }, { name: "Jeddah", path: "/saudi-car-rental/jeddah" }]);

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" {...jsonLdProps(service)} />
      <script type="application/ld+json" {...jsonLdProps(trail)} />
      {children}
    </>
  );
}
