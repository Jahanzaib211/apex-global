import { ButtonLink, Card, OriginBadge, Section, SectionHeading } from "@apex/ui";
import type { Metadata } from "next";
import { ArchitectureDiagram } from "@/components/architecture-diagram";
import { Prose } from "@/components/prose";
import { getTechProof } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Technology & Engineering",
  description:
    "The platforms and infrastructure Apex actually runs: architecture, orchestration, observability, security operations and engineering practice — with the provenance of every system stated.",
  alternates: { canonical: absoluteUrl("/technology") },
};

const CATEGORIES = [
  { key: "platform", label: "Platforms" },
  { key: "infrastructure", label: "Infrastructure" },
  { key: "security", label: "Security" },
  { key: "engineering", label: "Engineering practice" },
] as const;

export default async function TechnologyPage() {
  const entries = await getTechProof();

  return (
    <>
      <Section tone="inverse" grid className="py-20 md:py-24">
        <SectionHeading
          inverse
          as="h1"
          eyebrow="Technology & Engineering"
          title="We don't just talk about technology. We operate it."
          lede="This page exists for the technical person your organisation sends to check whether we know what we are doing. Every system below states whether we built it, operate it, or deploy it as third-party open source — and every figure states where it came from."
        />
      </Section>

      {/* ── Architecture ─────────────────────────────────────────────── */}
      <Section tone="page">
        <SectionHeading
          eyebrow="Architecture"
          title="How the platform fits together"
          lede="The shape of a system we build and run. Datastores are bound to loopback: nothing in the data tier is reachable from the public internet."
        />
        <div className="mt-10">
          <ArchitectureDiagram />
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              t: "No inbound listener",
              d: "Public services are published through authenticated outbound tunnels. There is no open port to scan and no origin address to reach around the edge.",
            },
            {
              t: "One system of record",
              d: "PostgreSQL holds the truth. Caches and search indexes are derived and disposable, so a rebuild is never a data-loss event.",
            },
            {
              t: "Work happens off the request",
              d: "Notifications, AI jobs and conversion delivery run on queues. A slow third party never blocks a visitor's form submission.",
            },
          ].map((x) => (
            <div key={x.t}>
              <h3 className="font-semibold">{x.t}</h3>
              <p className="mt-2 text-sm text-[var(--ink-secondary)]">{x.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Proof entries by category ────────────────────────────────── */}
      {CATEGORIES.map((cat, index) => {
        const items = entries.filter((e) => e.category === cat.key);
        if (items.length === 0) return null;

        return (
          <Section key={cat.key} tone={index % 2 === 0 ? "sunken" : "page"}>
            <SectionHeading eyebrow={cat.label} title={sectionTitle(cat.key)} />

            <div className="mt-10 flex flex-col gap-6">
              {items.map((e) => (
                <Card key={e.slug} as="article" className="p-8">
                  <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl">{e.title}</h3>
                        <OriginBadge
                          origin={e.origin}
                          upstreamName={e.upstreamName}
                          upstreamUrl={e.upstreamUrl}
                          upstreamLicense={e.upstreamLicense}
                        />
                      </div>

                      <p className="mt-3 font-medium text-[var(--ink-secondary)]">{e.summary}</p>

                      {e.isPubliclyReachable && e.publicUrl ? (
                        <a
                          href={e.publicUrl}
                          rel="noopener noreferrer"
                          target="_blank"
                          className="mt-4 inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border-default)] px-3 py-1.5 text-sm font-medium transition-colors hover:border-[var(--border-strong)]"
                        >
                          <span
                            aria-hidden
                            className="h-1.5 w-1.5 rounded-full bg-[var(--color-success-500)]"
                          />
                          See it running
                          <span aria-hidden className="text-[var(--ink-muted)]">
                            ↗
                          </span>
                        </a>
                      ) : (
                        // Saying so is the point. A system we cannot show is
                        // described as private rather than left ambiguous.
                        <p className="mt-4 text-2xs text-[var(--ink-muted)]">
                          Not publicly exposed — demonstrated privately on request.
                        </p>
                      )}

                      <Prose text={e.detail} className="mt-5" />

                      {e.technologies.length > 0 ? (
                        <ul className="mt-6 flex flex-wrap gap-2">
                          {e.technologies.map((t) => (
                            <li
                              key={t}
                              className="rounded-full border border-[var(--border-default)] px-2.5 py-1 text-2xs text-[var(--ink-secondary)]"
                            >
                              {t}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>

                    {e.evidence.length > 0 ? (
                      <div className="rounded-[var(--radius-md)] bg-[var(--bg-sunken)] p-6">
                        <h4 className="text-2xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
                          Evidence
                        </h4>
                        <dl className="mt-4 flex flex-col gap-5">
                          {e.evidence.map((ev) => (
                            <div key={ev.id}>
                              <dd className="font-display text-lg font-semibold text-[var(--ink-primary)]">
                                {ev.value}
                              </dd>
                              <dt className="mt-0.5 text-sm text-[var(--ink-secondary)]">
                                {ev.label}
                              </dt>
                              {/* The source is the point. A figure without one
                                  does not get published. */}
                              <p className="mt-1 text-2xs text-[var(--ink-muted)]">
                                Source: {ev.source}
                              </p>
                            </div>
                          ))}
                        </dl>
                      </div>
                    ) : null}
                  </div>
                </Card>
              ))}
            </div>
          </Section>
        );
      })}

      {/* ── The honesty note ─────────────────────────────────────────── */}
      <Section tone="raised">
        <div className="max-w-3xl">
          <SectionHeading
            eyebrow="A note on attribution"
            title="What we built, and what we run"
          />
          <div className="mt-6 flex flex-col gap-5 text-[1.0625rem] leading-[1.75] text-[var(--ink-secondary)]">
            <p>
              Every technology company stands on open source. The difference between suppliers is
              whether they tell you which parts are theirs.
            </p>
            <p>
              Where a system on this page carries{" "}
              <strong className="font-semibold text-[var(--ink-primary)]">Built by Apex</strong>, we
              designed and wrote it — and where it derives from an upstream project, that project is
              named with its licence.{" "}
              <strong className="font-semibold text-[var(--ink-primary)]">Operated by Apex</strong>{" "}
              means we deploy, configure, secure and run it.{" "}
              <strong className="font-semibold text-[var(--ink-primary)]">
                Third-party open source
              </strong>{" "}
              means someone else wrote it and we run it for clients. We do not blur those three.
            </p>
            <p>
              The security tooling in particular is other people&apos;s software. The deployment,
              hardening, tuning and triage process around it is ours, and that is what we are
              selling.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="inverse" className="py-16 md:py-20">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-2xl md:text-3xl">Want to go deeper?</h2>
            <p className="mt-3 max-w-xl text-[var(--color-navy-200)]">
              We will walk your engineers through any of this on a call, including the parts that
              are still rough.
            </p>
          </div>
          <ButtonLink href="/contact?interest=technology" size="lg" className="shrink-0">
            Arrange a technical review
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}

function sectionTitle(key: string): string {
  switch (key) {
    case "platform":
      return "Systems we have built and run";
    case "infrastructure":
      return "The infrastructure underneath";
    case "security":
      return "Security operations";
    default:
      return "How we work";
  }
}
