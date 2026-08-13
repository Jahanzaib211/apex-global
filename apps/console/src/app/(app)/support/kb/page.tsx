import { prisma } from "@apex/db";
import { SectionHeading, Button } from "@apex/ui";
import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/auth";
import { audit } from "@/lib/audit";

export const dynamic = "force-dynamic";

export default async function KbPage() {
  await requirePermission("support:read");
  const articles = await prisma.kbArticle.findMany({
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
  });

  async function createArticle(formData: FormData) {
    "use server";
    const actor = await requirePermission("support:write");
    const title = String(formData.get("title") ?? "").trim();
    const excerpt = String(formData.get("excerpt") ?? "").trim();
    const body = String(formData.get("body") ?? "").trim();
    const category = String(formData.get("category") ?? "").trim() || "General";
    if (!title || !body) redirect("/support/kb?error=missing");
    const slug =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 80) || `kb-${Date.now()}`;
    await prisma.kbArticle.create({
      data: { slug, title, excerpt, body, category, status: "DRAFT" },
    });
    await audit({
      actor,
      action: "support.kb_created",
      entityType: "KbArticle",
      entityId: slug,
      summary: `Created draft KB article ${title}`,
    });
    redirect("/support/kb");
  }

  async function togglePublish(formData: FormData) {
    "use server";
    const actor = await requirePermission("support:write");
    const id = String(formData.get("id") ?? "");
    const article = await prisma.kbArticle.findUnique({ where: { id } });
    if (!article) return;
    const next = article.status === "LIVE" ? "DRAFT" : "LIVE";
    await prisma.kbArticle.update({
      where: { id },
      data: { status: next, publishedAt: next === "LIVE" ? new Date() : null },
    });
    await audit({
      actor,
      action: "support.kb_published",
      entityType: "KbArticle",
      entityId: id,
      summary: `${article.title} → ${next}`,
    });
    redirect("/support/kb");
  }

  return (
    <div className="flex flex-col gap-8">
      <SectionHeading
        eyebrow="Support"
        title="Knowledge base"
        lede="Internal + client-facing articles."
      />

      <form
        action={createArticle}
        className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Title
            <input
              name="title"
              className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Category
            <input
              name="category"
              defaultValue="General"
              className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
            />
          </label>
        </div>
        <label className="mt-3 flex flex-col gap-1.5 text-sm font-medium">
          Excerpt
          <input
            name="excerpt"
            className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
          />
        </label>
        <label className="mt-3 flex flex-col gap-1.5 text-sm font-medium">
          Body
          <textarea
            name="body"
            rows={4}
            className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 py-2 text-sm font-normal"
          />
        </label>
        <div className="mt-3">
          <Button type="submit" size="sm">
            Create draft
          </Button>
        </div>
      </form>

      <div className="grid gap-3">
        {articles.map((a) => (
          <div
            key={a.id}
            className="flex items-center justify-between gap-3 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-4"
          >
            <div>
              <p className="font-medium">{a.title}</p>
              <p className="text-2xs text-[var(--ink-muted)]">
                {a.category} · {a.status}
              </p>
            </div>
            <form action={togglePublish}>
              <input type="hidden" name="id" value={a.id} />
              <Button type="submit" size="sm" variant="secondary">
                {a.status === "LIVE" ? "Unpublish" : "Publish"}
              </Button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
