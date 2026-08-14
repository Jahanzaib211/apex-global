import type { Metadata } from "next";
import OutsourcingHero from "@/components/companies/outsourcing/OutsourcingHero";
import OutsourcingAbout from "@/components/companies/outsourcing/OutsourcingAbout";
import OutsourcingBPO from "@/components/companies/outsourcing/OutsourcingBPO";
import OutsourcingCX from "@/components/companies/outsourcing/OutsourcingCX";
import OutsourcingTeleSales from "@/components/companies/outsourcing/OutsourcingTeleSales";
import OutsourcingLeadGen from "@/components/companies/outsourcing/OutsourcingLeadGen";
import OutsourcingMarketing from "@/components/companies/outsourcing/OutsourcingMarketing";
import OutsourcingDedicated from "@/components/companies/outsourcing/OutsourcingDedicated";
import OutsourcingBackOffice from "@/components/companies/outsourcing/OutsourcingBackOffice";
import OutsourcingTech from "@/components/companies/outsourcing/OutsourcingTech";
import OutsourcingAI from "@/components/companies/outsourcing/OutsourcingAI";
import OutsourcingIndustries from "@/components/companies/outsourcing/OutsourcingIndustries";
import OutsourcingCaseStudies from "@/components/companies/outsourcing/OutsourcingCaseStudies";
import OutsourcingCrossDiscovery from "@/components/companies/outsourcing/OutsourcingCrossDiscovery";
import OutsourcingFinalCTA from "@/components/companies/outsourcing/OutsourcingFinalCTA";
import { SITE_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Apex Global Outsourcing | People. Process. Performance. Global Scale.",
  description:
    "Apex Global Outsourcing delivers BPO, customer experience, telesales, lead generation, digital marketing and dedicated offshore teams built around your business.",
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType:
    "BPO, Customer Experience, Telesales, Lead Generation, Digital Marketing, Back-Office, Dedicated Teams",
  name: "Apex Global Outsourcing",
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
    "People-operations company of the Apex Group — building global teams for customer experience, sales, lead generation, back-office and dedicated offshore functions.",
};

export default function OutsourcingPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <OutsourcingHero />
      <OutsourcingAbout />
      <OutsourcingBPO />
      <OutsourcingCX />
      <OutsourcingTeleSales />
      <OutsourcingLeadGen />
      <OutsourcingMarketing />
      <OutsourcingDedicated />
      <OutsourcingBackOffice />
      <OutsourcingTech />
      <OutsourcingAI />
      <OutsourcingIndustries />
      <OutsourcingCaseStudies />
      <OutsourcingCrossDiscovery />
      <OutsourcingFinalCTA />
    </main>
  );
}
