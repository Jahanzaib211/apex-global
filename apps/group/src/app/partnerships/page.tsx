import PartnershipsHero from "@/components/partnerships/PartnershipsHero";
import PartnershipsIntro from "@/components/partnerships/PartnershipsIntro";
import PartnershipTypes from "@/components/partnerships/PartnershipTypes";
import PartnershipProcess from "@/components/partnerships/PartnershipProcess";
import PartnershipForm from "@/components/partnerships/PartnershipForm";
import PartnershipExpectations from "@/components/partnerships/PartnershipExpectations";
import PartnershipCrossDiscovery from "@/components/partnerships/PartnershipCrossDiscovery";
import PartnershipFinalCTA from "@/components/partnerships/PartnershipFinalCTA";

export const metadata = {
  title: "Partnerships | Apex Group of Companies",
  description:
    "Partner with Apex Group. We work with technology partners, real estate developers, travel & hospitality partners, outsourcing clients, strategic advisors and professional service firms.",
};

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Partnerships — Apex Group of Companies",
  url: "https://apexgroup.pk/partnerships",
  description:
    "Partnership enquiries for Apex Group — technology, real estate, travel, outsourcing, strategic and financial/professional partnerships.",
  publisher: {
    "@type": "Organization",
    name: "Apex Group of Companies (Pvt) Ltd",
    url: "https://apexgroup.pk",
  },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Apex Group of Companies (Pvt) Ltd",
  url: "https://apexgroup.pk",
  logo: "/logo.png",
  description:
    "A diversified group operating specialized businesses across technology, outsourcing, travel, real estate and financial consultancy.",
  sameAs: ["https://www.linkedin.com/company/apexgroup", "https://www.facebook.com/apexgroup"],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "partnerships",
    email: "partnerships@apexgroup.pk",
    areaServed: ["PK", "SA"],
    availableLanguage: ["English"],
  },
};

export default function PartnershipsPage() {
  return (
    <main>
      <PartnershipsHero />
      <PartnershipsIntro />
      <PartnershipTypes />
      <PartnershipProcess />
      <PartnershipForm />
      <PartnershipExpectations />
      <PartnershipCrossDiscovery />
      <PartnershipFinalCTA />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
    </main>
  );
}
