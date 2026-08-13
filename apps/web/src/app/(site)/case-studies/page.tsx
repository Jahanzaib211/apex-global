import { Card, Section, SectionHeading } from "@apex/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { displayClient, getCaseStudies } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Challenge, strategy, technology, implementation, result. Client names appear only where we hold written permission.",
  alternates: { canonical: absoluteUrl("/case-studies") },
};

export default async function CaseStudiesIndexPage() {
  const studies = await getCaseStudies();

  return (
    <>
      <Section tone="inverse" grid className="py-20 md:py-24">
        <SectionHeading
          inverse
          as="h1"
          eyebrow="Case studies"
          title="Challenge, strategy, technology, result"
          lede="Client names appear only where we hold written permission. Everything else is described accurately and anonymously."
        />
      </Section>

      <Section tone="page">
        <div className="grid gap-6 md:grid-cols-2">
          {studies.map((c) => (
            <Card key={c.slug} as="article" interactive className="flex flex-col gap-4 p-8">
              <p className="text-2xs font-semibold tracking-[0.16em] text-[var(--ink-muted)] uppercase">
                {displayClient(c)}
              </p>
              <h2 className="text-xl">{c.title}</h2>
              <p className="text-[var(--ink-secondary)]">{c.summary}</p>
              {c.metrics.length > 0 ? (
                <dl className="grid grid-cols-2 gap-4 border-t border-[var(--border-subtle)] pt-4">
                  {c.metrics.slice(0, 2).map((m) => (
                    <div key={m.id}>
                      <dd className="font-display text-xl font-semibold">{m.value}</dd>
                      <dt className="text-xs text-[var(--ink-secondary)]">{m.label}</dt>
                    </div>
                  ))}
                </dl>
              ) : null}
              <Link
                href={`/case-studies/${c.slug}`}
                className="mt-auto pt-2 text-sm font-medium underline-offset-4 hover:underline"
              >
                Read the case study →
              </Link>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
