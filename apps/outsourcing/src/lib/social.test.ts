import { describe, expect, it } from "vitest";
import { SOCIAL } from "./social";

/**
 * Pins the footer social handles for Apex Outsourcing. The handles come from
 * `@apex/site-kit/social` and must match the canonical Apex group profiles
 * the migration agreed on. Drift here means the Outsourcing footer points
 * at the wrong LinkedIn/Facebook/Instagram page — a regression every visitor
 * sees.
 */
describe("Outsourcing footer socials", () => {
  it("LinkedIn points at the Apex Global Tech Solution company page", () => {
    expect(SOCIAL.linkedin.href).toBe("https://www.linkedin.com/company/apex-global-tech-solution");
  });

  it("Facebook uses the canonical Apex share link", () => {
    expect(SOCIAL.facebook.href).toBe("https://www.facebook.com/share/1F8H6VoshA");
  });

  it("Instagram points at the Apex handle rather than being omitted", () => {
    expect(SOCIAL.instagram.href).toBe("https://www.instagram.com/apexglobaltechsolution");
  });

  it("renders no platform Apex does not publish — every href is absolute", () => {
    // The footer degrades an empty href to a disabled "coming soon" pill, so
    // an accidental "" here silently hides a profile instead of failing.
    for (const [key, entry] of Object.entries(SOCIAL)) {
      expect(entry.href, `${key} href`).toMatch(/^https:\/\//);
    }
  });
});
