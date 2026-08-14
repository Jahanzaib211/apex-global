import {
  LegalCTA,
  LegalContent,
  LegalHero,
  WebPageSchema,
  type LegalSection,
} from "@/components/LegalPage";
const sections: LegalSection[] = [
  {
    title: "Acceptance of Terms",
    content: (
      <p>
        These Terms of Service govern your use of the Apex Group of Companies website and related
        digital experiences. By accessing the website, you confirm that you have read and understood
        these terms. If you do not agree, please do not use the website. Additional terms may apply
        to a specific engagement, booking, product, or agreement and will prevail where they
        conflict.
      </p>
    ),
  },
  {
    title: "Use of the Website",
    content: (
      <p>
        You may use the website for lawful information, communication, and business purposes. You
        are responsible for ensuring that information you submit is accurate, current, and
        authorised for sharing. We may suspend access where needed to protect the website, our
        users, or our rights.
      </p>
    ),
  },
  {
    title: "Intellectual Property Rights",
    content: (
      <p>
        Unless stated otherwise, the website, brand elements, text, graphics, layouts, software, and
        other materials belong to Apex Group or its licensors. You may view and print reasonable
        extracts for personal or internal business reference. You may not copy, republish, modify,
        distribute, scrape, reverse engineer, or use our materials commercially without written
        permission.
      </p>
    ),
  },
  {
    title: "User Conduct",
    content: (
      <p>
        You must not misuse the website, introduce malicious code, attempt unauthorised access,
        interfere with availability, impersonate another person, submit unlawful or defamatory
        content, infringe rights, or use automated tools to harvest information. We may preserve
        evidence and report conduct where legally required.
      </p>
    ),
  },
  {
    title: "Company Information and Services",
    content: (
      <p>
        Website content provides general information about Apex Group and its companies.
        Descriptions are not a contract, quote, offer, recommendation, or regulated advice unless a
        separate written engagement says otherwise. Availability, scope, pricing, and delivery
        depend on the relevant group company, location, capacity, and agreed terms.
      </p>
    ),
  },
  {
    title: "Financial Consultancy Disclaimer",
    callout: true,
    content: (
      <>
        <p>
          Financial consultancy services are provided only within the authorised scope of the
          relevant Apex entity and through appropriately qualified professionals. Information on
          this website is educational and should not be treated as a promise of performance, a
          recommendation to buy or sell an asset, or a guarantee of returns.
        </p>
        <ul>
          <li>Past performance does not guarantee future results.</li>
          <li>All financial decisions involve risk, including loss of capital.</li>
          <li>
            Regulated services are subject to client suitability, identity, risk, and jurisdictional
            checks.
          </li>
          <li>
            Apex does not provide tax or legal advice unless a specifically qualified professional
            is engaged to do so.
          </li>
          <li>
            No adviser-client relationship is created by browsing the website or submitting an
            initial enquiry.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "Property and Real Estate Information",
    content: (
      <p>
        Project names, visuals, descriptions, locations, availability, specifications, prices,
        timelines, and other property information may change without notice and should be
        independently verified. Marketing material is not an offer, reservation, valuation, title
        opinion, or guarantee. A binding commitment arises only through documentation executed by
        the authorised parties.
      </p>
    ),
  },
  {
    title: "Travel and Pilgrimage Information",
    content: (
      <p>
        Travel itineraries, transport, accommodation, schedules, inclusions, visa guidance, health
        requirements, and pilgrimage arrangements may change because of suppliers, authorities,
        weather, capacity, or other circumstances. Travellers remain responsible for passports,
        visas, vaccinations, insurance, health disclosures, and compliance with destination
        requirements. Apex acts as a facilitator and does not control every third-party travel
        service.
      </p>
    ),
  },
  {
    title: "Third-Party Links and Services",
    content: (
      <p>
        Links to third-party websites, suppliers, payment services, maps, social networks, or
        booking systems are provided for convenience. We do not control or endorse their content,
        availability, security, or terms. Your use of those services is governed by their own
        agreements.
      </p>
    ),
  },
  {
    title: "Limitation of Liability",
    content: (
      <p>
        To the maximum extent permitted by law, Apex Group is not liable for indirect, incidental,
        special, consequential, or punitive loss, loss of profits, loss of data, or business
        interruption arising from website use or reliance on general information. Nothing in these
        terms excludes liability that cannot lawfully be excluded, including liability for fraud or
        applicable non-waivable rights.
      </p>
    ),
  },
  {
    title: "Indemnification",
    content: (
      <p>
        You agree to defend and indemnify Apex Group, its companies, personnel, and suppliers
        against claims, losses, costs, and reasonable expenses arising from your unlawful use of the
        website, breach of these terms, infringement of another party’s rights, or information you
        submit without authority.
      </p>
    ),
  },
  {
    title: "Governing Law",
    content: (
      <p>
        These terms are governed by the laws of Pakistan, without regard to conflict-of-law
        principles, except where mandatory local consumer or data protection law applies.
      </p>
    ),
  },
  {
    title: "Dispute Resolution",
    content: (
      <p>
        We encourage you to contact us first so we can understand and resolve a concern. If a
        dispute cannot be resolved informally, it will be submitted to the competent courts of
        Pakistan unless the applicable written engagement provides another lawful process.
      </p>
    ),
  },
  {
    title: "Modifications to Terms",
    content: (
      <p>
        We may update these terms to reflect changes in the website, services, or law. The latest
        version will appear on this page. Continued use after publication means you accept the
        updated terms, subject to any rights that cannot be waived.
      </p>
    ),
  },
  {
    title: "Severability",
    content: (
      <p>
        If any provision is held invalid or unenforceable, it will be adjusted to the minimum extent
        necessary and the remaining provisions will continue in effect.
      </p>
    ),
  },
  {
    title: "Contact",
    content: (
      <p>
        Questions about these terms may be sent to the contact form at
        apex.apexgroupcompanies.com/contact, or by post to 31-20, Sector CCD Main Blvd, Sector M7
        Lake City, Lahore, Pakistan. Please reference “Website Terms” in your message. Apex Group of
        Companies (Pvt) Ltd is the contact entity unless a specific service agreement identifies
        another group company.
      </p>
    ),
  },
];
export default function TermsPage() {
  return (
    <main>
      <LegalHero title="Terms of Service." subtitle="Effective date: [Month Day, Year]" />
      <LegalContent
        intro="These terms set a clear, practical foundation for using the Apex Group website. They explain what the site can and cannot provide, how specialist services should be understood, and the responsibilities that come with using our digital channels."
        sections={sections}
        disclaimer={false}
      />
      <section className="bg-cream pb-20">
        <div className="border-gold bg-navy mx-auto max-w-4xl border-2 p-7 text-white md:p-9">
          <h2 className="font-display text-gold text-2xl">Important legal review notice</h2>
          <p className="mt-4 text-sm leading-7 text-white/75">
            This Terms of Service is provided as a general framework. Apex Group operates in
            multiple jurisdictions and may need to tailor its terms to specific legal requirements.
            The final terms must be reviewed and approved by qualified legal counsel before launch.
          </p>
        </div>
      </section>
      <LegalCTA
        title="Need clarity before you proceed?"
        primary="Contact Apex"
        secondary="Read Disclaimer"
        secondaryHref="/disclaimer"
      />
      <WebPageSchema
        name="Terms of Service"
        description="Terms governing use of the Apex Group of Companies website."
        path="/terms"
      />
    </main>
  );
}
