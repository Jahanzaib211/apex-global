import Hero from "@/components/home/Hero";
import GroupIntro from "@/components/home/GroupIntro";
import OurCompanies from "@/components/home/OurCompanies";
import Ecosystem from "@/components/home/Ecosystem";
import WhyApex from "@/components/home/WhyApex";
import CrossBusinessDiscovery from "@/components/home/CrossBusinessDiscovery";
import FinalCTA from "@/components/home/FinalCTA";
import { jsonLdProps } from "@apex/site-kit/json-ld";
import { SITE_URL } from "@/lib/site-url";
import { APEX_SOCIALS } from "@apex/site-kit/social";
/**
 * The homepage carried no structured data at all, while ten inner pages did.
 * This is the page a query for the group as an entity resolves to, so it is
 * the one that most needs Organization + WebSite.
 */
const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Apex Group of Companies",
  url: SITE_URL,
  slogan: "One Group. One Vision.",
  description:
    "Apex Group of Companies brings together specialized businesses across technology, outsourcing, travel, real estate and financial consultancy.",
  sameAs: APEX_SOCIALS.map((s) => s.href),
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "Apex Group of Companies",
  publisher: { "@id": `${SITE_URL}/#organization` },
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" {...jsonLdProps(orgSchema)} />
      <script type="application/ld+json" {...jsonLdProps(websiteSchema)} />
      <main>
      <Hero />
      <GroupIntro />
      <OurCompanies />
      <Ecosystem />
      <WhyApex />
      <CrossBusinessDiscovery />
      <FinalCTA />
      </main>
    </>
  );
}
