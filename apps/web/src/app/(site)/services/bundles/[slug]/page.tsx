import { prisma } from "@apex/db";
import { Card, Section, SectionHeading } from "@apex/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadForm } from "@/components/lead-form";
import { Prose } from "@/components/prose";
import { getServiceBundle, getServices } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 300;

export async function generateStaticParams() {
  const rows = await prisma.serviceBundle.findMany({
    where: { status: "LIVE" },
    select: { slug: true },
  });
  return rows.map((r) => ({ slug: r.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const b = await getServiceBundle(slug);
  if (!b) return {};
  return {
    title: b.seo?.title ?? `${b.name} bundle — USD ${b.bundlePriceAmount.toLocaleString()}`,
    description: b.seo?.description ?? b.summary,
    alternates: { canonical: absoluteUrl(`/services/bundles/${slug}`) },
  };
}

/**
 * One of three bundles — a name, the modules it contains, and the bundle price
 * with what the modules would have cost individually. The discount is shown
 * plainly, not buried in fine print.
 */
export default async function BundlePage({ params }: Props) {
  const { slug } = await params;
  const [bundle, allServices] = await Promise.all([getServiceBundle(slug), getServices()]);
  if (!bundle) notFound();

  const included = allServices.filter((s) => bundle.serviceSlugs.includes(s.slug));
  const discount = bundle.sumPriceAmount - bundle.bundlePriceAmount;
  const discountPct = Math.round((discount / bundle.sumPriceAmount) * 100);

  return (
    <>
      <Section tone="inverse" grid className="py-20 md:py-24">
        <nav aria-label="Breadcrumb" className="mb-8">
          <Link
            href="/services"
            className="text-sm text-[var(--color-navy-200)] underline-offset-4 hover:text-white hover:underline"
          >
            ← All services
          </Link>
        </nav>

        <p className="text-2xs font-semibold tracking-[0.16em] text-[var(--color-amber-400)] uppercase">
          Bundle
        </p>
        <SectionHeading
          inverse
          as="h1"
          title={bundle.name}
          lede={bundle.tagline}
          className="mt-4"
        />

        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-navy-200)]">
          {bundle.summary}
        </p>

        <div className="mt-8 flex flex-wrap items-baseline gap-8">
          <div>
            <p className="text-2xs tracking-[0.16em] text-[var(--color-navy-300)] uppercase">
              Bundle price
            </p>
            <p className="font-display text-4xl font-semibold text-[var(--color-canvas-100)]">
              USD {bundle.bundlePriceAmount.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-2xs tracking-[0.16em] text-[var(--color-navy-300)] uppercase">
              Modules separately
            </p>
            <p className="font-display text-2xl font-medium text-[var(--color-navy-200)] line-through">
              USD {bundle.sumPriceAmount.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-2xs tracking-[0.16em] text-[var(--color-navy-300)] uppercase">
              Save
            </p>
            <p className="font-display text-2xl font-medium text-[var(--color-amber-400)]">
              USD {discount.toLocaleString()} ({discountPct}%)
            </p>
          </div>
        </div>
      </Section>

      {/* ── What's included ────────────────────────────────────────── */}
      <Section tone="page">
        <SectionHeading eyebrow="Included" title="What's in the bundle" />
        <div className="mt-10 flex flex-col gap-4">
          {included.map((s, i) => (
            <Card
              key={s.slug}
              as="article"
              className="flex flex-col gap-3 p-6 md:flex-row md:items-center md:justify-between md:gap-6"
            >
              <div className="flex items-start gap-5">
                <span className="text-2xs flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--bg-sunken)] font-semibold text-[var(--color-amber-700)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-semibold">{s.name}</h3>
                  <p className="mt-1 text-sm text-[var(--ink-secondary)]">{s.tagline}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-6 text-sm md:flex-col md:items-end md:gap-1">
                <p className="font-display text-lg font-semibold">
                  USD {s.flatFeeAmount.toLocaleString()}
                </p>
                <p className="text-2xs text-[var(--ink-muted)]">{s.timelineLabel}</p>
                <Link
                  href={`/services/${s.slug}`}
                  className="text-2xs font-medium underline-offset-4 hover:underline"
                >
                  Scope →
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* ── Best for / outcomes ────────────────────────────────────── */}
      <Section tone="raised">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <h2 className="text-2xs font-semibold tracking-[0.18em] text-[var(--color-amber-700)] uppercase">
              Best for
            </h2>
            <Prose text={bundle.bestFor} className="mt-4" />
          </div>
          {bundle.outcomes.length > 0 ? (
            <div>
              <h2 className="text-2xs font-semibold tracking-[0.18em] text-[var(--color-amber-700)] uppercase">
                What you end up with
              </h2>
              <ul className="mt-4 flex flex-col gap-3">
                {bundle.outcomes.map((o) => (
                  <li
                    key={o}
                    className="border-l-2 border-[var(--color-amber-500)] pl-4 text-sm text-[var(--ink-primary)]"
                  >
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </Section>

      {/* ── Body ───────────────────────────────────────────────────── */}
      {bundle.body ? (
        <Section tone="page">
          <div className="max-w-3xl">
            <Prose text={bundle.body} />
          </div>
        </Section>
      ) : null}

      {/* ── Enquiry ─────────────────────────────────────────────────── */}
      <Section tone="inverse" id="enquire">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div>
            <SectionHeading
              inverse
              eyebrow="Next step"
              title={`Discuss the ${bundle.name} bundle`}
              lede="One engagement, one point of accountability, all the modules delivered in sequence. Tell us about your system and the timeline you want it delivered in."
            />
          </div>
          <div className="rounded-[var(--radius-xl)] bg-[var(--bg-raised)] p-7 text-[var(--ink-primary)] md:p-9">
            <LeadForm
              compact
              interestType="bundle"
              interestSlug={bundle.slug}
              submitLabel={`Discuss the ${bundle.name} bundle`}
            />
          </div>
        </div>
      </Section>
    </>
  );
}
