"use client";

import { useReducedMotion } from "motion/react";
import { useState } from "react";
import { TECH_SECTIONS } from "@/lib/tech-stack";

/**
 * Infinite, smooth horizontal marquee of the technologies the platform
 * actually operates, grouped into three labelled bands:
 *
 *   Security → Technologies → Next Frontier
 *
 * The track is duplicated once and translated so the loop is frame-perfect —
 * no visible "rewind". Each band gets a glitter label then its technologies,
 * with a soft neon glow on hover. Pure CSS animation (`marquee-scroll`),
 * paused on hover so a name can be read, and completely static under
 * `prefers-reduced-motion`.
 */
export function TechStackMarquee() {
  const reduceMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);

  if (reduceMotion) {
    return <StaticStrip />;
  }

  const sections = [...TECH_SECTIONS, ...TECH_SECTIONS];

  return (
    <div
      className="relative overflow-hidden border-y border-[var(--border-subtle)] bg-[var(--bg-sunken)] py-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[var(--bg-sunken)] to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[var(--bg-sunken)] to-transparent"
        aria-hidden
      />

      <div
        className="marquee-track flex w-max items-center gap-8"
        aria-hidden
        style={
          paused
            ? { animationPlayState: "paused" }
            : ({
                "--marquee-translate": "translateX(calc(-50% - 0.625rem))",
              } as React.CSSProperties)
        }
      >
        {sections.map((section, si) => (
          <ul key={`${section.label}-${si}`} className="flex items-center gap-3 whitespace-nowrap">
            <li className="flex items-center gap-3 rounded-full border border-[var(--color-amber-500)]/40 bg-[var(--bg-raised)] px-5 py-3">
              <span className="tech-glow text-sm font-bold tracking-[0.22em] text-[var(--color-amber-500)] uppercase">
                {section.label}
              </span>
            </li>
            {section.items.map((item) => (
              <li
                key={`${section.label}-${si}-${item}`}
                className="tech-item flex items-center gap-3 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-raised)] px-4 py-3 transition-colors"
              >
                <span className="text-base font-semibold text-[var(--ink-primary)]">{item}</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

function StaticStrip() {
  return (
    <div className="overflow-hidden border-y border-[var(--border-subtle)] bg-[var(--bg-sunken)] py-6">
      <div className="flex flex-col gap-4">
        {TECH_SECTIONS.map((section) => (
          <div key={section.label} className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-[var(--color-amber-500)]/40 bg-[var(--bg-raised)] px-4 py-2 text-xs font-bold tracking-[0.22em] text-[var(--color-amber-500)] uppercase">
              {section.label}
            </span>
            {section.items.map((item) => (
              <span
                key={item}
                className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-raised)] px-3 py-1.5 text-base text-[var(--ink-primary)]"
              >
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
