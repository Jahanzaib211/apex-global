import { describe, expect, it } from "vitest";
import { APEX_SOCIALS, selectSocials } from "./social";

describe("APEX_SOCIALS", () => {
  it("always has LinkedIn, Facebook, and Instagram at the group level", () => {
    const platforms = APEX_SOCIALS.map((s) => s.platform).sort();
    expect(platforms).toEqual(["facebook", "instagram", "linkedin"]);
  });

  it("every href is https with no trailing slash", () => {
    for (const s of APEX_SOCIALS) {
      expect(s.href.startsWith("https://")).toBe(true);
      expect(s.href.endsWith("/")).toBe(false);
    }
  });
});

describe("selectSocials", () => {
  it("returns the entries for the requested platforms only", () => {
    const only = selectSocials(["linkedin"]);
    expect(only).toHaveLength(1);
    expect(only[0]?.platform).toBe("linkedin");
  });

  it("returns an empty array when the site publishes nothing", () => {
    expect(selectSocials([])).toEqual([]);
  });

  it("preserves the canonical order regardless of caller request order", () => {
    const reversed = selectSocials(["instagram", "linkedin", "facebook"]);
    expect(reversed.map((s) => s.platform)).toEqual(["linkedin", "facebook", "instagram"]);
  });
});
