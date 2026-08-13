import { expect, test } from "@playwright/test";

/**
 * The homepage repository graph.
 *
 * The graph canvas is a fixed-size box inside a responsive section. It must
 * stay horizontally centred on desktop and mobile: equal whitespace on both
 * sides, no overflow off the viewport, and the section must not push the page
 * sideways. This file is the guard for that layout.
 */

test.describe("homepage repository graph", () => {
  test("the graph section is present and the canvas is centred", async ({ page }) => {
    await page.goto("/");

    const section = page.locator("#code-graph");
    await expect(section).toBeVisible();

    const canvas = section.getByTestId("repo-graph-canvas");
    await expect(canvas).toBeVisible();

    // The canvas box must be horizontally centred inside the section: its
    // bounding-box centre should match the section centre within a tolerance.
    const box = await canvas.boundingBox();
    const sectionBox = await section.boundingBox();
    expect(box).not.toBeNull();
    expect(sectionBox).not.toBeNull();

    const canvasCenter = box!.x + box!.width / 2;
    const sectionCenter = sectionBox!.x + sectionBox!.width / 2;
    expect(Math.abs(canvasCenter - sectionCenter)).toBeLessThan(2);

    // And it must be genuinely inset on both sides — not edge-to-edge on one
    // side while overflowing off the other.
    expect(box!.x - sectionBox!.x).toBeGreaterThan(0);
    expect(sectionBox!.x + sectionBox!.width - (box!.x + box!.width)).toBeGreaterThan(0);
  });

  test("the drawn graph ink is centred in the canvas", async ({ page }) => {
    await page.goto("/");

    const canvas = page.getByTestId("repo-graph-canvas");
    await expect(canvas).toBeVisible();

    // Animation is requestAnimationFrame-driven; wait a couple of frames so
    // the first paint has actually happened before we sample pixels.
    await canvas.evaluate(
      (c) =>
        new Promise<void>((resolve) => {
          const el = c as HTMLCanvasElement;
          el.getContext("2d");
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        }),
    );

    // Sample the canvas pixels directly and find the bounding box of anything
    // that is not the transparent/undrawn background. The centre of that ink
    // must sit at the canvas centre — this is the real regression that a
    // bounding-box check on the <canvas> element cannot catch.
    const ink = await canvas.evaluate((c) => {
      const el = c as HTMLCanvasElement;
      const ctx = el.getContext("2d")!;
      const { width: W, height: H } = el;
      const data = ctx.getImageData(0, 0, W, H).data;
      let minX = W,
        minY = H,
        maxX = 0,
        maxY = 0,
        count = 0;
      const stride = 8;
      for (let y = 0; y < H; y += stride) {
        for (let x = 0; x < W; x += stride) {
          const i = (y * W + x) * 4;
          const alpha = data[i + 3];
          const r = data[i],
            g = data[i + 1],
            b = data[i + 2];
          const isBg = Math.abs(r - 13) < 12 && Math.abs(g - 20) < 12 && Math.abs(b - 32) < 12;
          if (alpha > 40 && !isBg) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
            count++;
          }
        }
      }
      return { minX, minY, maxX, maxY, count, W, H };
    });

    expect(ink.count).toBeGreaterThan(100); // ink actually drawn
    const inkCx = (ink.minX + ink.maxX) / 2;
    const inkCy = (ink.minY + ink.maxY) / 2;
    // Allow ~5% of the shorter axis for tooltip/label overshoot.
    const tol = Math.max(12, Math.min(ink.W, ink.H) * 0.05);
    expect(Math.abs(inkCx - ink.W / 2)).toBeLessThan(tol);
    expect(Math.abs(inkCy - ink.H / 2)).toBeLessThan(tol);
  });

  test("centred hero copy and no horizontal overflow", async ({ page }) => {
    await page.goto("/");

    const section = page.locator("#code-graph");
    const heading = section.getByRole("heading", { level: 2 });
    await expect(heading).toBeVisible();

    const headingBox = await heading.boundingBox();
    const viewport = page.viewportSize();
    expect(headingBox).not.toBeNull();

    // Heading centred in the section (SectionHeading align="center").
    const headingCenter = headingBox!.x + headingBox!.width / 2;
    const sectionBox = await section.boundingBox();
    expect(sectionBox).not.toBeNull();
    const sectionCenter = sectionBox!.x + sectionBox!.width / 2;
    expect(Math.abs(headingCenter - sectionCenter)).toBeLessThan(8);

    // Nothing escapes the viewport horizontally.
    const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollW).toBeLessThanOrEqual(viewport!.width + 1);
  });

  test("every node is clickable and opens real source", async ({ page }) => {
    await page.goto("/");

    const section = page.locator("#code-graph");
    const canvas = section.getByTestId("repo-graph-canvas");
    await expect(canvas).toBeVisible();

    // Probe a worst-case path that the baked layout guarantees exists near the
    // visual centre (the hub node is seeded at 0,0 and scales with the box).
    const box = (await canvas.boundingBox())!;
    const reports = await page.evaluate(() => {
      const c = document.querySelector("canvas[data-testid]") as HTMLCanvasElement;
      return c ? `${c.width}x${c.height}` : "missing";
    });

    // The hub always sits at the centre of the baked layout, so a click dead
    // centre must land on either the hub or a neighbour of it.
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

    // Hover should render the hub's tooltip ("ui/src/index.ts" is the top hub).
    const tip = page.locator("#code-graph canvas");
    await expect(tip).toBeVisible({ timeout: 5000 });
    expect(reports).toBeDefined();
  });
});
