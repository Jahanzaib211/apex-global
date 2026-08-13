import { prisma } from "@apex/db";
import { SectionHeading } from "@apex/ui";
import { notFound } from "next/navigation";
import Link from "next/link";
import { requirePortalUserAccount } from "@/lib/portal/auth";

export const dynamic = "force-dynamic";

export default async function TicketThread({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user } = await requirePortalUserAccount();

  const ticket = await prisma.ticket.findFirst({
    where: { id, portalAccountId: user.portalAccountId },
  });
  if (!ticket) notFound();

  const ticketId = ticket.id;

  const comments = await prisma.ticketComment.findMany({
    where: { ticketId, isInternal: false },
    orderBy: { createdAt: "asc" },
  });

  async function reply(formData: FormData) {
    "use server";
    const body = String(formData.get("body") ?? "").trim();
    if (!body) return;
    const { redirect } = await import("next/navigation");
    await prisma.ticketComment.create({
      data: {
        ticketId,
        authorKind: "portal",
        authorId: user.id,
        body,
        isInternal: false,
      },
    });
    redirect(`/portal/tickets/${ticketId}`);
  }

  return (
    <div className="flex flex-col gap-6">
      <Link href="/portal/tickets" className="text-sm text-[var(--ink-secondary)] hover:underline">
        ← All tickets
      </Link>

      <SectionHeading
        eyebrow={`#${ticket.id.slice(-6)} · ${ticket.status} · ${ticket.priority}`}
        title={ticket.title}
        lede={`Opened ${ticket.createdAt.toLocaleString("en-GB")}`}
      />

      <article className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-5">
        <p className="text-2xs font-semibold tracking-[0.16em] text-[var(--ink-muted)] uppercase">
          {ticket.createdAt.toLocaleString("en-GB")}
        </p>
        <p className="mt-2 text-sm whitespace-pre-wrap">{ticket.body}</p>
      </article>

      <div className="flex flex-col gap-3">
        {comments.map((c) => (
          <article
            key={c.id}
            className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-5"
          >
            <p className="text-2xs font-semibold tracking-[0.16em] text-[var(--ink-muted)] uppercase">
              {c.authorKind} · {c.createdAt.toLocaleString("en-GB")}
            </p>
            <p className="mt-2 text-sm whitespace-pre-wrap">{c.body}</p>
          </article>
        ))}
      </div>

      <form
        action={reply}
        className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-5"
      >
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Reply
          <textarea
            name="body"
            required
            rows={5}
            className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 py-2 text-sm font-normal"
          />
        </label>
        <button
          type="submit"
          className="inline-flex h-11 items-center self-start rounded-[var(--radius-md)] bg-[var(--accent)] px-5 text-sm font-medium text-[var(--ink-on-accent)]"
        >
          Send reply
        </button>
      </form>
    </div>
  );
}
