import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "inverse";
export type ButtonSize = "sm" | "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap " +
  "rounded-[var(--radius-md)] transition-[background-color,border-color,color,box-shadow,transform] " +
  "duration-[var(--duration-fast)] ease-[var(--ease-out-quart)] " +
  "disabled:pointer-events-none disabled:opacity-50 active:translate-y-px";

/**
 * Amber is the accent, so `primary` is the only variant that uses it and there
 * should be one per view. Note the ink on amber is navy, never white: amber on
 * white text fails contrast badly (see docs/BRAND.md).
 */
const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--accent)] text-[var(--ink-on-accent)] hover:bg-[var(--accent-hover)] " +
    "shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]",
  secondary:
    "bg-transparent text-[var(--ink-primary)] border border-[var(--border-strong)] " +
    "hover:border-[var(--ink-primary)] hover:bg-[var(--bg-sunken)]",
  ghost:
    "bg-transparent text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] hover:bg-[var(--bg-sunken)]",
  inverse:
    "bg-[var(--color-canvas-0)] text-[var(--color-navy-900)] hover:bg-[var(--color-canvas-200)] " +
    "shadow-[var(--shadow-sm)]",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-13 px-7 text-base",
};

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}

export type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button type={type} className={cn(BASE, VARIANTS[variant], SIZES[size], className)} {...props}>
      {children}
    </button>
  );
}

export type ButtonLinkProps = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement>;

/** Same visual treatment for navigation. A link that navigates must be an <a>. */
export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <a className={cn(BASE, VARIANTS[variant], SIZES[size], className)} {...props}>
      {children}
    </a>
  );
}
