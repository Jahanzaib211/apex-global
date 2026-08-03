import { prisma } from "@apex/db";
import { Logo } from "@apex/ui";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LeadForm } from "@/components/lead-form";
import { getLandingPage, getSettings } from "@/lib/content";

export const revalidate = 300;

export async function generateStaticParams() {
  const rows = await prisma.landingPage.findMany({
    where: { status: "LIVE" },
    select: { slug: true },
  });
  return rows.map((r) => ({ slug: r.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getLandingPage(slug);
  if (!page) return {};

  return {
    title: page.headline,
    description: page.subheadline.slice(0, 155),
    // Landing pages duplicate solution content and exist only to convert paid
    // traffic. Indexing them would compete with the pages that should rank.
    robots: { index: false, follow: false },
  };
}

/**
 * Ad landing page.
 *
 * No navigation, no footer links, one action. Everything here is in service of
 * a single conversion — a visitor who leaves to browse the site is a click we
 * paid for and did not convert.
 */
export default async function LandingPage({ params }: Props) {
  const { slug } = await params;
  const [page, settings] = await Promise.all([getLandingPage(slug), getSettings()]);
  if (!page) notFound();

  const phone = settings["org.phone"];

  return (
    <div className="min-h-dvh bg-[var(--color-navy-900)] text-[var(--color-canvas-100)]">
      <div aria-hidden className="bg-grid pointer-events-none fixed inset-0 opacity-30" />

      <div className="container-page relative py-8">
        <div className="flex items-center justify-between gap-4">
          <Logo variant="inverse" />
          {phone ? (
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              data-conversion="phone_click"
              className="text-sm font-medium text-[var(--color-navy-200)] underline-offset-4 hover:text-white hover:underline"
            >
              {phone}
            </a>
          ) : null}
        </div>

        <div className="grid gap-14 py-14 lg:grid-cols-[1.15fr_1fr] lg:gap-20 lg:py-20">
          <div>
            <h1 className="text-4xl leading-[1.08] md:text-5xl">{page.headline}</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--color-navy-200)]">
              {page.subheadline}
            </p>

            {page.bullets.length > 0 ? (
              <ul className="mt-9 flex flex-col gap-4">
                {page.bullets.map((b) => (
                  <li key={b} className="flex gap-3.5 text-[var(--color-canvas-100)]">
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
                    {b}
                  </li>
                ))}
              </ul>
            ) : null}

            <p className="mt-10 border-l-2 border-[var(--color-amber-500)] pl-5 text-sm leading-relaxed text-[var(--color-navy-200)]">
              Every claim on our website states its source, and every platform we show states
              whether we built it or merely run it. You can check us before you talk to us.
            </p>
          </div>

          <div className="rounded-[var(--radius-xl)] border border-[var(--border-inverse)] bg-[var(--bg-raised)] p-7 text-[var(--ink-primary)] shadow-[var(--shadow-lg)] md:p-9">
            <h2 className="text-xl">{page.ctaLabel}</h2>
            <p className="mt-2 text-sm text-[var(--ink-secondary)]">
              No obligation, and no mailing list.
            </p>
            <div className="mt-7">
              <LeadForm
                compact
                interestType={page.productSlug ? "product" : "solution"}
                interestSlug={page.productSlug ?? page.solutionSlug ?? slug}
                submitLabel={page.ctaLabel}
              />
            </div>
          </div>
        </div>

        <p className="border-t border-[var(--border-inverse)] pt-6 text-xs text-[var(--color-slate-400)]">
          © {new Date().getFullYear()} Apex Global Tech Solution
        </p>
      </div>
    </div>
  );
}
