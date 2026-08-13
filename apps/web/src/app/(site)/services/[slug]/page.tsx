import { prisma } from "@apex/db";
import { OriginBadge, Section, SectionHeading } from "@apex/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadForm } from "@/components/lead-form";
import { Prose } from "@/components/prose";
import { getService } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 300;

export async function generateStaticParams() {
  const rows = await prisma.service.findMany({
    where: { status: "LIVE" },
    select: { slug: true },
  });
  return rows.map((r) => ({ slug: r.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = await getService(slug);
  if (!s) return {};
  return {
    title:
      s.seo?.title ?? `${s.name} — USD ${s.flatFeeAmount.toLocaleString()} fixed-fee engagement`,
    description: s.seo?.description ?? s.summary,
    alternates: { canonical: absoluteUrl(`/services/${slug}`) },
  };
}

/**
 * Single productised service.
 *
 * The three values that decide what a productised service is — flat fee,
 * timeline and the deliverables list — are the headline. Body and FAQ sit
 * below. A lead form tagged `interestType=services` and `interestSlug=<slug>`
 * closes the loop into CRM.
 */
export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const s = await getService(slug);
  if (!s) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.name,
    description: s.summary,
    provider: { "@type": "Organization", name: "Apex Global Tech Solution" },
    areaServed: "Worldwide",
    url: absoluteUrl(`/services/${slug}`),
    offers: {
      "@type": "Offer",
      price: s.flatFeeAmount,
      priceCurrency: s.feeCurrency,
    },
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
            href="/services"
            className="text-sm text-[var(--color-navy-200)] underline-offset-4 hover:text-white hover:underline"
          >
            ← All services
          </Link>
        </nav>

        <div className="text-2xs flex flex-wrap items-center gap-3 tracking-[0.16em] text-[var(--color-amber-400)] uppercase">
          <span>{s.timelineLabel}</span>
          <span aria-hidden>·</span>
          <span>Fixed scope</span>
          <span aria-hidden>·</span>
          <span>Fixed fee</span>
        </div>

        <SectionHeading inverse as="h1" title={s.name} lede={s.tagline} className="mt-4" />

        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-navy-200)]">
          {s.summary}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-6">
          <div>
            <p className="text-2xs tracking-[0.16em] text-[var(--color-navy-300)] uppercase">
              Fixed fee
            </p>
            <p className="font-display text-3xl font-semibold text-[var(--color-canvas-100)]">
              USD {s.flatFeeAmount.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-2xs tracking-[0.16em] text-[var(--color-navy-300)] uppercase">
              Timeline
            </p>
            <p className="font-display text-3xl font-semibold text-[var(--color-canvas-100)]">
              {s.timelineLabel}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <OriginBadge
            origin={s.origin}
            upstreamName={s.upstreamName}
            upstreamUrl={s.upstreamUrl}
            upstreamLicense={s.upstreamLicense}
          />
        </div>
      </Section>

      {/* ── Deliverables ───────────────────────────────────────────── */}
      {s.deliverables.length > 0 ? (
        <Section tone="page">
          <SectionHeading eyebrow="What you get" title="The deliverables" />
          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {s.deliverables.map((d) => (
              <li
                key={d}
                className="flex gap-3 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-5"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  aria-hidden
                  className="mt-0.5 shrink-0"
                >
                  <circle cx="10" cy="10" r="10" fill="var(--color-amber-500)" opacity="0.15" />
                  <path
                    d="M6 10.5l2.5 2.5L14 7"
                    stroke="var(--color-amber-500)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
                <span className="text-[var(--ink-primary)]">{d}</span>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* ── Body ───────────────────────────────────────────────────── */}
      {s.body ? (
        <Section tone="raised">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
            <Prose text={s.body} />
            {s.outcomes.length > 0 ? (
              <aside>
                <h2 className="text-2xs font-semibold tracking-[0.18em] text-[var(--color-amber-700)] uppercase">
                  What you end up with
                </h2>
                <ul className="mt-4 flex flex-col gap-3">
                  {s.outcomes.map((o) => (
                    <li
                      key={o}
                      className="border-l-2 border-[var(--color-amber-500)] pl-4 text-sm text-[var(--ink-primary)]"
                    >
                      {o}
                    </li>
                  ))}
                </ul>
              </aside>
            ) : null}
          </div>
        </Section>
      ) : null}

      {/* ── Tech stack ─────────────────────────────────────────────── */}
      {s.technologies.length > 0 ? (
        <Section tone="sunken">
          <SectionHeading
            eyebrow="The stack"
            title="What we deploy against"
            lede="The open-source platform tools this module ships on top of. None of them invented by us; the deployment, hardening, and integration around them is the work we are selling."
          />
          <ul className="mt-10 flex flex-wrap gap-2">
            {s.technologies.map((t) => (
              <li
                key={t}
                className="rounded-full border border-[var(--border-default)] bg-[var(--bg-raised)] px-3 py-1.5 text-sm text-[var(--ink-secondary)]"
              >
                {t}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* ── FAQ ────────────────────────────────────────────────────── */}
      {s.faqs.length > 0 ? (
        <Section tone="page">
          <SectionHeading eyebrow="Questions" title="Frequently asked" />
          <dl className="mt-10 max-w-3xl divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
            {s.faqs.map((f) => (
              <div key={f.id} className="py-6">
                <dt className="font-semibold">{f.question}</dt>
                <dd className="mt-2 text-[var(--ink-secondary)]">{f.answer}</dd>
              </div>
            ))}
          </dl>
        </Section>
      ) : null}

      {/* ── Enquiry ─────────────────────────────────────────────────── */}
      <Section tone="raised" id="enquire">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Next step"
              title={`Discuss a ${s.name.toLowerCase()} engagement`}
              lede="Tell us the constraint. We will tell you whether this module fits, and — if it does — what the kickoff would look like."
            />
            <p className="mt-6 max-w-md text-sm text-[var(--ink-secondary)]">
              <strong className="font-semibold text-[var(--ink-primary)]">
                USD {s.flatFeeAmount.toLocaleString()} fixed.
              </strong>{" "}
              {s.timelineLabel} from kickoff. No change orders, no hourly billing.{" "}
              <Link
                href="/services/bundles/growth"
                className="font-medium underline-offset-4 hover:underline"
              >
                Or assemble a bundle →
              </Link>
            </p>
          </div>
          <div>
            <LeadForm
              compact
              interestType="services"
              interestSlug={s.slug}
              submitLabel={`Discuss ${s.name}`}
            />
          </div>
        </div>
      </Section>
    </>
  );
}
