import { prisma } from "@apex/db";
import { SectionHeading, Button } from "@apex/ui";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requirePermission } from "@/lib/auth";
import { audit } from "@/lib/audit";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function TicketDetailPage({ params }: Props) {
  await requirePermission("support:read");
  const { id } = await params;
  const found = await prisma.ticket.findUnique({
    where: { id },
    include: { comments: { orderBy: { createdAt: "asc" } } },
  });
  if (!found) notFound();
  const ticket = found;

  const users = await prisma.user.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  async function addReply(formData: FormData) {
    "use server";
    const actor = await requirePermission("support:write");
    const body = String(formData.get("body") ?? "").trim();
    if (!body) return;
    await prisma.ticketComment.create({
      data: {
        ticketId: id,
        authorKind: `core:user:${actor.id}`,
        authorId: actor.id,
        body,
        isInternal: false,
      },
    });
    await audit({
      actor,
      action: "support.reply",
      entityType: "Ticket",
      entityId: id,
      summary: `Replied on ${ticket!.number}`,
    });
    redirect(`/support/inbox/${id}`);
  }

  async function addInternalNote(formData: FormData) {
    "use server";
    const actor = await requirePermission("support:write");
    const body = String(formData.get("body") ?? "").trim();
    if (!body) return;
    await prisma.ticketComment.create({
      data: {
        ticketId: id,
        authorKind: `core:user:${actor.id}`,
        authorId: actor.id,
        body,
        isInternal: true,
      },
    });
    redirect(`/support/inbox/${id}`);
  }

  async function setStatus(formData: FormData) {
    "use server";
    const actor = await requirePermission("support:write");
    const status = String(formData.get("status") ?? "");
    const resolvedAt =
      status === "RESOLVED"
        ? new Date()
        : status === "CLOSED"
          ? (ticket!.resolvedAt ?? new Date())
          : null;
    await prisma.ticket.update({
      where: { id },
      data: {
        status: status as never,
        resolvedAt,
        closedAt: status === "CLOSED" ? new Date() : null,
      },
    });
    await audit({
      actor,
      action: "support.status",
      entityType: "Ticket",
      entityId: id,
      summary: `${ticket!.number} → ${status}`,
    });
    redirect(`/support/inbox/${id}`);
  }

  async function assign(formData: FormData) {
    "use server";
    const actor = await requirePermission("support:write");
    const assigneeId = String(formData.get("assigneeId") ?? "") || null;
    await prisma.ticket.update({ where: { id }, data: { assigneeId } });
    await audit({
      actor,
      action: "support.assign",
      entityType: "Ticket",
      entityId: id,
      summary: `Assigned ${ticket!.number}`,
    });
    redirect(`/support/inbox/${id}`);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between">
        <SectionHeading eyebrow={`Ticket ${ticket.number}`} title={ticket.title} />
        <Link href="/support/inbox" className="text-sm underline-offset-4 hover:underline">
          ← Inbox
        </Link>
      </div>

      <div className="mt-6 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-6">
        <p className="text-sm whitespace-pre-wrap">{ticket.body}</p>
        <div className="text-2xs mt-4 flex flex-wrap items-center gap-3 text-[var(--ink-muted)]">
          <span className="rounded-full bg-[var(--bg-sunken)] px-2 py-0.5 tracking-[0.12em] uppercase">
            {ticket.status}
          </span>
          <span className="rounded-full bg-[var(--bg-sunken)] px-2 py-0.5 tracking-[0.12em] uppercase">
            {ticket.priority}
          </span>
          {ticket.tags.map((t) => (
            <span key={t} className="rounded-full bg-[var(--bg-sunken)] px-2 py-0.5">
              #{t}
            </span>
          ))}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <form action={setStatus} className="flex items-end gap-2">
            <select
              name="status"
              defaultValue={ticket.status}
              className="h-9 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-2 text-sm"
            >
              {["OPEN", "WAITING", "RESOLVED", "CLOSED"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <Button type="submit" size="sm" variant="secondary">
              Status
            </Button>
          </form>
          <form action={assign} className="flex items-end gap-2">
            <select
              name="assigneeId"
              defaultValue={ticket.assigneeId ?? ""}
              className="h-9 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-2 text-sm"
            >
              <option value="">— unassigned —</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
            <Button type="submit" size="sm" variant="secondary">
              Assign
            </Button>
          </form>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {ticket.comments.map((c) => (
          <div
            key={c.id}
            className={`rounded-[var(--radius-md)] border p-4 text-sm ${c.isInternal ? "border-[var(--color-amber-500)] bg-[var(--color-amber-50)]" : "border-[var(--border-default)] bg-[var(--bg-raised)]"}`}
          >
            <p className="text-2xs mb-1 tracking-[0.12em] text-[var(--ink-muted)] uppercase">
              {c.isInternal ? "Internal note" : "Reply"} · {c.authorKind}
            </p>
            <p className="whitespace-pre-wrap">{c.body}</p>
          </div>
        ))}
      </div>

      <form
        action={addReply}
        className="mt-6 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-4"
      >
        <textarea
          name="body"
          rows={3}
          placeholder="Reply to the client…"
          className="w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 py-2 text-sm font-normal"
        />
        <div className="mt-2">
          <Button type="submit" size="sm">
            Post reply
          </Button>
        </div>
      </form>

      <form
        action={addInternalNote}
        className="mt-3 rounded-[var(--radius-lg)] border border-[var(--color-amber-300)] bg-[var(--color-amber-50)] p-4"
      >
        <textarea
          name="body"
          rows={2}
          placeholder="Internal note (client never sees this)…"
          className="w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 py-2 text-sm font-normal"
        />
        <div className="mt-2">
          <Button type="submit" size="sm" variant="secondary">
            Add internal note
          </Button>
        </div>
      </form>
    </div>
  );
}
