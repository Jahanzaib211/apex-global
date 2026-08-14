import { describe, expect, it } from "vitest";
import { DEFAULT_PALETTE, MOTION, MOTION_VARS, SPRING, hexToRgb } from "./tokens";

describe("hexToRgb", () => {
  it("parses six-digit hex into normalised channels", () => {
    expect(hexToRgb("#ffffff")).toEqual([1, 1, 1]);
    expect(hexToRgb("#000000")).toEqual([0, 0, 0]);
  });

  it("expands three-digit shorthand", () => {
    expect(hexToRgb("#fff")).toEqual(hexToRgb("#ffffff"));
  });

  it("tolerates a missing hash and surrounding space", () => {
    expect(hexToRgb("  c89b3c ")).toEqual(hexToRgb("#c89b3c"));
  });

  // Returning null rather than NaN matters: a NaN uniform does not throw, it
  // silently renders the whole field black.
  it("returns null for anything it cannot parse", () => {
    for (const bad of ["", "#", "rgb(1,2,3)", "#12345", "#ggg", "var(--x)"]) {
      expect(hexToRgb(bad), bad).toBeNull();
    }
  });

  it("keeps every channel within 0..1", () => {
    const rgb = hexToRgb(DEFAULT_PALETTE.accent);
    expect(rgb).not.toBeNull();
    for (const c of rgb!) {
      expect(c).toBeGreaterThanOrEqual(0);
      expect(c).toBeLessThanOrEqual(1);
    }
  });
});

describe("palette defaults", () => {
  it("ships a parseable default for every slot", () => {
    for (const [slot, value] of Object.entries(DEFAULT_PALETTE)) {
      expect(hexToRgb(value), slot).not.toBeNull();
    }
  });

  it("names one custom property per palette slot", () => {
    expect(Object.keys(MOTION_VARS).sort()).toEqual(Object.keys(DEFAULT_PALETTE).sort());
  });

  it("uses the --apex-motion- prefix so site CSS cannot collide", () => {
    for (const name of Object.values(MOTION_VARS)) {
      expect(name.startsWith("--apex-motion-")).toBe(true);
    }
  });
});

describe("timings", () => {
  // Press must be faster than release, or the control reads as sticky.
  it("releases more slowly than it presses", () => {
    expect(MOTION.pressOut).toBeGreaterThan(MOTION.pressIn);
  });

  it("keeps every duration positive and finite", () => {
    for (const [key, value] of Object.entries(MOTION)) {
      expect(Number.isFinite(value), key).toBe(true);
      expect(value, key).toBeGreaterThan(0);
    }
  });

  it("uses an under-damped-but-settling spring", () => {
    // damping below the critical value 2*sqrt(k*m) gives a slight overshoot,
    // which is what reads as "sprung" rather than "eased".
    const critical = 2 * Math.sqrt(SPRING.stiffness * SPRING.mass);
    expect(SPRING.damping).toBeLessThan(critical);
    expect(SPRING.damping).toBeGreaterThan(critical * 0.5);
  });
});
