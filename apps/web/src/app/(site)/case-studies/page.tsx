import { Card, Section, SectionHeading } from "@apex/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { displayClient, getCaseStudies } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Real projects: the challenge, the strategy, the technology, the implementation and the result — with every figure sourced.",
  alternates: { canonical: absoluteUrl("/case-studies") },
};

export default async function CaseStudiesPage() {
  const studies = await getCaseStudies();

  return (
    <>
      <Section tone="inverse" grid className="py-20 md:py-24">
        <SectionHeading
          inverse
          as="h1"
          eyebrow="Case studies"
          title="Challenge, strategy, technology, result"
          lede="Client names appear only where we hold written permission on record. Everything else is described accurately and anonymously — which costs us a logo and keeps the account of what happened true."
        />
      </Section>

      <Section tone="page">
        <div className="flex flex-col gap-8">
          {studies.map((c) => (
            <Card key={c.slug} as="article" interactive className="p-8 md:p-10">
              <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
                <div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <p className="text-2xs font-semibold uppercase tracking-[0.16em] text-[var(--ink-muted)]">
                      {displayClient(c)}
                    </p>
                    {c.industry ? (
                      <>
                        <span aria-hidden className="text-[var(--border-strong)]">
                          ·
                        </span>
                        <p className="text-2xs uppercase tracking-[0.16em] text-[var(--ink-muted)]">
                          {c.industry.name}
                        </p>
                      </>
                    ) : null}
                  </div>

                  <h2 className="mt-3 text-2xl">
                    <Link href={`/case-studies/${c.slug}`} className="after:absolute after:inset-0">
                      {c.title}
                    </Link>
                  </h2>
                  <p className="mt-3 text-[var(--ink-secondary)]">{c.summary}</p>

                  {c.solutions.length > 0 ? (
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {c.solutions.map((s) => (
                        <li
                          key={s.slug}
                          className="rounded-full border border-[var(--border-default)] px-2.5 py-1 text-2xs text-[var(--ink-secondary)]"
                        >
                          {s.name}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>

                {c.metrics.length > 0 ? (
                  <dl className="flex flex-col gap-5 rounded-[var(--radius-md)] bg-[var(--bg-sunken)] p-6">
                    {c.metrics.map((m) => (
                      <div key={m.id}>
                        <dd className="font-display text-xl font-semibold">{m.value}</dd>
                        <dt className="text-sm text-[var(--ink-secondary)]">{m.label}</dt>
                        <p className="mt-0.5 text-2xs text-[var(--ink-muted)]">Source: {m.source}</p>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
