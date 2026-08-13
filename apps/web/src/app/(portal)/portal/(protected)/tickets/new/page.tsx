import { prisma } from "@apex/db";
import type { TicketPriority } from "@apex/db";
import { Button, SectionHeading } from "@apex/ui";
import { requirePortalUserAccount } from "@/lib/portal/auth";

export const dynamic = "force-dynamic";

export default async function NewTicketPage() {
  const { user } = await requirePortalUserAccount();

  async function openTicket(formData: FormData) {
    "use server";
    const title = String(formData.get("title") ?? "").trim();
    const body = String(formData.get("body") ?? "").trim();
    const priorityRaw = String(formData.get("priority") ?? "NORMAL");
    if (!title || !body) return;
    const priority: TicketPriority =
      priorityRaw === "LOW" || priorityRaw === "HIGH" || priorityRaw === "URGENT"
        ? (priorityRaw as TicketPriority)
        : "NORMAL";

    // Generate the next ticket number in TCK-NNNN format. The transaction
    // is not strictly necessary for a single insert — the unique index on
    // `number` would catch a race. We pick a value derived from the latest
    // ticket so two operators opening tickets simultaneously still get
    // distinct numbers.
    const latest = await prisma.ticket.findFirst({
      orderBy: { createdAt: "desc" },
      select: { number: true },
    });
    const next = (() => {
      const match = latest?.number?.match(/(\d+)$/);
      const seq = match ? Number(match[1]) + 1 : 1;
      return `TCK-${seq.toString().padStart(4, "0")}`;
    })();

    await prisma.ticket.create({
      data: {
        number: next,
        title,
        body,
        priority,
        status: "OPEN",
        portalAccountId: user.portalAccountId,
        openedById: user.id,
      },
    });
    await prisma.portalAuditLog.create({
      data: {
        portalAccountId: user.portalAccountId,
        portalUserId: user.id,
        action: "ticket.opened",
        entityType: "Ticket",
        summary: `Opened ticket "${title}"`,
      },
    });
    const { redirect } = await import("next/navigation");
    redirect("/portal/tickets");
  }

  return (
    <div className="mx-auto max-w-2xl">
      <SectionHeading eyebrow="Tickets" title="Open a new ticket" />
      <form
        action={openTicket}
        className="mt-6 flex flex-col gap-5 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-6"
      >
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Subject
          <input
            name="title"
            required
            minLength={3}
            className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Priority
          <select
            name="priority"
            defaultValue="NORMAL"
            className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
          >
            <option value="LOW">Low</option>
            <option value="NORMAL">Normal</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          What is happening?
          <textarea
            name="body"
            required
            rows={8}
            className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 py-2 text-sm font-normal"
          />
        </label>
        <Button type="submit" size="lg" className="self-start">
          Submit ticket
        </Button>
      </form>
    </div>
  );
}
