/* eslint-disable no-console */
import { randomBytes, createHash } from "node:crypto";
import { PrismaClient } from "../generated/client/index.js";

/**
 * Issue a client-portal invitation.
 *
 * The invitation flow had no origin: nothing in the console, the seed or any
 * script created a `PortalInvitation`, so the accept page could never be
 * reached with a real token. This is that origin.
 *
 * Run:  pnpm --filter @apex/db invite -- <email> [account-slug] [role]
 *
 * Roles are OWNER | ADMIN | MEMBER (the `PortalRole` enum in portal.prisma).
 * Prints the accept URL; the raw token is shown once and never stored — only
 * its SHA-256 hash goes to the database, which is what the accept page looks up.
 */

const prisma = new PrismaClient();

const TTL_DAYS = Number(process.env.INVITATION_TTL_DAYS ?? 7);
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://tech.apexgroupcompanies.com"
).replace(/\/$/, "");

async function main() {
  const [email, accountSlug, roleArg] = process.argv.slice(2);

  if (!email || !email.includes("@")) {
    throw new Error("Usage: pnpm --filter @apex/db invite -- <email> [account-slug] [role]");
  }

  const role = (roleArg ?? "MEMBER").toUpperCase();
  if (!["OWNER", "ADMIN", "MEMBER"].includes(role)) {
    throw new Error(`Unknown role "${role}". Use OWNER, ADMIN or MEMBER.`);
  }

  const account = accountSlug
    ? await prisma.portalAccount.findUnique({ where: { slug: accountSlug } })
    : await prisma.portalAccount.findFirst({ orderBy: { createdAt: "asc" } });

  if (!account) {
    throw new Error(
      accountSlug
        ? `No portal account with slug "${accountSlug}".`
        : "No portal account exists yet. Run `pnpm --filter @apex/db provision:master` first.",
    );
  }

  // Raw token to the operator, hash to the database. An invitation the database
  // could replay is a password reset for anyone who reads a backup.
  const token = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + TTL_DAYS * 24 * 60 * 60 * 1000);

  await prisma.portalInvitation.create({
    data: {
      email: email.toLowerCase(),
      tokenHash,
      expiresAt,
      role: role as "OWNER" | "ADMIN" | "MEMBER",
      portalAccountId: account.id,
    },
  });

  console.log(`\nInvited ${email} to ${account.name} as ${role}.`);
  console.log(`Expires ${expiresAt.toISOString()} (${TTL_DAYS} days).\n`);
  console.log(`${SITE_URL}/portal/accept-invitation/${token}\n`);
  console.log("The token is not recoverable — reissue if this link is lost.\n");
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
