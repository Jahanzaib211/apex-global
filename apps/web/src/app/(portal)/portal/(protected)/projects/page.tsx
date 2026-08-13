import { prisma } from "@apex/db";
import { SectionHeading } from "@apex/ui";
import Link from "next/link";
import { requirePortalUserAccount } from "@/lib/portal/auth";

export const dynamic = "force-dynamic";

export default async function PortalProjectsPage() {
  const { user } = await requirePortalUserAccount();

  const projects = await prisma.project.findMany({
    where: { portalAccountId: user.portalAccountId },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="flex flex-col gap-8">
      <SectionHeading
        eyebrow="Projects"
        title="Your projects with Apex"
        lede="Live engagement progress, milestones and sign-offs."
      />

      {projects.length === 0 ? (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] bg-[var(--bg-raised)] p-8 text-center">
          <h2 className="text-lg font-semibold">No projects yet</h2>
          <p className="mt-2 text-sm text-[var(--ink-secondary)]">
            When we kick off a project for you, it appears here.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/portal/projects/${p.id}`}
              className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-5 transition-colors hover:border-[var(--color-amber-500)]"
            >
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-lg font-semibold">{p.name}</p>
                <span className="text-2xs rounded-full bg-[var(--bg-sunken)] px-3 py-1 font-medium text-[var(--ink-secondary)] uppercase">
                  {p.status}
                </span>
              </div>
              {p.summary ? (
                <p className="text-sm text-[var(--ink-secondary)]">{p.summary}</p>
              ) : null}
              {p.startsAt ? (
                <p className="text-2xs text-[var(--ink-muted)]">
                  Started {p.startsAt.toLocaleDateString("en-GB")}
                </p>
              ) : null}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
