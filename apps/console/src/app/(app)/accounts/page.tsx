import { prisma } from "@apex/db";
import { SectionHeading } from "@apex/ui";
import Link from "next/link";
import { requirePermission } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AccountsPage() {
  await requirePermission("portal:read");
  const accounts = await prisma.portalAccount.findMany({
    orderBy: [{ name: "asc" }],
    include: {
      _count: { select: { users: true, documents: true, invitations: true } },
      lead: { select: { id: true, name: true, email: true } },
    },
  });

  return (
    <div className="flex flex-col gap-8">
      <SectionHeading
        eyebrow="Client portal"
        title="Accounts"
        lede="Portal accounts, their documents and invitations."
      />

      <div className="grid gap-3">
        {accounts.length === 0 ? (
          <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] bg-[var(--bg-raised)] p-8 text-center text-sm text-[var(--ink-secondary)]">
            No portal accounts yet. Convert a lead to a customer to create one.
          </div>
        ) : (
          accounts.map((a) => (
            <Link
              key={a.id}
              href={`/accounts/${a.id}`}
              className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-4 transition-colors hover:border-[var(--color-amber-500)]"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium">{a.name}</p>
                <span className="text-2xs tracking-[0.12em] text-[var(--ink-muted)] uppercase">
                  {a.status}
                </span>
              </div>
              <p className="text-2xs mt-1 text-[var(--ink-muted)]">
                {a._count.users} user(s) · {a._count.documents} doc(s) · {a._count.invitations}{" "}
                invitation(s)
                {a.lead ? ` · from lead ${a.lead.name}` : ""}
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
