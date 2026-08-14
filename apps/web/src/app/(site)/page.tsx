import { ButtonLink, Card, OriginBadge, Section, SectionHeading, Stat } from "@apex/ui";
import Link from "next/link";
import { ComplianceStrip } from "@/components/compliance-strip";
import { Hero } from "@/components/hero";
import { RepoGraph } from "@/components/repo-graph";
import { TechStackMarquee } from "@/components/tech-stack-marquee";
import {
  displayClient,
  getCaseStudies,
  getIndustries,
  getInsights,
  getProducts,
  getServiceBundles,
  getServices,
  getSettings,
  getSolutions,
  getTechProof,
} from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 300;

const WHY = [
  {
    title: "We operate what we build",
    body: "The infrastructure practices on our Technology page are not a capability statement. They are the systems we run daily, and the same ones we implement for clients.",
  },
  {
    title: "Provenance on every claim",
    body: "Each platform we show states whether we built it, operate it, or deploy it as third-party open source. You can verify what you are buying.",
  },
  {
    title: "Built to be handed over",
    body: "Typed codebases, meaningful tests, deployment automation and a runbook. Your team should be able to run the system without us.",
  },
  {
    title: "A human where consequence is",
    body: "Automation drafts, ranks and summarises. People approve. That is what makes the output defensible to your auditor, regulator or board.",
  },
];

export default async function HomePage() {
  const [
    solutions,
    products,
    services,
    bundles,
    techProof,
    industries,
    caseStudies,
    insights,
    settings,
  ] = await Promise.all([
    getSolutions(),
    getProducts(),
    getServices(),
    getServiceBundles(),
    getTechProof(),
    getIndustries(),
    getCaseStudies(),
    getInsights(),
    getSettings(),
  ]);

  const partner = settings["partner.name"] ?? "ALI Technologies";
  const featuredServices = services.slice(0, 4);
  const featuredBundle = bundles.find((b) => b.slug === "growth") ?? bundles[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Apex Global Tech Solution",
    url: absoluteUrl("/"),
    description:
      "Apex Global Tech Solution builds SaaS products and delivers technology solutions across software, AI, cloud, cybersecurity and IT infrastructure.",
    knowsAbout: solutions.map((s) => s.name),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Hero />

      {/* ── The stack we operate, scrolling ─────────────────────────── */}
      <TechStackMarquee />

      {/* ── Compliance programme, honest about in-progress vs verified ─ */}
      <ComplianceStrip />

      {/* ── Partner strip ───────────────────────────────────────────── */}
      <Section tone="raised" className="py-12 md:py-14">
        <div className="grid items-center gap-8 md:grid-cols-[1fr_auto] md:gap-12">
          <div>
            <h2 className="text-2xs font-semibold tracking-[0.18em] text-[var(--color-amber-700)] uppercase">
              Powered by {partner}
            </h2>
            <p className="mt-3 max-w-3xl text-[var(--ink-secondary)]">
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

      {/* ── The whole repository, as a graph ─────────────────────────── */}
      <Section tone="inverse" id="code-graph">
        <SectionHeading
          inverse
          align="center"
          eyebrow="The code that runs this site"
          title="Everything is alive. This is the source."
          lede="Every symbol below is real, and every edge is a real dependency — parsed from the repository that builds this website, not a marketing mockup. Hover to trace a neighbourhood, click a node to read that file's actual source."
        />
        <div className="mt-10">
          <RepoGraph />
        </div>
      </Section>

      {/* ── Modular services (the headline offering) ───────────────── */}
      {featuredServices.length > 0 ? (
        <Section tone="page" id="services">
          <SectionHeading
            eyebrow="Productised services"
            title="Fixed scope. Fixed fee. Fixed timeline."
            lede={`Eight independently purchasable engineering modules — built and operated by ${partner} against an open-source platform stack. Buy one, or assemble a bundle.`}
          />

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {featuredServices.map((s) => (
              <Card key={s.slug} as="article" interactive className="flex flex-col gap-3 p-6">
                <p className="text-2xs font-semibold tracking-[0.16em] text-[var(--color-amber-700)] uppercase">
                  {s.timelineLabel}
                </p>
                <h3 className="text-lg font-semibold">{s.name}</h3>
                <p className="text-sm text-[var(--ink-secondary)]">{s.tagline}</p>
                <p className="font-display text-xl font-semibold text-[var(--ink-primary)]">
                  USD {s.flatFeeAmount.toLocaleString()}
                </p>
                <div className="mt-auto flex items-center gap-4">
                  <Link
                    href={`/services/${s.slug}`}
                    className="text-sm font-medium underline-offset-4 hover:underline"
                  >
                    Scope →
                  </Link>
                  {s.slug === "architecture-design" ? (
                    <Link
                      href="/campaigns/module-1-architecture-design"
                      className="text-sm font-medium text-[var(--color-amber-700)] underline-offset-4 hover:underline"
                    >
                      Watch us build it →
                    </Link>
                  ) : null}
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <ButtonLink href="/services" size="lg">
              All eight modules
            </ButtonLink>
            {featuredBundle ? (
              <Link
                href={`/services/bundles/${featuredBundle.slug}`}
                className="text-sm font-medium underline-offset-4 hover:underline"
              >
                See the {featuredBundle.name} bundle (USD{" "}
                {featuredBundle.bundlePriceAmount.toLocaleString()}) →
              </Link>
            ) : null}
          </div>
        </Section>
      ) : null}

      {/* ── Trusted technology partner ─────────────────────────────────── */}
      <Section tone="raised" className="py-16 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <p className="text-xl leading-relaxed text-[var(--ink-primary)] md:text-2xl">
            We build technology. We operate technology. We help businesses scale through technology
            — as an engineering partner, not a supplier of hours.
          </p>
          {/* Every figure carries its source. Stat cannot be rendered without
              one, which is the cheapest enforcement of the rule that a number
              on this site must be traceable. */}
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-3">
            <Stat
              value="+35,738"
              label="Lines of original engineering on our AI agent platform"
              source="git diff against the upstream release tag"
            />
            <Stat
              value="0"
              label="Open inbound ports on our production origin"
              source="Network configuration review, Aug 2026"
            />
            <Stat
              value="1.3s"
              label="Response time measured on a live production endpoint"
              source="Direct HTTP request, Aug 2026"
            />
          </div>
        </div>
      </Section>

      {/* ── SaaS products ──────────────────────────────────────────────── */}
      <Section id="saas" tone="page">
        <SectionHeading
          eyebrow="Apex SaaS"
          title="Technology products built to solve real business problems"
          lede="Products we build, run and support. Each one states its provenance, because a platform you cannot verify is a platform you cannot trust."
        />

        {/* One live product must not sit in a two-column grid with a hole
            beside it — an empty cell reads as something failing to load. */}
        <div className={`mt-12 grid gap-6 ${products.length > 1 ? "md:grid-cols-2" : "max-w-3xl"}`}>
          {products.map((p) => (
            <Card key={p.slug} as="article" interactive className="flex flex-col gap-4 p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-2xs font-semibold tracking-[0.16em] text-[var(--ink-muted)] uppercase">
                    {p.category}
                  </p>
                  <h3 className="mt-2 text-2xl">{p.name}</h3>
                  <p className="mt-1 text-[var(--ink-secondary)]">{p.tagline}</p>
                </div>
              </div>

              <p className="text-[var(--ink-secondary)]">{p.summary}</p>

              <OriginBadge
                origin={p.origin}
                upstreamName={p.upstreamName}
                upstreamUrl={p.upstreamUrl}
                upstreamLicense={p.upstreamLicense}
              />

              <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-2">
                <Link
                  href={`/saas/${p.slug}`}
                  className="text-sm font-medium text-[var(--ink-primary)] underline-offset-4 hover:underline"
                >
                  Explore {p.name} →
                </Link>
                {/* Only rendered when the record says it is reachable AND has a
                    URL — the credibility audit enforces that pairing, so this
                    link can never point at nothing. */}
                {p.isPubliclyReachable && p.publicUrl ? (
                  <a
                    href={p.publicUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-amber-700)] underline-offset-4 hover:underline"
                  >
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 rounded-full bg-[var(--color-success-500)]"
                    />
                    See it live
                  </a>
                ) : null}
                {p.demoAvailable ? (
                  <span className="text-2xs text-[var(--ink-muted)]">Demo available</span>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* ── What we build / technology services ────────────────────────── */}
      <Section tone="sunken">
        <SectionHeading
          eyebrow="Technology services"
          title="What we build and operate"
          lede="Nine areas of capability. Most engagements draw on several of them, because production systems rarely respect a service catalogue."
        />

        <ul className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--border-default)] sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((s) => (
            <li key={s.slug} className="bg-[var(--bg-raised)]">
              <Link
                href={`/solutions/${s.slug}`}
                className="group flex h-full flex-col gap-2 p-7 transition-colors hover:bg-[var(--bg-page)]"
              >
                <h3 className="text-lg font-semibold">{s.name}</h3>
                <p className="text-sm text-[var(--ink-secondary)]">{s.tagline}</p>
                <span className="mt-3 text-sm font-medium text-[var(--ink-muted)] transition-colors group-hover:text-[var(--color-amber-700)]">
                  Read more →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── Technology proof ───────────────────────────────────────────── */}
      <Section tone="inverse" grid>
        <SectionHeading
          inverse
          eyebrow="Technology proof"
          title="We don't just talk about technology. We operate it."
          lede="A selection of the platforms and infrastructure we run. Every entry states what we built and what we merely deploy."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {techProof.slice(0, 6).map((t) => (
            <Card key={t.slug} as="article" inverse className="flex flex-col gap-3">
              <p className="text-2xs font-semibold tracking-[0.16em] text-[var(--color-amber-400)] uppercase">
                {t.category}
              </p>
              <h3 className="text-lg font-semibold text-[var(--color-canvas-100)]">{t.title}</h3>
              <p className="text-sm text-[var(--color-navy-200)]">{t.summary}</p>
              <div className="mt-auto pt-3">
                <OriginBadge
                  origin={t.origin}
                  upstreamName={t.upstreamName}
                  upstreamLicense={t.upstreamLicense}
                />
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-10">
          <ButtonLink href="/technology" variant="inverse">
            See the full technology breakdown
          </ButtonLink>
        </div>
      </Section>

      {/* ── Why Apex ───────────────────────────────────────────────────── */}
      <Section tone="page">
        <SectionHeading eyebrow="Why Apex" title="What working with us is actually like" />
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {WHY.map((w) => (
            <div key={w.title} className="border-l-2 border-[var(--color-amber-500)] pl-6">
              <h3 className="text-lg font-semibold">{w.title}</h3>
              <p className="mt-2 text-[var(--ink-secondary)]">{w.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Industries ─────────────────────────────────────────────────── */}
      <Section tone="raised">
        <SectionHeading
          eyebrow="Industries"
          title="Sector context, not sector clichés"
          lede="What changes between industries is the constraint — auditability, peak load, regulation, margin. The engineering follows from that."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((i) => (
            <Card key={i.slug} as="article" interactive className="flex flex-col gap-3">
              <h3 className="text-lg font-semibold">{i.name}</h3>
              <p className="text-sm text-[var(--ink-secondary)]">{i.tagline}</p>
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

      {/* ── Case studies ───────────────────────────────────────────────── */}
      <Section tone="sunken">
        <SectionHeading
          eyebrow="Case studies"
          title="Challenge, strategy, technology, result"
          lede="Client names appear only where we hold written permission. Everything else is described accurately and anonymously."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {caseStudies.map((c) => (
            <Card key={c.slug} as="article" interactive className="flex flex-col gap-4 p-8">
              <p className="text-2xs font-semibold tracking-[0.16em] text-[var(--ink-muted)] uppercase">
                {displayClient(c)}
              </p>
              <h3 className="text-xl">{c.title}</h3>
              <p className="text-[var(--ink-secondary)]">{c.summary}</p>
              {c.metrics.length > 0 ? (
                <dl className="grid grid-cols-2 gap-4 border-t border-[var(--border-subtle)] pt-4">
                  {c.metrics.slice(0, 2).map((m) => (
                    <div key={m.id}>
                      <dd className="font-display text-xl font-semibold">{m.value}</dd>
                      <dt className="text-xs text-[var(--ink-secondary)]">{m.label}</dt>
                    </div>
                  ))}
                </dl>
              ) : null}
              <Link
                href={`/case-studies/${c.slug}`}
                className="mt-auto pt-2 text-sm font-medium underline-offset-4 hover:underline"
              >
                Read the case study →
              </Link>
            </Card>
          ))}
        </div>
      </Section>

      {/* ── Insights ───────────────────────────────────────────────────── */}
      <Section tone="page">
        <SectionHeading eyebrow="Insights" title="Notes from the engineering side" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {insights.slice(0, 3).map((i) => (
            <article key={i.slug} className="flex flex-col gap-3">
              <p className="text-2xs font-semibold tracking-[0.16em] text-[var(--color-amber-700)] uppercase">
                {i.category}
              </p>
              <h3 className="text-lg font-semibold">
                <Link href={`/insights/${i.slug}`} className="underline-offset-4 hover:underline">
                  {i.title}
                </Link>
              </h3>
              <p className="text-sm text-[var(--ink-secondary)]">{i.excerpt}</p>
              <p className="text-2xs mt-auto pt-2 text-[var(--ink-muted)]">
                {i.readingMinutes} min read
              </p>
            </article>
          ))}
        </div>
      </Section>

      {/* ── Final CTA ──────────────────────────────────────────────────── */}
      <Section tone="inverse" className="py-20 md:py-24">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl">Let&apos;s build what&apos;s next.</h2>
            <p className="mt-4 text-lg text-[var(--color-navy-200)]">
              Tell us what you are trying to build, modernise or secure. We will tell you what we
              would do — including when the answer is that you do not need us.
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
