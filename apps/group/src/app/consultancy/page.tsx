import ConsultancyHero from "@/components/consultancy/ConsultancyHero";
import ConsultancyIntro from "@/components/consultancy/ConsultancyIntro";
import ConsultancyApproach from "@/components/consultancy/ConsultancyApproach";
import ConsultancyClients from "@/components/consultancy/ConsultancyClients";
import ConsultancyServices from "@/components/consultancy/ConsultancyServices";
import ConsultancyProcess from "@/components/consultancy/ConsultancyProcess";
import ConsultancyForm from "@/components/consultancy/ConsultancyForm";
import ConsultancySecurity from "@/components/consultancy/ConsultancySecurity";
import ConsultancyFAQ from "@/components/consultancy/ConsultancyFAQ";
import ConsultancyCrossDiscovery from "@/components/consultancy/ConsultancyCrossDiscovery";
import ConsultancyFinalCTA from "@/components/consultancy/ConsultancyFinalCTA";
import { SITE_URL, url } from "@/lib/site-url";
import { jsonLdProps } from "@apex/site-kit/json-ld";

export const metadata = {
  title: "Financial Consultancy",
  description:
    "Apex Group provides strategic financial consultancy to High-Net-Worth Individuals, entrepreneurs, business owners and selected clients — offering a clearer view of financial position, assets, businesses, objectives and long-term opportunities.",
};

const financialServiceSchema = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  name: "Apex Group Financial Consultancy",
  url: url("/consultancy"),
  provider: {
    "@type": "Organization",
    name: "Apex Group of Companies",
    url: SITE_URL,
  },
  areaServed: { "@type": "Country", name: "Pakistan" },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Financial Consultancy Services",
    itemListElement: [
      "Personal Financial Consultancy",
      "Business Financial Consultancy",
      "Asset Review",
      "Wealth Structuring",
      "Business Growth Consultancy",
      "Capital Planning",
      "Real Estate Consultancy",
      "Investment Planning",
      "Succession & Long-Term Planning",
      "Strategic Financial Planning",
    ].map((name) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name },
    })),
  },
};

export default function ConsultancyPage() {
  return (
    <main>
      <ConsultancyHero />
      <ConsultancyIntro />
      <ConsultancyApproach />
      <ConsultancyClients />
      <ConsultancyServices />
      <ConsultancyProcess />
      <ConsultancyForm />
      <ConsultancySecurity />
      <ConsultancyFAQ />
      <ConsultancyCrossDiscovery />
      <ConsultancyFinalCTA />

      <script type="application/ld+json" {...jsonLdProps(financialServiceSchema)} />
    </main>
  );
}
