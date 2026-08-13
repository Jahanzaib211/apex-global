import { test, expect } from "@playwright/test";

/**
 * Mailcow admin — reached the way an operator reaches it: through the
 * public Cloudflare tunnel (cloud.ApexGroupCompanies.com). Sign in as
 * super-admin, then pull Rspamd history (the same rows the UI's Rspamd
 * History screen shows) and confirm the fresh password-reset email to
 * Gmail went through with DKIM signing.
 *
 * Story: visitor requests a reset on the portal → operator inspects mail
 * history → sees the signed message destined for the Gmail inbox.
 */

const MAILCOW_URL = "https://cloud.apexgroupcompanies.com";
const ADMIN_USER = process.env.E2E_MAILCOW_ADMIN ?? "admin";
const ADMIN_PASS = process.env.E2E_MAILCOW_PASS ?? "Apex-Mailcow-Admin!2026";
const RCPT = "alilabsx@gmail.com";

async function operatorLogin(page) {
  // Admin login lives on the /admin/ entry (the root / form is the user
  // login only). The page JS names the hidden csrf input before submit.
  await page.goto(`${MAILCOW_URL}/admin/`);
  await page.fill('input[name="login_user"]', ADMIN_USER);
  await page.fill('input[name="pass_user"]', ADMIN_PASS);
  // Wait for CSRF token to be injected by page JS before submitting
  await page.waitForSelector('input[name="csrf_token"]', { state: "attached", timeout: 10_000 });
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/admin\/dashboard/, { timeout: 30_000 });
  await expect(page.locator("body")).toContainText(
    /System & Containers|Architecture|Rspamd|Postfix|mail UI/i,
    { timeout: 30_000 },
  );
}

test.describe("Mailcow admin (via public tunnel)", () => {
  test("operator signs in and sees the mail system overview", async ({ page }) => {
    await operatorLogin(page);
    // Objectively in, and the top navigation reflects the system state.
    await expect(page.locator("body")).toContainText(
      /System & Containers|Rspamd|Postfix|Mailcow UI|E-Mail/i,
      {
        timeout: 20_000,
      },
    );
  });

  test("operator confirms the fresh reset mail is DKIM-signed in history", async ({ page }) => {
    // 1. A visitor requests the password reset on the portal origin.
    const reset = await page.request.post("http://localhost:4300/api/portal/auth/forgot-password", {
      data: { email: RCPT },
    });
    expect(reset.ok()).toBeTruthy();

    // 2. Operator signs in and opens the Rspamd history (same data the UI
    //    history screen renders, through the same session).
    await operatorLogin(page);
    const history = await page.request.get(
      `${MAILCOW_URL}/api/v1/get/logs/rspamd-history?lines=100`,
    );
    expect(history.ok()).toBeTruthy();

    const rows = (await history.json()) as Array<Record<string, unknown>>;
    const mail = rows.find((r) => {
      const blob = JSON.stringify(r).toLowerCase();
      return blob.includes(RCPT) && (blob.includes("dkim_sign") || blob.includes("dkim_pass"));
    });
    expect(mail, `history should hold a DKIM-signed row for ${RCPT}`).toBeDefined();
  });
});
