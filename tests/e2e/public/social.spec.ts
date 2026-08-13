import { test, expect } from "@playwright/test";

/**
 * The footer brand column carries the group's public social channels.
 * Links were checked before wiring them in; Facebook cannot be verified
 * by bots (it blocks anonymous clients), so its share link is asserted
 * as shipped rather than fetched.
 */

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/apexglobaltechsolution" },
  { label: "Facebook", href: "https://www.facebook.com/share/1F8H6VoshA" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/apex-global-tech-solution" },
];

test.describe("Footer social links", () => {
  test("home footer lists every social channel with its logo", async ({ page }) => {
    await page.goto("/");
    const social = page.locator("footer ul[aria-label='Social']");
    await expect(social).toBeVisible();
    await expect(page.locator("footer")).toContainText("Follow us");
    await expect(social.locator("svg[aria-hidden='true']")).toHaveCount(SOCIAL_LINKS.length);
    for (const s of SOCIAL_LINKS) {
      const link = social.getByRole("link", { name: s.label });
      await expect(link).toBeVisible();
      await expect(link.locator("svg")).toHaveCount(1);
      await expect(link).toHaveAttribute("href", s.href);
      await expect(link).toHaveAttribute("target", "_blank");
    }
  });

  test("about footer mirrors the social channels", async ({ page }) => {
    await page.goto("/about");
    const social = page.locator("footer ul[aria-label='Social']");
    await expect(social).toBeVisible();
    for (const s of SOCIAL_LINKS) {
      await expect(social.getByRole("link", { name: s.label })).toBeVisible();
    }
  });
});
