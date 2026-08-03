import { Section } from "@apex/ui";
import type { Metadata } from "next";
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
      <div className="mx-auto flex max-w-[var(--container-prose)] flex-col gap-6">
        <h1 className="text-3xl md:text-4xl">Privacy</h1>
        <p className="text-[var(--ink-secondary)]">
          This describes what happens to information you give us through this website. It reflects
          how the site is actually built, not a generic template.
        </p>

        <h2 className="mt-6 text-xl">What we collect</h2>
        <p className="text-[var(--ink-secondary)]">
          When you submit an enquiry we store what you typed: your name, email address, and whichever
          of company, phone, country, company size, budget range, timeline and message you chose to
          provide. Only name, email and your consent are required.
        </p>
        <p className="text-[var(--ink-secondary)]">
          We also store how you arrived: campaign parameters in the link you followed, the referring
          site, the page you landed on, your browser&apos;s user-agent string, and the country your
          request came from. This is what lets us tell which advertising is worth paying for.
        </p>

        <h2 className="mt-6 text-xl">What we do not store</h2>
        <p className="text-[var(--ink-secondary)]">
          We do not keep your IP address. It is converted to an irreversible hash with a salt that
          rotates daily, which is enough to prevent abuse of our forms and cannot be turned back into
          an address or used to recognise you across days.
        </p>
        <p className="text-[var(--ink-secondary)]">
          We do not sell data, and we do not add you to a mailing list. An enquiry gets a reply about
          that enquiry.
        </p>

        <h2 className="mt-6 text-xl">Analytics and advertising</h2>
        <p className="text-[var(--ink-secondary)]">
          Third-party analytics and advertising tags load only after you consent to them. We record
          your consent state alongside your enquiry so we can show why a tag did or did not fire. We
          also run first-party analytics on our own infrastructure, which counts page views without
          identifying you.
        </p>

        <h2 className="mt-6 text-xl">How long we keep it</h2>
        <p className="text-[var(--ink-secondary)]">
          Enquiries are retained while they are commercially relevant and for as long as we are
          required to keep business records. You can ask us to delete yours at any time.
        </p>

        <h2 className="mt-6 text-xl">Your rights</h2>
        <p className="text-[var(--ink-secondary)]">
          You can ask what we hold about you, ask for it to be corrected, or ask for it to be
          deleted. Write to us and we will action it.
        </p>

        <h2 className="mt-6 text-xl">Contact</h2>
        <p className="text-[var(--ink-secondary)]">
          {email ? (
            <a href={`mailto:${email}`} className="underline underline-offset-4">
              {email}
            </a>
          ) : (
            "Use the contact page."
          )}
          {address ? <span className="block mt-2">{address}</span> : null}
        </p>
      </div>
    </Section>
  );
}
