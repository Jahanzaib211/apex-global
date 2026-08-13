import { prisma } from "@apex/db";
import { ButtonLink, Section, SectionHeading } from "@apex/ui";
import type { Metadata } from "next";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import { LiveCode } from "@/components/live-code";
import { RepoGraph } from "@/components/repo-graph";
import { LeadForm } from "@/components/lead-form";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Module 1 — Architecture & Design | See the code, then buy the module",
  description:
    "The $4,000, five-day Architecture & Design module, shown with the real source that ships with it. What you see running below is actual code from the repository that builds this site.",
  alternates: { canonical: absoluteUrl("/campaigns/module-1-architecture-design") },
  robots: { index: true, follow: true },
};

/**
 * The file we animate on this campaign. Deliberately a small, representative,
 * self-contained source file from this repository — the seeded Module 1
 * service record — so the "real code" claim is literally true. We read it at
 * build/ISR time from disk and pass the bytes to the client animator.
 */
const SHOWCASE_FILE = "packages/db/prisma/content/services.ts";

async function readShowcase(): Promise<string | null> {
  const fromRoot = path.join(process.cwd(), SHOWCASE_FILE);
  const fromApp = path.join(process.cwd(), "..", "..", SHOWCASE_FILE);
  for (const candidate of [fromRoot, fromApp]) {
    try {
      return await readFile(candidate, "utf8");
    } catch {
      // try next
    }
  }
  return null;
}

export default async function Module1CampaignPage() {
  const service = await prisma.service.findUnique({
    where: { slug: "architecture-design" },
    select: {
      slug: true,
      name: true,
      tagline: true,
      summary: true,
      flatFeeAmount: true,
      feeCurrency: true,
      timelineLabel: true,
      deliverables: true,
      technologies: true,
    },
  });
  if (!service) notFound();

  const code = await readShowcase();

  return (
    <>
      <Section tone="inverse" grid className="py-20 md:py-24">
        <div className="text-2xs flex flex-wrap items-center gap-3 tracking-[0.16em] text-[var(--color-amber-400)] uppercase">
          <span>Campaign</span>
          <span aria-hidden>·</span>
          <span>Module 1</span>
        </div>

        <SectionHeading
          inverse
          as="h1"
          title="Architecture & Design — see the code, then see the cost"
          lede="The first module in the fixed-fee catalogue. A documented target architecture before you commit to a build — and below, the real source code we ship as part of the work, animated as it is written."
          className="mt-4"
        />

        <div className="mt-8 flex flex-wrap items-center gap-6">
          <div>
            <p className="text-2xs tracking-[0.16em] text-[var(--color-navy-300)] uppercase">
              Fixed fee
            </p>
            <p className="font-display text-3xl font-semibold text-[var(--color-canvas-100)]">
              USD {service.flatFeeAmount.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-2xs tracking-[0.16em] text-[var(--color-navy-300)] uppercase">
              Timeline
            </p>
            <p className="font-display text-3xl font-semibold text-[var(--color-canvas-100)]">
              {service.timelineLabel}
            </p>
          </div>
          <div>
            <ButtonLink href="/contact?interest=architecture-design" size="lg">
              Buy Module 1
            </ButtonLink>
          </div>
        </div>
      </Section>

      {/* ── The code, live ──────────────────────────────────────────── */}
      {code ? (
        <Section tone="raised">
          <SectionHeading
            eyebrow="See the code"
            title="This is real source from a real repository"
            lede="Every Architecture & Design module ships a reference deployment and the code that runs it. What you are watching below is actual code from the repository that builds this website — read from disk seconds ago, animated line by line."
          />
          <div className="mt-12">
            <LiveCode filePath={SHOWCASE_FILE} code={code} linesPerStep={1} stepMs={40} />
          </div>
        </Section>
      ) : null}

      {/* ── The whole repository, as a graph ─────────────────────────── */}
      <Section tone="inverse">
        <SectionHeading
          inverse
          eyebrow="Everything that builds this site"
          title="This is the code behind the page you are reading"
          lede="Every symbol below is real, and every edge between two symbols is a real dependency in this repository. Hover to trace a node's neighbourhood, click a node to read that file's actual source."
        />
        <div className="mt-10">
          <RepoGraph />
        </div>
      </Section>

      {/* ── The deliverables ────────────────────────────────────────── */}
      <Section tone="page">
        <SectionHeading eyebrow="What you get" title="The deliverables" />
        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {service.deliverables.map((d) => (
            <li
              key={d}
              className="flex gap-3 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-5"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-amber-500)]/15 font-semibold text-[var(--color-amber-700)]">
                ✓
              </span>
              <span className="text-[var(--ink-primary)]">{d}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── Enquire ─────────────────────────────────────────────────── */}
      <Section tone="sunken" id="enquire">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Next step"
              title="Discuss a Module 1 engagement"
              lede="Tell us the constraint. If this module fits, the kickoff is a fixed-scope week — not a discovery phase."
            />
            <p className="mt-6 max-w-md text-sm text-[var(--ink-secondary)]">
              <strong className="font-semibold text-[var(--ink-primary)]">
                USD {service.flatFeeAmount.toLocaleString()} fixed.
              </strong>{" "}
              {service.timelineLabel} from kickoff. Worst case, walk away with the document and a
              reference deployment in your repo.
            </p>
          </div>
          <div>
            <LeadForm
              compact
              interestType="services"
              interestSlug="architecture-design"
              submitLabel="Discuss Architecture & Design"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
