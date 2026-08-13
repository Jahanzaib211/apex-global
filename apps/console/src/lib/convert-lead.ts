import "server-only";
import { randomBytes, createHash } from "node:crypto";
import { prisma } from "@apex/db";
import { sendInvitation } from "@apex/auth";

/**
 * Convert a CRM Lead into a client PortalAccount (and invite its contact).
 *
 * Idempotent:
 *  - if the lead already has a linked account, it is returned unchanged;
 *  - otherwise, a self-serve holding account whose slug matches the lead email
 *    is adopted (set `leadId`) instead of creating a duplicate;
 *  - otherwise a fresh account is created and the lead's contact is invited as
 *    OWNER. The lead's `convertedAt` is stamped and a `LeadActivity` + audit row
 *    record the conversion.
 *
 * The portal invoice visibility query joins `invoice.lead.portalAccounts`, so
 * linking `PortalAccount.leadId` here is what makes a console-issued invoice
 * surface in the customer's portal.
 */
export interface ConvertResult {
  portalAccountId: string;
  created: boolean;
  invited: boolean;
}

export async function convertLeadToCustomer(
  leadId: string,
  actor: { id: string; name: string },
): Promise<ConvertResult> {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: { portalAccounts: true },
  });
  if (!lead) throw new Error(`Lead ${leadId} not found`);

  // Already converted — return the existing account, no-op.
  if (lead.portalAccounts && lead.portalAccounts.length > 0) {
    return { portalAccountId: lead.portalAccounts[0]!.id, created: false, invited: false };
  }

  const existing = await prisma.portalAccount.findFirst({
    where: { slug: leadEmailSlug(lead.email) },
  });

  const account = existing
    ? await prisma.portalAccount.update({
        where: { id: existing.id },
        data: { leadId: lead.id },
      })
    : await prisma.portalAccount.create({
        data: {
          slug: await uniqueSlug(lead.companyName ?? lead.name),
          name: lead.companyName ?? lead.name,
          leadId: lead.id,
        },
      });

  // Stamp the lead as converted.
  await prisma.lead.update({
    where: { id: lead.id },
    data: { convertedAt: new Date() },
  });

  // Invite the lead contact as account OWNER (if not already invited).
  let invited = false;
  const alreadyInvited = await prisma.portalInvitation.findFirst({
    where: { email: lead.email.toLowerCase(), portalAccountId: account.id, acceptedAt: null },
  });
  if (!alreadyInvited) {
    const token = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.portalInvitation.create({
      data: {
        email: lead.email.toLowerCase(),
        tokenHash,
        expiresAt,
        role: "OWNER",
        portalAccountId: account.id,
      },
    });
    try {
      const url = `${siteUrl()}/portal/accept-invitation/${token}`;
      await sendInvitation({
        to: lead.email,
        inviterName: actor.name,
        organisation: account.name,
        url,
        ttlDays: 7,
      });
      invited = true;
    } catch (err) {
      // The account + lead link are the important part; a mail failure must not
      // roll that back. Log and continue.
      console.error("[convert] invitation email failed", err);
    }
  }

  await prisma.leadActivity.create({
    data: {
      leadId: lead.id,
      actorId: actor.id,
      type: "conversion",
      summary: `Converted to client account ${account.name}`,
      detail: `PortalAccount ${account.id}${invited ? " · invitation sent" : ""}`,
    },
  });

  return { portalAccountId: account.id, created: !existing, invited };
}

function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://tech.apexgroupcompanies.com").replace(
    /\/$/,
    "",
  );
}

function leadEmailSlug(email: string): string {
  const local = email.split("@")[0] ?? "lead";
  return `self-${local.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
}

async function uniqueSlug(base: string): Promise<string> {
  const root =
    base
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-+$/g, "")
      .slice(0, 40) || "client";
  // Up to 5 attempts at a collision-free slug; the unique constraint is the
  // final guard and the transaction retries on rare races.
  for (let i = 0; i < 5; i++) {
    const slug = i === 0 ? root : `${root}-${randomBytes(2).toString("hex")}`;
    const clash = await prisma.portalAccount.findUnique({ where: { slug } });
    if (!clash) return slug;
  }
  return `${root}-${randomBytes(4).toString("hex")}`;
}
