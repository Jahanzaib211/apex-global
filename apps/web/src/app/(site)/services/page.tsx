import { ButtonLink, Card, Section, SectionHeading } from "@apex/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { getServiceBundles, getServices, getSettings } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Services",
  description:
    "Eight productised cloud and platform engineering modules with fixed scope, fixed fee and fixed timeline. Buy one, or assemble a bundle.",
  alternates: { canonical: absoluteUrl("/services") },
};

/**
 * Modular services index.
 *
 * Services-first per the partner agreement: the eight modules are the headline
 * offering. Each card carries a price, a timeline, and what the buyer gets,
 * because the procurement conversation for productised work starts with those
 * three numbers.
 */
export default async function ServicesIndexPage() {
  const [services, bundles, settings] = await Promise.all([
    getServices(),
    getServiceBundles(),
    getSettings(),
  ]);

  const partner = settings["partner.name"] ?? "ALI Technologies";

  return (
    <>
      <Section tone="inverse" grid className="py-20 md:py-24">
        <SectionHeading
          inverse
          as="h1"
          eyebrow="Modular AI Infrastructure Services"
          title="Fixed scope. Fixed fee. Fixed timeline."
          lede="Eight productised modules — architecture, Kubernetes migration, observability, security hardening and the rest — sold individually or assembled into a bundle. Built and operated against an open-source platform stack, in partnership with ALI Technologies."
        />
      </Section>

      {/* ── Partner disclosure ───────────────────────────────────────── */}
      <Section tone="raised" className="py-12 md:py-14">
        <div className="grid items-center gap-8 md:grid-cols-[1fr_auto] md:gap-12">
          <div>
            <h2 className="text-2xs font-semibold tracking-[0.18em] text-[var(--color-amber-700)] uppercase">
              In partnership with {partner}
            </h2>
            <p className="mt-3 max-w-2xl text-[var(--ink-secondary)]">
              {settings["partner.relationship"]}
            </p>
          </div>
          {settings["partner.url"] ? (
            <a
              href={settings["partner.url"]}
              rel="noopener noreferrer"
              target="_blank"
              className="inline-flex h-11 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border-default)] px-4 text-sm font-medium transition-colors hover:border-[var(--border-strong)]"
            >
              {partner} ↗
            </a>
          ) : null}
        </div>
      </Section>

      {/* ── The eight modules ────────────────────────────────────────── */}
      <Section tone="page">
        <SectionHeading
          eyebrow="Modules"
          title="Eight independently purchasable engagements"
          lede="Pick the one you need. The rest is a follow-on."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Card key={s.slug} as="article" interactive className="flex flex-col gap-4 p-7">
              <div>
                <p className="text-2xs font-semibold tracking-[0.16em] text-[var(--color-amber-700)] uppercase">
                  {s.timelineLabel}
                </p>
                <h3 className="mt-2 text-xl">{s.name}</h3>
                <p className="mt-2 text-sm text-[var(--ink-secondary)]">{s.tagline}</p>
              </div>

              <p className="font-display text-2xl font-semibold text-[var(--ink-primary)]">
                USD {s.flatFeeAmount.toLocaleString()}
              </p>

              <p className="text-sm text-[var(--ink-secondary)]">{s.summary}</p>

              <ul className="flex flex-col gap-1.5 border-t border-[var(--border-subtle)] pt-4 text-sm">
                {s.deliverables.slice(0, 3).map((d) => (
                  <li key={d} className="flex gap-2 text-[var(--ink-secondary)]">
                    <span
                      aria-hidden
                      className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]"
                    />
                    {d}
                  </li>
                ))}
                {s.deliverables.length > 3 ? (
                  <li className="text-2xs text-[var(--ink-muted)]">
                    + {s.deliverables.length - 3} more in the scope
                  </li>
                ) : null}
              </ul>

              <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
                <Link
                  href={`/services/${s.slug}`}
                  className="text-sm font-medium underline-offset-4 hover:underline"
                >
                  Full scope →
                </Link>
                <span className="text-2xs text-[var(--ink-muted)]">{s.category}</span>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* ── The three bundles ───────────────────────────────────────── */}
      <Section tone="sunken">
        <SectionHeading
          eyebrow="Bundles"
          title="Three pre-assembled engagements"
          lede="Common adoption patterns, priced as a unit and discounted against the sum of their modules."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {bundles.map((b) => {
            const discount = b.sumPriceAmount - b.bundlePriceAmount;
            const discountPct = Math.round((discount / b.sumPriceAmount) * 100);
            return (
              <Card key={b.slug} as="article" interactive className="flex flex-col gap-4 p-8">
                <h3 className="text-2xl">{b.name}</h3>
                <p className="text-sm text-[var(--ink-secondary)]">{b.tagline}</p>

                <div>
                  <p className="font-display text-3xl font-semibold text-[var(--ink-primary)]">
                    USD {b.bundlePriceAmount.toLocaleString()}
                  </p>
                  <p className="text-2xs mt-1 text-[var(--ink-muted)]">
                    Sum of modules USD {b.sumPriceAmount.toLocaleString()} · save USD{" "}
                    {discount.toLocaleString()} ({discountPct}%)
                  </p>
                </div>

                <p className="text-sm text-[var(--ink-secondary)]">{b.summary}</p>

                <ul className="text-2xs flex flex-col gap-1.5 border-t border-[var(--border-subtle)] pt-4 text-[var(--ink-secondary)]">
                  {b.serviceSlugs.map((slug) => (
                    <li key={slug} className="flex gap-2">
                      <span aria-hidden className="text-[var(--color-amber-700)]">
                        ·
                      </span>
                      <span className="capitalize">{slug.replace(/-/g, " ")}</span>
                    </li>
                  ))}
                </ul>

                <ButtonLink
                  href={`/services/bundles/${b.slug}`}
                  variant={b.slug === "growth" ? "primary" : "secondary"}
                  className="mt-auto"
                >
                  Bundle scope
                </ButtonLink>
              </Card>
            );
          })}
        </div>
      </Section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <Section tone="inverse" className="py-16 md:py-20">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-2xl md:text-3xl">Not sure which module fits?</h2>
            <p className="mt-3 max-w-xl text-[var(--color-navy-200)]">
              Tell us the constraint. We will tell you which module to start with — including when
              the answer is to start with none of them.
            </p>
          </div>
          <ButtonLink href="/contact?interest=services" size="lg" className="shrink-0">
            Talk to the engineering team
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
