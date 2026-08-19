import type { Metadata } from "next";
import TechHero from "@/components/companies/tech-solution/TechHero";
import TechAbout from "@/components/companies/tech-solution/TechAbout";
import TechSaaS from "@/components/companies/tech-solution/TechSaaS";
import TechITServices from "@/components/companies/tech-solution/TechITServices";
import TechAI from "@/components/companies/tech-solution/TechAI";
import TechSoftwareDev from "@/components/companies/tech-solution/TechSoftwareDev";
import TechCloud from "@/components/companies/tech-solution/TechCloud";
import TechCybersecurity from "@/components/companies/tech-solution/TechCybersecurity";
import TechConsulting from "@/components/companies/tech-solution/TechConsulting";
import TechCustom from "@/components/companies/tech-solution/TechCustom";
import TechIndustries from "@/components/companies/tech-solution/TechIndustries";
import TechCaseStudies from "@/components/companies/tech-solution/TechCaseStudies";
import TechCrossDiscovery from "@/components/companies/tech-solution/TechCrossDiscovery";
import TechFinalCTA from "@/components/companies/tech-solution/TechFinalCTA";
import { SITE_URL } from "@/lib/site-url";
import { jsonLdProps } from "@apex/site-kit/json-ld";

export const metadata: Metadata = {
  title: "Apex Global Tech Solution",
  description:
    "Apex Global Tech Solution delivers SaaS, IT services, software development, AI, cloud, cybersecurity and digital solutions for the modern enterprise.",
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType:
    "Technology, SaaS, IT, AI, Software, Cloud, Cybersecurity, Digital Solutions, Technology Consulting",
  name: "Apex Global Tech Solution",
  provider: {
    "@type": "Organization",
    name: "Apex Group of Companies",
    url: SITE_URL,
  },
  areaServed: {
    "@type": "Place",
    name: "Global",
  },
  description:
    "Technology-focused company of the Apex Group, operating across SaaS, IT services, software development, AI, cloud, cybersecurity and digital solutions.",
};

export default function TechSolutionPage() {
  return (
    <main>
      <script type="application/ld+json" {...jsonLdProps(serviceJsonLd)} />
      <TechHero />
      <TechAbout />
      <TechSaaS />
      <TechITServices />
      <TechAI />
      <TechSoftwareDev />
      <TechCloud />
      <TechCybersecurity />
      <TechConsulting />
      <TechCustom />
      <TechIndustries />
      <TechCaseStudies />
      <TechCrossDiscovery />
      <TechFinalCTA />
    </main>
  );
}
