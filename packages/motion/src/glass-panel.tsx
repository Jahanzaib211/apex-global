"use client";

import { useRef, useState } from "react";
import { EASE_OUT } from "./tokens";
import { usePrefersReducedMotion } from "./hooks";

/**
 * Multi-pass glass surface for hero content sitting over the spatial field.
 *
 * Three layers, because one blur on its own reads as a grey box:
 *   1. a backdrop blur with a slight saturation lift, so colour from the field
 *      bleeds through instead of being washed out;
 *   2. a fine noise overlay, which is what stops large blurred areas banding
 *      on 8-bit displays;
 *   3. a specular glare that tracks the pointer across the panel.
 *
 * `backdrop-filter` is the expensive part, so the panel opts out of it when the
 * visitor prefers reduced motion — at that point the effect is decoration with
 * a real cost and no payoff.
 */

export interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  /** Blur radius in px. */
  blur?: number;
  /** Base tint opacity, 0..1. */
  tint?: number;
  radius?: number;
}

/** 1px of monochrome noise, tiled. Inline so it costs no request. */
const NOISE_URI =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="140" height="140">
       <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3"/>
       <feColorMatrix type="saturate" values="0"/></filter>
       <rect width="140" height="140" filter="url(#n)" opacity="0.42"/>
     </svg>`,
  );

export function GlassPanel({
  children,
  className,
  blur = 18,
  tint = 0.08,
  radius = 20,
}: GlassPanelProps) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const frame = useRef(0);
  const [glare, setGlare] = useState({ x: 50, y: 0, on: false });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || frame.current) return;
    const { clientX, clientY, currentTarget } = e;
    const rect = currentTarget.getBoundingClientRect();
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      if (!rect.width || !rect.height) return;
      setGlare({
        x: ((clientX - rect.left) / rect.width) * 100,
        y: ((clientY - rect.top) / rect.height) * 100,
        on: true,
      });
    });
  };

  return (
    <div
      ref={ref}
      className={className}
      onPointerMove={onMove}
      onPointerLeave={() => setGlare((g) => ({ ...g, on: false }))}
      style={{
        position: "relative",
        borderRadius: radius,
        overflow: "hidden",
        background: `rgba(255,255,255,${tint})`,
        border: "1px solid rgba(255,255,255,0.14)",
        // Skipped under reduced motion: backdrop-filter forces the compositor
        // to re-blur on every scroll frame, which is a real cost to impose on
        // someone who has asked for less.
        backdropFilter: reduced ? undefined : `blur(${blur}px) saturate(140%)`,
        WebkitBackdropFilter: reduced ? undefined : `blur(${blur}px) saturate(140%)`,
        boxShadow: "0 24px 60px -30px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.10)",
      }}
    >
      {!reduced && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage: `url("${NOISE_URI}")`,
            backgroundSize: "140px 140px",
            opacity: 0.16,
            mixBlendMode: "overlay",
          }}
        />
      )}
      {!reduced && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: glare.on ? 1 : 0,
            transition: `opacity 320ms ${EASE_OUT}`,
            background: `radial-gradient(420px circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.16) 0%, transparent 60%)`,
          }}
        />
      )}
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}
