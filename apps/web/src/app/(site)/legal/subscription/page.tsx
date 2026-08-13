import { Section } from "@apex/ui";
import type { Metadata } from "next";
import { ContactBlock, LegalDoc } from "@/components/legal/legal-doc";
import { getSettings } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Subscription terms",
  description:
    "Fees, billing, renewal and cancellation terms for Apex Global Tech Solution's SaaS products.",
  alternates: { canonical: absoluteUrl("/legal/subscription") },
};

export default async function SubscriptionTermsPage() {
  const s = await getSettings();
  const email = s["org.email"];

  return (
    <Section tone="page" className="py-16 md:py-20">
      <div className="mx-auto max-w-[var(--container-prose)]">
        <LegalDoc
          title="Subscription terms"
          lead="The terms that apply to paid access to our hosted products and SaaS services."
          updated="3 August 2026"
          notice="Where a client has signed a contract, that contract governs. This page underpins it."
          sections={[
            {
              id: "fees",
              heading: "Fees",
              body: (
                <p>
                  Fees are quoted and invoiced for the term agreed. Prices for the products on the
                  packages page are published; enterprise pricing is set per engagement.
                </p>
              ),
            },
            {
              id: "billing-renewal",
              heading: "Billing and renewal",
              body: (
                <p>
                  Subscriptions renew on the term agreed (monthly or annually). We send an invoice
                  before renewal so you have sight of the charge. Price increases apply on renewal
                  only, with notice.
                </p>
              ),
            },
            {
              id: "cancellation",
              heading: "Cancellation",
              body: (
                <p>
                  Cancel at the end of the current term, and watch that in writing. On cancellation
                  we give you access to export your data for a reasonable period. The subscription
                  stops renewing; paid but unused time is typically not refunded unless a refund
                  policy or contract provides otherwise.
                </p>
              ),
            },
            {
              id: "service-level",
              heading: "Service levels",
              body: (
                <p>
                  Availability commitments are published against the specific product. Public status
                  and maintenance windows are on the status page.
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
