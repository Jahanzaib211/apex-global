import { prisma } from "@apex/db";
import { SectionHeading } from "@apex/ui";
import Link from "next/link";
import { requirePermission } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function SupportInboxPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requirePermission("support:read");
  const { status } = await searchParams;
  const where = status && status !== "ALL" ? { status: status as never } : {};

  const tickets = await prisma.ticket.findMany({
    where,
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: { _count: { select: { comments: true } } },
  });

  return (
    <div className="flex flex-col gap-8">
      <SectionHeading
        eyebrow="Support"
        title="Ticket inbox"
        lede="Every ticket opened by clients and the team."
      />

      <div className="flex flex-wrap gap-2">
        {["ALL", "OPEN", "WAITING", "RESOLVED", "CLOSED"].map((s) => (
          <Link
            key={s}
            href={s === "ALL" ? "/support/inbox" : `/support/inbox?status=${s}`}
            className={`text-2xs rounded-full px-3 py-1 font-medium tracking-[0.12em] uppercase ${
              (status ?? "ALL") === s
                ? "bg-[var(--accent)] text-[var(--ink-on-accent)]"
                : "bg-[var(--bg-sunken)] text-[var(--ink-secondary)]"
            }`}
          >
            {s.toLowerCase()}
          </Link>
        ))}
      </div>

      <div className="grid gap-3">
        {tickets.length === 0 ? (
          <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] bg-[var(--bg-raised)] p-8 text-center text-sm text-[var(--ink-secondary)]">
            No tickets in this view.
          </div>
        ) : (
          tickets.map((t) => (
            <Link
              key={t.id}
              href={`/support/inbox/${t.id}`}
              className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-4 transition-colors hover:border-[var(--color-amber-500)]"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium">{t.number}</p>
                <span className="text-2xs tracking-[0.12em] text-[var(--ink-muted)] uppercase">
                  {t.status}
                </span>
              </div>
              <p className="mt-1 text-sm">{t.title}</p>
              <p className="text-2xs mt-1 text-[var(--ink-muted)]">
                {t._count.comments} comment(s) · {t.priority}
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
