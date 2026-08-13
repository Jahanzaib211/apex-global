/* eslint-disable no-console */
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import { PrismaClient } from "../generated/client/index.js";

/**
 * One-time provisioning of the master operator account.
 *
 * Creates (or upgrades) `alilabsx@gmail.com` on BOTH identity planes so the
 * single credential from MASTER-CREDENTIALS.md works everywhere:
 *
 *   1. core.User  → console admin (dev/ops + all the leads land here)
 *   2. PortalUser → client portal OWNER (projects, invoices, tickets)
 *
 * Run:  pnpm --filter @apex/db provision:master
 *
 * Password comes from MASTER_ADMIN_PASSWORD (default: Jatt@1234567) — the
 * 12-char version, because the portal enforces MIN_LENGTH 12 + 3 of 4 char
 * classes (see packages/auth/src/passwords.ts).
 */

const EMAIL = (process.env.MASTER_ADMIN_EMAIL ?? "alilabsx@gmail.com").toLowerCase();
const PASSWORD = process.env.MASTER_ADMIN_PASSWORD ?? "Jatt@1234567";
const ACCOUNT_NAME = process.env.MASTER_ACCOUNT_NAME ?? "Apex Global";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash(PASSWORD, 12);

  // ---- 1. Console admin (core.User) ----
  const adminRole = await prisma.role.findUnique({ where: { key: "admin" } });
  if (!adminRole) throw new Error("Run `pnpm db:seed` first — the admin role does not exist yet.");

  let user = await prisma.user.findUnique({ where: { email: EMAIL } });
  if (user) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, isActive: true, lockedUntil: null, failedLogins: 0 },
    });
    console.log(`Console admin updated: ${EMAIL}`);
  } else {
    user = await prisma.user.create({
      data: {
        email: EMAIL,
        name: process.env.MASTER_ADMIN_NAME ?? "ALI Labs",
        passwordHash,
        isActive: true,
        roles: { create: { roleId: adminRole.id } },
      },
    });
    console.log(`Console admin created: ${EMAIL}`);
  }

  // Ensure the admin role is attached even if the user pre-existed.
  const existingRole = await prisma.userRole.findUnique({
    where: { userId_roleId: { userId: user.id, roleId: adminRole.id } },
  });
  if (!existingRole) {
    await prisma.userRole.create({ data: { userId: user.id, roleId: adminRole.id } });
    console.log("  + attached `admin` role");
  }

  // ---- 2. Portal / client (PortalUser OWNER) ----
  const account =
    (await prisma.portalAccount.findFirst({
      where: { users: { some: { email: EMAIL } } },
    })) ??
    (await prisma.portalAccount.findFirst({ where: { name: ACCOUNT_NAME } })) ??
    (await prisma.portalAccount.create({
      data: {
        name: ACCOUNT_NAME,
        slug: `apex-${randomBytes(3).toString("hex")}`,
      },
    }));

  let portalUser = await prisma.portalUser.findUnique({ where: { email: EMAIL } });
  if (portalUser) {
    portalUser = await prisma.portalUser.update({
      where: { id: portalUser.id },
      data: {
        passwordHash,
        emailVerifiedAt: new Date(),
        isActive: true,
        lockedUntil: null,
        failedLogins: 0,
        role: "OWNER",
        portalAccountId: account.id,
      },
    });
    console.log(`Portal OWNER updated: ${EMAIL} on account ${account.name} (${account.slug})`);
  } else {
    portalUser = await prisma.portalUser.create({
      data: {
        email: EMAIL,
        name: process.env.MASTER_ADMIN_NAME ?? "Administrator",
        passwordHash,
        emailVerifiedAt: new Date(),
        isActive: true,
        role: "OWNER",
        portalAccountId: account.id,
      },
    });
    console.log(`Portal OWNER created: ${EMAIL} on account ${account.name} (${account.slug})`);
  }

  console.log("\n  Master admin is provisioned everywhere.\n");
  console.log(`    Email:    ${EMAIL}`);
  console.log(`    Password: (from MASTER_ADMIN_PASSWORD, default 12-char)`);
  console.log(`    Console : ${process.env.CONSOLE_URL ?? "http://localhost:4301"}`);
  console.log(
    `    Portal  : ${process.env.NEXT_PUBLIC_SITE_URL ?? "https://tech.apexgroupcompanies.com"}/portal\n`,
  );

  await prisma.$disconnect();
}

main().catch(async (error: unknown) => {
  await prisma.$disconnect();
  console.error(error);
  process.exitCode = 1;
});
