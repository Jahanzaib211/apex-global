import { test, expect } from "@playwright/test";

/**
 * The live chat widget, on every Apex property.
 *
 * Chat is only "rolled out" if the launcher actually renders and talks to the
 * right inbox. Each site carries its own Chatwoot website token so the agent
 * answering can see which brand the conversation arrived on — a tour question
 * and an outsourcing RFP need different people. A shared token would look
 * identical in a screenshot and be wrong in the inbox, so the token is
 * asserted per site rather than just "some widget appeared".
 *
 * This lives under `surfaces`, not `public`, because every URL below is a live
 * production address behind a Cloudflare tunnel. As a `public` spec it was
 * gating CI on the public internet: a tunnel hiccup failed the build with no
 * commit having changed. The invariant it protects — that no two sites share a
 * token — is pinned hermetically in packages/site-kit/src/chatwoot.test.ts, so
 * nothing is lost. What is checked here is deployment, which is the host's
 * question to answer and not a runner's.
 */

const CHAT_HOST = "https://chat.apexgroupcompanies.com";

const SITES = [
  {
    name: "Apex Tech",
    url: "https://tech.apexgroupcompanies.com",
    token: "BwtQt74nqfPep16bMSHJrXZB",
  },
  {
    name: "Apex Group",
    url: "https://apex.apexgroupcompanies.com",
    token: "8ifuvAsh77ZAc3CfAV1vv29z",
  },
  {
    name: "Apex Holdings",
    url: "https://holdings.apexgroupcompanies.com",
    token: "DCBe85BZciTqg3GtMZqM8Lkc",
  },
  {
    name: "Apex Outsourcing",
    url: "https://outsourcing.apexgroupcompanies.com",
    token: "HCkV3Ez6Njd3XpYhgXiaw6nr",
  },
  {
    name: "Apex Tours",
    url: "https://tours.apexgroupcompanies.com",
    token: "kzvNNCuZqvKhTu9Pb3hsGiut",
  },
];

for (const site of SITES) {
  test.describe(site.name, () => {
    test("renders, loads the chat SDK, and mounts its own inbox", async ({ page }) => {
      const sdkRequests: string[] = [];
      page.on("request", (r) => {
        if (r.url().includes("/packs/js/sdk.js")) sdkRequests.push(r.url());
      });

      const response = await page.goto(site.url, { waitUntil: "domcontentloaded" });
      expect(response?.status(), `${site.name} should serve 200`).toBe(200);

      // The frontend itself is up, not just the origin answering.
      await expect(page.locator("body")).toBeVisible();
      expect(await page.title()).not.toBe("");

      // The widget injects a same-name iframe once the SDK has run. Waiting on
      // the iframe rather than the script tag proves the SDK executed, not
      // merely that a <script> was appended.
      const widget = page.locator("iframe.woot-widget-holder, #chatwoot_live_chat_widget");
      await expect(widget.first()).toBeAttached({ timeout: 30_000 });

      // The SDK came from the chat host, and carries this site's own token.
      expect(sdkRequests.some((u) => u.startsWith(CHAT_HOST))).toBe(true);

      // Read the src off whichever element actually mounted — the same locator
      // as above, not just `.woot-widget-holder`. Chatwoot's current build
      // mounts `iframe#chatwoot_live_chat_widget` with no `woot-widget-holder`
      // class, so a hardcoded `.woot-widget-holder` here matches nothing and
      // burns the full actionability timeout before falling through, blowing
      // the test budget before the token is ever asserted.
      const src = await widget
        .first()
        .getAttribute("src", { timeout: 5_000 })
        .catch(() => null);

      if (src) {
        expect(src, `${site.name} must use its own inbox token`).toContain(site.token);
      } else {
        // Older widget builds keep the token on the SDK global instead.
        const token = await page.evaluate(
          () =>
            (window as unknown as { $chatwoot?: { websiteToken?: string } }).$chatwoot
              ?.websiteToken ?? null,
        );
        expect(token, `${site.name} must use its own inbox token`).toBe(site.token);
      }
    });

    test("footer cross-links the whole group", async ({ page }) => {
      await page.goto(site.url, { waitUntil: "domcontentloaded" });
      const html = await page.content();
      for (const host of ["apex", "tech", "cloud", "tours", "outsourcing", "holdings"]) {
        // A site does not link to itself; every other property must be there.
        if (site.url.includes(`${host}.`)) continue;
        expect(html, `${site.name} footer should link ${host}`).toContain(
          `${host}.apexgroupcompanies.com`,
        );
      }
    });
  });
}
