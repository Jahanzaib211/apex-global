"use client";

import { useEffect, useRef } from "react";
import {
  useAnimationFrame,
  useMounted,
  usePointerTracker,
  usePrefersReducedMotion,
  useWebGLSupport,
} from "./hooks";
import { hexToRgb, readPalette } from "./tokens";

/**
 * The spatial layer behind a hero: a depth-sorted particle field that responds
 * to cursor position, velocity and drag inertia.
 *
 * Written against raw WebGL2 rather than Three.js on purpose. Three would add
 * roughly 150 KB gzipped to a marketing page whose entire job is to load fast
 * and rank; everything here needs one vertex shader, one fragment shader and a
 * single instanced draw call. It is about 6 KB and has no dependency to keep
 * patched.
 *
 * It degrades in three steps, because a hero that fails to a blank rectangle is
 * worse than one that was never animated:
 *
 *   1. `prefers-reduced-motion` — renders the static gradient, no loop at all.
 *   2. No WebGL2 — renders the same static gradient.
 *   3. Context lost (GPU reset, tab backgrounded too long) — the gradient
 *      underneath is a real element, so the section keeps its composition.
 *
 * The loop is paused when the tab is hidden or the canvas scrolls out of view.
 */

const VERTEX_SHADER = `#version 300 es
precision highp float;

// One quad, instanced. a_corner is the corner of the sprite; a_seed carries
// the per-particle randomness so the CPU never has to touch a buffer again.
layout(location = 0) in vec2 a_corner;
layout(location = 1) in vec4 a_seed;   // x, y, depth, size

uniform vec2  u_resolution;
uniform vec2  u_pointer;      // 0..1, smoothed
uniform vec2  u_velocity;     // smoothed pointer velocity
uniform float u_time;         // seconds
uniform float u_intensity;    // 0..1 master fade

out float v_depth;
out vec2  v_uv;
out float v_glow;

void main() {
  float depth = a_seed.z;                 // 0 = far, 1 = near
  float scale = mix(0.35, 1.0, depth);

  // Slow ambient drift, so the field is alive before the pointer arrives.
  vec2 drift = vec2(
    sin(u_time * 0.08 + a_seed.x * 6.2831) * 0.015,
    cos(u_time * 0.11 + a_seed.y * 6.2831) * 0.015
  );

  // Parallax: near particles track the cursor further than far ones.
  vec2 toPointer = (u_pointer - 0.5) * mix(0.02, 0.13, depth);

  // Inertia: the field keeps leaning after a fast flick, then settles.
  vec2 lean = u_velocity * mix(0.004, 0.018, depth);

  vec2 pos = a_seed.xy + drift + toPointer + lean;
  pos = fract(pos);                       // wrap, so nothing ever empties out

  vec2 clip = pos * 2.0 - 1.0;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);

  float size = a_seed.w * scale * u_intensity;
  vec2 corner = a_corner * size;
  corner.x /= aspect;

  gl_Position = vec4(clip + corner, 0.0, 1.0);

  v_uv = a_corner;
  v_depth = depth;

  // Particles near the cursor brighten — the "specular" read.
  float d = distance(pos, u_pointer);
  v_glow = smoothstep(0.28, 0.0, d);
}`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

in float v_depth;
in vec2  v_uv;
in float v_glow;

uniform vec3  u_primary;
uniform vec3  u_accent;
uniform float u_intensity;

out vec4 outColor;

void main() {
  // Round sprite with a soft edge. Discarding outside the radius keeps the
  // overdraw down, which is most of the cost at this particle count.
  float r = length(v_uv);
  if (r > 1.0) discard;

  float alpha = smoothstep(1.0, 0.15, r);
  alpha *= mix(0.18, 0.75, v_depth);
  alpha *= u_intensity;

  vec3 color = mix(u_primary, u_accent, v_glow * 0.85 + v_depth * 0.15);
  color += u_accent * v_glow * 0.35;

  outColor = vec4(color, alpha * (0.55 + v_glow * 0.45));
}`;

/** Uniform locations, named so each read keeps its exact type. */
interface Uniforms {
  resolution: WebGLUniformLocation | null;
  pointer: WebGLUniformLocation | null;
  velocity: WebGLUniformLocation | null;
  time: WebGLUniformLocation | null;
  intensity: WebGLUniformLocation | null;
  primary: WebGLUniformLocation | null;
  accent: WebGLUniformLocation | null;
}

function compile(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    // Surfacing this matters: a shader that fails to compile renders nothing,
    // which looks identical to "the section is meant to be empty".
    console.error("[apex-motion] shader compile failed:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function link(
  gl: WebGL2RenderingContext,
  vertexSource: string,
  fragmentSource: string,
): WebGLProgram | null {
  const vs = compile(gl, gl.VERTEX_SHADER, vertexSource);
  const fs = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
  if (!vs || !fs) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("[apex-motion] program link failed:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

export interface SpatialCanvasProps {
  /**
   * Particle count. The default is tuned for a 60fps floor on integrated
   * graphics; it is halved automatically on coarse pointers (phones), where
   * the effect is less visible and the thermal budget is smaller.
   */
  density?: number;
  /** Master opacity of the field, 0..1. */
  intensity?: number;
  className?: string;
  /**
   * DOM id. Defaults to `sovereign-viewport`, which the E2E suite asserts on.
   * Override only if a page needs two fields.
   */
  id?: string;
}

export function SpatialCanvas({
  density = 720,
  intensity = 1,
  className,
  id = "sovereign-viewport",
}: SpatialCanvasProps) {
  const mounted = useMounted();
  const reducedMotion = usePrefersReducedMotion();
  const webgl = useWebGLSupport();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const { ref: pointerRef, pointer } = usePointerTracker<HTMLDivElement>(!reducedMotion);

  // Smoothed values live in a ref: updating state per frame would re-render the
  // whole hero 60 times a second.
  const smoothed = useRef({ x: 0.5, y: 0.5, vx: 0, vy: 0, fade: 0 });
  const glState = useRef<{
    gl: WebGL2RenderingContext;
    program: WebGLProgram;
    vao: WebGLVertexArrayObject;
    count: number;
    uniforms: Uniforms;
    lost: boolean;
  } | null>(null);

  const active = mounted && !reducedMotion && webgl === true;

  // Set up GL once the component is allowed to animate.
  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: false, // sprites are already soft-edged; MSAA is pure cost here
      depth: false,
      powerPreference: "low-power",
      premultipliedAlpha: false,
    });
    if (!gl) return;

    const program = link(gl, VERTEX_SHADER, FRAGMENT_SHADER);
    if (!program) return;

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const count = Math.max(120, Math.floor(coarse ? density / 2 : density));

    const vao = gl.createVertexArray();
    if (!vao) return;
    gl.bindVertexArray(vao);

    // Static unit quad, drawn as a triangle strip.
    const quad = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    // Per-particle seeds, uploaded once. The shader derives all motion from
    // these plus time, so there is no per-frame buffer traffic.
    const seeds = new Float32Array(count * 4);
    for (let i = 0; i < count; i++) {
      const depth = Math.pow(Math.random(), 1.7); // bias toward the far plane
      seeds[i * 4 + 0] = Math.random();
      seeds[i * 4 + 1] = Math.random();
      seeds[i * 4 + 2] = depth;
      seeds[i * 4 + 3] = (0.0016 + Math.random() * 0.0042) * (0.6 + depth);
    }
    const seedBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, seedBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, seeds, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(1, 1);

    gl.bindVertexArray(null);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE); // additive: particles accumulate light

    const palette = readPalette(host);
    const primary = hexToRgb(palette.primary) ?? [0.04, 0.11, 0.23];
    const accent = hexToRgb(palette.accent) ?? [0.78, 0.61, 0.24];

    gl.useProgram(program);
    const uniforms: Uniforms = {
      resolution: gl.getUniformLocation(program, "u_resolution"),
      pointer: gl.getUniformLocation(program, "u_pointer"),
      velocity: gl.getUniformLocation(program, "u_velocity"),
      time: gl.getUniformLocation(program, "u_time"),
      intensity: gl.getUniformLocation(program, "u_intensity"),
      primary: gl.getUniformLocation(program, "u_primary"),
      accent: gl.getUniformLocation(program, "u_accent"),
    };
    gl.uniform3f(uniforms.primary, primary[0], primary[1], primary[2]);
    gl.uniform3f(uniforms.accent, accent[0], accent[1], accent[2]);

    glState.current = { gl, program, vao, count, uniforms, lost: false };

    // Resize with the device pixel ratio capped at 2. Beyond that the extra
    // fragments cost real frames and nobody can see the difference.
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const w = Math.max(1, Math.floor(host.clientWidth * dpr));
      const h = Math.max(1, Math.floor(host.clientHeight * dpr));
      if (canvas.width === w && canvas.height === h) return;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uniforms.resolution, w, h);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(host);

    const onLost = (e: Event) => {
      e.preventDefault();
      if (glState.current) glState.current.lost = true;
    };
    canvas.addEventListener("webglcontextlost", onLost);

    return () => {
      observer.disconnect();
      canvas.removeEventListener("webglcontextlost", onLost);
      gl.deleteBuffer(quadBuffer);
      gl.deleteBuffer(seedBuffer);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      glState.current = null;
    };
  }, [active, density]);

  useAnimationFrame(
    (delta, elapsed) => {
      const state = glState.current;
      if (!state || state.lost) return;
      const { gl, program, vao, count, uniforms } = state;

      const p = pointer.current;
      const s = smoothed.current;
      // Frame-rate-independent smoothing, so the feel is the same at 60 and 144.
      const k = 1 - Math.pow(0.001, delta / 1000);
      const targetX = p.inside ? p.x : 0.5;
      const targetY = p.inside ? p.y : 0.5;
      s.x += (targetX - s.x) * k;
      s.y += (targetY - s.y) * k;
      s.vx += ((p.inside ? p.vx : 0) - s.vx) * k;
      s.vy += ((p.inside ? p.vy : 0) - s.vy) * k;
      s.fade += (1 - s.fade) * (delta / 700); // fade the field in on first paint

      gl.useProgram(program);
      gl.bindVertexArray(vao);
      gl.uniform2f(uniforms.pointer, s.x, 1 - s.y); // GL's Y runs the other way
      gl.uniform2f(uniforms.velocity, s.vx, -s.vy);
      gl.uniform1f(uniforms.time, elapsed / 1000);
      gl.uniform1f(uniforms.intensity, Math.min(s.fade, 1) * intensity);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, count);
      gl.bindVertexArray(null);
    },
    active,
    hostRef,
  );

  return (
    <div
      ref={(node) => {
        hostRef.current = node;
        pointerRef.current = node;
      }}
      className={className}
      aria-hidden
      data-spatial={active ? "webgl" : "static"}
    >
      {/*
        The gradient is a real element, not a shader fallback. It is what the
        section looks like with reduced motion, without WebGL, and in the
        moment before the field fades in — so the composition never depends on
        the canvas succeeding.
      */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(120% 90% at 15% 10%, var(--apex-motion-primary, #0b1d3a) 0%, transparent 55%)," +
            "radial-gradient(90% 80% at 85% 25%, var(--apex-motion-accent, #c89b3c) 0%, transparent 45%)," +
            "var(--apex-motion-depth, #05101f)",
          opacity: 0.85,
        }}
      />
      {active && (
        <canvas
          id={id}
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            display: "block",
          }}
        />
      )}
    </div>
  );
}
