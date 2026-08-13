import { prisma } from "@apex/db";
import type { Metadata } from "next";
import Link from "next/link";
import { requirePermission } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Leads" };

const STAGES = ["NEW", "QUALIFIED", "OPPORTUNITY", "CUSTOMER", "LOST"] as const;

/**
 * The Apex properties that feed this pipeline. Keep in step with `LEAD_SITES`
 * in apps/web/src/lib/ingest-lead.ts, which is what actually writes the value.
 */
const SITES: Record<string, string> = {
  tech: "Apex Tech",
  "apex-group": "Group",
  "apex-holdings": "Holdings",
  "apex-outsourcing": "Outsourcing",
  "apex-tours": "Tours",
};

type Props = { searchParams: Promise<{ stage?: string; q?: string; site?: string }> };

export default async function LeadsPage({ searchParams }: Props) {
  await requirePermission("crm:read");
  const { stage, q, site } = await searchParams;

  const where = {
    ...(stage && STAGES.includes(stage as (typeof STAGES)[number])
      ? { stage: stage as (typeof STAGES)[number] }
      : {}),
    ...(site && site in SITES ? { sourceSite: site } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { email: { contains: q, mode: "insensitive" as const } },
            { companyName: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [leads, counts, siteCounts] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        owner: { select: { name: true } },
        attribution: { select: { utmSource: true, utmCampaign: true } },
      },
    }),
    prisma.lead.groupBy({ by: ["stage"], _count: true }),
    prisma.lead.groupBy({ by: ["sourceSite"], _count: true }),
  ]);

  const countFor = (s: string) => counts.find((c) => c.stage === s)?._count ?? 0;
  const countForSite = (s: string) => siteCounts.find((c) => c.sourceSite === s)?._count ?? 0;

  /** Preserve the other filters when switching one of them. */
  const hrefWith = (patch: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const next = { stage, q, site, ...patch };
    for (const [k, v] of Object.entries(next)) if (v) params.set(k, v);
    const qs = params.toString();
    return qs ? `/leads?${qs}` : "/leads";
  };

  return (
    <div className="flex flex-col gap-7">
      <div>
        <h1 className="text-2xl">Leads</h1>
        <p className="mt-1 text-[var(--ink-secondary)]">
          Every enquiry, with the campaign that produced it.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <nav className="flex flex-wrap gap-1" aria-label="Filter by stage">
          <Link
            href={hrefWith({ stage: undefined })}
            className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
              !stage
                ? "bg-[var(--color-navy-900)] text-[var(--color-canvas-100)]"
                : "border border-[var(--border-default)] hover:border-[var(--border-strong)]"
            }`}
          >
            All
          </Link>
          {STAGES.map((s) => (
            <Link
              key={s}
              href={hrefWith({ stage: s })}
              className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                stage === s
                  ? "bg-[var(--color-navy-900)] text-[var(--color-canvas-100)]"
                  : "border border-[var(--border-default)] hover:border-[var(--border-strong)]"
              }`}
            >
              {s.charAt(0) + s.slice(1).toLowerCase()}{" "}
              <span className="opacity-60">{countFor(s)}</span>
            </Link>
          ))}
        </nav>

        <form className="ml-auto" action="/leads">
          {stage ? <input type="hidden" name="stage" value={stage} /> : null}
          {site ? <input type="hidden" name="site" value={site} /> : null}
          <input
            type="search"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search name, email, company"
            className="h-9 w-64 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-raised)] px-3 text-sm"
          />
        </form>
      </div>

      {/* Which Apex property produced the enquiry. Only worth showing once
          more than one site is actually feeding the pipeline. */}
      {siteCounts.length > 1 ? (
        <nav className="flex flex-wrap items-center gap-1" aria-label="Filter by site">
          <span className="text-2xs mr-1 tracking-[0.12em] text-[var(--ink-muted)] uppercase">
            Site
          </span>
          <Link
            href={hrefWith({ site: undefined })}
            className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
              !site
                ? "bg-[var(--color-navy-900)] text-[var(--color-canvas-100)]"
                : "border border-[var(--border-default)] hover:border-[var(--border-strong)]"
            }`}
          >
            All
          </Link>
          {Object.entries(SITES).map(([slug, label]) => (
            <Link
              key={slug}
              href={hrefWith({ site: slug })}
              className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                site === slug
                  ? "bg-[var(--color-navy-900)] text-[var(--color-canvas-100)]"
                  : "border border-[var(--border-default)] hover:border-[var(--border-strong)]"
              }`}
            >
              {label} <span className="opacity-60">{countForSite(slug)}</span>
            </Link>
          ))}
        </nav>
      ) : null}

      <div className="scroll-x rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)]">
        <table className="w-full min-w-[52rem] text-sm">
          <thead>
            <tr className="text-2xs border-b border-[var(--border-subtle)] text-left tracking-[0.12em] text-[var(--ink-muted)] uppercase">
              <th className="px-5 py-3 font-semibold">Name</th>
              <th className="px-5 py-3 font-semibold">Site</th>
              <th className="px-5 py-3 font-semibold">Company</th>
              <th className="px-5 py-3 font-semibold">Interest</th>
              <th className="px-5 py-3 font-semibold">Source</th>
              <th className="px-5 py-3 font-semibold">Owner</th>
              <th className="px-5 py-3 font-semibold">Stage</th>
              <th className="px-5 py-3 font-semibold">Received</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {leads.map((lead) => (
              <tr key={lead.id} className="transition-colors hover:bg-[var(--bg-sunken)]">
                <td className="px-5 py-3">
                  <Link
                    href={`/leads/${lead.id}`}
                    className="font-medium underline-offset-4 hover:underline"
                  >
                    {lead.name}
                  </Link>
                  <p className="text-xs text-[var(--ink-muted)]">{lead.email}</p>
                </td>
                <td className="px-5 py-3">
                  <span className="rounded-full border border-[var(--border-default)] px-2 py-0.5 text-xs whitespace-nowrap text-[var(--ink-secondary)]">
                    {SITES[lead.sourceSite] ?? lead.sourceSite}
                  </span>
                </td>
                <td className="px-5 py-3 text-[var(--ink-secondary)]">
                  {lead.companyName ?? "—"}
                  {lead.country ? (
                    <p className="text-xs text-[var(--ink-muted)]">{lead.country}</p>
                  ) : null}
                </td>
                <td className="px-5 py-3 text-[var(--ink-secondary)]">
                  {lead.interestSlug ?? "—"}
                </td>
                <td className="px-5 py-3 text-[var(--ink-secondary)]">
                  {lead.attribution?.utmSource ?? "direct"}
                  {lead.attribution?.utmCampaign ? (
                    <p className="text-xs text-[var(--ink-muted)]">
                      {lead.attribution.utmCampaign}
                    </p>
                  ) : null}
                </td>
                <td className="px-5 py-3 text-[var(--ink-secondary)]">
                  {lead.owner?.name ?? (
                    <span className="text-[var(--color-amber-700)]">Unassigned</span>
                  )}
                </td>
                <td className="px-5 py-3">
                  <span className="text-2xs rounded-full bg-[var(--bg-sunken)] px-2.5 py-0.5 font-medium uppercase">
                    {lead.stage}
                  </span>
                </td>
                <td className="px-5 py-3 text-[var(--ink-muted)]">
                  {lead.createdAt.toLocaleDateString("en-GB")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {leads.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-[var(--ink-secondary)]">
            No leads match this filter.
          </p>
        ) : null}
      </div>
    </div>
  );
}
