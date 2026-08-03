import { prisma } from "@apex/db";
import { ButtonLink, Section, SectionHeading } from "@apex/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Prose } from "@/components/prose";
import { displayClient, getCaseStudy } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 300;

export async function generateStaticParams() {
  const rows = await prisma.caseStudy.findMany({
    where: { status: "LIVE" },
    select: { slug: true },
  });
  return rows.map((r) => ({ slug: r.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  if (!study) return {};

  return {
    title: study.seo?.title ?? study.title,
    description: study.seo?.description ?? study.summary,
    alternates: { canonical: absoluteUrl(`/case-studies/${slug}`) },
  };
}

const SECTIONS = [
  ["Challenge", "challenge"],
  ["Strategy", "strategy"],
  ["Technology", "technology"],
  ["Implementation", "implementation"],
  ["Result", "result"],
] as const;

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  if (!study) notFound();

  const body: Record<string, string> = {
    challenge: study.challenge,
    strategy: study.strategy,
    technology: study.technology,
    implementation: study.implementation,
    result: study.result,
  };

  return (
    <>
      <Section tone="inverse" grid className="py-20 md:py-24">
        <nav aria-label="Breadcrumb" className="mb-8">
          <Link
            href="/case-studies"
            className="text-sm text-[var(--color-navy-200)] underline-offset-4 hover:text-white hover:underline"
          >
            ← All case studies
          </Link>
        </nav>

        <SectionHeading
          inverse
          as="h1"
          eyebrow={displayClient(study)}
          title={study.title}
          lede={study.summary}
        />

        {/* Stated plainly rather than left for the reader to wonder about. */}
        {!study.clientConsent ? (
          <p className="mt-8 max-w-2xl border-l-2 border-[var(--color-amber-500)] pl-5 text-sm text-[var(--color-navy-200)]">
            This client is described anonymously. We name a client only where we hold their written
            permission on record.
          </p>
        ) : null}
      </Section>

      {study.metrics.length > 0 ? (
        <Section tone="raised" className="py-12 md:py-14">
          <dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {study.metrics.map((m) => (
              <div key={m.id}>
                <dd className="font-display text-3xl font-semibold">{m.value}</dd>
                <dt className="mt-1 text-sm text-[var(--ink-secondary)]">{m.label}</dt>
                <p className="mt-1 text-2xs text-[var(--ink-muted)]">Source: {m.source}</p>
              </div>
            ))}
          </dl>
        </Section>
      ) : null}

      <Section tone="page">
        <div className="flex max-w-3xl flex-col gap-14">
          {SECTIONS.map(([label, key], index) => (
            <div key={key}>
              <div className="flex items-baseline gap-4">
                <span className="font-display text-sm font-semibold text-[var(--color-amber-500)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className="text-2xl">{label}</h2>
              </div>
              <Prose text={body[key] ?? ""} className="mt-4" />
            </div>
          ))}

          {study.lessons ? (
            <div className="rounded-[var(--radius-lg)] bg-[var(--bg-sunken)] p-7">
              <h2 className="text-2xs font-semibold uppercase tracking-[0.18em] text-[var(--color-amber-700)]">
                What we took from it
              </h2>
              <Prose text={study.lessons} className="mt-3" />
            </div>
          ) : null}
        </div>

        {study.technologies.length > 0 ? (
          <div className="mt-14 max-w-3xl border-t border-[var(--border-subtle)] pt-8">
            <h2 className="text-2xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
              Technologies
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {study.technologies.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-[var(--border-default)] px-2.5 py-1 text-2xs text-[var(--ink-secondary)]"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Section>

      <Section tone="inverse" className="py-16 md:py-20">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-2xl md:text-3xl">Facing something similar?</h2>
            <p className="mt-3 max-w-xl text-[var(--color-navy-200)]">
              We will walk through how this applies to your situation, including where it does not.
            </p>
          </div>
          <ButtonLink href="/contact" size="lg" className="shrink-0">
            Talk to our technology team
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
