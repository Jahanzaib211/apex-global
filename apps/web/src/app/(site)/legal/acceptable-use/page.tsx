import { Section } from "@apex/ui";
import type { Metadata } from "next";
import { ContactBlock, LegalDoc } from "@/components/legal/legal-doc";
import { getSettings } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Acceptable use policy",
  description:
    "The rules for using Apex Global Tech Solution's website, portals, platforms and SaaS products.",
  alternates: { canonical: absoluteUrl("/legal/acceptable-use") },
};

export default async function AcceptableUsePolicyPage() {
  const s = await getSettings();
  const email = s["org.email"];

  return (
    <Section tone="page" className="py-16 md:py-20">
      <div className="mx-auto max-w-[var(--container-prose)]">
        <LegalDoc
          title="Acceptable use policy"
          lead="These rules apply to everyone who uses our website, portals, SaaS products and platforms. They keep the estate safe for every customer."
          updated="3 August 2026"
          sections={[
            {
              id: "prohibited",
              heading: "What you may not do",
              body: (
                <ul className="mt-3 flex flex-col gap-2">
                  <li>Attempt to access our infrastructure outside your own account or role.</li>
                  <li>Probe, fuzz or attack our systems without written authorisation.</li>
                  <li>
                    Distribute malware, phishing content or illegal material through any platform we
                    run.
                  </li>
                  <li>Send spam or bulk messages through our products.</li>
                  <li>Interfere with the experience of other customers.</li>
                  <li>
                    Oversell, aggregate or resell access to a product we host unless a signed
                    agreement allows it.
                  </li>
                </ul>
              ),
            },
            {
              id: "forms",
              heading: "Forms and enquiries",
              body: (
                <p>
                  Our enquiry forms are protected against abuse with rate-limiting and salted,
                  rotating hashes of your IP. Deliberately submitting false enquiries, or automating
                  form submissions, is a breach of this policy.
                </p>
              ),
            },
            {
              id: "enforcement",
              heading: "Enforcement",
              body: (
                <p>
                  We review suspicious activity and may suspend access with an explanation. For
                  activity that places other customers at risk, we may act before telling you.
                </p>
              ),
            },
            {
              id: "report",
              heading: "Report a problem",
              body: (
                <p>
                  Report abuse, vulnerabilities or incidents to the contact below. We handle
                  activity reports with discretion.
                </p>
              ),
            },
            {
              id: "contact",
              heading: "Contact",
              body: <ContactBlock email={email} />,
            },
          ]}
        />
      </div>
    </Section>
  );
}
