import { test, expect } from "@playwright/test";

/**
 * The Apex group of companies — the footer "Group" column lists each
 * company in the group once (source of truth: /technology live endpoints).
 * Walk it like a visitor: home page → footer → open each company site.
 * Apex is the main brand at the top; no internal entities appear here.
 */

const GROUP_LINKS = [
  { label: "Apex Group of Companies", href: "https://apex.apexgroupcompanies.com" },
  { label: "Apex Global Tech Solution", href: "/" },
  { label: "Apex Cloud", href: "https://cloud.apexgroupcompanies.com" },
  { label: "Apex Tours", href: "https://tours.apexgroupcompanies.com" },
  { label: "Apex Outsourcing", href: "https://outsourcing.apexgroupcompanies.com" },
  { label: "Apex Holdings", href: "https://holdings.apexgroupcompanies.com" },
];

test.describe("Group companies", () => {
  test("home page footer lists each group company exactly once", async ({ page }) => {
    await page.goto("/");
    const groupColumn = page.locator("footer nav[aria-label='Group']");
    await expect(groupColumn).toBeVisible();

    const labels = await groupColumn.locator("a").allTextContents();
    const seen = new Set<string>();
    for (const label of labels) {
      test.step(`no duplicate ${label.trim()}`, () => {
        expect(seen.has(label.trim()), `"${label}" listed a second time`).toBe(false);
        seen.add(label.trim());
      });
    }

    for (const c of GROUP_LINKS) {
      const link = groupColumn.getByRole("link", { name: c.label, exact: true });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute("href", c.href);
    }
  });

  test("footer keeps Apex as the main brand and the partner framing as on the homepage", async ({
    page,
  }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer).toContainText("Apex Global Tech Solution");
    await expect(footer.getByText(/Engineering partner:/)).toBeVisible();
    await expect(footer).not.toContainText("ALI Labs");
    await expect(footer).not.toContainText("nova.alilabsx.com");
  });

  for (const c of GROUP_LINKS) {
    test(`group company site ${c.label} is reachable`, async ({ page }) => {
      const res = await page.request.get(c.href, { timeout: 15_000 });
      expect(res.ok(), `${c.href} should return 2xx`).toBeTruthy();
    });
  }
});
