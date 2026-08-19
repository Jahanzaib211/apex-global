import { prisma } from "@apex/db";
import { SectionHeading, Button } from "@apex/ui";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/auth";
import { audit } from "@/lib/audit";
import { approveSignupAccount } from "@apex/auth";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ approved?: string; error?: string }> };

/**
 * Accounts — every portal account, with the self-serve signups surfaced for
 * approval.
 *
 * A signup lands as a holding account (slug `self-…`, name "(pending)") and
 * is invisible to the Leads pipeline until approved. The operator approves
 * from this list (one click, creates the SIGNUP lead and links the account)
 * or the user's email verification auto-approves it for them.
 */
export default async function AccountsPage({ searchParams }: Props) {
  const { approved, error } = await searchParams;
  await requirePermission("portal:read");
  const accounts = await prisma.portalAccount.findMany({
    orderBy: [{ createdAt: "desc" }],
    include: {
      _count: { select: { users: true, documents: true, invitations: true } },
      lead: { select: { id: true, name: true, email: true } },
      users: { select: { id: true, name: true, email: true, emailVerifiedAt: true } },
    },
  });

  async function approveAccount(formData: FormData) {
    "use server";
    const actor = await requirePermission("portal:admin");
    const accountId = String(formData.get("accountId") ?? "");
    if (!accountId) redirect("/accounts");

    let created = false;
    try {
      const result = await approveSignupAccount(accountId, {
        actor,
        requiresSelfSignup: true,
      });
      created = result.created;
      await audit({
        actor,
        action: "portal.account_approved",
        entityType: "PortalAccount",
        entityId: accountId,
        summary: `Approved self-serve signup → ${created ? "created" : "linked"} lead ${result.leadId}`,
      });
    } catch (err) {
      console.error("[accounts] approval failed", err);
      redirect("/accounts?error=approve-failed");
    }
    redirect(`/accounts?approved=1`);
  }

  return (
    <div className="flex flex-col gap-8">
      <SectionHeading
        eyebrow="Client portal"
        title="Accounts"
        lede="Portal accounts, their documents and invitations. Self-serve signups wait here for approval before they enter the Leads pipeline."
      />

      {approved ? (
        <div className="rounded-[var(--radius-md)] border border-[var(--color-success-500)] bg-[var(--color-success-100)] px-4 py-3 text-sm text-[var(--color-success-700)]">
          Signup approved — the account now appears in Leads.
        </div>
      ) : null}
      {error === "approve-failed" ? (
        <div className="rounded-[var(--radius-md)] border border-[var(--color-danger-500)] bg-[var(--color-danger-100)] px-4 py-3 text-sm text-[var(--color-danger-700)]">
          Could not approve that signup — it may already be linked to a lead.
        </div>
      ) : null}

      <div className="grid gap-3">
        {accounts.length === 0 ? (
          <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] bg-[var(--bg-raised)] p-8 text-center text-sm text-[var(--ink-secondary)]">
            No portal accounts yet. Convert a lead to a customer to create one.
          </div>
        ) : (
          accounts.map((a) => {
            const isSignup = a.slug.startsWith("self-");
            const needsApproval = isSignup && !a.leadId;
            const verified = a.users.some((u) => u.emailVerifiedAt);
            return (
              <div
                key={a.id}
                className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-4 transition-colors hover:border-[var(--color-amber-500)] sm:flex-row sm:items-center sm:justify-between"
              >
                <Link href={`/accounts/${a.id}`} className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{a.name}</p>
                    <span className="text-2xs tracking-[0.12em] text-[var(--ink-muted)] uppercase">
                      {a.status}
                    </span>
                  </div>
                  <p className="text-2xs mt-1 text-[var(--ink-muted)]">
                    {a._count.users} user(s) · {a._count.documents} doc(s) ·{" "}
                    {a._count.invitations} invitation(s)
                    {a.lead ? ` · from lead ${a.lead.name}` : ""}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {isSignup ? (
                      <span
                        className={`text-2xs rounded-full px-2 py-0.5 font-medium ${
                          needsApproval
                            ? "bg-[var(--color-amber-100)] text-[var(--color-amber-700)]"
                            : "bg-[var(--color-success-100)] text-[var(--color-success-700)]"
                        }`}
                      >
                        {needsApproval ? "Awaiting approval" : "Signup approved"}
                      </span>
                    ) : null}
                    <span
                      className={`text-2xs rounded-full px-2 py-0.5 font-medium ${
                        verified
                          ? "bg-[var(--color-success-100)] text-[var(--color-success-700)]"
                          : "bg-[var(--bg-sunken)] text-[var(--ink-muted)]"
                      }`}
                    >
                      {verified ? "Email verified" : "Email unverified"}
                    </span>
                  </div>
                </Link>
                {needsApproval ? (
                  <form action={approveAccount}>
                    <input type="hidden" name="accountId" value={a.id} />
                    <Button type="submit" size="sm">
                      Approve
                    </Button>
                  </form>
                ) : null}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}