import { Section, SectionHeading } from "@apex/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { getSolutions } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Nine areas of technology capability — SaaS development, software engineering, AI and automation, cloud, cybersecurity, managed IT, DevOps, digital transformation and consulting.",
  alternates: { canonical: absoluteUrl("/solutions") },
};

export default async function SolutionsIndexPage() {
  const solutions = await getSolutions();

  return (
    <>
      <Section tone="inverse" grid className="py-20 md:py-24">
        <SectionHeading
          inverse
          as="h1"
          eyebrow="Solutions"
          title="Nine areas of capability"
          lede="Most engagements draw on several of them, because production systems rarely respect a service catalogue."
        />
      </Section>

      <Section tone="page">
        <ul className="grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--border-default)] sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((s) => (
            <li key={s.slug} className="bg-[var(--bg-raised)]">
              <Link
                href={`/solutions/${s.slug}`}
                className="group flex h-full flex-col gap-2 p-7 transition-colors hover:bg-[var(--bg-page)]"
              >
                <h2 className="text-lg font-semibold">{s.name}</h2>
                <p className="text-sm text-[var(--ink-secondary)]">{s.tagline}</p>
                <span className="mt-3 text-sm font-medium text-[var(--ink-muted)] transition-colors group-hover:text-[var(--color-amber-700)]">
                  Read more →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
