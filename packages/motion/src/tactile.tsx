"use client";

import { useCallback, useRef, useState } from "react";
import { EASE_OUT, MOTION } from "./tokens";
import { usePrefersReducedMotion } from "./hooks";

/**
 * Press physics for anything clickable.
 *
 * Three things happen on press, and they are the difference between a control
 * that feels like software and one that feels like a physical button:
 *
 *   1. Compression — the surface scales down slightly and its shadow tightens,
 *      as though it moved toward the page.
 *   2. Specular highlight — a light source tracks the pointer across the face.
 *   3. Ripple — a single expanding circle from the exact contact point.
 *
 * The release is slower than the press, which is what reads as "sprung"
 * rather than "snapped".
 *
 * This is a hook rather than a component so a site can apply it to its own
 * button and link classes without adopting our markup. Everything it returns
 * is a prop bag you spread.
 */

export interface TactileOptions {
  /** Scale at full compression. */
  pressScale?: number;
  /** Draw the expanding ripple. */
  ripple?: boolean;
  /** Track a specular highlight under the pointer. */
  sheen?: boolean;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export function useTactile({ pressScale = 0.97, ripple = true, sheen = true }: TactileOptions = {}) {
  const reduced = usePrefersReducedMotion();
  const [pressed, setPressed] = useState(false);
  const [point, setPoint] = useState({ x: 50, y: 50, on: false });
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const nextId = useRef(0);
  const frame = useRef(0);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      setPressed(true);
      if (!ripple || reduced) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const id = nextId.current++;
      setRipples((rs) => [...rs, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
      // Drop the ripple once its animation has finished. Without this the
      // array grows for the lifetime of the page on a repeatedly-clicked
      // control.
      window.setTimeout(() => setRipples((rs) => rs.filter((r) => r.id !== id)), 620);
    },
    [ripple, reduced],
  );

  const release = useCallback(() => setPressed(false), []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (!sheen || reduced || frame.current) return;
      const { clientX, clientY, currentTarget } = e;
      const rect = currentTarget.getBoundingClientRect();
      frame.current = requestAnimationFrame(() => {
        frame.current = 0;
        if (!rect.width || !rect.height) return;
        setPoint({
          x: ((clientX - rect.left) / rect.width) * 100,
          y: ((clientY - rect.top) / rect.height) * 100,
          on: true,
        });
      });
    },
    [sheen, reduced],
  );

  const onPointerLeave = useCallback(() => {
    setPressed(false);
    setPoint((p) => ({ ...p, on: false }));
  }, []);

  if (reduced) {
    // No transform, no ripple, no listeners beyond what the control needs.
    return {
      props: {} as React.HTMLAttributes<HTMLElement>,
      overlay: null as React.ReactNode,
      pressed: false,
    };
  }

  const props: React.HTMLAttributes<HTMLElement> = {
    onPointerDown,
    onPointerUp: release,
    onPointerLeave,
    onPointerMove,
    style: {
      position: "relative",
      overflow: "hidden",
      transform: `scale(${pressed ? pressScale : 1})`,
      transition: `transform ${pressed ? MOTION.pressIn : MOTION.pressOut}ms ${EASE_OUT}, box-shadow ${MOTION.pressOut}ms ${EASE_OUT}`,
      willChange: "transform",
    },
  };

  const overlay = (
    <>
      {sheen && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: point.on ? 0.5 : 0,
            transition: `opacity 260ms ${EASE_OUT}`,
            background: `radial-gradient(circle at ${point.x}% ${point.y}%, rgba(255,255,255,0.55) 0%, transparent 55%)`,
          }}
        />
      )}
      {ripples.map((r) => (
        <span
          key={r.id}
          aria-hidden
          style={{
            position: "absolute",
            left: r.x,
            top: r.y,
            width: 8,
            height: 8,
            marginLeft: -4,
            marginTop: -4,
            borderRadius: "50%",
            pointerEvents: "none",
            background: "currentColor",
            opacity: 0.28,
            animation: `apex-ripple 600ms ${EASE_OUT} forwards`,
          }}
        />
      ))}
    </>
  );

  return { props, overlay, pressed };
}

/**
 * Keyframes for the ripple. Injected once; kept next to the hook that uses it
 * so the two cannot drift apart.
 */
const RIPPLE_STYLE_ID = "apex-tactile-ripple";
const RIPPLE_KEYFRAMES = `
@keyframes apex-ripple {
  from { transform: scale(1); opacity: 0.28; }
  to   { transform: scale(34); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  @keyframes apex-ripple { from { opacity: 0; } to { opacity: 0; } }
}
`;

if (typeof document !== "undefined" && !document.getElementById(RIPPLE_STYLE_ID)) {
  const style = document.createElement("style");
  style.id = RIPPLE_STYLE_ID;
  style.textContent = RIPPLE_KEYFRAMES;
  document.head.appendChild(style);
}

export interface TactileProps extends TactileOptions {
  children: React.ReactNode;
  className?: string;
  /** Renders as this element. Defaults to a button. */
  as?: "button" | "span" | "div";
  onClick?: React.MouseEventHandler<HTMLElement>;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  "aria-label"?: string;
  id?: string;
}

/** Ready-made wrapper for sites that do not want to wire the hook themselves. */
export function Tactile({
  children,
  className,
  as: Tag = "button",
  onClick,
  type = "button",
  disabled,
  id,
  "aria-label": ariaLabel,
  ...options
}: TactileProps) {
  const { props, overlay } = useTactile(options);
  const extra = Tag === "button" ? { type, disabled } : {};

  return (
    <Tag className={className} onClick={onClick} id={id} aria-label={ariaLabel} {...extra} {...props}>
      {children}
      {overlay}
    </Tag>
  );
}
