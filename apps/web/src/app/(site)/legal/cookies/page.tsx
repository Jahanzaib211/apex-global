import { Section } from "@apex/ui";
import type { Metadata } from "next";
import { ContactBlock, LegalDoc } from "@/components/legal/legal-doc";
import { getSettings } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Cookie policy",
  description: "Which cookies and tags this website sets, and what happens to them.",
  alternates: { canonical: absoluteUrl("/legal/cookies") },
};

export default async function CookiePolicyPage() {
  const s = await getSettings();
  const email = s["org.email"];

  return (
    <Section tone="page" className="py-16 md:py-20">
      <div className="mx-auto max-w-[var(--container-prose)]">
        <LegalDoc
          title="Cookie policy"
          lead="This page describes the cookies and tracking tags this website sets, what each one is for, and how consent works. It reflects how the site is built, not a generic list."
          updated="3 August 2026"
          notice="Strictly necessary cookies do not require consent."
          sections={[
            {
              id: "strictly-necessary",
              heading: "Strictly necessary",
              body: (
                <p>
                  Cookies required to make the site function — for example, the ones that keep a
                  logged-in portal session alive, remember your consent choice, or protect forms
                  from abuse. These cannot be switched off.
                </p>
              ),
            },
            {
              id: "analytics-and-ads",
              heading: "Analytics and advertising",
              body: (
                <p>
                  Third-party analytics and advertising tags load only after you consent to them. We
                  record your consent state so that, if a tag does not fire, we can show why. Our
                  own first-party analytics count page views on our own infrastructure without
                  identifying you.
                </p>
              ),
            },
            {
              id: "lead-campaigns",
              heading: "Campaign parameters",
              body: (
                <p>
                  Links from advertising carry campaign parameters. When you submit an enquiry we
                  store the parameters from the link you followed, together with your consent state,
                  so we can attribute business to the channels that produced it.
                </p>
              ),
            },
            {
              id: "manage",
              heading: "Managing cookies",
              body: (
                <p>
                  You can withdraw consent to non-essential tags at any time through the consent
                  control on this site, or in your browser. Withdrawing consent stops the tags; it
                  does not delete data already processed under consent.
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
