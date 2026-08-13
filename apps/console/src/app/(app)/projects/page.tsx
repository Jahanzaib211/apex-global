import { prisma } from "@apex/db";
import { SectionHeading } from "@apex/ui";
import Link from "next/link";
import { requirePermission } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  await requirePermission("projects:read");
  const projects = await prisma.project.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <SectionHeading
          eyebrow="Projects"
          title="Delivery projects"
          lede="Engagements, milestones and tasks."
        />
        <Link
          href="/projects/new"
          className="inline-flex h-11 items-center rounded-[var(--radius-md)] bg-[var(--accent)] px-5 text-sm font-medium text-[var(--ink-on-accent)]"
        >
          New project
        </Link>
      </div>

      <div className="grid gap-3">
        {projects.length === 0 ? (
          <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] bg-[var(--bg-raised)] p-8 text-center text-sm text-[var(--ink-secondary)]">
            No projects yet.
          </div>
        ) : (
          projects.map((p) => (
            <Link
              key={p.id}
              href={`/projects/${p.id}`}
              className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-4 transition-colors hover:border-[var(--color-amber-500)]"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium">{p.name}</p>
                <span className="text-2xs tracking-[0.12em] text-[var(--ink-muted)] uppercase">
                  {p.status}
                </span>
              </div>
              {p.summary ? (
                <p className="mt-1 text-sm text-[var(--ink-secondary)]">{p.summary}</p>
              ) : null}
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
