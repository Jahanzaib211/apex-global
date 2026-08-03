import { Card, Section, SectionHeading } from "@apex/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { getIndustries } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Industries",
  description:
    "What changes between industries is the constraint — auditability, peak load, regulation, margin. The engineering follows from that.",
  alternates: { canonical: absoluteUrl("/industries") },
};

export default async function IndustriesPage() {
  const industries = await getIndustries();

  return (
    <>
      <Section tone="inverse" grid className="py-20 md:py-24">
        <SectionHeading
          inverse
          as="h1"
          eyebrow="Industries"
          title="Sector context, not sector clichés"
          lede="We do not claim deep domain expertise in twelve verticals. What we understand is which constraint dominates in each — and constraints are what architecture answers to."
        />
      </Section>

      <Section tone="page">
        <div className="grid gap-6 md:grid-cols-2">
          {industries.map((i) => (
            <Card key={i.slug} as="article" interactive className="flex flex-col gap-4 p-8">
              <h2 className="text-2xl">
                <Link href={`/industries/${i.slug}`} className="after:absolute after:inset-0">
                  {i.name}
                </Link>
              </h2>
              <p className="font-medium text-[var(--ink-secondary)]">{i.tagline}</p>
              <p className="line-clamp-4 text-sm text-[var(--ink-secondary)]">{i.challenge}</p>
              <span className="mt-auto pt-2 text-sm font-medium text-[var(--color-amber-700)]">
                How we work here →
              </span>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
