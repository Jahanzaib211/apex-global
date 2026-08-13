import { prisma } from "@apex/db";
import { ButtonLink, Card, Section, SectionHeading } from "@apex/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Prose } from "@/components/prose";
import { displayClient, getSolution } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 300;

export async function generateStaticParams() {
  const rows = await prisma.solution.findMany({
    where: { status: "LIVE" },
    select: { slug: true },
  });
  return rows.map((r) => ({ slug: r.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const solution = await getSolution(slug);
  if (!solution) return {};

  return {
    title: solution.seo?.title ?? solution.name,
    description: solution.seo?.description ?? solution.summary,
    alternates: { canonical: absoluteUrl(`/solutions/${slug}`) },
    openGraph: {
      title: solution.seo?.title ?? solution.name,
      description: solution.seo?.description ?? solution.summary,
      url: absoluteUrl(`/solutions/${slug}`),
    },
  };
}

export default async function SolutionPage({ params }: Props) {
  const { slug } = await params;
  const solution = await getSolution(slug);
  if (!solution) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: solution.name,
        description: solution.summary,
        provider: { "@type": "Organization", name: "Apex Global Tech Solution" },
        areaServed: "Worldwide",
        url: absoluteUrl(`/solutions/${slug}`),
      },
      ...(solution.faqs.length > 0
        ? [
            {
              "@type": "FAQPage",
              mainEntity: solution.faqs.map((f) => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: { "@type": "Answer", text: f.answer },
              })),
            },
          ]
        : []),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Solutions", item: absoluteUrl("/solutions") },
          { "@type": "ListItem", position: 2, name: solution.name },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Section tone="inverse" grid className="py-20 md:py-24">
        <nav aria-label="Breadcrumb" className="mb-8">
          <Link
            href="/solutions"
            className="text-sm text-[var(--color-navy-200)] underline-offset-4 hover:text-white hover:underline"
          >
            ← All solutions
          </Link>
        </nav>
        <SectionHeading
          inverse
          as="h1"
          eyebrow="Solutions"
          title={solution.name}
          lede={solution.tagline}
        />
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-navy-200)]">
          {solution.summary}
        </p>
      </Section>

      <Section tone="page">
        <div className="grid gap-16 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          <div>{solution.body ? <Prose text={solution.body} /> : null}</div>

          <aside className="flex flex-col gap-10">
            {solution.capabilities.length > 0 ? (
              <div>
                <h2 className="text-2xs font-semibold tracking-[0.18em] text-[var(--color-amber-700)] uppercase">
                  Capabilities
                </h2>
                <ul className="mt-4 flex flex-col gap-3">
                  {solution.capabilities.map((c) => (
                    <li key={c} className="flex gap-3 text-sm text-[var(--ink-secondary)]">
                      <span
                        aria-hidden
                        className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]"
                      />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {solution.outcomes.length > 0 ? (
              <div>
                <h2 className="text-2xs font-semibold tracking-[0.18em] text-[var(--color-amber-700)] uppercase">
                  What you end up with
                </h2>
                <ul className="mt-4 flex flex-col gap-3">
                  {solution.outcomes.map((o) => (
                    <li
                      key={o}
                      className="border-l-2 border-[var(--border-default)] pl-4 text-sm text-[var(--ink-secondary)]"
                    >
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>
      </Section>

      {solution.industries.length > 0 ? (
        <Section tone="raised">
          <SectionHeading eyebrow="Where this applies" title="Industries" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {solution.industries.map((i) => (
              <Card key={i.slug} interactive className="flex flex-col gap-2">
                <h3 className="font-semibold">
                  <Link href={`/industries/${i.slug}`} className="after:absolute after:inset-0">
                    {i.name}
                  </Link>
                </h3>
                <p className="text-sm text-[var(--ink-secondary)]">{i.tagline}</p>
              </Card>
            ))}
          </div>
        </Section>
      ) : null}

      {solution.caseStudies.length > 0 ? (
        <Section tone="sunken">
          <SectionHeading eyebrow="Proof" title="Related work" />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {solution.caseStudies.map((c) => (
              <Card key={c.slug} as="article" interactive className="flex flex-col gap-3 p-8">
                <p className="text-2xs font-semibold tracking-[0.16em] text-[var(--ink-muted)] uppercase">
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

      {solution.faqs.length > 0 ? (
        <Section tone="page">
          <SectionHeading eyebrow="Questions" title="Frequently asked" />
          <dl className="mt-10 max-w-3xl divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
            {solution.faqs.map((f) => (
              <div key={f.id} className="py-6">
                <dt className="font-semibold">{f.question}</dt>
                <dd className="mt-2 text-[var(--ink-secondary)]">{f.answer}</dd>
              </div>
            ))}
          </dl>
        </Section>
      ) : null}

      <Section tone="inverse" className="py-16 md:py-20">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-2xl md:text-3xl">
              Discuss a {solution.name.toLowerCase()} project
            </h2>
            <p className="mt-3 max-w-xl text-[var(--color-navy-200)]">
              Tell us the constraint you are working against. We will tell you what we would do.
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
