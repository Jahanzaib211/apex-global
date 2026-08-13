import { prisma } from "@apex/db";
import { ButtonLink, Section } from "@apex/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Prose } from "@/components/prose";
import { getInsight } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 300;

export async function generateStaticParams() {
  const rows = await prisma.insight.findMany({
    where: { status: "LIVE" },
    select: { slug: true },
  });
  return rows.map((r) => ({ slug: r.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const insight = await getInsight(slug);
  if (!insight) return {};

  return {
    title: insight.seo?.title ?? insight.title,
    description: insight.seo?.description ?? insight.excerpt.slice(0, 155),
    alternates: { canonical: absoluteUrl(`/insights/${slug}`) },
    openGraph: {
      type: "article",
      title: insight.title,
      description: insight.excerpt.slice(0, 155),
      publishedTime: insight.publishedAt?.toISOString(),
    },
  };
}

export default async function InsightPage({ params }: Props) {
  const { slug } = await params;
  const insight = await getInsight(slug);
  if (!insight) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: insight.title,
    description: insight.excerpt,
    datePublished: insight.publishedAt?.toISOString(),
    dateModified: insight.updatedAt.toISOString(),
    author: { "@type": "Organization", name: "Apex Global Tech Solution" },
    publisher: { "@type": "Organization", name: "Apex Global Tech Solution" },
    mainEntityOfPage: absoluteUrl(`/insights/${slug}`),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Section tone="page" className="pt-16 pb-10 md:pt-20 md:pb-12">
        <div className="mx-auto max-w-[var(--container-prose)]">
          <nav aria-label="Breadcrumb" className="mb-8">
            <Link
              href="/insights"
              className="text-sm text-[var(--ink-secondary)] underline-offset-4 hover:text-[var(--ink-primary)] hover:underline"
            >
              ← All insights
            </Link>
          </nav>

          <p className="text-2xs font-semibold tracking-[0.16em] text-[var(--color-amber-700)] uppercase">
            {insight.category}
          </p>
          <h1 className="mt-4 text-3xl md:text-4xl">{insight.title}</h1>
          <p className="mt-5 text-lg text-[var(--ink-secondary)]">{insight.excerpt}</p>

          <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-[var(--border-subtle)] pt-5 text-sm text-[var(--ink-muted)]">
            <span>{insight.authorName}</span>
            {insight.authorRole ? (
              <>
                <span aria-hidden>·</span>
                <span>{insight.authorRole}</span>
              </>
            ) : null}
            <span aria-hidden>·</span>
            <span>{insight.readingMinutes} min read</span>
            {insight.publishedAt ? (
              <>
                <span aria-hidden>·</span>
                <time dateTime={insight.publishedAt.toISOString()}>
                  {insight.publishedAt.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              </>
            ) : null}
          </div>
        </div>
      </Section>

      <Section tone="page" className="py-0 pb-20">
        <article className="mx-auto max-w-[var(--container-prose)]">
          <Prose text={insight.body} />
        </article>
      </Section>

      <Section tone="inverse" className="py-16">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-2xl md:text-3xl">Want this applied to your systems?</h2>
            <p className="mt-3 max-w-xl text-[var(--color-navy-200)]">
              We do this work for clients, and we are happy to tell you when you do not need us.
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
