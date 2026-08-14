/**
 * The motion system's shared vocabulary.
 *
 * Every Apex site keeps its own palette — Tours is navy and gold, Holdings is
 * a colder navy, Outsourcing is amber — so this package never hard-codes a
 * colour. It reads CSS custom properties the site sets once, which is what
 * lets four sites share one interaction language without looking identical.
 *
 * A site opts in by setting these on `:root` (or any ancestor of the
 * components). Missing values fall back to the defaults below, so a site that
 * sets nothing still renders correctly rather than transparent.
 */

/** CSS custom properties this package reads. */
export const MOTION_VARS = {
  /** Primary brand colour. Drives the spatial field's base hue. */
  primary: "--apex-motion-primary",
  /** Accent colour. Drives highlights, glare and the living border sweep. */
  accent: "--apex-motion-accent",
  /** Deep background the spatial field sits on. */
  depth: "--apex-motion-depth",
} as const;

export interface MotionPalette {
  readonly primary: string;
  readonly accent: string;
  readonly depth: string;
}

/** Apex group defaults, used when a site sets no custom properties. */
export const DEFAULT_PALETTE: MotionPalette = {
  primary: "#0b1d3a",
  accent: "#c89b3c",
  depth: "#05101f",
};

/**
 * Durations and easings, in one place so a card, a button and the hero all
 * settle at the same rate. Values are milliseconds.
 */
export const MOTION = {
  /** Pointer-follow smoothing. Lower is snappier. */
  pointerLerp: 0.12,
  /** Press-down compression. Deliberately faster than the release. */
  pressIn: 90,
  /** Release, which overshoots slightly via the spring below. */
  pressOut: 420,
  /** Border sweep, one full rotation. */
  borderSweep: 6000,
  /** Tilt settle. */
  tiltSettle: 260,
} as const;

/**
 * Critically-damped-ish spring used by the tactile primitives.
 *
 * Tuned by feel rather than physics: stiff enough to arrive quickly, damped
 * enough that a fast repeated click does not visibly wobble.
 */
export const SPRING = { stiffness: 340, damping: 26, mass: 1 } as const;

/** Standard easing for anything that is not spring-driven. */
export const EASE_OUT = "cubic-bezier(0.16, 1, 0.3, 1)";

/**
 * Parse a hex colour into normalised RGB for a shader uniform.
 *
 * Accepts `#rgb` and `#rrggbb`. Anything else returns null so the caller can
 * fall back rather than upload NaN into a uniform, which silently renders
 * black.
 */
export function hexToRgb(hex: string): readonly [number, number, number] | null {
  const value = hex.trim().replace(/^#/, "");
  const full =
    value.length === 3
      ? value
          .split("")
          .map((c) => c + c)
          .join("")
      : value;
  if (!/^[0-9a-f]{6}$/i.test(full)) return null;
  return [
    parseInt(full.slice(0, 2), 16) / 255,
    parseInt(full.slice(2, 4), 16) / 255,
    parseInt(full.slice(4, 6), 16) / 255,
  ] as const;
}

/** Read the site's palette from CSS custom properties, with fallbacks. */
export function readPalette(el: Element): MotionPalette {
  const styles = getComputedStyle(el);
  const pick = (name: string, fallback: string): string => {
    const v = styles.getPropertyValue(name).trim();
    return v.length > 0 ? v : fallback;
  };
  return {
    primary: pick(MOTION_VARS.primary, DEFAULT_PALETTE.primary),
    accent: pick(MOTION_VARS.accent, DEFAULT_PALETTE.accent),
    depth: pick(MOTION_VARS.depth, DEFAULT_PALETTE.depth),
  };
}
