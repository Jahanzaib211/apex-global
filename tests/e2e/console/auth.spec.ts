import { expect, test } from "@playwright/test";
import { prisma } from "@apex/db";

/**
 * Console authentication.
 *
 * The negative cases matter more than the happy path: an admin console that
 * lets the wrong person in is worse than one nobody can reach.
 */

const EMAIL = process.env.ADMIN_EMAIL ?? "admin@apexglobal.local";
const PASSWORD = process.env.ADMIN_PASSWORD ?? "";

test.describe("console auth", () => {
  // These tests deliberately submit wrong passwords, and the console locks an
  // account after enough of them. Retries and repeated local runs accumulate,
  // so the suite eventually locked the very account it was testing and the
  // wrong-password case started reporting "temporarily locked" instead of the
  // generic message. The lockout is correct; the test was carrying state
  // between runs. Clearing it here makes each run start from the same place.
  //
  // This is the only place the suite reaches past HTTP into the database.
  test.beforeEach(async () => {
    await prisma.user.updateMany({
      where: { email: EMAIL.toLowerCase() },
      data: { failedLogins: 0, lockedUntil: null },
    });
  });

  test("redirects an unauthenticated visitor to the login page", async ({ page }) => {
    await page.goto("/leads");
    await expect(page).toHaveURL(/\/login\?next=%2Fleads/);
  });

  test("rejects a wrong password without revealing whether the account exists", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(EMAIL);
    await page.getByLabel("Password").fill("definitely-not-the-password");
    await page.getByRole("button", { name: "Sign in" }).click();

    // Scope to the form's own alert — Next's route announcer is also role=alert.
    const alert = page.locator("form p[role=alert]");
    await expect(alert).toBeVisible();
    // Same message for an unknown address and a wrong password.
    await expect(alert).toHaveText(/not recognised/i);
  });

  test("gives the same message for an unknown address", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("nobody@example.com");
    await page.getByLabel("Password").fill("whatever");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.locator("form p[role=alert]")).toHaveText(/not recognised/i);
  });

  test("signs in and returns to the requested page", async ({ page }) => {
    test.skip(!PASSWORD, "ADMIN_PASSWORD not set");

    await page.goto("/leads");
    await expect(page).toHaveURL(/\/login/);

    await page.getByLabel("Email").fill(EMAIL);
    await page.getByLabel("Password").fill(PASSWORD);
    await page.getByRole("button", { name: "Sign in" }).click();

    // Deep link preserved through the login round trip.
    await expect(page).toHaveURL(/\/leads$/);
    await expect(page.getByRole("heading", { name: "Leads", level: 1 })).toBeVisible();
  });

  test("ignores an off-site next parameter", async ({ page }) => {
    test.skip(!PASSWORD, "ADMIN_PASSWORD not set");

    // An open redirect on a login form is a gift to a phishing campaign.
    await page.goto("/login?next=https://evil.example.com");
    await page.getByLabel("Email").fill(EMAIL);
    await page.getByLabel("Password").fill(PASSWORD);
    await page.getByRole("button", { name: "Sign in" }).click();

    // Anchored, and via expect(page) so it retries until navigation settles —
    // page.url() is a synchronous snapshot and races the redirect.
    await expect(page).toHaveURL(/^https?:\/\/[^/]+\/$/);
  });
});
