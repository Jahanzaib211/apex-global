import { Section } from "@apex/ui";
import type { Metadata } from "next";
import { ContactBlock, LegalDoc } from "@/components/legal/legal-doc";
import { getSettings } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Privacy",
  description: "What data Apex Global Tech Solution collects through this website, and why.",
  alternates: { canonical: absoluteUrl("/legal/privacy") },
};

/**
 * Written to describe what the code in this repository actually does. If the
 * lead pipeline changes, this page changes with it — a privacy policy that
 * describes a different system is worse than none.
 *
 * Not a substitute for legal review before launch.
 */
export default async function PrivacyPage() {
  const settings = await getSettings();
  const email = settings["org.email"];
  const address = settings["org.address"];

  return (
    <Section tone="page" className="py-16 md:py-20">
      <div className="mx-auto max-w-[var(--container-prose)]">
        <LegalDoc
          title="Privacy"
          lead="This describes what happens to information you give us through this website. It reflects how the site is actually built, not a generic template."
          updated="3 August 2026"
          sections={[
            {
              id: "collect",
              heading: "What we collect",
              body: (
                <p>
                  When you submit an enquiry we store what you typed: your name, email address, and
                  whichever of company, phone, country, company size, budget range, timeline and
                  message you chose to provide. Only name, email and your consent are required. We
                  also store how you arrived: campaign parameters in the link you followed, the
                  referring site, the page you landed on, your browser&apos;s user-agent string, and
                  the country your request came from.
                </p>
              ),
            },
            {
              id: "not-store",
              heading: "What we do not store",
              body: (
                <p>
                  We do not keep your IP address. It is converted to an irreversible hash with a
                  salt that rotates daily, which is enough to prevent abuse of our forms and cannot
                  be turned back into an address. We do not sell data, and we do not add you to a
                  mailing list.
                </p>
              ),
            },
            {
              id: "analytics",
              heading: "Analytics and advertising",
              body: (
                <p>
                  Third-party analytics and advertising tags load only after you consent. We record
                  your consent state alongside your enquiry so we can show why a tag did or did not
                  fire. We also run first-party analytics on our own infrastructure, which counts
                  page views without identifying you.
                </p>
              ),
            },
            {
              id: "retention",
              heading: "How long we keep it",
              body: (
                <p>
                  Enquiries are retained while they are commercially relevant and for as long as we
                  are required to keep business records. You can ask us to delete yours at any time.
                </p>
              ),
            },
            {
              id: "rights",
              heading: "Your rights",
              body: (
                <p>
                  You can ask what we hold about you, ask for it to be corrected, or ask for it to
                  be deleted. Write to us and we will action it.
                </p>
              ),
            },
            {
              id: "contact",
              heading: "Contact",
              body: <ContactBlock email={email} address={address} />,
            },
          ]}
        />
      </div>
    </Section>
  );
}
