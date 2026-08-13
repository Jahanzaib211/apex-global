import { Section } from "@apex/ui";
import type { Metadata } from "next";
import { ContactBlock, LegalDoc } from "@/components/legal/legal-doc";
import { getSettings } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Data processing agreement",
  description:
    "How Apex Global Tech Solution processes personal data on behalf of clients, its sub-processors, and the rights data subjects can exercise.",
  alternates: { canonical: absoluteUrl("/legal/data-processing") },
};

export default async function DataProcessingPage() {
  const s = await getSettings();
  const email = s["org.email"];
  const dpoEmail = s["org.disputeEmail"] || email;

  return (
    <Section tone="page" className="py-16 md:py-20">
      <div className="mx-auto max-w-[var(--container-prose)]">
        <LegalDoc
          title="Data processing agreement"
          lead="Where we process personal data on a client's behalf — for example running a SaaS product that stores the client's customers or users — this DPA describes how, where and for how long, and the rights you can exercise."
          updated="3 August 2026"
          notice="This is a description of our position, not a signed contract. A bespoke DPA is provided as a schedule to client agreements where required."
          sections={[
            {
              id: "roles",
              heading: "Roles",
              body: (
                <p>
                  The client is the controller of the data its users and customers provide. We act
                  as a processor, processing only to operate the product or service under the
                  client's instructions. We do not use client data to train models or for any
                  purpose outside the engagement.
                </p>
              ),
            },
            {
              id: "what-we-process",
              heading: "What we process",
              body: (
                <p>
                  We process the data required to operate the product: account details, content the
                  client or its users submit, logs that keep the service secure, and backups. The
                  scope of processing for a specific engagement is defined in the statement of work;
                  this page does not extend it.
                </p>
              ),
            },
            {
              id: "sub-processors",
              heading: "Sub-processors",
              body: (
                <p>
                  Where we use a sub-processor to deliver a service, we name it on the
                  sub-processors page. We remain responsible for their compliance and review the
                  list as the estate changes.
                </p>
              ),
            },
            {
              id: "security",
              heading: "Security",
              body: (
                <p>
                  Personal data is protected by the measures described on our technology and
                  infrastructure pages: no inbound ports, authenticated tunnels, encryption in
                  transit, datastores bound to loopback, backups and tested restores. Access to
                  production data is limited and logged.
                </p>
              ),
            },
            {
              id: "data-subject-rights",
              heading: "Data subject rights",
              body: (
                <p>
                  Where a data subject asks to access, rectify, or delete their data, we respond
                  within one month. We may forward the request to the controller where that is who
                  holds the relationship. Requests go to the contact below.
                </p>
              ),
            },
            {
              id: "cross-border",
              heading: "Cross-border transfers",
              body: (
                <p>
                  We prefer infrastructure that is located in the client's own region or chosen
                  jurisdiction. Where data is processed elsewhere, appropriate transfer safeguards
                  are applied in line with the applicable data protection law.
                </p>
              ),
            },
            {
              id: "contact",
              heading: "Privacy and DPO contact",
              body: <ContactBlock email={dpoEmail} />,
            },
          ]}
        />
      </div>
    </Section>
  );
}
