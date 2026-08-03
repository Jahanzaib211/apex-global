import { Card, Section, SectionHeading } from "@apex/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { getSolutions } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Nine areas of technology capability: SaaS, software engineering, AI and automation, cloud, cybersecurity, managed IT, DevOps, digital transformation and consulting.",
  alternates: { canonical: absoluteUrl("/solutions") },
};

export default async function SolutionsPage() {
  const solutions = await getSolutions();

  return (
    <>
      <Section tone="inverse" grid className="py-20 md:py-24">
        <SectionHeading
          inverse
          as="h1"
          eyebrow="Solutions"
          title="What we build and operate"
          lede="Most engagements draw on several of these at once, because production systems rarely respect a service catalogue."
        />
      </Section>

      <Section tone="page">
        <div className="grid gap-6 md:grid-cols-2">
          {solutions.map((s) => (
            <Card key={s.slug} as="article" interactive className="flex flex-col gap-4 p-8">
              <h2 className="text-2xl">
                <Link href={`/solutions/${s.slug}`} className="after:absolute after:inset-0">
                  {s.name}
                </Link>
              </h2>
              <p className="font-medium text-[var(--ink-secondary)]">{s.tagline}</p>
              <p className="text-[var(--ink-secondary)]">{s.summary}</p>

              {s.outcomes.length > 0 ? (
                <ul className="mt-2 flex flex-col gap-2 border-t border-[var(--border-subtle)] pt-4">
                  {s.outcomes.slice(0, 3).map((o) => (
                    <li key={o} className="flex gap-2.5 text-sm text-[var(--ink-secondary)]">
                      <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]" />
                      {o}
                    </li>
                  ))}
                </ul>
              ) : null}
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
