import ToursHero from "@/components/companies/tours-travels/ToursHero";
import ToursAbout from "@/components/companies/tours-travels/ToursAbout";
import ToursPakistan from "@/components/companies/tours-travels/ToursPakistan";
import ToursSaudi from "@/components/companies/tours-travels/ToursSaudi";
import ToursHajj from "@/components/companies/tours-travels/ToursHajj";
import ToursUmrah from "@/components/companies/tours-travels/ToursUmrah";
import ToursCustom from "@/components/companies/tours-travels/ToursCustom";
import ToursGroup from "@/components/companies/tours-travels/ToursGroup";
import ToursFleet from "@/components/companies/tours-travels/ToursFleet";
import ToursResources from "@/components/companies/tours-travels/ToursResources";
import ToursGallery from "@/components/companies/tours-travels/ToursGallery";
import ToursBooking from "@/components/companies/tours-travels/ToursBooking";
import ToursCrossDiscovery from "@/components/companies/tours-travels/ToursCrossDiscovery";
import ToursFinalCTA from "@/components/companies/tours-travels/ToursFinalCTA";
import { url } from "@/lib/site-url";
import { jsonLdProps } from "@apex/site-kit/json-ld";

export const metadata = {
  title: "Apex Global Tours & Travels | Car Rentals, Hajj & Umrah | Apex Group",
  description:
    "Apex Global Tours & Travels provides car rentals in Pakistan and Saudi Arabia, Hajj and Umrah packages, and customized group travel delivered with care, safety and operational discipline.",
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Travel, Transportation, Hajj and Umrah Packages",
  provider: {
    "@type": "Organization",
    name: "Apex Global Tours & Travels",
    parentOrganization: { "@type": "Organization", name: "Apex Group of Companies" },
  },
  areaServed: [
    { "@type": "Country", name: "Pakistan" },
    { "@type": "Country", name: "Saudi Arabia" },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Travel Services",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Pakistan Car Rentals" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Saudi Arabia Car Rentals" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Hajj Packages" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Umrah Packages" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Custom Travel Packages" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Group Travel" } },
    ],
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Apex Global Tours & Travels",
  parentOrganization: { "@type": "Organization", name: "Apex Group of Companies" },
  url: url("/companies/tours-travels"),
  areaServed: [
    { "@type": "Country", name: "Pakistan" },
    { "@type": "Country", name: "Saudi Arabia" },
  ],
  address: { "@type": "PostalAddress", addressCountry: "PK" },
  priceRange: "$$",
};

export default function ToursTravelsPage() {
  return (
    <main>
      <ToursHero />
      <ToursAbout />
      <ToursPakistan />
      <ToursSaudi />
      <ToursHajj />
      <ToursUmrah />
      <ToursCustom />
      <ToursGroup />
      <ToursFleet />
      <ToursResources />
      <ToursGallery />
      <ToursBooking />
      <ToursCrossDiscovery />
      <ToursFinalCTA />

      <script type="application/ld+json" {...jsonLdProps(serviceSchema)} />
      <script type="application/ld+json" {...jsonLdProps(localBusinessSchema)} />
    </main>
  );
}
