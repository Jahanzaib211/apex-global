import { test, expect } from "@playwright/test";
import { SITES, baseUrlFor } from "./site-matrix";

/**
 * The spatial layer: it must render, it must hold a frame rate, and it must
 * disappear entirely for anyone who asked for less motion.
 *
 * The last of those is the one worth automating. A decorative WebGL field is
 * easy to ship and easy to forget to gate, and the people it hurts are exactly
 * the people least likely to file a bug about it.
 */

for (const site of SITES) {
  const base = baseUrlFor(site);

  test.describe(`[${site.id}] spatial layer`, () => {
    test("honours prefers-reduced-motion by not starting WebGL at all", async ({ browser }) => {
      const context = await browser.newContext({ reducedMotion: "reduce" });
      const page = await context.newPage();
      await page.goto(`${base}/`, { waitUntil: "networkidle" });

      const host = page.locator("[data-spatial]").first();
      await expect(host).toHaveAttribute("data-spatial", "static");
      await expect(page.locator("canvas#sovereign-viewport")).toHaveCount(0);

      // The brand mark drops its listeners too, rather than tilting slowly.
      const mark = page.locator('[data-testid="brand-logo"]').first();
      if (await mark.count()) await expect(mark).toHaveAttribute("data-tilt", "off");

      await context.close();
    });

    test("the spatial layer is invisible to assistive technology", async ({ page }) => {
      await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
      const host = page.locator("[data-spatial]").first();
      // aria-hidden on the host covers the canvas and the gradient beneath it.
      await expect(host).toHaveAttribute("aria-hidden", "true");
    });

    test("the hero still reads without the canvas", async ({ browser }) => {
      // A hero whose headline depends on an effect having succeeded is a hero
      // that breaks for a fraction of every audience.
      const context = await browser.newContext({ reducedMotion: "reduce" });
      const page = await context.newPage();
      await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });

      const h1 = page.locator("h1").first();
      await expect(h1).toBeVisible();
      expect((await h1.innerText()).trim().length).toBeGreaterThan(3);

      await context.close();
    });

    test("the primary hero call to action is present and reachable", async ({ page }) => {
      await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
      const cta = page.locator("#hero-cta-primary");
      await expect(cta, "every hero needs one addressable primary CTA").toHaveCount(1);
      await expect(cta).toBeVisible();
      const name = (await cta.innerText()).trim();
      expect(name.length, "the CTA needs a label").toBeGreaterThan(2);
    });

    test("the brand mark is present and keyboard reachable", async ({ page }) => {
      await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
      const mark = page.locator('[data-testid="brand-logo"]').first();
      await expect(mark).toHaveCount(1);
      await expect(mark).toBeVisible();
      // Some sites wrap the logo in the mark, others wrap the mark in the
      // logo's own link. Either is fine; what must hold is that the mark is
      // associated with a link home and that link is the tab stop.
      const linked = await mark.evaluate((el) => {
        const ancestor = el.closest("a");
        const descendant = el.querySelector("a");
        const href = ancestor?.getAttribute("href") ?? descendant?.getAttribute("href") ?? null;
        return href;
      });
      expect(linked, "the brand mark should link home").toBe("/");
    });
  });
}
