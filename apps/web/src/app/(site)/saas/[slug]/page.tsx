import { prisma } from "@apex/db";
import { ButtonLink, Card, OriginBadge, Section, SectionHeading } from "@apex/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadForm } from "@/components/lead-form";
import { Prose } from "@/components/prose";
import { getProduct } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 300;

export async function generateStaticParams() {
  const rows = await prisma.saasProduct.findMany({
    where: { status: "LIVE" },
    select: { slug: true },
  });
  return rows.map((r) => ({ slug: r.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};

  return {
    title: product.seo?.title ?? product.name,
    description: product.seo?.description ?? product.summary,
    alternates: { canonical: absoluteUrl(`/saas/${slug}`) },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const shipped = product.features.filter((f) => f.isShipped);
  const roadmap = product.features.filter((f) => !f.isShipped);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    description: product.summary,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: absoluteUrl(`/saas/${slug}`),
    publisher: { "@type": "Organization", name: "Apex Global Tech Solution" },
    ...(product.plans.length > 0
      ? {
          offers: product.plans.map((p) => ({
            "@type": "Offer",
            name: p.name,
            description: p.description,
            ...(p.priceAmount != null
              ? { price: (p.priceAmount / 100).toFixed(2), priceCurrency: p.priceCurrency }
              : {}),
          })),
        }
      : {}),
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
            href="/saas"
            className="text-sm text-[var(--color-navy-200)] underline-offset-4 hover:text-white hover:underline"
          >
            ← Apex SaaS
          </Link>
        </nav>

        <SectionHeading
          inverse
          as="h1"
          eyebrow={product.category}
          title={product.name}
          lede={product.tagline}
        />

        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-navy-200)]">
          {product.summary}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <ButtonLink href="#enquire" size="lg">
            {product.demoAvailable ? "Request a demo" : "Talk to us about this"}
          </ButtonLink>
          {product.isPubliclyReachable && product.publicUrl ? (
            <a
              href={product.publicUrl}
              rel="noopener noreferrer"
              target="_blank"
              className="inline-flex h-13 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border-inverse)] px-6 text-base font-medium text-[var(--color-canvas-100)] transition-colors hover:border-[var(--color-canvas-100)]"
            >
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full bg-[var(--color-success-500)]"
              />
              See it running ↗
            </a>
          ) : null}
        </div>

        <div className="mt-8">
          <OriginBadge
            origin={product.origin}
            upstreamName={product.upstreamName}
            upstreamUrl={product.upstreamUrl}
            upstreamLicense={product.upstreamLicense}
          />
        </div>
      </Section>

      {/* ── Problem / solution ───────────────────────────────────────── */}
      <Section tone="page">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 className="text-2xs font-semibold tracking-[0.18em] text-[var(--ink-muted)] uppercase">
              The problem
            </h2>
            <Prose text={product.problem} className="mt-5" />
          </div>
          <div>
            <h2 className="text-2xs font-semibold tracking-[0.18em] text-[var(--color-amber-700)] uppercase">
              What we do about it
            </h2>
            <Prose text={product.solution} className="mt-5" />
          </div>
        </div>
      </Section>

      {/* ── Features ─────────────────────────────────────────────────── */}
      {shipped.length > 0 ? (
        <Section tone="sunken">
          <SectionHeading eyebrow="Capabilities" title="What it does today" />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {shipped.map((f) => (
              <Card key={f.id} className="flex flex-col gap-2.5">
                <h3 className="font-semibold">{f.title}</h3>
                <p className="text-sm text-[var(--ink-secondary)]">{f.description}</p>
                {f.benefit ? (
                  <p className="mt-1 border-l-2 border-[var(--color-amber-500)] pl-3 text-sm text-[var(--ink-primary)]">
                    {f.benefit}
                  </p>
                ) : null}
              </Card>
            ))}
          </div>

          {/* Anything unshipped is labelled, never mixed in with the rest.
              A roadmap item presented as available is the fastest way to lose
              a technical evaluation. */}
          {roadmap.length > 0 ? (
            <div className="mt-10">
              <h3 className="text-2xs font-semibold tracking-[0.18em] text-[var(--ink-muted)] uppercase">
                On the roadmap — not yet available
              </h3>
              <ul className="mt-4 flex flex-wrap gap-3">
                {roadmap.map((f) => (
                  <li
                    key={f.id}
                    className="rounded-full border border-dashed border-[var(--border-strong)] px-3 py-1 text-sm text-[var(--ink-muted)]"
                  >
                    {f.title}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Section>
      ) : null}

      {/* ── Pricing ──────────────────────────────────────────────────── */}
      {product.plans.length > 0 ? (
        <Section tone="page">
          <SectionHeading
            eyebrow="Pricing"
            title="How it is priced"
            lede="Scope varies enough that a public price would be a guess. We quote against your actual requirements."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {product.plans.map((plan) => (
              <Card
                key={plan.id}
                className={`flex flex-col gap-4 p-8 ${plan.isFeatured ? "border-[var(--color-amber-500)]" : ""}`}
              >
                <div>
                  <h3 className="text-xl">{plan.name}</h3>
                  <p className="mt-1 text-sm text-[var(--ink-secondary)]">{plan.description}</p>
                </div>

                <p className="font-display text-2xl font-semibold">
                  {plan.priceAmount != null
                    ? `${plan.priceCurrency} ${(plan.priceAmount / 100).toLocaleString()}`
                    : "On application"}
                  {plan.pricePeriod ? (
                    <span className="text-base font-normal text-[var(--ink-muted)]">
                      {" "}
                      / {plan.pricePeriod}
                    </span>
                  ) : null}
                </p>

                <ul className="flex flex-col gap-2.5 border-t border-[var(--border-subtle)] pt-5">
                  {plan.features.map((f) => (
                    <li key={f.id} className="flex gap-2.5 text-sm text-[var(--ink-secondary)]">
                      <span
                        aria-hidden
                        className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]"
                      />
                      {f.label}
                      {f.limitNote ? (
                        <span className="text-[var(--ink-muted)]"> ({f.limitNote})</span>
                      ) : null}
                    </li>
                  ))}
                </ul>

                <ButtonLink
                  href="#enquire"
                  variant={plan.isFeatured ? "primary" : "secondary"}
                  className="mt-auto"
                >
                  {plan.ctaLabel}
                </ButtonLink>
              </Card>
            ))}
          </div>
        </Section>
      ) : null}

      {/* ── Security ─────────────────────────────────────────────────── */}
      {product.securityNotes ? (
        <Section tone="sunken">
          <div className="max-w-3xl">
            <SectionHeading eyebrow="Security" title="How it is protected" />
            <Prose text={product.securityNotes} className="mt-6" />
          </div>
        </Section>
      ) : null}

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      {product.faqs.length > 0 ? (
        <Section tone="page">
          <SectionHeading eyebrow="Questions" title="Frequently asked" />
          <dl className="mt-10 max-w-3xl divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
            {product.faqs.map((f) => (
              <div key={f.id} className="py-6">
                <dt className="font-semibold">{f.question}</dt>
                <dd className="mt-2 text-[var(--ink-secondary)]">{f.answer}</dd>
              </div>
            ))}
          </dl>
        </Section>
      ) : null}

      {/* ── Enquiry ──────────────────────────────────────────────────── */}
      <Section tone="raised" id="enquire">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Next step"
              title={
                product.demoAvailable
                  ? `See ${product.name} properly`
                  : `Talk to us about ${product.name}`
              }
              lede="We will show you the authenticated views, not a slide deck — including the parts that are still rough."
            />
          </div>
          <div>
            <LeadForm
              compact
              interestType="product"
              interestSlug={product.slug}
              productSlug={product.slug}
              endpoint={product.demoAvailable ? "/api/demo-request" : "/api/leads"}
              submitLabel={product.demoAvailable ? "Request a demo" : "Send enquiry"}
            />
          </div>
        </div>
      </Section>
    </>
  );
}
