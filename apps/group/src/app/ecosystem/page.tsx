import EcosystemHero from "@/components/ecosystem/EcosystemHero";
import EcosystemDiagram from "@/components/ecosystem/EcosystemDiagram";
import EcosystemPrinciples from "@/components/ecosystem/EcosystemPrinciples";
import EcosystemFlow from "@/components/ecosystem/EcosystemFlow";
import EcosystemCompanies from "@/components/ecosystem/EcosystemCompanies";
import EcosystemFuture from "@/components/ecosystem/EcosystemFuture";
import EcosystemCrossDiscovery from "@/components/ecosystem/EcosystemCrossDiscovery";
import EcosystemFinalCTA from "@/components/ecosystem/EcosystemFinalCTA";
const subsidiaries = [
  "Apex Global Tech Solution",
  "Apex Global Outsourcing",
  "Apex Tours & Travels",
  "Apex Holdings",
  "Apex Financial Consultancy",
];
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
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Apex Group of Companies",
            url: "https://apexgroup.example/ecosystem",
            department: subsidiaries.map((name) => ({ "@type": "Organization", name })),
          }),
        }}
      />
    </main>
  );
}
