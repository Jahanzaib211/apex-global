import type { SVGProps } from "react";

/**
 * The Apex mark: an `A` peak crossed by three swept lines.
 * Rebuilt as vector from brand/logo-sheet.jpeg so it stays crisp at any size,
 * animates cleanly, and drives the favicon and OG images from one source.
 */

export type MarkVariant = "brand" | "inverse" | "mono";

const PEAK = "M56 4 L96 92 L78 92 L56 42 L34 92 L16 92 Z";

/** Three tapered ribbons sweeping up and to the right, nearest first. */
const SWEEPS = [
  "M4 92 C40 88 100 74 152 54 C104 80 48 92 26 92 Z",
  "M14 92 C52 84 108 62 154 38 C110 68 58 92 38 92 Z",
  "M30 92 C66 80 116 52 156 22 C118 56 74 92 54 92 Z",
];

const VARIANTS: Record<MarkVariant, { peak: string; sweeps: string[] }> = {
  brand: {
    peak: "var(--color-navy-500)",
    sweeps: ["var(--color-slate-500)", "var(--color-slate-600)", "var(--color-navy-950)"],
  },
  inverse: {
    peak: "var(--color-canvas-0)",
    sweeps: [
      "color-mix(in oklab, var(--color-canvas-0) 82%, transparent)",
      "color-mix(in oklab, var(--color-canvas-0) 64%, transparent)",
      "color-mix(in oklab, var(--color-canvas-0) 46%, transparent)",
    ],
  },
  mono: {
    peak: "currentColor",
    sweeps: ["currentColor", "currentColor", "currentColor"],
  },
};

export interface MarkProps extends Omit<SVGProps<SVGSVGElement>, "children"> {
  variant?: MarkVariant;
  /** Accessible label. Omit for decorative use next to the wordmark. */
  title?: string;
}

export function Mark({ variant = "brand", title, ...props }: MarkProps) {
  const palette = VARIANTS[variant];
  const decorative = !title;

  return (
    <svg
      viewBox="0 0 160 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={decorative ? "presentation" : "img"}
      aria-hidden={decorative || undefined}
      aria-label={title}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {SWEEPS.map((d, i) => (
        <path key={d} d={d} fill={palette.sweeps[i] ?? palette.peak} />
      ))}
      <path d={PEAK} fill={palette.peak} />
    </svg>
  );
}

export interface LogoProps {
  variant?: MarkVariant;
  /** Stacked reads better in footers; inline in headers. */
  orientation?: "inline" | "stacked";
  className?: string;
}

export function Logo({ variant = "brand", orientation = "inline", className }: LogoProps) {
  const stacked = orientation === "stacked";
  const ink = variant === "inverse" ? "text-[var(--color-canvas-0)]" : "text-[var(--color-navy-500)]";

  return (
    <span
      className={[
        "inline-flex items-center",
        stacked ? "flex-col gap-2" : "gap-2.5",
        className ?? "",
      ].join(" ")}
    >
      <Mark variant={variant} className={stacked ? "h-10 w-auto" : "h-7 w-auto"} />
      <span className={["flex flex-col leading-none", stacked ? "items-center" : ""].join(" ")}>
        <span
          className={[
            "font-display font-semibold tracking-tight",
            stacked ? "text-lg" : "text-[0.9375rem]",
            ink,
          ].join(" ")}
        >
          APEX GLOBAL
        </span>
        <span
          className={[
            "font-display font-medium",
            stacked ? "text-[0.625rem]" : "text-[0.5rem]",
            variant === "inverse" ? "text-[var(--color-navy-200)]" : "text-[var(--ink-muted)]",
          ].join(" ")}
          style={{ letterSpacing: "0.34em" }}
        >
          TECH SOLUTION
        </span>
      </span>
    </span>
  );
}
