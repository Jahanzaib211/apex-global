"use client";

import { usePrefersReducedMotion } from "./hooks";
import { MOTION } from "./tokens";

/**
 * A border that is a rotating conic gradient rather than a flat 1px line.
 *
 * The gradient lives in a `::before`-style layer masked to the border box, so
 * the sweep animates without repainting the card's contents. Only the gradient
 * angle changes, and it is driven by a registered custom property where the
 * browser supports one — that keeps the animation off the main thread. Where
 * `@property` is unavailable the element falls back to a static gradient
 * border, which still looks deliberate.
 *
 * With `prefers-reduced-motion` the sweep is frozen at a fixed angle.
 */

export interface LivingBorderProps {
  children: React.ReactNode;
  /** Corner radius in pixels; matches the wrapped element. */
  radius?: number;
  /** Border thickness in pixels. */
  width?: number;
  /** Sweep duration in ms. Longer reads as more premium. */
  duration?: number;
  /** Brighten the sweep on hover and keyboard focus. */
  interactive?: boolean;
  className?: string;
}

/**
 * Injected once per document. A registered custom property is the only way to
 * animate a gradient angle smoothly — without it the browser cannot
 * interpolate `--apex-angle` and the sweep jumps between keyframes.
 */
const STYLE_ID = "apex-living-border";
const STYLE_TEXT = `
@property --apex-angle {
  syntax: "<angle>";
  inherits: false;
  initial-value: 0deg;
}
@keyframes apex-border-spin {
  to { --apex-angle: 360deg; }
}
.apex-living-border {
  position: relative;
  isolation: isolate;
}
.apex-living-border::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: var(--apex-border-width, 1px);
  background: conic-gradient(
    from var(--apex-angle),
    transparent 0deg,
    var(--apex-motion-accent, #c89b3c) 60deg,
    var(--apex-motion-primary, #0b1d3a) 140deg,
    transparent 220deg,
    var(--apex-motion-accent, #c89b3c) 320deg,
    transparent 360deg
  );
  /* Mask to the border box only: the fill stays behind the content. */
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  mask-composite: exclude;
  animation: apex-border-spin var(--apex-border-duration, 6000ms) linear infinite;
  opacity: var(--apex-border-opacity, 0.55);
  transition: opacity 220ms cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
  z-index: 1;
}
.apex-living-border[data-interactive="true"]:hover::before,
.apex-living-border[data-interactive="true"]:focus-within::before {
  opacity: 1;
}
.apex-living-border[data-motion="reduced"]::before {
  animation: none;
  --apex-angle: 135deg;
}
@media (prefers-reduced-motion: reduce) {
  .apex-living-border::before { animation: none; --apex-angle: 135deg; }
}
`;

let injected = false;

function ensureStyles(): void {
  if (injected || typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) {
    injected = true;
    return;
  }
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = STYLE_TEXT;
  document.head.appendChild(style);
  injected = true;
}

export function LivingBorder({
  children,
  radius = 16,
  width = 1,
  duration = MOTION.borderSweep,
  interactive = true,
  className,
}: LivingBorderProps) {
  const reduced = usePrefersReducedMotion();
  // Injected during render rather than in an effect so the border is styled on
  // the first paint. It is idempotent and guarded for SSR.
  ensureStyles();

  return (
    <div
      className={["apex-living-border", className].filter(Boolean).join(" ")}
      data-interactive={interactive ? "true" : "false"}
      data-motion={reduced ? "reduced" : "full"}
      style={
        {
          borderRadius: radius,
          "--apex-border-width": `${width}px`,
          "--apex-border-duration": `${duration}ms`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
