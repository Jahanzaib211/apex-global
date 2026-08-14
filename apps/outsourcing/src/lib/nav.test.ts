import { describe, expect, it } from "vitest";
import { SERVICES } from "./nav";

/**
 * Pin the docx-mandated "Telesales" (one word) label across the data that
 * drives the navbar, services index, and per-service page links. Drift in any
 * of these is a regression of the Apex Web Tweaks 2026-08-13 item
 * ("Capitalization and Spelling for Telesales").
 */
describe("Telesales label", () => {
  it("uses the canonical 'Telesales' (one word) in the service title and short label", () => {
    const tele = SERVICES.find((s) => s.slug === "tele-sales");
    expect(tele).toBeDefined();
    expect(tele?.title).toBe("Telesales");
    expect(tele?.shortLabel).toBe("Telesales");
  });

  it("does not appear as 'Tele Sales' or 'tele sales' in any service", () => {
    for (const s of SERVICES) {
      expect(s.title).not.toMatch(/[Tt]ele [Ss]ales/);
      expect(s.shortLabel).not.toMatch(/[Tt]ele [Ss]ales/);
    }
  });
});
