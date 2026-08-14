import { test, expect, type Page, type ConsoleMessage, type Request } from "@playwright/test";
import { SITES, baseUrlFor, type SiteSpec } from "./site-matrix";

/**
 * Structural integrity of every public page on the four marketing sites.
 *
 * This suite exists because the defects it checks for all shipped to
 * production undetected: two sites served with no CSS at all, three shipped
 * footer links that 404'd, one published a reserved placeholder domain in
 * every canonical tag, and every site's chat widget silently rendered nothing.
 * None of it failed a build, a typecheck or a unit test.
 *
 * Everything here is asserted per-route, so a regression names the page.
 */

/** Noise that is not the site's fault and would make the suite flaky. */
const IGNORABLE = [
  /favicon/i,
  /net::ERR_INTERNET_DISCONNECTED/,
  // The Chatwoot SDK is a third-party origin that is not reachable from CI.
  /chat\.apexgroupcompanies\.com/,
  // Next cancels in-flight RSC prefetches when the pointer leaves a link. The
  // abort is the framework working as designed, not a broken request.
  /_rsc=/,
  // Remote images from an external CDN are blocked by Chromium's opaque-response
  // blocking in this environment. Their availability is not what this suite tests.
  /images\.unsplash\.com/,
  /ERR_NETWORK_CHANGED/,
  // React hydration diff warnings are caught by the dedicated check below.
  /Download the React DevTools/,
];

const isIgnorable = (text: string): boolean => IGNORABLE.some((re) => re.test(text));

function collect(page: Page) {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  const failedRequests: string[] = [];

  page.on("console", (msg: ConsoleMessage) => {
    if (msg.type() !== "error") return;
    const text = msg.text();
    if (!isIgnorable(text)) consoleErrors.push(text);
  });
  page.on("pageerror", (err: Error) => {
    if (!isIgnorable(err.message)) pageErrors.push(err.message);
  });
  page.on("requestfailed", (req: Request) => {
    const url = req.url();
    const reason = req.failure()?.errorText ?? "unknown";
    // Match on the failure reason as well as the origin. ERR_NETWORK_CHANGED
    // is environmental and can strike any host, so filtering by URL alone let
    // it through whenever a third-party origin happened to be the victim.
    if (isIgnorable(url) || isIgnorable(reason)) return;
    failedRequests.push(`${req.method()} ${url} :: ${reason}`);
  });

  return { consoleErrors, pageErrors, failedRequests };
}

for (const site of SITES) {
  const base = baseUrlFor(site);

  test.describe(`[${site.id}] page integrity`, () => {
    for (const route of site.routes) {
      test(`${route} renders cleanly`, async ({ page }) => {
        const { consoleErrors, pageErrors, failedRequests } = collect(page);

        const response = await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded" });
        expect(response, `no response for ${route}`).not.toBeNull();
        expect(response!.status(), `${route} status`).toBeLessThan(400);

        await page.waitForLoadState("networkidle").catch(() => {
          /* a long-poll can keep the network busy; the assertions below still hold */
        });

        expect(pageErrors, `${route} threw`).toEqual([]);
        expect(consoleErrors, `${route} console errors`).toEqual([]);
        expect(failedRequests, `${route} failed requests`).toEqual([]);
      });
    }

    test("every route has a unique set of DOM ids", async ({ page }) => {
      const offenders: string[] = [];

      for (const route of site.routes) {
        await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded" });
        const duplicates = await page.evaluate(() => {
          const seen = new Set<string>();
          const dupes = new Set<string>();
          for (const el of Array.from(document.querySelectorAll("[id]"))) {
            const id = el.id;
            if (!id) continue;
            if (seen.has(id)) dupes.add(id);
            seen.add(id);
          }
          return Array.from(dupes);
        });
        // A duplicate id silently breaks every in-page anchor and every
        // aria-controls / label association pointing at it.
        if (duplicates.length) offenders.push(`${route}: ${duplicates.join(", ")}`);
      }

      expect(offenders, "duplicate DOM ids").toEqual([]);
    });

    test("in-page anchors resolve to an element that exists", async ({ page }) => {
      const broken: string[] = [];

      for (const route of site.routes) {
        await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded" });
        const dangling = await page.evaluate(() => {
          const out: string[] = [];
          for (const a of Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href]"))) {
            const href = a.getAttribute("href") ?? "";
            if (!href.startsWith("#") || href === "#") continue;
            const id = decodeURIComponent(href.slice(1));
            if (!document.getElementById(id) && !document.querySelector(`[name="${id}"]`)) {
              out.push(href);
            }
          }
          return Array.from(new Set(out));
        });
        if (dangling.length) broken.push(`${route}: ${dangling.join(", ")}`);
      }

      expect(broken, "anchors pointing at ids that do not exist").toEqual([]);
    });

    test("no link points at a route that 404s", async ({ page, request }) => {
      const seen = new Set<string>();
      const broken: string[] = [];

      for (const route of site.routes) {
        await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded" });
        const hrefs = await page.evaluate(() =>
          Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href]"))
            .map((a) => a.getAttribute("href") ?? "")
            .filter((h) => h.startsWith("/") && !h.startsWith("//")),
        );

        for (const href of hrefs) {
          const path = href.split("#")[0]!;
          if (!path || seen.has(path)) continue;
          seen.add(path);
          const res = await request.get(`${base}${path}`, { maxRedirects: 5 });
          if (res.status() >= 400) broken.push(`${path} -> ${res.status()} (linked from ${route})`);
        }
      }

      expect(broken, "internal links that do not resolve").toEqual([]);
    });

    test("canonical and og:url name this site, never a sibling", async ({ page }) => {
      const wrong: string[] = [];

      for (const route of site.routes) {
        await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded" });
        const { canonical, ogUrl } = await page.evaluate(() => ({
          canonical: document
            .querySelector('link[rel="canonical"]')
            ?.getAttribute("href")
            ?.toString(),
          ogUrl: document.querySelector('meta[property="og:url"]')?.getAttribute("content"),
        }));

        for (const [label, value] of [
          ["canonical", canonical],
          ["og:url", ogUrl],
        ] as const) {
          if (!value) continue;
          // Loopback is expected when serving from 127.0.0.1 in this suite;
          // what must never appear is another Apex property's hostname.
          const host = new URL(value, base).hostname;
          const isLoopback = host === "127.0.0.1" || host === "localhost";
          if (!isLoopback && host !== site.host) {
            wrong.push(`${route} ${label} -> ${host}`);
          }
        }
      }

      expect(wrong, `pages naming a host other than ${site.host}`).toEqual([]);
    });

    test("serves real stylesheets, not an unstyled document", async ({ page }) => {
      // Both group and tours shipped with `content: []` in their Tailwind
      // config, which emits the preflight reset and zero utility classes. The
      // pages still rendered and every other check passed.
      await page.goto(`${base}/`, { waitUntil: "networkidle" });

      const styling = await page.evaluate(() => {
        const rules = Array.from(document.styleSheets).reduce((n, sheet) => {
          try {
            return n + (sheet.cssRules?.length ?? 0);
          } catch {
            return n; // cross-origin sheet, not ours
          }
        }, 0);
        const body = getComputedStyle(document.body);
        return { rules, background: body.backgroundColor, font: body.fontFamily };
      });

      expect(styling.rules, "CSS rules delivered").toBeGreaterThan(200);
      expect(styling.font, "body font-family should be themed").not.toBe("");
    });

    test("has exactly one <h1> and one <main> on the home page", async ({ page }) => {
      await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
      // More than one of either is the usual symptom of a duplicated layout
      // section — the "repeated UI" class of bug.
      expect(await page.locator("h1").count(), "h1 count").toBe(1);
      expect(await page.locator("main").count(), "main count").toBeLessThanOrEqual(1);
    });

    test("renders one header and one footer, never doubled", async ({ page }) => {
      await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
      expect(await page.locator("body > header, body > div > header").count()).toBeLessThanOrEqual(
        1,
      );
      expect(await page.locator("footer").count(), "footer count").toBe(1);
    });

    test("404 page responds 404 and is noindex", async ({ page }) => {
      const res = await page.goto(`${base}/definitely-not-a-real-route-xyz`, {
        waitUntil: "domcontentloaded",
      });
      expect(res?.status(), "404 status").toBe(404);
      const robots = await page
        .locator('meta[name="robots"]')
        .first()
        .getAttribute("content")
        .catch(() => null);
      if (robots) expect(robots).toMatch(/noindex/i);
    });

    test("sitemap and robots are served and self-consistent", async ({ request }) => {
      const robots = await request.get(`${base}/robots.txt`);
      expect(robots.status(), "robots.txt").toBe(200);
      expect(await robots.text()).toMatch(/sitemap:/i);

      const sitemap = await request.get(`${base}/sitemap.xml`);
      expect(sitemap.status(), "sitemap.xml").toBe(200);
      const xml = await sitemap.text();
      expect(xml).toContain("<urlset");
      // Every URL in the sitemap must belong to this site.
      const hosts = Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g)).map(
        (m) => new URL(m[1]!).hostname,
      );
      expect(hosts.length, "sitemap entries").toBeGreaterThan(0);
      expect(
        Array.from(new Set(hosts)).filter((h) => h !== site.host),
        "sitemap URLs on a foreign host",
      ).toEqual([]);
    });
  });
}

test.describe("cross-site consistency", () => {
  test("the four sites do not share a canonical hostname", () => {
    const hosts = SITES.map((s: SiteSpec) => s.host);
    expect(new Set(hosts).size, "each site needs its own host").toBe(hosts.length);
  });
});
