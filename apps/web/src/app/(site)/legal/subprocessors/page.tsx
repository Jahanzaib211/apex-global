import { Section } from "@apex/ui";
import type { Metadata } from "next";
import { ContactBlock, LegalDoc } from "@/components/legal/legal-doc";
import { getSettings } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Sub-processors",
  description:
    "The providers Apex Global Tech Solution uses to operate its website, products and client platforms.",
  alternates: { canonical: absoluteUrl("/legal/subprocessors") },
};

export default async function SubprocessorsPage() {
  const s = await getSettings();
  const email = s["org.email"];

  return (
    <Section tone="page" className="py-16 md:py-20">
      <div className="mx-auto max-w-[var(--container-prose)]">
        <LegalDoc
          title="Sub-processors"
          lead="The processors we use to run the systems behind this website and our products. Each line is a real part of our estate."
          updated="3 August 2026"
          notice="We notify clients and update this list as the estate changes."
          sections={[
            {
              id: "infrastructure",
              heading: "Infrastructure and storage",
              body: (
                <ul className="mt-2 flex flex-col gap-2">
                  {[
                    [
                      "Cloudflare",
                      "Edge network, TLS and authenticated tunnels that publish public services.",
                    ],
                    [
                      "Self-hosted PostgreSQL",
                      "Primary data store, run by us on our own infrastructure.",
                    ],
                    ["Self-hosted Redis", "Caching layer, run by us."],
                    ["MinIO / object storage", "Document and media storage, run by us."],
                    ["Meilisearch", "Search index, run by us."],
                  ].map(([name, role]) => (
                    <li key={name}>
                      <strong>{name}</strong> — {role}
                    </li>
                  ))}
                </ul>
              ),
            },
            {
              id: "communications",
              heading: "Communications and support",
              body: (
                <p>
                  Chatwoot (self-hosted) for live chat, and the email service configured in our
                  operations settings for transactional mail. Consent state and conversion data are
                  stored in the systems we operate.
                </p>
              ),
            },
            {
              id: "third-party-tags",
              heading: "Third-party tags after consent",
              body: (
                <p>
                  Third-party analytics and advertising tags load only after you consent (see the
                  cookie policy). Those providers are engaged as processors under consent, and the
                  list follows the tags we actually run.
                </p>
              ),
            },
            {
              id: "open-source",
              heading: "Open-source components",
              body: (
                <p>
                  Where the estate uses open-source software, the project and its licence are
                  declared on the technology page. Open source is operated by us under those
                  licenses; it is named there so nothing is implied that is not true.
                </p>
              ),
            },
            {
              id: "contact",
              heading: "Changes and contact",
              body: (
                <p>
                  This list changes as the estate changes. For the current list, or to raise a
                  concern, use the contact below.
                  <span className="mt-2 block">
                    <ContactBlock email={email} />
                  </span>
                </p>
              ),
            },
          ]}
        />
      </div>
    </Section>
  );
}
