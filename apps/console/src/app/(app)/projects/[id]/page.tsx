import { prisma } from "@apex/db";
import type { TaskStatus } from "@apex/db";
import { SectionHeading, Button } from "@apex/ui";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requirePermission } from "@/lib/auth";

export const dynamic = "force-dynamic";

const TASK_STATUSES: TaskStatus[] = ["TODO", "IN_PROGRESS", "REVIEW", "DONE"];

type Props = { params: Promise<{ id: string }> };

export default async function ProjectDetailPage({ params }: Props) {
  await requirePermission("projects:read");
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: { tasks: { orderBy: { order: "asc" } }, leads: { select: { id: true, name: true } } },
  });
  if (!project) notFound();

  async function createTask(formData: FormData) {
    "use server";
    await requirePermission("projects:write");
    const title = String(formData.get("title") ?? "").trim();
    if (!title) return;
    const order = project!.tasks.length;
    await prisma.task.create({ data: { projectId: id, title, status: "TODO", order } });
    redirect(`/projects/${id}`);
  }

  async function setTaskStatus(formData: FormData) {
    "use server";
    await requirePermission("projects:write");
    const taskId = String(formData.get("taskId") ?? "");
    const status = String(formData.get("status") ?? "") as TaskStatus;
    if (!TASK_STATUSES.includes(status)) return;
    await prisma.task.update({ where: { id: taskId }, data: { status } });
    redirect(`/projects/${id}`);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between">
        <SectionHeading
          eyebrow={`Project ${project.status}`}
          title={project.name}
          lede={project.summary ?? undefined}
        />
        <Link href="/projects" className="text-sm underline-offset-4 hover:underline">
          ← All projects
        </Link>
      </div>

      {project.leads.length > 0 ? (
        <p className="text-2xs mt-3 text-[var(--ink-muted)]">
          Linked to lead{" "}
          <Link href={`/leads/${project.leads[0]!.id}`} className="underline">
            {project.leads[0]!.name}
          </Link>
        </p>
      ) : null}

      <div className="mt-6 space-y-2">
        {project.tasks.map((t) => (
          <div
            key={t.id}
            className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-3"
          >
            <span className="text-sm">{t.title}</span>
            <form action={setTaskStatus} className="flex items-center gap-2">
              <input type="hidden" name="taskId" value={t.id} />
              <select
                name="status"
                defaultValue={t.status}
                className="h-8 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-2 text-xs"
                onChange={(e) => e.currentTarget.form?.requestSubmit()}
              >
                {TASK_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <Button type="submit" size="sm" variant="secondary" className="hidden">
                Update
              </Button>
            </form>
          </div>
        ))}
        {project.tasks.length === 0 ? (
          <p className="text-sm text-[var(--ink-secondary)]">No tasks yet.</p>
        ) : null}
      </div>

      <form action={createTask} className="mt-6 flex gap-2">
        <input
          name="title"
          placeholder="New task title"
          className="h-11 flex-1 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
        />
        <Button type="submit" size="sm">
          Add task
        </Button>
      </form>
    </div>
  );
}
