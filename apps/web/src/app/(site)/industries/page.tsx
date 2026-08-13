import { Card, Section, SectionHeading } from "@apex/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { getIndustries } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Industries",
  description:
    "Sector context for the work Apex Global Tech Solution does — what changes between industries is the constraint, not the engineering.",
  alternates: { canonical: absoluteUrl("/industries") },
};

export default async function IndustriesIndexPage() {
  const industries = await getIndustries();

  return (
    <>
      <Section tone="inverse" grid className="py-20 md:py-24">
        <SectionHeading
          inverse
          as="h1"
          eyebrow="Industries"
          title="Sector context, not sector clichés"
          lede="What changes between industries is the constraint — auditability, peak load, regulation, margin. The engineering follows from that."
        />
      </Section>

      <Section tone="page">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((i) => (
            <Card key={i.slug} as="article" interactive className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold">{i.name}</h2>
              <p className="text-sm text-[var(--ink-secondary)]">{i.tagline}</p>
              <p className="text-2xs mt-1 text-[var(--ink-muted)]">{i.challenge.slice(0, 120)}…</p>
              <Link
                href={`/industries/${i.slug}`}
                className="mt-auto pt-3 text-sm font-medium underline-offset-4 hover:underline"
              >
                How we work here →
              </Link>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
