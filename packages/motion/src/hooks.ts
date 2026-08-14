"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SPRING } from "./tokens";

/**
 * Whether the visitor has asked for reduced motion.
 *
 * Starts `true` so that the very first paint — before the effect runs — is the
 * still version. Guessing "animate" and then stopping is the failure mode that
 * actually hurts people who set the preference.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  return reduced;
}

/**
 * True once the component has mounted on the client.
 *
 * Anything that reads window, WebGL support or a media query must render the
 * same output as the server until this flips, or hydration fails — which is
 * exactly the class of bug that had every icon on the Tours site mismatching.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

export interface PointerState {
  /** Position within the element, 0..1 on each axis. */
  readonly x: number;
  readonly y: number;
  /** Smoothed velocity in units per second, useful for inertia. */
  readonly vx: number;
  readonly vy: number;
  readonly inside: boolean;
}

const IDLE: PointerState = { x: 0.5, y: 0.5, vx: 0, vy: 0, inside: false };

/**
 * Track the pointer over an element, normalised and velocity-smoothed.
 *
 * Reads are throttled to one per animation frame: `pointermove` fires far more
 * often than the compositor paints, and doing work per event is how a hero
 * section drops below 60fps on a trackpad.
 *
 * The returned object is a ref, not state — a state update per frame would
 * re-render the whole subtree 60 times a second. Consumers read `.current`
 * inside their own rAF loop.
 */
export function usePointerTracker<T extends HTMLElement>(
  enabled = true,
): { ref: React.RefObject<T | null>; pointer: React.RefObject<PointerState> } {
  const ref = useRef<T | null>(null);
  const pointer = useRef<PointerState>(IDLE);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) {
      pointer.current = IDLE;
      return;
    }

    let frame = 0;
    let pending: { x: number; y: number } | null = null;
    let last = { x: 0.5, y: 0.5, t: performance.now() };

    const flush = () => {
      frame = 0;
      if (!pending) return;
      const now = performance.now();
      const dt = Math.max(now - last.t, 1) / 1000;
      const vx = (pending.x - last.x) / dt;
      const vy = (pending.y - last.y) / dt;
      // Blend velocity so a single jittery sample cannot snap the scene.
      pointer.current = {
        x: pending.x,
        y: pending.y,
        vx: pointer.current.vx * 0.7 + vx * 0.3,
        vy: pointer.current.vy * 0.7 + vy * 0.3,
        inside: true,
      };
      last = { x: pending.x, y: pending.y, t: now };
      pending = null;
    };

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      pending = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
      if (!frame) frame = requestAnimationFrame(flush);
    };

    const onLeave = () => {
      pointer.current = { ...pointer.current, inside: false, vx: 0, vy: 0 };
    };

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  return { ref, pointer };
}

/**
 * Run a callback on every animation frame while `active`.
 *
 * Pauses when the tab is hidden and when the element scrolls out of view —
 * a WebGL loop that keeps running off-screen is the main reason a "lightweight"
 * hero drains a laptop battery.
 */
export function useAnimationFrame(
  callback: (deltaMs: number, elapsedMs: number) => void,
  active: boolean,
  observe?: React.RefObject<Element | null>,
): void {
  const saved = useRef(callback);
  saved.current = callback;

  useEffect(() => {
    if (!active) return;

    let raf = 0;
    let start = 0;
    let previous = 0;
    let visible = true;
    let onScreen = true;

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || !onScreen) {
        previous = now;
        return;
      }
      if (!start) start = now;
      const delta = previous ? now - previous : 16.7;
      previous = now;
      // Clamp: after a tab regains focus the first delta can be seconds long,
      // which would teleport anything integrating against it.
      saved.current(Math.min(delta, 50), now - start);
    };

    const onVisibility = () => {
      visible = document.visibilityState === "visible";
      previous = 0;
    };
    document.addEventListener("visibilitychange", onVisibility);

    let io: IntersectionObserver | undefined;
    const target = observe?.current;
    if (target && typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          onScreen = entries.some((e) => e.isIntersecting);
          previous = 0;
        },
        { rootMargin: "120px" },
      );
      io.observe(target);
    }

    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
      io?.disconnect();
    };
  }, [active, observe]);
}

/**
 * A spring that drives a number toward a target.
 *
 * Returns the current value as state, so this is for a handful of springs —
 * a press, a tilt — not for something running on every frame of a particle
 * field. It settles and then stops scheduling frames.
 */
export function useSpring(target: number, enabled = true): number {
  const [value, setValue] = useState(target);
  const state = useRef({ value: target, velocity: 0 });

  useEffect(() => {
    if (!enabled) {
      state.current = { value: target, velocity: 0 };
      setValue(target);
      return;
    }

    let raf = 0;
    let previous = performance.now();

    const step = (now: number) => {
      const dt = Math.min((now - previous) / 1000, 0.05);
      previous = now;

      const { stiffness, damping, mass } = SPRING;
      const displacement = state.current.value - target;
      const force = -stiffness * displacement - damping * state.current.velocity;
      state.current.velocity += (force / mass) * dt;
      state.current.value += state.current.velocity * dt;

      const settled =
        Math.abs(state.current.value - target) < 0.001 && Math.abs(state.current.velocity) < 0.001;

      if (settled) {
        state.current = { value: target, velocity: 0 };
        setValue(target);
        return;
      }
      setValue(state.current.value);
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, enabled]);

  return value;
}

/** Whether this browser can give us a WebGL2 context at all. */
export function useWebGLSupport(): boolean | null {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2");
      setSupported(Boolean(gl));
      // Release the context immediately; browsers cap how many may exist.
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      setSupported(false);
    }
  }, []);

  return supported;
}

/** Stable callback identity without re-running effects that depend on it. */
export function useEvent<A extends unknown[], R>(fn: (...args: A) => R): (...args: A) => R {
  const ref = useRef(fn);
  ref.current = fn;
  return useCallback((...args: A) => ref.current(...args), []);
}
