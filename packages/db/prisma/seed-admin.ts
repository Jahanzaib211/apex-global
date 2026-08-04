/* eslint-disable no-console */
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../generated/client/index.js";

/**
 * Creates the first console administrator.
 *
 * Separate from the content seed on purpose: content is re-seeded routinely,
 * and a routine re-seed must never reset a real operator's password.
 *
 * The password is generated, printed once, and stored only as a bcrypt hash —
 * a default like "admin123" committed to a repository is how consoles get
 * taken over. Set ADMIN_PASSWORD to choose your own.
 */
const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? "admin@apexglobal.local").toLowerCase();
  const name = process.env.ADMIN_NAME ?? "Administrator";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin already exists: ${email} — leaving the existing password alone.`);
    return;
  }

  const generated = !process.env.ADMIN_PASSWORD;
  const password = process.env.ADMIN_PASSWORD ?? randomBytes(12).toString("base64url");

  const adminRole = await prisma.role.findUnique({ where: { key: "admin" } });
  if (!adminRole) {
    throw new Error("Run `pnpm db:seed` first — the admin role does not exist yet.");
  }

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash: await bcrypt.hash(password, 12),
      roles: { create: { roleId: adminRole.id } },
    },
  });

  console.log("\n  Console administrator created.\n");
  console.log(`    Email:    ${email}`);
  if (generated) {
    console.log(`    Password: ${password}`);
    console.log("\n  This password is shown once and is not recoverable — store it now.");
  } else {
    console.log("    Password: (from ADMIN_PASSWORD)");
  }
  console.log(`\n  Sign in at ${process.env.CONSOLE_URL ?? "http://localhost:4301"}\n`);

  await prisma.auditLog.create({
    data: {
      actorId: user.id,
      action: "user.created",
      entityType: "User",
      entityId: user.id,
      summary: `Initial administrator ${email} created by the seed script`,
    },
  });
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
