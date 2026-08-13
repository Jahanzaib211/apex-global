import { Card, Section } from "@apex/ui";
import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Legal",
  description:
    "The policies, agreements and standards that govern how Apex Global Tech Solution operates — privacy, terms, data processing, accessibility and more.",
  alternates: { canonical: absoluteUrl("/legal") },
};

const DOCS = [
  {
    href: "/legal/privacy",
    title: "Privacy",
    summary:
      "What we collect through this website, what we store, what we never store, and your rights over it.",
    updated: "3 August 2026",
  },
  {
    href: "/legal/terms",
    title: "Website terms",
    summary: "The terms that govern use of this website and our published content.",
    updated: "3 August 2026",
  },
  {
    href: "/legal/user-agreement",
    title: "User agreement",
    summary:
      "What applies to anyone who registers for, logs in to, or uses a Apex platform, portal or SaaS product.",
    updated: "3 August 2026",
  },
  {
    href: "/legal/cookies",
    title: "Cookie policy",
    summary:
      "Which cookies and tags we set, what they are used for, and that third-party tags only fire after consent.",
    updated: "3 August 2026",
  },
  {
    href: "/legal/data-processing",
    title: "Data processing agreement",
    summary:
      "How we process personal data on behalf of clients, including sub-processors and data-subject rights.",
    updated: "3 August 2026",
  },
  {
    href: "/legal/subprocessors",
    title: "Sub-processors",
    summary:
      "The processors we use to run the site and platforms, and how we keep the list current.",
    updated: "3 August 2026",
  },
  {
    href: "/legal/acceptable-use",
    title: "Acceptable use",
    summary:
      "What users of our platforms may and may not do — security, content and conduct rules.",
    updated: "3 August 2026",
  },
  {
    href: "/legal/subscription",
    title: "Subscription terms",
    summary: "Fees, billing, renewal, cancellation and SLA for paid SaaS services.",
    updated: "3 August 2026",
  },
  {
    href: "/legal/accessibility",
    title: "Accessibility",
    summary:
      "How we make the site usable for everyone, the standard we target, and how to report a barrier.",
    updated: "3 August 2026",
  },
] as const;

export default function LegalHubPage() {
  return (
    <Section tone="page" className="py-16 md:py-20">
      <div className="mx-auto max-w-[var(--container-prose)]">
        <h1 className="text-3xl md:text-4xl">Legal</h1>
        <p className="mt-3 text-[var(--ink-secondary)]">
          The documents that govern our website, our platforms and our engagements. Each one
          describes how a thing is actually built and run, not a generic template.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {DOCS.map((doc) => (
            <Card key={doc.href} as="article" className="p-6">
              <a href={doc.href} className="group block">
                <h2 className="group-hover:underline">{doc.title}</h2>
                <p className="mt-2 text-sm text-[var(--ink-secondary)]">{doc.summary}</p>
                <p className="mt-3 text-xs text-[var(--ink-muted)]">Updated {doc.updated}</p>
              </a>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
}
