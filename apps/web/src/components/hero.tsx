import type { CSSProperties } from "react";
import { ButtonLink, Mark } from "@apex/ui";
import Link from "next/link";

/**
 * Homepage hero.
 *
 * Server-rendered, zero JavaScript. The animated brand geometry is pure CSS on
 * an inline SVG — no canvas, no WebGL bundle, nothing that can push the LCP
 * past the 2.0s budget that paid traffic is billed against. Motion is confined
 * to a slow drift, a 3D glyph rain on a CSS perspective stage, and hairlines —
 * removed entirely under prefers-reduced-motion by the global rule in the
 * design system. The rain columns are absolutely positioned and `aria-hidden`:
 * purely decorative.
 */

/** Glyph columns on the 3D perspective stage. Depth is a translateZ: near
    columns are larger/brighter/faster, far columns recede, blur and dim. */
const MATRIX_COLUMNS = [
  {
    left: "6%",
    glyphs: "アイウエオカキクケコサシスセソ",
    depth: 60,
    speed: 12,
    opacity: 0.3,
    blur: "0px",
    size: 13,
  },
  {
    left: "22%",
    glyphs: "トナニヌネノハヒフヘホ",
    depth: -140,
    speed: 18,
    opacity: 0.18,
    blur: "1.2px",
    size: 11,
  },
  {
    left: "38%",
    glyphs: "マミムメモヤユヨ",
    depth: -40,
    speed: 14,
    opacity: 0.26,
    blur: "0.4px",
    size: 12,
  },
  {
    left: "55%",
    glyphs: "ラリルレロワヲン",
    depth: 80,
    speed: 13,
    opacity: 0.32,
    blur: "0px",
    size: 13,
  },
  {
    left: "72%",
    glyphs: "アイウエオカキクケコ",
    depth: -260,
    speed: 22,
    opacity: 0.14,
    blur: "2.2px",
    size: 10,
  },
  {
    left: "84%",
    glyphs: "ラリルレロワヲン01",
    depth: 40,
    speed: 12,
    opacity: 0.28,
    blur: "0.2px",
    size: 12,
  },
  {
    left: "94%",
    glyphs: "マミムメモヤユヨ012",
    depth: -180,
    speed: 20,
    opacity: 0.16,
    blur: "1.6px",
    size: 10,
  },
] as const;

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[var(--color-navy-900)] text-[var(--color-canvas-100)]">
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 -z-10 opacity-40" />

      {/* 3D perspective stage for the glyph rain. */}
      <div aria-hidden className="hero-matrix-scene -z-10">
        {MATRIX_COLUMNS.map((col, i) => (
          <div
            key={i}
            className="hero-matrix-column"
            data-glyphs={col.glyphs}
            style={
              {
                left: col.left,
                "--col-depth": `${col.depth}px`,
                "--col-speed": `${col.speed}s`,
                "--col-opacity": col.opacity,
                "--col-blur": col.blur,
                "--col-size": `${col.size}px`,
                animationDelay: `${(i - 1) * -0.7}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>

      {/* Oversized brand mark as the backdrop. Decorative, hidden from AT. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 -right-[12%] -z-10 hidden w-[62%] -translate-y-1/2 opacity-[0.07] md:block"
      >
        <Mark variant="inverse" className="h-auto w-full" />
      </div>

      <div
        aria-hidden
        className="hero-glow pointer-events-none absolute -top-32 -left-32 -z-10 h-[28rem] w-[28rem] rounded-full opacity-25 blur-[120px]"
        style={{ background: "radial-gradient(circle, var(--color-amber-500), transparent 70%)" }}
      />

      {/* Amber aurora slowly rotating behind the copy. Decorative. */}
      <div
        aria-hidden
        className="hero-aurora pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[52rem] w-[52rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.09]"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, var(--color-amber-500) 60deg, transparent 140deg, var(--color-amber-400) 200deg, transparent 280deg)",
        }}
      />

      <div className="container-page relative py-20 md:py-26 lg:py-30">
        <div className="max-w-3xl">
          <p className="text-2xs mb-6 inline-flex items-center gap-2.5 rounded-full border border-[var(--border-inverse)] px-3.5 py-1.5 font-medium tracking-[0.16em] text-[var(--color-navy-200)] uppercase">
            <span className="hero-pulse h-1.5 w-1.5 rounded-full bg-[var(--color-amber-500)]" />
            Global SaaS &amp; technology company
          </p>

          <h1 className="text-4xl leading-[1.05] md:text-5xl lg:text-6xl">
            <span className="hero-shimmer-line">Global Technology.</span>
            <br />
            <span className="hero-shimmer-line">Intelligent Solutions.</span>
            <br />
            <span className="hero-glint">Built to Scale.</span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-[var(--color-navy-200)]">
            Apex Global Tech Solution builds SaaS products and delivers intelligent technology
            solutions across software, AI, cloud, cybersecurity and IT infrastructure — helping
            businesses operate smarter and scale faster.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="/contact" size="lg" className="cta-sheen">
              Talk to our technology team
            </ButtonLink>
            <ButtonLink href="/solutions" size="lg" variant="inverse" className="cta-sheen">
              Explore our solutions
            </ButtonLink>
            <Link
              href="/saas"
              className="inline-flex h-13 items-center px-2 text-base font-medium text-[var(--color-navy-200)] underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              Explore SaaS products →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
