import { prisma } from "@apex/db";
import { ButtonLink, Card, Section, SectionHeading } from "@apex/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Prose } from "@/components/prose";
import { displayClient, getIndustry } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 300;

export async function generateStaticParams() {
  const rows = await prisma.industry.findMany({
    where: { status: "LIVE" },
    select: { slug: true },
  });
  return rows.map((r) => ({ slug: r.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const industry = await getIndustry(slug);
  if (!industry) return {};

  return {
    title: industry.seo?.title ?? industry.name,
    description: industry.seo?.description ?? industry.tagline,
    alternates: { canonical: absoluteUrl(`/industries/${slug}`) },
  };
}

const STAGES = [
  { key: "challenge", label: "The challenge", eyebrow: "01" },
  { key: "approach", label: "Our approach", eyebrow: "02" },
  { key: "outcome", label: "The outcome", eyebrow: "03" },
] as const;

export default async function IndustryPage({ params }: Props) {
  const { slug } = await params;
  const industry = await getIndustry(slug);
  if (!industry) notFound();

  const content: Record<string, string> = {
    challenge: industry.challenge,
    approach: industry.approach,
    outcome: industry.outcome,
  };

  return (
    <>
      <Section tone="inverse" grid className="py-20 md:py-24">
        <nav aria-label="Breadcrumb" className="mb-8">
          <Link
            href="/industries"
            className="text-sm text-[var(--color-navy-200)] underline-offset-4 hover:text-white hover:underline"
          >
            ← All industries
          </Link>
        </nav>
        <SectionHeading
          inverse
          as="h1"
          eyebrow="Industries"
          title={industry.name}
          lede={industry.tagline}
        />
      </Section>

      <Section tone="page">
        <div className="flex max-w-3xl flex-col gap-14">
          {STAGES.map((stage) => (
            <div key={stage.key}>
              <div className="flex items-baseline gap-4">
                <span className="font-display text-sm font-semibold text-[var(--color-amber-500)]">
                  {stage.eyebrow}
                </span>
                <h2 className="text-2xl">{stage.label}</h2>
              </div>
              <Prose text={content[stage.key] ?? ""} className="mt-4" />
            </div>
          ))}
        </div>
      </Section>

      {industry.solutions.length > 0 ? (
        <Section tone="sunken">
          <SectionHeading eyebrow="Relevant capability" title="What we bring to this" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {industry.solutions.map((s) => (
              <Card key={s.slug} interactive className="flex flex-col gap-2">
                <h3 className="font-semibold">
                  <Link href={`/solutions/${s.slug}`} className="after:absolute after:inset-0">
                    {s.name}
                  </Link>
                </h3>
                <p className="text-sm text-[var(--ink-secondary)]">{s.tagline}</p>
              </Card>
            ))}
          </div>
        </Section>
      ) : null}

      {industry.caseStudies.length > 0 ? (
        <Section tone="page">
          <SectionHeading eyebrow="Proof" title="Related work" />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {industry.caseStudies.map((c) => (
              <Card key={c.slug} as="article" interactive className="flex flex-col gap-3 p-8">
                <p className="text-2xs font-semibold uppercase tracking-[0.16em] text-[var(--ink-muted)]">
                  {displayClient({ ...c, clientConsent: false })}
                </p>
                <h3 className="text-xl">
                  <Link href={`/case-studies/${c.slug}`} className="after:absolute after:inset-0">
                    {c.title}
                  </Link>
                </h3>
                <p className="text-sm text-[var(--ink-secondary)]">{c.summary}</p>
              </Card>
            ))}
          </div>
        </Section>
      ) : null}

      <Section tone="inverse" className="py-16 md:py-20">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-2xl md:text-3xl">Working in {industry.name.toLowerCase()}?</h2>
            <p className="mt-3 max-w-xl text-[var(--color-navy-200)]">
              Tell us the constraint you are up against. We will tell you how we would approach it.
            </p>
          </div>
          <ButtonLink href={`/contact?interest=${slug}`} size="lg" className="shrink-0">
            Talk to our technology team
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
