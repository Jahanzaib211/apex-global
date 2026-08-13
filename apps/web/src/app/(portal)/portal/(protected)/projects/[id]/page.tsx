import { prisma } from "@apex/db";
import { SectionHeading } from "@apex/ui";
import { notFound } from "next/navigation";
import Link from "next/link";
import { requirePortalUserAccount } from "@/lib/portal/auth";

export const dynamic = "force-dynamic";

export default async function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user } = await requirePortalUserAccount();

  const project = await prisma.project.findFirst({
    where: { id, portalAccountId: user.portalAccountId },
    include: { tasks: { orderBy: { order: "asc" } } },
  });
  if (!project) notFound();

  return (
    <div className="flex flex-col gap-6">
      <Link href="/portal/projects" className="text-sm text-[var(--ink-secondary)] hover:underline">
        ← All projects
      </Link>

      <SectionHeading
        eyebrow={project.status}
        title={project.name}
        lede={project.summary ?? undefined}
      />

      <section className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-6">
        <h2 className="text-lg font-semibold">Progress</h2>
        <ul className="mt-4 flex flex-col gap-2">
          {project.tasks.map((t) => (
            <li
              key={t.id}
              className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--border-subtle)] px-4 py-3"
            >
              <span className="text-sm">{t.title}</span>
              <span
                className={`text-2xs rounded-full px-2.5 py-0.5 font-medium uppercase ${
                  t.status === "DONE"
                    ? "bg-[var(--color-success-100)] text-[var(--color-success-500)]"
                    : "bg-[var(--bg-sunken)] text-[var(--ink-secondary)]"
                }`}
              >
                {t.status}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
