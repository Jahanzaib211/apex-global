import { test, expect } from "@playwright/test";

/**
 * The live-chat widget (Chatwoot, proxied through the Next origin): the
 * site hides Chatwoot's own bubble and ships a custom launcher that calls
 * `$chatwoot.toggle()`. Walk it like a visitor — SDK loads, launcher is on
 * the page, clicking opens a usable conversation window.
 */

test.describe("Chatwoot widget", () => {
  test("SDK and custom launcher are present on the public site", async ({ page }) => {
    await page.goto("https://tech.apexgroupcompanies.com/", { waitUntil: "domcontentloaded" });
    const launcher = page.getByRole("button", { name: /talk to|chat with|start chat/i });
    await expect(launcher).toBeVisible({ timeout: 20_000 });

    const sdk = await page.request.get("https://tech.apexgroupcompanies.com/packs/js/sdk.js", {
      timeout: 20_000,
    });
    expect(sdk.ok(), "chatwoot SDK (proxied through the tunnel) should be served").toBeTruthy();
  });

  test("opening the widget shows a usable conversation window", async ({ page }) => {
    await page.goto("https://tech.apexgroupcompanies.com/", { waitUntil: "domcontentloaded" });
    const launcher = page.getByRole("button", { name: /talk to|start chat/i });
    await expect(launcher).toBeVisible({ timeout: 20_000 });

    await launcher.click();
    const frame = page.frameLocator("iframe#chatwoot_live_chat_widget");
    await expect(frame.locator("body")).toBeVisible({ timeout: 20_000 });

    // Incoming crew is "away" right now — a real visitor starts a
    // conversation first, then gets the message composer.
    const start = frame.getByRole("button", { name: /start (a )?conversation/i });
    await start.click({ timeout: 20_000 });
    const composer = frame
      .locator("textarea, [contenteditable='true'], [data-cy='chat-input']")
      .first();
    await expect(composer).toBeVisible({ timeout: 20_000 });

    // And a message actually lands in the conversation.
    await composer.fill("Hello from the Playwright walkthrough 👋");
    await composer.press("Enter");
    await expect(frame.getByText(/Hello from the Playwright walkthrough/)).toBeVisible({
      timeout: 20_000,
    });
  });
});
