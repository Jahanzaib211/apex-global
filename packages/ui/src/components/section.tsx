import type { ElementType, ReactNode } from "react";
import { cn } from "../lib/cn";

export type SectionTone = "page" | "raised" | "sunken" | "inverse";

const TONES: Record<SectionTone, string> = {
  page: "bg-[var(--bg-page)] text-[var(--ink-primary)]",
  raised: "bg-[var(--bg-raised)] text-[var(--ink-primary)]",
  sunken: "bg-[var(--bg-sunken)] text-[var(--ink-primary)]",
  inverse: "bg-[var(--color-navy-900)] text-[var(--color-canvas-100)]",
};

export interface SectionProps {
  tone?: SectionTone;
  /** Adds the hairline grid used behind dark sections. */
  grid?: boolean;
  id?: string;
  as?: ElementType;
  className?: string;
  innerClassName?: string;
  children: ReactNode;
}

export function Section({
  tone = "page",
  grid = false,
  id,
  as: Tag = "section",
  className,
  innerClassName,
  children,
}: SectionProps) {
  return (
    <Tag id={id} className={cn("relative isolate py-20 md:py-28", TONES[tone], className)}>
      {grid ? (
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 -z-10" />
      ) : null}
      <div className={cn("container-page", innerClassName)}>{children}</div>
    </Tag>
  );
}

export interface SectionHeadingProps {
  /** Small label above the title. Sets context in two or three words. */
  eyebrow?: string;
  title: ReactNode;
  /** One sentence. If it needs two, the section is doing too much. */
  lede?: ReactNode;
  align?: "left" | "center";
  inverse?: boolean;
  as?: "h1" | "h2" | "h3";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  inverse = false,
  as: Tag = "h2",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "mx-auto max-w-3xl items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <span
          className={cn(
            "text-2xs inline-flex items-center gap-2 font-semibold tracking-[0.18em] uppercase",
            inverse ? "text-[var(--color-amber-400)]" : "text-[var(--color-amber-700)]",
          )}
        >
          <span aria-hidden className="h-px w-6 bg-current opacity-60" />
          {eyebrow}
        </span>
      ) : null}

      <Tag
        className={cn(
          Tag === "h1" ? "text-4xl md:text-5xl lg:text-6xl" : "text-3xl md:text-4xl",
          inverse ? "text-[var(--color-canvas-100)]" : "text-[var(--ink-primary)]",
        )}
      >
        {title}
      </Tag>

      {lede ? (
        <p
          className={cn(
            "max-w-2xl text-lg",
            inverse ? "text-[var(--color-navy-200)]" : "text-[var(--ink-secondary)]",
          )}
        >
          {lede}
        </p>
      ) : null}
    </div>
  );
}
