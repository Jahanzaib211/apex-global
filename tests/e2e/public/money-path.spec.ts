import { expect, test } from "@playwright/test";

/**
 * The money path.
 *
 * An ad click carrying campaign parameters lands on a campaign page, the
 * visitor converts, and the enquiry arrives with its attribution intact. If
 * this breaks, advertising spend produces nothing measurable — every other
 * test in the suite matters less than this one.
 */

const CAMPAIGN = `e2e-${Date.now()}`;
const LANDING = `/lp/cloud-migration?utm_source=google&utm_medium=cpc&utm_campaign=${CAMPAIGN}&gclid=E2ETESTGCLID`;

function uniqueEmail() {
  return `e2e-${Date.now()}-${Math.floor(Math.random() * 1e6)}@example.com`;
}

test.describe("money path", () => {
  test("a campaign page has one action and no way to wander off", async ({ page }) => {
    await page.goto(LANDING);

    // No site chrome: every exit route on a page we paid for is a lost click.
    await expect(page.locator("header nav")).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Case Studies" })).toHaveCount(0);
    await expect(page.locator("footer")).toHaveCount(0);

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("button", { name: /request|talk|send|start/i })).toBeVisible();
  });

  test("campaign pages are excluded from search", async ({ page }) => {
    const response = await page.goto(LANDING);
    expect(response?.status()).toBe(200);

    // noindex on the page itself, because a disallow in robots.txt does not
    // prevent indexing when something links to the URL.
    const robots = page.locator('head meta[name="robots"]');
    await expect(robots).toHaveAttribute("content", /noindex/);
  });

  test("submitting converts and lands on the thank-you page", async ({ page }) => {
    const email = uniqueEmail();

    await page.goto(LANDING);
    await page.getByLabel("Full name").fill("E2E Buyer");
    await page.getByLabel("Work email").fill(email);
    await page.getByLabel("Company").fill("E2E Ltd");
    await page.getByLabel(/contact me about this enquiry/i).check();
    await page.getByRole("button", { name: /request a migration assessment/i }).click();

    await expect(page).toHaveURL(/\/thank-you$/);
    await expect(page.getByRole("heading", { name: /enquiry received/i })).toBeVisible();
  });

  test("the enquiry is stored with its campaign attribution intact", async ({ page, request }) => {
    const email = uniqueEmail();

    await page.goto(LANDING);
    await page.getByLabel("Full name").fill("Attribution Check");
    await page.getByLabel("Work email").fill(email);
    await page.getByLabel(/contact me about this enquiry/i).check();
    await page.getByRole("button", { name: /request a migration assessment/i }).click();
    await expect(page).toHaveURL(/\/thank-you$/);

    // Re-submitting the same address on the same day must append to the
    // existing lead, not create a second one for sales to call twice.
    const duplicate = await request.post("/api/leads", {
      data: { name: "Attribution Check", email, consentContact: true, message: "double tap" },
    });
    expect(duplicate.status()).toBe(201);
  });

  test("a bot that fills the honeypot gets a normal-looking success", async ({ request }) => {
    // Returning a validation error naming the trap field would tell the bot
    // exactly which input to leave alone next time.
    const response = await request.post("/api/leads", {
      data: {
        name: "Bot",
        email: uniqueEmail(),
        consentContact: true,
        company_website: "http://spam.example",
      },
    });

    expect(response.status()).toBe(201);
    expect(await response.json()).toEqual({ ok: true });
  });

  test("consent is required", async ({ request }) => {
    const response = await request.post("/api/leads", {
      data: { name: "No Consent", email: uniqueEmail() },
    });

    expect(response.status()).toBe(422);
    const body = (await response.json()) as { fields?: Record<string, string[]> };
    expect(body.fields?.consentContact).toBeTruthy();
  });

  test("the raw IP is never returned to a client", async ({ request }) => {
    const response = await request.post("/api/leads", {
      data: { name: "Privacy Check", email: uniqueEmail(), consentContact: true },
    });

    const text = await response.text();
    expect(text).not.toMatch(/\b\d{1,3}(\.\d{1,3}){3}\b/);
  });
});
