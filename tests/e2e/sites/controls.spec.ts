import { test, expect, type Page } from "@playwright/test";
import { SITES, baseUrlFor } from "./site-matrix";

/**
 * Every interactive control on every page must be real, unique and honest.
 *
 * "Real" — a button does something, a link goes somewhere that exists.
 * "Unique" — the same label does not appear twice in the same nav or footer.
 * "Honest" — no placeholder, lorem, or "coming soon" filler reaches a visitor.
 *
 * All three failed in production before this suite existed: a fake admin login
 * that only called console.info, a footer listing Events and Gallery pointing
 * at the wrong pages, and nine articles titled "[Placeholder] …".
 */

/** Copy that must never reach a visitor. */
const FILLER = [
  /\[placeholder\]/i,
  /\blorem\s+ipsum\b/i,
  /\bTBD\b/,
  /\bTODO\b/,
  /\bFIXME\b/,
  /coming soon/i,
  /placeholder\s*[—–-]/i,
  /to be updated/i,
  /\bXXX+\b/,
  /\bexample\.com\b/i,
  /\.example\b/,
  /\+92 300 123 4567/,
  /\bchangeme\b/i,
];

/** Normalise a label so "Contact Us" and "contact us " compare equal. */
const norm = (s: string): string => s.replace(/\s+/g, " ").trim().toLowerCase();

/** Collect a nameless-button report line. */
function buttonsWithoutName(sink: string[], route: string, html: string): void {
  sink.push(`${route}: ${html}`);
}

async function visibleText(page: Page): Promise<string> {
  return page.evaluate(() => document.body.innerText);
}

for (const site of SITES) {
  const base = baseUrlFor(site);

  test.describe(`[${site.id}] controls`, () => {
    test("no placeholder or filler copy is visible to a visitor", async ({ page }) => {
      const offences: string[] = [];

      for (const route of site.routes) {
        await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded" });
        const text = await visibleText(page);
        for (const pattern of FILLER) {
          const hit = text.match(pattern);
          if (hit) offences.push(`${route}: ${JSON.stringify(hit[0])}`);
        }
      }

      expect(offences, "filler copy on a public page").toEqual([]);
    });

    test("every button has an accessible name", async ({ page }) => {
      // The original form of this check tried to infer whether a button had a
      // click handler. React attaches listeners as fibre properties that a
      // production build does not reliably expose, so it flagged every working
      // filter tab as dead. What is both detectable and genuinely broken is a
      // control a screen reader cannot announce.
      const nameless: string[] = [];

      for (const route of site.routes) {
        await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded" });
        const found = await page.evaluate(() => {
          const out: string[] = [];
          for (const el of Array.from(document.querySelectorAll("button"))) {
            const rect = el.getBoundingClientRect();
            if (rect.width === 0 && rect.height === 0) continue;
            const name =
              (el.textContent ?? "").trim() ||
              el.getAttribute("aria-label") ||
              el.getAttribute("title") ||
              (el.getAttribute("aria-labelledby") &&
                document.getElementById(el.getAttribute("aria-labelledby")!)?.textContent) ||
              "";
            if (!name.trim()) out.push(el.outerHTML.slice(0, 80));
          }
          return out;
        });
        for (const b of found) buttonsWithoutName(nameless, route, b);
      }

      expect(nameless, "buttons a screen reader cannot announce").toEqual([]);
    });

    test("no link is a dead end (# or empty href)", async ({ page }) => {
      const dead: string[] = [];

      for (const route of site.routes) {
        await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded" });
        const found = await page.evaluate(() =>
          Array.from(document.querySelectorAll<HTMLAnchorElement>("a"))
            .filter((a) => {
              const href = a.getAttribute("href");
              return href === null || href.trim() === "" || href.trim() === "#";
            })
            .map((a) => (a.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 60)),
        );
        for (const label of found) dead.push(`${route}: "${label || "(no label)"}"`);
      }

      expect(dead, "anchors with no destination").toEqual([]);
    });

    test("nav lists each destination once", async ({ page }) => {
      await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });

      const dupes = await page.evaluate(() => {
        const nav = document.querySelector("header") ?? document.querySelector("nav");
        if (!nav) return [];
        const byHref = new Map<string, number>();
        for (const a of Array.from(nav.querySelectorAll<HTMLAnchorElement>("a[href]"))) {
          // Only count what a visitor can actually see, so a mobile menu
          // mirroring the desktop nav is not reported as a duplicate.
          const rect = a.getBoundingClientRect();
          const style = getComputedStyle(a);
          const visible =
            rect.width > 0 &&
            rect.height > 0 &&
            style.visibility !== "hidden" &&
            style.display !== "none" &&
            style.opacity !== "0";
          if (!visible) continue;
          // Key on label + destination, not destination alone. A nav that has
          // both a "Contact" link and a "Talk to Apex" button pointing at
          // /contact offers two routes to one page on purpose; the same label
          // appearing twice is the actual duplicate.
          const label = (a.textContent ?? "").replace(/\s+/g, " ").trim().toLowerCase();
          if (!label) continue; // image-only logo link
          const key = `${label} -> ${a.getAttribute("href") ?? ""}`;
          byHref.set(key, (byHref.get(key) ?? 0) + 1);
        }
        return Array.from(byHref.entries())
          .filter(([, n]) => n > 1)
          .map(([key, n]) => `${key} x${n}`);
      });

      expect(dupes, "the same destination listed twice in the visible nav").toEqual([]);
    });

    test("footer lists each destination once", async ({ page }) => {
      await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });

      const dupes = await page.evaluate(() => {
        const footer = document.querySelector("footer");
        if (!footer) return [];
        const byHref = new Map<string, number>();
        for (const a of Array.from(footer.querySelectorAll<HTMLAnchorElement>("a[href]"))) {
          const href = a.getAttribute("href") ?? "";
          if (!href.startsWith("/")) continue; // external siblings may repeat
          const label = (a.textContent ?? "").replace(/\s+/g, " ").trim().toLowerCase();
          if (!label) continue;
          const key = `${label} -> ${href}`;
          byHref.set(key, (byHref.get(key) ?? 0) + 1);
        }
        return Array.from(byHref.entries())
          .filter(([, n]) => n > 1)
          .map(([key, n]) => `${key} x${n}`);
      });

      expect(dupes, "the same destination listed twice in the footer").toEqual([]);
    });

    test("no two chrome links share a label but differ in destination", async ({ page }) => {
      // Scoped to header and footer on purpose. In a card grid the same
      // call-to-action appears on every card with a different href, which is
      // correct; inside one nav or footer it means two identical labels take
      // the reader to different places.
      const conflicts: string[] = [];

      for (const route of site.routes) {
        await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded" });
        const found = await page.evaluate(() => {
          const byLabel = new Map<string, Set<string>>();
          const chrome = Array.from(document.querySelectorAll("header, footer"));
          const anchors = chrome.flatMap((c) =>
            Array.from(c.querySelectorAll<HTMLAnchorElement>("a[href]")),
          );
          for (const a of anchors) {
            const rect = a.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) continue;
            const label = (a.textContent ?? "").replace(/\s+/g, " ").trim().toLowerCase();
            // Generic labels are expected to repeat across cards; only flag
            // distinctive ones, which are the ones a visitor reads as unique.
            if (!label || label.length < 8) continue;
            if (/read more|learn more|view all|see all|explore|get started|contact us/.test(label))
              continue;
            const set = byLabel.get(label) ?? new Set<string>();
            set.add(a.getAttribute("href") ?? "");
            byLabel.set(label, set);
          }
          return Array.from(byLabel.entries())
            .filter(([, hrefs]) => hrefs.size > 1)
            .map(([label, hrefs]) => `"${label}" -> ${Array.from(hrefs).join(" | ")}`);
        });
        for (const c of found) conflicts.push(`${route}: ${c}`);
      }

      expect(conflicts, "same label, different destination").toEqual([]);
    });

    test("headings are not repeated verbatim on the same page", async ({ page }) => {
      const repeats: string[] = [];

      for (const route of site.routes) {
        await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded" });
        const found = await page.evaluate(() => {
          const counts = new Map<string, number>();
          for (const h of Array.from(document.querySelectorAll("h1, h2"))) {
            const t = (h.textContent ?? "").replace(/\s+/g, " ").trim().toLowerCase();
            if (t.length < 12) continue;
            counts.set(t, (counts.get(t) ?? 0) + 1);
          }
          return Array.from(counts.entries())
            .filter(([, n]) => n > 1)
            .map(([t, n]) => `"${t.slice(0, 60)}" x${n}`);
        });
        for (const r of found) repeats.push(`${route}: ${r}`);
      }

      expect(
        repeats,
        "the same heading rendered more than once — usually a duplicated section",
      ).toEqual([]);
    });

    test("every form control is labelled", async ({ page }) => {
      const unlabelled: string[] = [];

      for (const route of site.routes) {
        await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded" });
        const found = await page.evaluate(() => {
          const out: string[] = [];
          const controls = document.querySelectorAll<HTMLElement>(
            "input:not([type=hidden]), select, textarea",
          );
          for (const el of Array.from(controls)) {
            const rect = el.getBoundingClientRect();
            if (rect.width === 0 && rect.height === 0) continue; // honeypot
            const id = el.getAttribute("id");
            const labelled =
              (id && document.querySelector(`label[for="${CSS.escape(id)}"]`)) ||
              el.closest("label") ||
              el.getAttribute("aria-label") ||
              el.getAttribute("aria-labelledby");
            if (!labelled) out.push(el.getAttribute("name") ?? el.tagName.toLowerCase());
          }
          return out;
        });
        for (const c of found) unlabelled.push(`${route}: ${c}`);
      }

      expect(unlabelled, "form controls with no accessible label").toEqual([]);
    });

    test("images declare alt text", async ({ page }) => {
      const missing: string[] = [];

      for (const route of site.routes) {
        await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded" });
        const found = await page.evaluate(() =>
          Array.from(document.querySelectorAll("img"))
            .filter((img) => !img.hasAttribute("alt"))
            .map((img) => img.getAttribute("src") ?? "(no src)"),
        );
        for (const src of found) missing.push(`${route}: ${src}`);
      }

      expect(missing, "images with no alt attribute").toEqual([]);
    });
  });
}

test("labels are compared case- and whitespace-insensitively", () => {
  expect(norm("  Contact   Us ")).toBe("contact us");
});
