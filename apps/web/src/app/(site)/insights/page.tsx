import { Section, SectionHeading } from "@apex/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { getInsights } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Notes from the engineering side — architecture, operations and engineering practice.",
  alternates: { canonical: absoluteUrl("/insights") },
};

export default async function InsightsIndexPage() {
  const insights = await getInsights();

  return (
    <>
      <Section tone="inverse" grid className="py-20 md:py-24">
        <SectionHeading
          inverse
          as="h1"
          eyebrow="Insights"
          title="Notes from the engineering side"
          lede="Architecture, operations and engineering practice. Written by the team that runs the systems."
        />
      </Section>

      <Section tone="page">
        <div className="grid gap-6 md:grid-cols-3">
          {insights.map((i) => (
            <article key={i.slug} className="flex flex-col gap-3">
              <p className="text-2xs font-semibold tracking-[0.16em] text-[var(--color-amber-700)] uppercase">
                {i.category}
              </p>
              <h2 className="text-lg font-semibold">
                <Link href={`/insights/${i.slug}`} className="underline-offset-4 hover:underline">
                  {i.title}
                </Link>
              </h2>
              <p className="text-sm text-[var(--ink-secondary)]">{i.excerpt}</p>
              <p className="text-2xs mt-auto pt-2 text-[var(--ink-muted)]">
                {i.readingMinutes} min read
              </p>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
