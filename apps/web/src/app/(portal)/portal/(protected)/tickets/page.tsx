import { prisma } from "@apex/db";
import { SectionHeading } from "@apex/ui";
import Link from "next/link";
import { requirePortalUserAccount } from "@/lib/portal/auth";

export const dynamic = "force-dynamic";

export default async function PortalTicketsPage() {
  const { user } = await requirePortalUserAccount();

  const tickets = await prisma.ticket.findMany({
    where: { portalAccountId: user.portalAccountId },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="flex flex-col gap-8">
      <SectionHeading
        eyebrow="Tickets"
        title="Your support tickets"
        lede="Conversations with the Apex team about your account."
      />

      <div>
        <Link
          href="/portal/tickets/new"
          className="inline-flex h-11 items-center rounded-[var(--radius-md)] bg-[var(--accent)] px-5 text-sm font-medium text-[var(--ink-on-accent)]"
        >
          Open a new ticket
        </Link>
      </div>

      {tickets.length === 0 ? (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] bg-[var(--bg-raised)] p-8 text-center">
          <h2 className="text-lg font-semibold">No tickets yet</h2>
          <p className="mt-2 text-sm text-[var(--ink-secondary)]">
            Tickets open here when you report an issue or request a change.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {tickets.map((t) => (
            <Link
              key={t.id}
              href={`/portal/tickets/${t.id}`}
              className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-5 transition-colors hover:border-[var(--color-amber-500)] md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-2xs font-semibold tracking-[0.16em] text-[var(--ink-muted)] uppercase">
                  {t.status} · {t.priority}
                </p>
                <p className="mt-1 text-lg font-semibold">{t.title}</p>
                <p className="text-sm text-[var(--ink-secondary)]">
                  Opened {t.createdAt.toLocaleDateString("en-GB")}
                </p>
              </div>
              <p className="text-2xs text-[var(--ink-muted)]">#{t.id.slice(-6)}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
