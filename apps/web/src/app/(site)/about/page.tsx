import { ButtonLink, Card, Section, SectionHeading, Stat } from "@apex/ui";
import type { Metadata } from "next";
import { getSettings, getSolutions, getTechProof } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "About",
  description:
    "Apex Global Tech Solution is a technology company that builds and operates SaaS products and delivers software, AI, cloud, cybersecurity and managed IT to businesses worldwide.",
  alternates: { canonical: absoluteUrl("/about") },
};

const VALUES = [
  {
    title: "Say what is ours",
    body: "Every platform we show states whether we built it, operate it, or deploy it as third-party open source. Every figure states its source. Anyone can check us, and we would rather they did.",
  },
  {
    title: "Build to hand over",
    body: "Typed codebases, tests that assert behaviour, deployment automation and a runbook with every system. A client who cannot run what we built without us is a client we have failed.",
  },
  {
    title: "Operate, don't just ship",
    body: "We run production systems daily — monitoring, backups, restores, incident response. It is why our advice about operations is worth something.",
  },
  {
    title: "Decline the wrong work",
    body: "If a project does not need doing, or a cheaper approach exists, we say so. Being right is a better long-term business than being busy.",
  },
];

export default async function AboutPage() {
  const [settings, solutions, techProof] = await Promise.all([
    getSettings(),
    getSolutions(),
    getTechProof(),
  ]);

  const ceoName = settings["leadership.ceo.name"];
  const ceoTitle = settings["leadership.ceo.title"];
  const ceoBio = settings["leadership.ceo.bio"];
  const liveSystems = techProof.filter((t) => t.isPubliclyReachable).length;

  return (
    <>
      <Section tone="inverse" grid className="py-20 md:py-24">
        <SectionHeading
          inverse
          as="h1"
          eyebrow="About Apex"
          title="A technology company that builds and runs its own software"
          lede="We build SaaS products, we operate them in production, and we deliver the same engineering to businesses worldwide. Those two halves are not separate: running our own platforms is what makes our advice about running yours worth paying for."
        />
      </Section>

      <Section tone="page">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          <div className="flex max-w-[var(--container-prose)] flex-col gap-5 text-[1.0625rem] leading-[1.75] text-[var(--ink-secondary)]">
            <h2 className="text-2xl text-[var(--ink-primary)]">Where we came from</h2>
            <p>
              Apex started by building and operating its own platforms rather than by selling
              consulting hours. That order matters. It means the infrastructure practices we
              recommend are ones we are already living with, and the failure modes we design around
              are ones that have actually woken someone up.
            </p>
            <p>
              Today we run a hosting business on software we wrote, an AI agent platform in
              production, and the Kubernetes infrastructure underneath both. The same team that
              builds for clients keeps those systems up.
            </p>

            <h2 className="mt-6 text-2xl text-[var(--ink-primary)]">Where we are going</h2>
            <p>
              The long-term shape of the company is a portfolio of SaaS products, funded and
              informed by the services work. Services prove the capability and pay for the
              engineering; products compound. We are deliberate about which side a given piece of
              work belongs to.
            </p>
            <p>
              Geographically we are unbounded. We work with clients internationally and deliver
              remotely, with an office in Lahore. What we sell is engineering judgement, and that
              travels.
            </p>
          </div>

          <aside className="flex flex-col gap-8">
            <Stat
              value={String(solutions.length)}
              label="Areas of technology capability"
              source="Published solution pages on this site"
            />
            <Stat
              value={String(liveSystems)}
              label="Systems you can visit and check right now"
              source="Publicly reachable entries on our Technology page"
            />
            <Stat
              value="+35,738"
              label="Lines of original engineering on our AI platform"
              source="git diff against the upstream release tag"
            />
          </aside>
        </div>
      </Section>

      {/* ── Leadership ───────────────────────────────────────────────── */}
      <Section tone="sunken">
        <SectionHeading eyebrow="Leadership" title="Who runs Apex" />

        <div className="mt-10 grid gap-8 lg:grid-cols-[auto_1fr] lg:gap-12">
          <div className="h-40 w-40 shrink-0 overflow-hidden rounded-[var(--radius-lg)] bg-[var(--bg-sunken)] ring-1 ring-[var(--border-default)]">
            {settings["leadership.ceo.photo"] ? (
              // Plain img rather than next/image: the URL comes from a console
              // setting and could be any host, which next/image would reject
              // without a remotePatterns entry per domain.
              <img
                src={settings["leadership.ceo.photo"]}
                alt={`${ceoName}, ${ceoTitle}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xs uppercase tracking-[0.16em] text-[var(--ink-muted)]">
                Photograph
                <br />
                pending
              </div>
            )}
          </div>

          <div className="max-w-[var(--container-prose)]">
            <h3 className="text-2xl">{ceoName}</h3>
            <p className="mt-1 text-[var(--color-amber-700)]">{ceoTitle}</p>

            {ceoBio ? (
              <p className="mt-5 text-[1.0625rem] leading-[1.75] text-[var(--ink-secondary)]">
                {ceoBio}
              </p>
            ) : (
              /* No invented biography. A fabricated background is exactly the
                 detail that unravels in a first conversation, so the page says
                 what is true — that it is not written yet. Fill it in from
                 Settings → Leadership. */
              <p className="mt-5 rounded-[var(--radius-md)] border border-dashed border-[var(--border-strong)] p-5 text-sm text-[var(--ink-muted)]">
                Biography to be supplied. This section is intentionally blank rather than filled
                with generic copy — it will carry {ceoName}&apos;s own account of what Apex is
                building and why.
              </p>
            )}
          </div>
        </div>
      </Section>

      {/* ── Values ───────────────────────────────────────────────────── */}
      <Section tone="page">
        <SectionHeading
          eyebrow="How we work"
          title="Four things we hold to"
          lede="These are operating rules rather than aspirations — each one is enforced somewhere in how we build."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {VALUES.map((v) => (
            <Card key={v.title} className="flex flex-col gap-3 p-8">
              <h3 className="text-lg font-semibold">{v.title}</h3>
              <p className="text-[var(--ink-secondary)]">{v.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="inverse" className="py-16 md:py-20">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-2xl md:text-3xl">Work with us, or come and build here</h2>
            <p className="mt-3 max-w-xl text-[var(--color-navy-200)]">
              We are hiring engineers, and we are always open to a conversation about a project.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <ButtonLink href="/contact" size="lg">
              Talk to our team
            </ButtonLink>
            <ButtonLink href="/careers" size="lg" variant="inverse">
              See open roles
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
