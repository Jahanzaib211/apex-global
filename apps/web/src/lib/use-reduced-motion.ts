"use client";

import { useEffect, useState } from "react";

/**
 * Whether the visitor has asked for reduced motion.
 *
 * A local six-line hook rather than `useReducedMotion` from `motion/react`.
 * The marquee on the home page was the only thing importing `motion` there,
 * and pulling the whole animation library in for one media query put the
 * page over the 180 KB script budget in `.lighthouserc.json`. `LiveCode` on
 * the campaign route still uses `motion` properly, for actual animation.
 *
 * Returns `false` until the effect runs so the server and the first client
 * render agree — starting at `true` would swap the marquee for the static
 * strip on hydration and mismatch. The animation only begins after mount,
 * which is when this has its real answer.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  return reduced;
}
