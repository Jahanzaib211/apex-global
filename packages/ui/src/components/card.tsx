import type { ReactNode } from "react";
import { cn } from "../lib/cn";

export interface CardProps {
  as?: "div" | "article" | "li";
  interactive?: boolean;
  inverse?: boolean;
  className?: string;
  children: ReactNode;
}

export function Card({
  as: Tag = "div",
  interactive = false,
  inverse = false,
  className,
  children,
}: CardProps) {
  return (
    <Tag
      className={cn(
        "relative rounded-[var(--radius-lg)] border p-6",
        inverse
          ? "border-[var(--border-inverse)] bg-[var(--color-navy-800)]"
          : "border-[var(--border-default)] bg-[var(--bg-raised)]",
        interactive &&
          "transition-[border-color,box-shadow,transform] duration-[var(--duration-base)] " +
            "ease-[var(--ease-out-quart)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]" +
            (inverse
              ? "hover:border-[var(--color-amber-500)]/40"
              : "hover:border-[var(--border-strong)]"),
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export interface StatProps {
  value: string;
  label: string;
  /**
   * Where the number comes from. Required by the credibility rules — a metric
   * without a traceable source does not go on the site.
   */
  source: string;
  inverse?: boolean;
  className?: string;
}

export function Stat({ value, label, source, inverse = false, className }: StatProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span
        className={cn(
          "font-display text-3xl font-semibold tracking-tight md:text-4xl",
          inverse ? "text-[var(--color-canvas-100)]" : "text-[var(--ink-primary)]",
        )}
      >
        {value}
      </span>
      <span
        className={cn(
          "text-sm font-medium",
          inverse ? "text-[var(--color-navy-200)]" : "text-[var(--ink-secondary)]",
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "text-2xs",
          inverse ? "text-[var(--color-slate-400)]" : "text-[var(--ink-muted)]",
        )}
        title="Source of this figure"
      >
        {source}
      </span>
    </div>
  );
}
