import CareersHero from "@/components/careers/CareersHero";
import CareersIntro from "@/components/careers/CareersIntro";
import CareersExperience from "@/components/careers/CareersExperience";
import CareersValues from "@/components/careers/CareersValues";
import CareersProcess from "@/components/careers/CareersProcess";
import CareersCrossDiscovery from "@/components/careers/CareersCrossDiscovery";
import CareersFinalCTA from "@/components/careers/CareersFinalCTA";
import { SITE_URL } from "@/lib/site-url";
import { jsonLdProps } from "@apex/site-kit/json-ld";

export const metadata = {
  title: "Careers | Apex Group of Companies",
  description:
    "Build a career with Apex Group of Companies. Explore roles across technology, outsourcing, travel, real estate and financial consultancy.",
};

const jobPostingSchema = {
  "@context": "https://schema.org",
  "@type": "JobPosting",
  title: "Apex Group Careers — General Application",
  description:
    "General application for roles across Apex Group of Companies. Current vacancies are listed on the Careers page.",
  datePosted: "2025-01-01",
  employmentType: "FULL_TIME",
  hiringOrganization: {
    "@type": "Organization",
    name: "Apex Group of Companies (Pvt) Ltd",
    sameAs: SITE_URL,
    logo: "/logo.png",
  },
  jobLocation: {
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      addressCountry: "PK",
      addressLocality: "Karachi",
    },
  },
  applicantLocationRequirements: [
    { "@type": "Country", name: "Pakistan" },
    { "@type": "Country", name: "Saudi Arabia" },
  ],
  validThrough: "2026-12-31",
};

export default function CareersPage() {
  return (
    <main>
      <CareersHero />
      <CareersIntro />
      <CareersExperience />
      <CareersValues />
      <CareersProcess />
      <CareersCrossDiscovery />
      <CareersFinalCTA />

      <script type="application/ld+json" {...jsonLdProps(jobPostingSchema)} />
    </main>
  );
}
