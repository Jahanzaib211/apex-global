import { prisma, type Prisma } from "@apex/db";

/**
 * Approve a self-serve signup's holding account into the CRM pipeline.
 *
 * A signup creates a holding `PortalAccount` (slug `self-…`, name ending
 * " (pending)") with no `leadId`. Until something links it, the customer is
 * invisible to the console Leads pipeline. This helper is the single place
 * that promotion happens — from the email-verification auto-approve path and
 * from the console's manual "Approve" action:
 *
 *   - an existing Lead with the user's email is adopted (oldest first),
 *   - otherwise a `SIGNUP` lead is created,
 *   - the account is linked to the lead and its "(pending)" name is dropped,
 *   - the promotion is written to the portal audit log.
 *
 * Idempotent: an account that already has a lead is returned untouched.
 */

export interface ApproveSignupResult {
  accountId: string;
  leadId: string;
  created: boolean;
  alreadyApproved: boolean;
}

export async function approveSignupAccount(
  accountId: string,
  opts: {
    /** The console operator approving manually. Auto-approve passes null. */
    actor?: { id: string; name: string } | null;
    /** Must start with "self-" — holding accounts created by the signup route. */
    requiresSelfSignup?: boolean;
    tx?: Prisma.TransactionClient;
  } = {},
): Promise<ApproveSignupResult> {
  const db = opts.tx ?? prisma;

  const account = await db.portalAccount.findUnique({
    where: { id: accountId },
    include: { users: { select: { id: true, name: true, email: true } } },
  });
  if (!account) throw new Error(`PortalAccount ${accountId} not found`);

  if (opts.requiresSelfSignup && !account.slug.startsWith("self-")) {
    throw new Error(`PortalAccount ${accountId} is not a self-serve signup`);
  }
  if (account.leadId) {
    return {
      accountId: account.id,
      leadId: account.leadId,
      created: false,
      alreadyApproved: true,
    };
  }

  const user = account.users[0];
  if (!user) throw new Error(`PortalAccount ${accountId} has no user to approve`);

  // Adopt the lead that already owns this address — the customer's commercial
  // history must not be split across two rows.
  const existing = await db.lead.findFirst({
    where: { email: { equals: user.email, mode: "insensitive" } },
    select: { id: true },
    orderBy: { createdAt: "asc" },
  });

  const lead = existing
    ? existing
    : await db.lead.create({
        data: {
          name: user.name,
          email: user.email,
          sourceType: "SIGNUP",
          sourceSite: "portal",
          message: "Self-serve signup approved for the client portal.",
        },
        select: { id: true },
      });

  await db.portalAccount.update({
    where: { id: account.id },
    data: {
      leadId: lead.id,
      // Drop the signup placeholder before the account name is used as the
      // organisation label in the portal and in the console.
      ...(account.name.endsWith(" (pending)")
        ? { name: account.name.slice(0, -" (pending)".length) }
        : {}),
    },
  });

  await db.leadActivity.create({
    data: {
      leadId: lead.id,
      actorId: opts.actor?.id ?? null,
      type: "note",
      summary: opts.actor
        ? `Signup approved by ${opts.actor.name}`
        : "Signup approved automatically after email verification",
      detail: `PortalAccount ${account.id} · ${account.slug}`,
    },
  });

  await db.portalAuditLog.create({
    data: {
      portalAccountId: account.id,
      portalUserId: user.id,
      action: "account.approved",
      entityType: "Lead",
      entityId: lead.id,
      summary: opts.actor
        ? `Self-serve signup approved by ${opts.actor.name}`
        : "Self-serve signup approved automatically after email verification",
      changes: {
        leadId: lead.id,
        sourceType: "SIGNUP",
      } satisfies Prisma.InputJsonValue,
    },
  });

  return {
    accountId: account.id,
    leadId: lead.id,
    created: !existing,
    alreadyApproved: false,
  };
}