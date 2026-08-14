import { test, expect } from "@playwright/test";

/**
 * The live-chat widget on the deployed Tech site.
 *
 * This walks a **live production hostname**, so it belongs with the other
 * host-audit specs rather than in the per-commit gate — it says nothing about
 * the build in the pull request, and it fails on a CI runner for reasons that
 * have nothing to do with the change.
 *
 * The SDK is served by the Chatwoot host, not proxied through the Next origin.
 * The previous assertion fetched `/packs/js/sdk.js` from
 * tech.apexgroupcompanies.com, which answers 404; the widget was working the
 * whole time, loading the script from chat.apexgroupcompanies.com as the
 * component actually does.
 */

test.describe("Chatwoot widget", () => {
  test("SDK and custom launcher are present on the public site", async ({ page }) => {
    await page.goto("https://tech.apexgroupcompanies.com/", { waitUntil: "domcontentloaded" });
    const launcher = page.getByRole("button", { name: /talk to|chat with|start chat/i });
    await expect(launcher).toBeVisible({ timeout: 20_000 });

    const sdk = await page.request.get("https://chat.apexgroupcompanies.com/packs/js/sdk.js", {
      timeout: 20_000,
    });
    expect(sdk.ok(), "chatwoot SDK should be served by the chat host").toBeTruthy();
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
