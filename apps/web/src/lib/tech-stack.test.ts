import { describe, expect, it } from "vitest";
import { TECH_SECTIONS, TECH_STACK } from "./tech-stack";

/**
 * The tech-stack data drives the homepage marquee and, by extension, what the
 * site publicly claims it operates. The credibility rule is that the stack
 * naming is honest: these assertions keep the constant structurally sound so
 * the marquee can never render broken or empty UI.
 */

describe("TECH_STACK", () => {
  it("lists a non-trivial set of technologies", () => {
    expect(TECH_STACK.length).toBeGreaterThanOrEqual(8);
  });

  it("orders the bands Security → Technologies → Next Frontier", () => {
    expect(TECH_SECTIONS.map((s) => s.label)).toEqual([
      "Security",
      "Technologies",
      "Next Frontier",
    ]);
  });

  it("has no duplicate names (duplicates would double-render in the marquee)", () => {
    const names = TECH_STACK.map((t) => t.name.toLowerCase());
    expect(new Set(names).size).toBe(names.length);
  });
  it("has no duplicate names within a single band", () => {
    for (const section of TECH_SECTIONS) {
      const names = section.items.map((n) => n.toLowerCase());
      expect(new Set(names).size).toBe(names.length);
    }
  });

  it("every band has a label, a blurb and more than zero items", () => {
    for (const section of TECH_SECTIONS) {
      expect(section.label.length).toBeGreaterThan(0);
      expect(section.blurb.length).toBeGreaterThan(0);
      expect(section.items.length).toBeGreaterThan(0);
    }
  });

  it("every flat entry carries a valid group", () => {
    for (const item of TECH_STACK) {
      expect(item.group.length).toBeGreaterThan(0);
      expect(item.name.length).toBeGreaterThan(0);
    }
  });
});
