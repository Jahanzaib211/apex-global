import { Section } from "@apex/ui";
import type { Metadata } from "next";
import { ContactBlock, LegalDoc } from "@/components/legal/legal-doc";
import { getSettings } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms governing use of the Apex Global Tech Solution website.",
  alternates: { canonical: absoluteUrl("/legal/terms") },
};

/** Website terms only. Client engagements are governed by their own contract. */
export default async function TermsPage() {
  const settings = await getSettings();
  const email = settings["org.email"];

  return (
    <Section tone="page" className="py-16 md:py-20">
      <div className="mx-auto max-w-[var(--container-prose)]">
        <LegalDoc
          title="Terms"
          lead="These terms cover use of this website. Work we do for clients is governed by a separate signed agreement, and nothing here overrides it."
          updated="3 August 2026"
          sections={[
            {
              id: "content",
              heading: "Content on this site",
              body: (
                <p>
                  We take care that what we publish is accurate, and every figure we state carries
                  its source. Descriptions of our capability are not a contractual commitment; the
                  scope of any work is what appears in a signed proposal.
                </p>
              ),
            },
            {
              id: "third-party",
              heading: "Third-party software and trademarks",
              body: (
                <p>
                  Where our work builds on an open-source project, that project is named with its
                  licence on the page. Product and company names belonging to others are their
                  trademarks, referenced descriptively.
                </p>
              ),
            },
            {
              id: "intellectual-property",
              heading: "Intellectual property",
              body: (
                <p>
                  The design, text and code of this website belong to Apex Global Tech Solution
                  unless stated otherwise. Ownership of work produced for a client is set by that
                  client&apos;s agreement.
                </p>
              ),
            },
            {
              id: "live-systems",
              heading: "Links to live systems",
              body: (
                <p>
                  Where we link to a system we operate, it is a production service and may be under
                  maintenance at the time you visit. Systems described as not publicly reachable are
                  demonstrated privately on request.
                </p>
              ),
            },
            {
              id: "liability",
              heading: "Liability",
              body: (
                <p>
                  This site is provided as information. We are not liable for decisions taken solely
                  on the basis of it.
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
