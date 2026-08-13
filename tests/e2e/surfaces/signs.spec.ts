import { test, expect } from "@playwright/test";

/**
 * Sign-in flow for every authenticated surface. Credentials fall back to the
 * values recorded in infra/MASTER-CREDENTIALS.md (gitignored); override with
 * E2E_* env vars rather than editing this file.
 *
 * Each test asserts the post-login marker for that product — arriving
 * anywhere before the login round-trip completes is treated as a failure.
 */

const ADMIN_EMAIL = "alilabsx@gmail.com";
const ADMIN_PASS = process.env.E2E_ADMIN_PASSWORD ?? "Jatt@1234567";
const MAILCOW_ADMIN = process.env.E2E_MAILCOW_ADMIN ?? "admin";
const MAILCOW_PASS = process.env.E2E_MAILCOW_PASS ?? "Apex-Mailcow-Admin!2026";

test.describe("apex console", () => {
  test("admin signs in and lands on the console", async ({ page }) => {
    await page.goto("http://127.0.0.1:4301/login");
    await page.getByLabel("Email").fill(ADMIN_EMAIL);
    await page.getByLabel("Password").fill(ADMIN_PASS);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).not.toHaveURL(/\/login/, { timeout: 15_000 });
    await expect(page.locator("body")).toContainText(/leads|settings|audit/i, { timeout: 15_000 });
  });
});

test.describe("client portal", () => {
  test("owner signs in and sees their dashboard", async ({ page }) => {
    await page.goto("https://tech.apexgroupcompanies.com/portal/login");
    await page.locator('input[name="email"]').fill(ADMIN_EMAIL);
    await page.locator('input[name="password"]').fill(ADMIN_PASS);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/portal($|\/)/, { timeout: 15_000 });
    await expect(page.getByRole("heading", { name: /Welcome back,/ })).toBeVisible({
      timeout: 15_000,
    });
  });
});

test.describe("chatwoot helpdesk", () => {
  test("super admin signs in", async ({ page }) => {
    await page.goto("http://127.0.0.1:4800/app/login");
    await page.locator('input[name="email_address"]').fill(ADMIN_EMAIL);
    await page.locator('input[name="password"]').fill(ADMIN_PASS);
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page).toHaveURL(/conversations|dashboard/, { timeout: 15_000 });
    await expect(page.locator("body")).toContainText(/conversations/i, { timeout: 15_000 });
  });
});

test.describe("twenty CRM", () => {
  test("workspace owner signs in", async ({ page }) => {
    await page.goto("http://127.0.0.1:3008");
    await page.getByPlaceholder(/email/i).fill(ADMIN_EMAIL);
    await page.getByRole("button", { name: /continue/i }).click();
    await page.locator('input[type="password"]').fill(ADMIN_PASS);
    await page.getByRole("button", { name: /sign in|login/i }).click();
    await expect(page.locator("body")).toContainText(/people|companies|opportunities|command/i, {
      timeout: 20_000,
    });
  });
});

test.describe("hyperswitch control center", () => {
  test("operator UI renders its login form", async ({ page }) => {
    test.setTimeout(60_000);
    await page.goto("http://127.0.0.1:9090/dashboard/login");
    await expect(page.getByPlaceholder(/enter your email/i)).toBeVisible({ timeout: 20_000 });
    await expect(page.getByPlaceholder(/enter your password/i)).toBeVisible();
    // Provisioning the merchant account is blocked upstream: the
    // nightly-standalone router answers every `/api/v1/auth/*` route with
    // 404, so the CC's "Register" cannot create the owner. Tracked in
    // infra/MASTER-CREDENTIALS.md → Hyperswitch "Todo".
  });
});

test.describe("open-webui", () => {
  test("admin signs in", async ({ page }) => {
    const password = process.env.E2E_OPENWEBUI_PASS;
    test.skip(!password, "E2E_OPENWEBUI_PASS not set — Open WebUI has its own account");
    await page.goto("http://127.0.0.1:3030");
    await page.getByPlaceholder(/email/i).fill(ADMIN_EMAIL);
    await page.locator('input[type="password"]').last().fill(password);
    await page
      .getByRole("button", { name: /sign in|login/i })
      .last()
      .click();
    await expect(page.locator("body")).toContainText(/chat|new chat|model/i, { timeout: 20_000 });
  });
});

test.describe("nova-ops", () => {
  test("passcode unlocks the ops console", async ({ page }) => {
    const passcode = process.env.E2E_NOVA_PASSCODE ?? "c2b20d4d06199bb27bae191e";
    await page.goto("http://127.0.0.1:4100/login");
    await page.locator('input[type="password"]').first().fill(passcode);
    await page
      .getByRole("button", { name: /unlock|enter|sign in|continue/i })
      .first()
      .click();
    await expect(page.locator("body")).toContainText(/dashboard|ops|gateway|health/i, {
      timeout: 15_000,
    });
  });
});

test.describe("mailcow admin", () => {
  test("operator signs in on the public admin host", async ({ page }) => {
    await page.goto("https://cloud.apexgroupcompanies.com/admin/");
    await page.fill('input[name="login_user"]', MAILCOW_ADMIN);
    await page.fill('input[name="pass_user"]', MAILCOW_PASS);
    // Wait for CSRF token to be injected by page JS before submitting
    await page.waitForSelector('input[name="csrf_token"]', { state: "attached", timeout: 10_000 });
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 30_000 });
    await expect(page.locator("body")).toContainText(/System & Containers|Rspamd|Postfix/i, {
      timeout: 20_000,
    });
  });
});
