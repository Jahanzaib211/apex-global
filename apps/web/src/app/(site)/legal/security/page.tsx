import { Section } from "@apex/ui";
import type { Metadata } from "next";
import { ContactBlock, LegalDoc } from "@/components/legal/legal-doc";
import { getSettings } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Security and compliance",
  description:
    "How Apex Global Tech Solution secures the estate it runs, and the status of each compliance framework in its programme — SOC 2 Type II, ISO 27001 and HIPAA.",
  alternates: { canonical: absoluteUrl("/legal/security") },
};

export default async function SecurityPage() {
  const s = await getSettings();
  const email = s["org.email"];

  return (
    <Section tone="page" className="py-16 md:py-20">
      <div className="mx-auto max-w-[var(--container-prose)]">
        <LegalDoc
          title="Security and compliance"
          lead="How the estate is secured, and exactly where each compliance framework stands. Frameworks are listed from the day an engagement begins, marked in progress until the audit closes — never before."
          updated="13 August 2026"
          notice="A framework listed as in progress means an audit is underway or engaged, not completed. We do not describe an unaudited control set as certified."
          sections={[
            {
              id: "posture",
              heading: "Security posture",
              body: (
                <>
                  <p>
                    Every service runs bound to loopback. There is no inbound port to scan: public
                    reachability comes from an authenticated outbound tunnel, so the origin is not
                    addressable from the internet even if a hostname is known.
                  </p>
                  <p className="mt-4">
                    Datastores are loopback-bound, traffic is encrypted in transit, and stored
                    provider credentials are sealed with a per-environment encryption key that is
                    never shared between environments. Backups are encrypted before they leave the
                    host, and restores are tested rather than assumed.
                  </p>
                </>
              ),
            },
            {
              id: "soc2",
              heading: "SOC 2 Type II",
              body: (
                <p>
                  <strong>Status: in progress.</strong> SOC 2 Type II reports on the operating
                  effectiveness of controls over a monitoring window rather than at a point in time,
                  so a report only exists once that window has elapsed and the audit has closed. We
                  publish the report date here when it does. Until then this entry states
                  engagement, not attestation.
                </p>
              ),
            },
            {
              id: "iso27001",
              heading: "ISO 27001",
              body: (
                <p>
                  <strong>Status: in progress.</strong> ISO 27001 certifies an information security
                  management system — the documented process by which risks are identified, treated
                  and reviewed. Work covers the statement of applicability and the risk treatment
                  plan. The certificate number and issuing body will be listed here on
                  certification.
                </p>
              ),
            },
            {
              id: "hipaa",
              heading: "HIPAA",
              body: (
                <p>
                  <strong>Status: in progress.</strong> HIPAA is a regulatory obligation rather than
                  a certification a body awards, so no certificate exists to display. Where an
                  engagement involves protected health information, we sign a business associate
                  agreement and apply the safeguards it requires. Ask for the current BAA template
                  through the contact below.
                </p>
              ),
            },
            {
              id: "gdpr",
              heading: "GDPR",
              body: (
                <p>
                  Our role, the scope of processing, sub-processors, data subject rights and
                  cross-border transfer safeguards are set out in the{" "}
                  <a href="/legal/data-processing" className="underline underline-offset-4">
                    data processing agreement
                  </a>
                  , with the current processor list on the{" "}
                  <a href="/legal/subprocessors" className="underline underline-offset-4">
                    sub-processors page
                  </a>
                  .
                </p>
              ),
            },
            {
              id: "reporting",
              heading: "Reporting a vulnerability",
              body: (
                <>
                  <p>
                    If you believe you have found a vulnerability, report it to the address below
                    before disclosing it publicly. We will acknowledge the report, keep you updated
                    while it is investigated, and will not pursue action against good-faith research
                    that avoids privacy violations and service degradation.
                  </p>
                  <div className="mt-4">
                    <ContactBlock email={email} />
                  </div>
                </>
              ),
            },
          ]}
        />
      </div>
    </Section>
  );
}
