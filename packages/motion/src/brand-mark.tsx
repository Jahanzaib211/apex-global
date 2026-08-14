"use client";

import { useRef, useState } from "react";
import { EASE_OUT, MOTION } from "./tokens";
import { usePrefersReducedMotion } from "./hooks";

/**
 * The brand mark, made responsive to cursor proximity.
 *
 * Wraps whatever logo a site already ships — an `<img>`, an inline `<svg>`,
 * a `next/image` — and adds a small 3D tilt toward the pointer plus a specular
 * sheen that tracks it. The logo itself is untouched, so a site keeps its own
 * artwork and its own alt text.
 *
 * Deliberately restrained: the tilt maxes out at 9 degrees. A logo that swings
 * dramatically reads as a toy, and this one sits in a header on every page of
 * a company that sells trust.
 *
 * With `prefers-reduced-motion` the wrapper renders as a plain span and no
 * listener is attached at all.
 */

export interface BrandMarkProps {
  children: React.ReactNode;
  /** Maximum tilt in degrees on each axis. */
  maxTilt?: number;
  /** Lift toward the viewer, in pixels, at full engagement. */
  lift?: number;
  className?: string;
  /** Overrides the default `brand-logo` test id. */
  testId?: string;
}

export function BrandMark({
  children,
  maxTilt = 9,
  lift = 6,
  className,
  testId = "brand-logo",
}: BrandMarkProps) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLSpanElement | null>(null);
  const frame = useRef(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0, gx: 50, gy: 50, on: false });

  if (reduced) {
    return (
      <span className={className} data-testid={testId} data-tilt="off">
        {children}
      </span>
    );
  }

  const onMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    const el = ref.current;
    if (!el) return;
    // One update per frame. pointermove outruns the compositor, and a state
    // update per event would re-render the header on every sample.
    if (frame.current) return;
    const { clientX, clientY } = e;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const px = (clientX - rect.left) / rect.width;
      const py = (clientY - rect.top) / rect.height;
      setTilt({
        // Invert Y so the mark leans toward the cursor rather than away.
        x: (0.5 - py) * 2 * maxTilt,
        y: (px - 0.5) * 2 * maxTilt,
        gx: px * 100,
        gy: py * 100,
        on: true,
      });
    });
  };

  const reset = () => {
    if (frame.current) {
      cancelAnimationFrame(frame.current);
      frame.current = 0;
    }
    setTilt({ x: 0, y: 0, gx: 50, gy: 50, on: false });
  };

  return (
    <span
      ref={ref}
      className={className}
      data-testid={testId}
      data-tilt={tilt.on ? "on" : "idle"}
      onPointerMove={onMove}
      onPointerLeave={reset}
      onBlur={reset}
      style={{
        display: "inline-block",
        position: "relative",
        transformStyle: "preserve-3d",
        perspective: 600,
        // `transform` and `opacity` only — both composited, so this never
        // triggers layout or paint on the main thread.
        transform: `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(${
          tilt.on ? lift : 0
        }px)`,
        transition: tilt.on
          ? `transform ${MOTION.tiltSettle}ms ${EASE_OUT}`
          : `transform ${MOTION.pressOut}ms ${EASE_OUT}`,
        willChange: "transform",
      }}
    >
      {children}
      {/*
        Specular sheen. Sits above the mark, ignores pointer events, and fades
        out entirely when the cursor leaves — so it can never obscure the logo
        for someone who is not interacting with it.
      */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          borderRadius: "inherit",
          opacity: tilt.on ? 1 : 0,
          transition: `opacity ${MOTION.tiltSettle}ms ${EASE_OUT}`,
          background: `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, var(--apex-motion-accent, #c89b3c) 0%, transparent 62%)`,
          mixBlendMode: "soft-light",
        }}
      />
    </span>
  );
}
