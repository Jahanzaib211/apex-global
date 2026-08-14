import { test, expect } from "@playwright/test";
import { SITES, baseUrlFor } from "./site-matrix";

/**
 * Frame-rate floor for the spatial layer.
 *
 * Separated from the rest of the spatial suite and pinned to a single worker,
 * because this is the one assertion whose result depends on what else is
 * running. Measured in parallel across four browsers and four Next servers the
 * same page reports 11-52fps; measured serially it is stable. A flaky
 * performance gate teaches people to ignore performance gates.
 *
 * These numbers come from software rasterisation (SwiftShader, no GPU). The
 * same page measures ~62fps with the field disabled and ~52 with it on, so the
 * threshold catches a runaway loop or a leak rather than certifying 60.
 */

/** Frames actually painted over a second of wall-clock time. */
async function measureFps(page: import("@playwright/test").Page): Promise<number> {
  return page.evaluate<number>(
    () =>
      new Promise<number>((resolve) => {
        let frames = 0;
        const start = performance.now();
        const loop = () => {
          frames += 1;
          if (performance.now() - start < 1000) requestAnimationFrame(loop);
          else resolve(frames);
        };
        requestAnimationFrame(loop);
      }),
  );
}

for (const site of SITES) {
  const base = baseUrlFor(site);

  test.describe(`[${site.id}] spatial performance`, () => {
    test("renders the viewport and holds a frame rate under pointer load", async ({ page }) => {
      await page.goto(`${base}/`, { waitUntil: "networkidle" });

      const host = page.locator("[data-spatial]").first();
      await expect(host, "hero should mount a spatial host").toHaveCount(1);

      // The canvas only exists where WebGL2 does. Headless Chromium usually
      // provides it through SwiftShader, but a machine without it must still
      // pass — the static gradient is a supported outcome, not a failure.
      const mode = await host.getAttribute("data-spatial");
      if (mode !== "webgl") {
        test.info().annotations.push({ type: "note", description: "no WebGL2; static fallback" });
        return;
      }

      const canvas = page.locator("canvas#sovereign-viewport");
      await expect(canvas).toHaveCount(1);

      const box = await canvas.boundingBox();
      expect(box, "canvas should occupy real space").not.toBeNull();
      expect(box!.width).toBeGreaterThan(100);
      expect(box!.height).toBeGreaterThan(100);

      // Engage the field, then measure while its inertia settles. Measuring
      // *during* the sweep measures Playwright: each mouse.move is a CDP
      // round-trip that contends with the frame loop under test.
      for (let i = 0; i <= 6; i++) {
        await page.mouse.move(
          box!.x + (box!.width * i) / 6,
          box!.y + box!.height * (0.3 + (i % 3) * 0.2),
        );
      }

      const fps = await measureFps(page);
      // A floor, not a target. This runs on SwiftShader with no GPU, where the
      // same page measures ~62fps with the field off and ~52 with it on; the
      // threshold is set to catch a runaway loop or a leak, not to certify 60.
      expect(fps, `sustained frame rate on ${site.id}`).toBeGreaterThanOrEqual(30);
    });


    test("the field costs less than a third of the idle frame budget", async ({ browser }) => {
      // Compare against the same page with the field off, so the number means
      // "what the effect costs" rather than "how fast this machine is".
      const still = await browser.newContext({ reducedMotion: "reduce" });
      const stillPage = await still.newPage();
      await stillPage.goto(`${base}/`, { waitUntil: "networkidle" });
      const baseline = await measureFps(stillPage);
      await still.close();

      const page = await browser.newPage();
      await page.goto(`${base}/`, { waitUntil: "networkidle" });
      const mode = await page.locator("[data-spatial]").first().getAttribute("data-spatial");
      const withField = await measureFps(page);
      await page.close();

      if (mode !== "webgl") return; // nothing to charge for

      expect(baseline, "baseline should itself be healthy").toBeGreaterThan(30);
      expect(
        withField,
        `field cost on ${site.id}: ${baseline} -> ${withField} fps`,
      ).toBeGreaterThanOrEqual(baseline * 0.65);
    });
  });
}
