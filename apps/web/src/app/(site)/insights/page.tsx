import { Section, SectionHeading } from "@apex/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { getInsights } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Notes from the engineering side: infrastructure, AI in production, and how to evaluate a technology supplier.",
  alternates: { canonical: absoluteUrl("/insights") },
};

export default async function InsightsPage() {
  const insights = await getInsights();

  return (
    <>
      <Section tone="inverse" grid className="py-20 md:py-24">
        <SectionHeading
          inverse
          as="h1"
          eyebrow="Insights"
          title="Notes from the engineering side"
          lede="Written by the people doing the work, about problems we have actually hit."
        />
      </Section>

      <Section tone="page">
        <ul className="flex flex-col divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
          {insights.map((i) => (
            <li key={i.slug}>
              <Link
                href={`/insights/${i.slug}`}
                className="group grid gap-4 py-8 transition-colors md:grid-cols-[1fr_2.2fr] md:gap-10"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-2xs font-semibold uppercase tracking-[0.16em] text-[var(--color-amber-700)]">
                    {i.category}
                  </span>
                  <span className="text-2xs text-[var(--ink-muted)]">
                    {i.readingMinutes} min read
                  </span>
                </div>

                <div>
                  <h2 className="text-xl font-semibold underline-offset-4 group-hover:underline md:text-2xl">
                    {i.title}
                  </h2>
                  <p className="mt-2 text-[var(--ink-secondary)]">{i.excerpt}</p>
                  <p className="mt-3 text-2xs text-[var(--ink-muted)]">{i.authorName}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
