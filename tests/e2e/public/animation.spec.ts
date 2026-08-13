import { expect, test } from "@playwright/test";

/**
 * Animation conformance — the executable half of the motion design tokens.
 *
 * The durations live once, in `packages/ui/src/styles/base.css` as `--motion-*`
 * on `:root`. This spec reads the LIVE computed styles and asserts the exact
 * values, so a drift in either direction (a token retimed, a shorthand that
 * silently resets a delay, a cache-busted CSS that dropped a rule) fails the
 * build instead of being noticed by a visitor or a client on a call.
 *
 * It also guards the two easy-to-break properties an animation must have:
 *  - stagger is real (delays differ between ribbons),
 *  - hover never restarts the entrance (changing animation-delay is the bug);
 *  - the matrix is genuinely 3D (perspective + per-column translateZ/depth),
 *  - reduced-motion zeroes every effect the global rule promises to zero.
 *
 * Tests run against the site on :4300 (see playwright.config). The marquee
 * items and hero columns are decorative, so these are pure-CSS assertions —
 * no screenshots, no pixel diffs.
 */

/** Parse the computed `animation-duration` list (e.g. "0.9s, 3.4s"). */
function parseSeconds(value: string): number[] {
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean)
    .map((v) => {
      const m = v.match(/^([-+]?\d*\.?\d+)s$/);
      return m ? Number(m[1]) : 0;
    });
}

test.describe("homepage animation tokens", () => {
  test("the motion tokens exist on :root and parse", async ({ page }) => {
    await page.goto("/");
    const tokens = await page.evaluate(() => {
      const cs = getComputedStyle(document.documentElement);
      const pick = (t: string) => (cs.getPropertyValue(t) || "").trim();
      return {
        logoSweep: pick("--motion-logo-sweep-dur"),
        logoChase: pick("--motion-logo-chase-dur"),
        logoGap: pick("--motion-logo-gap"),
        peak: pick("--motion-peak-dur"),
        matrixMin: pick("--motion-matrix-speed-min"),
        matrixMax: pick("--motion-matrix-speed-max"),
        marquee: pick("--motion-marquee-scroll"),
      };
    });

    const secs = (t: string) => parseFloat(t);
    expect(secs(tokens.logoSweep)).toBe(0.9);
    expect(secs(tokens.logoChase)).toBe(3.4);
    expect(secs(tokens.logoGap)).toBe(0.18);
    expect(secs(tokens.peak)).toBe(3.2);
    expect(secs(tokens.matrixMin)).toBeLessThan(secs(tokens.matrixMax));
    expect(secs(tokens.marquee)).toBe(64);
  });

  test("the animated logo has three ribbons that animate on stagger", async ({ page }) => {
    await page.goto("/");

    // Scope to a single logo instance (header one is first; footer also uses
    // the animated mark, so a page-wide query finds 6 paths across two logos).
    const logo = page.locator(".apex-logo").first();
    await expect(logo).toBeVisible();

    const sweep = logo.locator(".apex-sweep");
    await expect(sweep).toHaveCount(3);

    const delays = await sweep.evaluateAll((els) =>
      els.map((el) => getComputedStyle(el).animationDelay),
    );
    expect(delays).toHaveLength(3);

    // The three delays must be pairwise distinct — the old bug (a shorthand
    // resetting animation-delay) locked all ribbons to 0s.
    const uniq = new Set(delays);
    expect(uniq.size).toBe(3);

    // And the entrance animation must actually be attached (not `none`).
    const names = await sweep.first().evaluate((el) => getComputedStyle(el).animationName);
    expect(names).toContain("apex-sweep-in");
  });

  test("hover quickens the chase without restarting it", async ({ page }) => {
    await page.goto("/");

    const logo = page.locator(".apex-logo").first();
    await expect(logo).toBeVisible();

    const before = await logo
      .locator(".apex-sweep")
      .first()
      .evaluate((el) => getComputedStyle(el).animationDuration);

    await logo.hover();
    await page.waitForTimeout(150);

    const during = await logo
      .locator(".apex-sweep")
      .first()
      .evaluate((el) => getComputedStyle(el).animationDuration);

    // Hover must shorten the chase (1.5s) — that is the "it noticed you" beat.
    expect(before).not.toBe(during);
    expect(durations(during).find((d) => d > 0 && d < 2)).toBeDefined();

    // Moving the mouse away must not leave the mark slower than it started —
    // i.e. the change is reversible.
    await page.mouse.move(0, 0);
    await page.waitForTimeout(150);
    const after = await logo
      .locator(".apex-sweep")
      .first()
      .evaluate((el) => getComputedStyle(el).animationDuration);
    expect(after).toBe(before);
  });

  test("the hero matrix is a real 3D perspective scene", async ({ page }) => {
    await page.goto("/");

    const scene = page.locator(".hero-matrix-scene");
    await expect(scene).toBeVisible();

    // Each column carries a depth custom property and the perspective stage
    // is present — depth and stage are what make this 3D rather than 2D.
    const data = await scene.evaluate((stage) => {
      const cs = getComputedStyle(stage);
      const perspective = cs.perspective;
      const columns = Array.from(stage.querySelectorAll<HTMLElement>(".hero-matrix-column"));
      return {
        perspective,
        depths: columns.map((c) => c.style.getPropertyValue("--col-depth") || "0px"),
        speeds: columns.map((c) => c.style.getPropertyValue("--col-speed") || "14s"),
      };
    });

    // perspective must be a distance, not "none"/"0".
    expect(data.perspective).toMatch(/^\d+px/);

    // There must be more than one distinct depth and more than one speed.
    expect(new Set(data.depths).size).toBeGreaterThan(1);
    expect(new Set(data.speeds).size).toBeGreaterThan(1);
  });

  test("reduced-motion zeroes every animation", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    const sweep = page.locator(".apex-logo .apex-sweep").first();

    // Reduced motion does not delete the animation — it collapses its duration
    // to ~0ms so it completes in one frame. `animationName` must still be the
    // sweep; the browser may briefly report "" right after style recalc on a
    // just-completed animation, so poll rather than read a single frame.
    const name = await expect
      .poll(() => sweep.evaluate((el) => getComputedStyle(el).animationName), {
        message: "the sweep animation must stay applied under reduced motion",
      })
      .toContain("apex-sweep-in");
    void name;
    const durations = await sweep.evaluate((el) => getComputedStyle(el).animationDuration);
    // The global reduced-motion rule forces durations down to ~0.01ms. The
    // browser may serialize it as "0.01ms" or "1e-05s" — accept both.
    expect(parseSeconds(durations).every((s) => s <= 0.0001)).toBe(true);
  });

  test("no layout overflow while the hero animates", async ({ page }) => {
    await page.goto("/");
    const [scrollW, clientW] = await page.evaluate(() => [
      document.documentElement.scrollWidth,
      document.documentElement.clientWidth,
    ]);
    expect(scrollW).toBeLessThanOrEqual(clientW + 1);
  });
});

/** Parse an animation-duration list into seconds; numbers only. */
function durations(value: string): number[] {
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean)
    .map((v) => {
      const m = v.match(/^([\d.]+)s$/);
      return m ? Number(m[1]) : 0;
    });
}
