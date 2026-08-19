import type { Metadata } from "next";
import CompaniesIndexHero from "@/components/companies-index/CompaniesIndexHero";
import CompaniesIndexList from "@/components/companies-index/CompaniesIndexList";
import CompaniesIndexWhy from "@/components/companies-index/CompaniesIndexWhy";
import CompaniesIndexFuture from "@/components/companies-index/CompaniesIndexFuture";
import CompaniesIndexCrossDiscovery from "@/components/companies-index/CompaniesIndexCrossDiscovery";
import CompaniesIndexFinalCTA from "@/components/companies-index/CompaniesIndexFinalCTA";
import { jsonLdProps } from "@apex/site-kit/json-ld";
const names = [
  "Apex Global Tech Solution",
  "Apex Global Outsourcing",
  "Apex Tours & Travels",
  "Apex Holdings",
  "Apex Financial Consultancy",
];
export const metadata: Metadata = {
  title: "Our Companies",
  description:
    "Specialized businesses, unified vision — technology, outsourcing, travel, real estate and financial consultancy under Apex Group.",
};

export default function CompaniesPage() {
  return (
    <main>
      <CompaniesIndexHero />
      <CompaniesIndexList />
      <CompaniesIndexWhy />
      <CompaniesIndexFuture />
      <CompaniesIndexCrossDiscovery />
      <CompaniesIndexFinalCTA />
      <script
        type="application/ld+json"
        {...jsonLdProps({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Apex Group Companies",
          itemListElement: names.map((name, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: { "@type": "Organization", name },
          })),
        })}
      />
    </main>
  );
}
