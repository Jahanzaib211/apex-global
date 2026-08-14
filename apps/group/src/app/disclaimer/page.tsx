import {
  LegalCTA,
  LegalContent,
  LegalHero,
  WebPageSchema,
  type LegalSection,
} from "@/components/LegalPage";
const sections: LegalSection[] = [
  {
    title: "General Disclaimer",
    content: (
      <p>
        Information on this website is provided for general awareness and business communication. We
        work to keep it accurate and current, but we do not warrant that every page is complete,
        error-free, continuously available, or suitable for a particular decision. You should
        confirm important details directly with the relevant Apex company.
      </p>
    ),
  },
  {
    title: "Financial Consultancy Disclaimer",
    callout: true,
    content: (
      <p>
        Financial information is not personal investment, lending, tax, or legal advice. No outcome,
        return, approval, valuation, or funding result is guaranteed. Services are delivered only
        within the authorised scope of the relevant entity and, where required, through qualified
        professionals after appropriate client and risk assessments. Financial decisions involve
        risk and should be made after obtaining advice suited to your circumstances.
      </p>
    ),
  },
  {
    title: "Real Estate Disclaimer",
    content: (
      <p>
        Property content may describe planned, marketed, or available opportunities, but images,
        prices, specifications, title, approvals, availability, and completion dates can change.
        Nothing on this website is a binding offer or substitute for independent legal, financial,
        title, or technical due diligence.
      </p>
    ),
  },
  {
    title: "Travel Disclaimer",
    content: (
      <p>
        Travel and pilgrimage information is indicative and can change due to authorities,
        suppliers, weather, health requirements, capacity, or operational conditions. Travellers
        must independently satisfy passport, visa, insurance, vaccination, and entry requirements.
        Third-party travel providers may have separate terms and cancellation policies.
      </p>
    ),
  },
  {
    title: "External Links",
    content: (
      <p>
        External links are provided for convenience. Apex does not control third-party content,
        security, availability, or privacy practices and is not responsible for losses arising from
        their use.
      </p>
    ),
  },
  {
    title: "Professional Advice",
    content: (
      <p>
        Nothing on this website creates an adviser-client, solicitor-client, doctor-patient, broker,
        fiduciary, or other professional relationship. Submit a formal enquiry and await written
        confirmation before relying on a specialist engagement.
      </p>
    ),
  },
  {
    title: "Limitation of Liability",
    content: (
      <p>
        To the extent permitted by law, Apex Group is not responsible for indirect loss, loss of
        profits, loss of opportunity, data loss, or business interruption resulting from reliance on
        this website. Non-waivable legal rights remain unaffected.
      </p>
    ),
  },
  {
    title: "Jurisdiction",
    content: (
      <p>
        These statements are intended to be read with the applicable service terms. The laws of
        Pakistan generally govern the website, subject to mandatory rules applying in your location.
      </p>
    ),
  },
];
export default function DisclaimerPage() {
  return (
    <main>
      <LegalHero title="Disclaimer." subtitle="Last updated: [Month Day, Year]" />
      <LegalContent
        intro="Apex Group operates across specialist sectors where decisions can carry financial, operational, travel, or property consequences. This page highlights the limits of website information and the point at which independent professional advice is needed."
        sections={sections}
        disclaimer={false}
      />
      <LegalCTA
        title="Have a question about our information?"
        primary="Contact Apex"
        secondary="View Terms"
        secondaryHref="/terms"
      />
      <WebPageSchema
        name="Disclaimer"
        description="Important disclaimers for Apex Group of Companies website content."
        path="/disclaimer"
      />
    </main>
  );
}
