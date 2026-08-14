"use client";

import { useState } from "react";

interface Props {
  variant?: "primary" | "secondary" | "outline-gold" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  /**
   * If `true`, the button is rendered as an `<a>` with smooth-scroll handling
   * plus `scroll-margin-top` accounting for the sticky header.
   */
  anchor?: boolean;
}

const BASE =
  "inline-flex items-center justify-center font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy disabled:opacity-50";

const VARIANTS = {
  primary: "bg-gold text-navy hover:bg-white",
  secondary: "bg-navy text-white border border-gold hover:bg-gold hover:text-navy",
  "outline-gold": "border border-gold bg-transparent text-gold hover:bg-gold hover:text-navy",
  ghost: "text-white hover:text-gold",
} as const;

const SIZES = {
  sm: "px-4 py-2 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-4 text-sm",
} as const;

/**
 * Replaces the original "Button" which used a static `<a>`. Same visual
 * treatment, but:
 *   - Anchors smoothly scroll to their target
 *   - Updates the URL hash without a jump-to-top flash
 *   - Honours `prefers-reduced-motion` (uses `auto` instead of `smooth`)
 */
export default function Button({
  variant = "primary",
  size = "md",
  href,
  onClick,
  anchor = false,
  className = "",
  children,
}: Props) {
  const cls = `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`.trim();
  const [hash, setHash] = useState<string | null>(null);

  if (href && (anchor || href.startsWith("#"))) {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!href.startsWith("#") || href.length <= 1) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const reduceMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      setHash(href);
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", href);
      }
    };

    return (
      <a
        href={href}
        onClick={handleClick}
        aria-current={hash === href ? "true" : undefined}
        className={cls}
      >
        {children}
      </a>
    );
  }

  if (href) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={cls}>
      {children}
    </button>
  );
}
