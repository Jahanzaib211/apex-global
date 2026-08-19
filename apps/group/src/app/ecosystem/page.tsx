import type { Metadata } from "next";
import EcosystemHero from "@/components/ecosystem/EcosystemHero";
import EcosystemDiagram from "@/components/ecosystem/EcosystemDiagram";
import EcosystemPrinciples from "@/components/ecosystem/EcosystemPrinciples";
import EcosystemFlow from "@/components/ecosystem/EcosystemFlow";
import EcosystemCompanies from "@/components/ecosystem/EcosystemCompanies";
import EcosystemFuture from "@/components/ecosystem/EcosystemFuture";
import EcosystemCrossDiscovery from "@/components/ecosystem/EcosystemCrossDiscovery";
import EcosystemFinalCTA from "@/components/ecosystem/EcosystemFinalCTA";
import { url } from "@/lib/site-url";
import { jsonLdProps } from "@apex/site-kit/json-ld";
const subsidiaries = [
  "Apex Global Tech Solution",
  "Apex Global Outsourcing",
  "Apex Tours & Travels",
  "Apex Holdings",
  "Apex Financial Consultancy",
];
export const metadata: Metadata = {
  title: "How the Group Operates",
  description:
    "How the Apex ecosystem fits together: shared standards, shared infrastructure and independent businesses with one operating model.",
};

export default function EcosystemPage() {
  return (
    <main>
      <EcosystemHero />
      <EcosystemDiagram />
      <EcosystemPrinciples />
      <EcosystemFlow />
      <EcosystemCompanies />
      <EcosystemFuture />
      <EcosystemCrossDiscovery />
      <EcosystemFinalCTA />
      <script
        type="application/ld+json"
        {...jsonLdProps({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Apex Group of Companies",
          url: url("/ecosystem"),
          department: subsidiaries.map((name) => ({ "@type": "Organization", name })),
        })}
      />
    </main>
  );
}
