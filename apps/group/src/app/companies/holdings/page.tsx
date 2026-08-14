import HoldingsHero from "@/components/companies/holdings/HoldingsHero";
import HoldingsAbout from "@/components/companies/holdings/HoldingsAbout";
import HoldingsMarketing from "@/components/companies/holdings/HoldingsMarketing";
import HoldingsPortfolio from "@/components/companies/holdings/HoldingsPortfolio";
import HoldingsFeatured from "@/components/companies/holdings/HoldingsFeatured";
import HoldingsCategories from "@/components/companies/holdings/HoldingsCategories";
import HoldingsMarketed from "@/components/companies/holdings/HoldingsMarketed";
import HoldingsDevelopments from "@/components/companies/holdings/HoldingsDevelopments";
import HoldingsFuture from "@/components/companies/holdings/HoldingsFuture";
import HoldingsPartnerships from "@/components/companies/holdings/HoldingsPartnerships";
import HoldingsSiteVisits from "@/components/companies/holdings/HoldingsSiteVisits";
import HoldingsGallery from "@/components/companies/holdings/HoldingsGallery";
import HoldingsCrossDiscovery from "@/components/companies/holdings/HoldingsCrossDiscovery";
import HoldingsFinalCTA from "@/components/companies/holdings/HoldingsFinalCTA";

export const metadata = {
  title: "Apex Holdings | Real Estate Marketing & Future Development | Apex Group",
  description:
    "Apex Holdings is the Group's real estate business — marketing a curated portfolio of projects across Pakistan, with a long-term direction toward self-owned development.",
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Real Estate Project Marketing and Sales Coordination",
  provider: {
    "@type": "Organization",
    name: "Apex Holdings",
    parentOrganization: { "@type": "Organization", name: "Apex Group of Companies" },
  },
  areaServed: { "@type": "Country", name: "Pakistan" },
};

const realEstateAgentSchema = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "Apex Holdings",
  parentOrganization: { "@type": "Organization", name: "Apex Group of Companies" },
  url: "https://apexgroup.pk/companies/holdings",
  areaServed: { "@type": "Country", name: "Pakistan" },
  address: { "@type": "PostalAddress", addressCountry: "PK" },
};

export default function HoldingsPage() {
  return (
    <main>
      <HoldingsHero />
      <HoldingsAbout />
      <HoldingsMarketing />
      <HoldingsPortfolio />
      <HoldingsFeatured />
      <HoldingsCategories />
      <HoldingsMarketed />
      <HoldingsDevelopments />
      <HoldingsFuture />
      <HoldingsPartnerships />
      <HoldingsSiteVisits />
      <HoldingsGallery />
      <HoldingsCrossDiscovery />
      <HoldingsFinalCTA />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(realEstateAgentSchema) }}
      />
    </main>
  );
}
