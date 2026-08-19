import PartnershipsHero from "@/components/partnerships/PartnershipsHero";
import PartnershipsIntro from "@/components/partnerships/PartnershipsIntro";
import PartnershipTypes from "@/components/partnerships/PartnershipTypes";
import PartnershipProcess from "@/components/partnerships/PartnershipProcess";
import PartnershipForm from "@/components/partnerships/PartnershipForm";
import PartnershipExpectations from "@/components/partnerships/PartnershipExpectations";
import PartnershipCrossDiscovery from "@/components/partnerships/PartnershipCrossDiscovery";
import PartnershipFinalCTA from "@/components/partnerships/PartnershipFinalCTA";
import { SITE_URL, url } from "@/lib/site-url";
import { APEX_SOCIALS } from "@apex/site-kit/social";
import { DEFAULT_BRANDS } from "@apex/site-kit/brand";
import { jsonLdProps } from "@apex/site-kit/json-ld";

export const metadata = {
  title: "Partnerships",
  description:
    "Partner with Apex Group. We work with technology partners, real estate developers, travel & hospitality partners, outsourcing clients, strategic advisors and professional service firms.",
};

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Partnerships — Apex Group of Companies",
  url: url("/partnerships"),
  description:
    "Partnership enquiries for Apex Group — technology, real estate, travel, outsourcing, strategic and financial/professional partnerships.",
  publisher: {
    "@type": "Organization",
    name: "Apex Group of Companies (Pvt) Ltd",
    url: SITE_URL,
  },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Apex Group of Companies (Pvt) Ltd",
  url: SITE_URL,
  logo: "/logo.png",
  description:
    "A diversified group operating specialized businesses across technology, outsourcing, travel, real estate and financial consultancy.",
  sameAs: APEX_SOCIALS.map((s) => s.href),
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "partnerships",
    telephone: DEFAULT_BRANDS["apex-group"]!.contactPhone,
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

      <script type="application/ld+json" {...jsonLdProps(contactSchema)} />
      <script type="application/ld+json" {...jsonLdProps(orgSchema)} />
    </main>
  );
}
