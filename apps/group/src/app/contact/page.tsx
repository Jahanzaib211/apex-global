import ContactHero from "@/components/contact/ContactHero";
import ContactForm from "@/components/contact/ContactForm";
import ContactOffices from "@/components/contact/ContactOffices";
import ContactChannels from "@/components/contact/ContactChannels";
import ContactCompanyRouting from "@/components/contact/ContactCompanyRouting";
import ContactCrossDiscovery from "@/components/contact/ContactCrossDiscovery";
import ContactFinalCTA from "@/components/contact/ContactFinalCTA";
import { SITE_URL, url } from "@/lib/site-url";
import { DEFAULT_BRANDS } from "@apex/site-kit/brand";
import { jsonLdProps } from "@apex/site-kit/json-ld";

export const metadata = {
  title: "Contact | Apex Group of Companies",
  description:
    "Get in touch with Apex Group of Companies. Reach our headquarters, regional offices, or contact a specific company across the Group for enquiries, partnerships, media, or careers.",
};

const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Apex Group of Companies",
  url: url("/contact"),
  description:
    "Contact page for Apex Group of Companies — general enquiries, partnerships, media, and careers across our Group businesses.",
  publisher: {
    "@type": "Organization",
    name: "Apex Group of Companies (Pvt) Ltd",
    url: SITE_URL,
  },
  areaServed: [
    { "@type": "Country", name: "Pakistan" },
    { "@type": "Country", name: "Saudi Arabia" },
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      telephone: DEFAULT_BRANDS["apex-group"]!.contactPhone,
      areaServed: ["PK", "SA"],
      availableLanguage: ["English"],
    },
  ],
};

export default function ContactPage() {
  return (
    <main>
      <ContactHero />
      <ContactForm />
      <ContactOffices />
      <ContactChannels />
      <ContactCompanyRouting />
      <ContactCrossDiscovery />
      <ContactFinalCTA />

      <script type="application/ld+json" {...jsonLdProps(contactPageSchema)} />
    </main>
  );
}
