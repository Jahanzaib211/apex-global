import { Section } from "@apex/ui";
import type { Metadata } from "next";
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
      <div className="mx-auto flex max-w-[var(--container-prose)] flex-col gap-6">
        <h1 className="text-3xl md:text-4xl">Terms</h1>
        <p className="text-[var(--ink-secondary)]">
          These terms cover use of this website. Work we do for clients is governed by a separate
          signed agreement, and nothing here overrides it.
        </p>

        <h2 className="mt-6 text-xl">Content on this site</h2>
        <p className="text-[var(--ink-secondary)]">
          We take care that what we publish is accurate, and every figure we state carries its
          source. Descriptions of our capability are not a contractual commitment; the scope of any
          work is what appears in a signed proposal.
        </p>

        <h2 className="mt-6 text-xl">Third-party software and trademarks</h2>
        <p className="text-[var(--ink-secondary)]">
          Where our work builds on an open-source project, that project is named with its licence on
          the page. Product and company names belonging to others are their trademarks, referenced
          descriptively. Nothing on this site claims ownership of software we did not write.
        </p>

        <h2 className="mt-6 text-xl">Intellectual property</h2>
        <p className="text-[var(--ink-secondary)]">
          The design, text and code of this website belong to Apex Global Tech Solution unless stated
          otherwise. Ownership of work produced for a client is set by that client&apos;s agreement.
        </p>

        <h2 className="mt-6 text-xl">Links to live systems</h2>
        <p className="text-[var(--ink-secondary)]">
          Where we link to a system we operate, it is a production service and may be under
          maintenance at the time you visit. Systems described as not publicly reachable are
          demonstrated privately on request.
        </p>

        <h2 className="mt-6 text-xl">Liability</h2>
        <p className="text-[var(--ink-secondary)]">
          This site is provided as information. We are not liable for decisions taken solely on the
          basis of it — talk to us and we will give you a considered answer for your situation.
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
        </p>
      </div>
    </Section>
  );
}
