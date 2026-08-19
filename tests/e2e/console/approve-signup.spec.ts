import { expect, test } from "@playwright/test";
import bcrypt from "bcryptjs";
import { prisma } from "@apex/db";
import { randomBytes } from "node:crypto";

/**
 * Self-serve signup approval in the console.
 *
 * A signup lands as a holding account (slug `self-…`, name "(pending)") with
 * no lead. Until it is approved — automatically by the customer clicking the
 * verification link, or manually from the console — it is invisible to the
 * Leads pipeline. This spec locks in the manual path end to end: create a
 * holding account in the DB, approve it from `/accounts`, and assert the
 * SIGNUP lead exists, the account is renamed, and the approve button is gone.
 */

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@apexglobal.local";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";
const BCRYPT_COST = 12;

interface HoldingFixture {
  accountId: string;
  email: string;
}

async function createHoldingFixture(): Promise<HoldingFixture> {
  const suffix = randomBytes(3).toString("hex");
  const email = `e2e-approve-${suffix}@apex.example.com`;
  const accountId = await prisma.$transaction(async (tx) => {
    const account = await tx.portalAccount.create({
      data: {
        slug: `self-e2e-${suffix}`,
        name: `E2E Approve ${suffix} (pending)`,
        status: "ACTIVE",
      },
    });
    await tx.portalUser.create({
      data: {
        email,
        name: `E2E Approve ${suffix}`,
        passwordHash: await bcrypt.hash("Correct-Horse-Battery-Staple-1", BCRYPT_COST),
        portalAccountId: account.id,
        role: "MEMBER",
      },
    });
    return account.id;
  });
  return { accountId, email };
}

async function destroyHoldingFixture(fixture: HoldingFixture): Promise<void> {
  await prisma.portalSession.deleteMany({ where: { user: { email: fixture.email } } });
  await prisma.portalAuditLog.deleteMany({ where: { portalAccountId: fixture.accountId } });
  await prisma.portalInvitation.deleteMany({ where: { portalAccountId: fixture.accountId } });
  await prisma.portalUser.deleteMany({ where: { email: fixture.email } });
  await prisma.portalAccount.deleteMany({ where: { id: fixture.accountId } });
  // The lead + its activity were created by the approve action; remove both.
  await prisma.leadActivity.deleteMany({
    where: { lead: { email: { equals: fixture.email, mode: "insensitive" } } },
  });
  await prisma.lead.deleteMany({ where: { email: { equals: fixture.email, mode: "insensitive" } } });
}

test.describe("console account approval", () => {
  test.skip(!ADMIN_PASSWORD, "ADMIN_PASSWORD not set");

  test("approves a self-serve signup from the accounts page", async ({ page }) => {
    test.setTimeout(60_000);
    const fixture = await createHoldingFixture();

    try {
      await page.goto("/login");
      await page.getByLabel("Email").fill(ADMIN_EMAIL);
      await page.getByLabel("Password").fill(ADMIN_PASSWORD);
      await page.getByRole("button", { name: "Sign in" }).click();
      await expect(page).toHaveURL(/\/$/, { timeout: 15_000 });

      await page.goto("/accounts");
      const row = page
        .locator(`a[href="/accounts/${fixture.accountId}"]`)
        .locator("xpath=..");
      await expect(row.getByText("Awaiting approval")).toBeVisible({ timeout: 15_000 });
      await expect(row.getByText("Email unverified")).toBeVisible();

      await row.getByRole("button", { name: "Approve" }).click();
      await expect(page).toHaveURL(/approved=1/, { timeout: 15_000 });
      await expect(page.getByText(/now appears in Leads/)).toBeVisible();

      // The account no longer shows an approve button and the lead exists.
      const reloaded = await prisma.portalAccount.findUnique({
        where: { id: fixture.accountId },
        include: { lead: true },
      });
      expect(reloaded?.lead).not.toBeNull();
      expect(reloaded?.lead?.sourceType).toBe("SIGNUP");
      expect(reloaded?.lead?.sourceSite).toBe("portal");
      expect(reloaded?.lead?.stage).toBe("NEW");
      expect(reloaded?.name).not.toContain("(pending)");

      // The lead is visible in the Leads pipeline.
      await page.goto("/leads");
      await expect(page.getByText(fixture.email)).toBeVisible({ timeout: 15_000 });
    } finally {
      await destroyHoldingFixture(fixture);
    }
  });
});