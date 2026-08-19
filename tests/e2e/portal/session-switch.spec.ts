import { test, expect, type Page } from "@playwright/test";
import bcrypt from "bcryptjs";
import { prisma } from "@apex/db";
import { randomBytes } from "node:crypto";

/**
 * Regression: signing in as a second user must refresh the (protected) layout
 * header. The previous password-login path used `router.push(...)` after a
 * successful POST, which Next.js intercepted as a soft navigation. If the
 * destination URL had been visited earlier in the same client session, the
 * App Router served the cached `(protected)/layout.tsx` payload — including
 * the previous user's name — for one frame and often longer.
 *
 * The fix replaces the soft push with a hard `window.location.assign(...)`,
 * so the new session cookie is read by a fresh server render. This test
 * exercises that path: sign in as user A, sign out, sign in as user B, and
 * assert the header name and account page email belong to user B.
 */

// bcryptjs is a direct dependency of @apex/auth. The test imports it from the
// root node_modules rather than from `@apex/auth` because the root package does
// not declare `@apex/auth` as a dev dependency (the suite is meant to be
// black-box over HTTP, with the database the only exception).
const BCRYPT_COST = 12;

interface UserFixture {
  email: string;
  name: string;
  password: string;
  portalAccountId: string;
}

async function createUserFixture(label: string): Promise<UserFixture> {
  const suffix = randomBytes(3).toString("hex");
  const password = "Correct-Horse-Battery-Staple-1";
  const passwordHash = await bcrypt.hash(password, BCRYPT_COST);
  const email = `e2e-session-switch-${label}-${suffix}@apex.example.com`;
  const name = `E2E Session Switch ${label.toUpperCase()}`;
  const slug = `self-e2e-${label}-${suffix}-${randomBytes(3).toString("hex")}`;

  const portalAccountId = await prisma.$transaction(async (tx) => {
    const account = await tx.portalAccount.create({
      data: { slug, name: `${name} (pending)`, status: "ACTIVE" },
    });
    await tx.portalUser.create({
      data: {
        email,
        name,
        passwordHash,
        portalAccountId: account.id,
        role: "MEMBER",
        emailVerifiedAt: new Date(),
        isActive: true,
      },
    });
    return account.id;
  });

  return { email, name, password, portalAccountId };
}

async function destroyUserFixture(user: UserFixture): Promise<void> {
  await prisma.portalSession.deleteMany({
    where: { user: { email: user.email } },
  });
  await prisma.portalAuditLog.deleteMany({
    where: { portalUser: { email: user.email } },
  });
  await prisma.portalPasswordReset.deleteMany({
    where: { user: { email: user.email } },
  });
  await prisma.portalMagicLink.deleteMany({
    where: { user: { email: user.email } },
  });
  await prisma.portalUser.deleteMany({ where: { email: user.email } });
  await prisma.portalAccount.deleteMany({ where: { id: user.portalAccountId } });
}

async function signIn(page: Page, email: string, password: string) {
  await page.goto("/portal/login");
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(password);
  await Promise.all([
    page.waitForURL((url) => {
      const path = url.pathname;
      return path === "/portal" || path === "/portal/" || path.startsWith("/portal?");
    }, { timeout: 15_000 }),
    page.getByRole("button", { name: "Sign in" }).click(),
  ]);
  await page.locator("header").first().waitFor({ state: "visible", timeout: 15_000 });
}

async function signOut(page: Page) {
  await Promise.all([
    page.waitForURL((url) => url.pathname === "/portal/login", { timeout: 15_000 }),
    page.getByRole("button", { name: "Sign out" }).click(),
  ]);
}

test.describe("Client portal session refresh", () => {
  test("header shows the new user after a second sign-in in the same session", async ({ page }) => {
    const userA = await createUserFixture("a");
    const userB = await createUserFixture("b");

    try {
      await signIn(page, userA.email, userA.password);
      const header = page.locator("header").first();
      await expect(header.getByText(userA.name, { exact: true })).toBeVisible({ timeout: 15_000 });

      await signOut(page);
      await signIn(page, userB.email, userB.password);

      await expect(header.getByText(userB.name, { exact: true })).toBeVisible({ timeout: 15_000 });
      await expect(header.getByText(userA.name, { exact: true })).toHaveCount(0);
    } finally {
      await destroyUserFixture(userA);
      await destroyUserFixture(userB);
    }
  });

  test("account page shows the new user's email after a second sign-in", async ({ page }) => {
    const userA = await createUserFixture("a");
    const userB = await createUserFixture("b");

    try {
      await signIn(page, userA.email, userA.password);
      await signOut(page);
      await signIn(page, userB.email, userB.password);

      await page.goto("/portal/account");
      await expect(page.getByText(userB.email, { exact: true })).toBeVisible({ timeout: 15_000 });
      await expect(page.getByText(userA.email, { exact: true })).toHaveCount(0);
    } finally {
      await destroyUserFixture(userA);
      await destroyUserFixture(userB);
    }
  });
});
