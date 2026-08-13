import { Section } from "@apex/ui";
import type { Metadata } from "next";
import { ContactBlock, LegalDoc } from "@/components/legal/legal-doc";
import { getSettings } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "User agreement",
  description:
    "The agreement that applies to anyone using an Apex Global Tech Solution portal, SaaS product or platform.",
  alternates: { canonical: absoluteUrl("/legal/user-agreement") },
};

export default async function UserAgreementPage() {
  const s = await getSettings();
  const email = s["org.email"];

  return (
    <Section tone="page" className="py-16 md:py-20">
      <div className="mx-auto max-w-[var(--container-prose)]">
        <LegalDoc
          title="User agreement"
          lead="This agreement applies to anyone who registers for, logs in to or otherwise uses an Apex Global Tech Solution platform, portal, dashboard or SaaS product — whether as the customer, an employee of the customer, or an end user."
          updated="3 August 2026"
          notice="Applies to hosted platforms. Work delivered for clients under a signed statement of work is governed by that engagement contract."
          sections={[
            {
              id: "account",
              heading: "Accounts and credentials",
              body: (
                <p>
                  You are responsible for maintaining the confidentiality of your account
                  credentials and for anything that happens under them. Where we issue a magic link
                  or single sign-on, it grants access only when correctly presented. Sharing
                  credentials or automated bulk access is not permitted unless an agreement with us
                  says otherwise.
                </p>
              ),
            },
            {
              id: "your-data",
              heading: "Data you submit",
              body: (
                <p>
                  The data you submit to a product is processed to provide that product to you. We
                  treat it as confidential, apply the protections in our privacy and data processing
                  pages, and we do not sell it. Backups and derived indexes are retained only for as
                  long as the product needs them.
                </p>
              ),
            },
            {
              id: "acceptable-use",
              heading: "Acceptable use",
              body: (
                <p>
                  You must not use our products to break the law, to attack other systems, to
                  distribute malware, to attempt to access our infrastructure outside your account,
                  or to interfere with other customers. We may suspend access where a risk is
                  immediate — and we will tell you why.
                </p>
              ),
            },
            {
              id: "termination",
              heading: "Suspension and termination",
              body: (
                <p>
                  You may stop using a product at any time. We may terminate access for a material
                  breach, or where continued use would put other customers at risk. Where we
                  terminate, we will give you access to export your data for a reasonable period,
                  unless doing so itself creates a risk.
                </p>
              ),
            },
            {
              id: "changes",
              heading: "Changes to this agreement",
              body: (
                <p>
                  We may update this agreement as products evolve. Significant changes are announced
                  through the product and take effect on the date stated there. Continued use after
                  that date is acceptance.
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
