import { prisma } from "@apex/db";
import { SectionHeading, Button } from "@apex/ui";
import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/auth";
import { audit } from "@/lib/audit";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  await requirePermission("projects:write");
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: { id: true, name: true, email: true },
  });

  async function createProject(formData: FormData) {
    "use server";
    const actor = await requirePermission("projects:write");
    const name = String(formData.get("name") ?? "").trim();
    const summary = String(formData.get("summary") ?? "").trim() || null;
    const leadId = String(formData.get("leadId") ?? "").trim() || null;
    if (!name) redirect("/projects/new?error=missing");
    const slug =
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 60) || `proj-${Date.now()}`;
    await prisma.project.create({ data: { name, summary, slug, leadId } });
    await audit({
      actor,
      action: "projects.created",
      entityType: "Project",
      entityId: slug,
      summary: `Created project ${name}`,
    });
    redirect("/projects");
  }

  return (
    <div className="mx-auto max-w-3xl">
      <SectionHeading eyebrow="Projects" title="New project" />
      <form
        action={createProject}
        className="mt-6 flex flex-col gap-5 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-6"
      >
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Name
          <input
            name="name"
            required
            className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Summary
          <textarea
            name="summary"
            rows={3}
            className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 py-2 text-sm font-normal"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Link to lead (optional)
          <select
            name="leadId"
            className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
          >
            <option value="">— none —</option>
            {leads.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name} ({l.email})
              </option>
            ))}
          </select>
        </label>
        <div>
          <Button type="submit" size="lg">
            Create project
          </Button>
        </div>
      </form>
    </div>
  );
}
