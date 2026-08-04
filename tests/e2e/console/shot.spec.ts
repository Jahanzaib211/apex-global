import { test } from "@playwright/test";

/** Screenshot helper — not an assertion suite. Run with SHOTS=1. */
const PASSWORD = process.env.ADMIN_PASSWORD ?? "";
const DIR = process.env.SHOT_DIR ?? "/home/jahanzaib/apex-render";

test("capture console screens", async ({ page }) => {
  test.skip(!process.env.SHOTS, "set SHOTS=1 to capture");
  test.skip(!PASSWORD, "ADMIN_PASSWORD not set");

  await page.goto("/login");
  await page.getByLabel("Email").fill(process.env.ADMIN_EMAIL ?? "admin@apexglobal.local");
  await page.getByLabel("Password").fill(PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL(/localhost:4301\/$/);

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({ path: `${DIR}/console-overview.png`, fullPage: false });

  await page.goto("/leads");
  await page.screenshot({ path: `${DIR}/console-leads.png`, fullPage: false });

  await page.goto("/settings");
  await page.screenshot({ path: `${DIR}/console-settings.png`, fullPage: false });
});
