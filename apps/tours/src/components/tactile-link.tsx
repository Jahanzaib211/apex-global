"use client";

import Link from "next/link";
import { useTactile } from "@apex/motion/tactile";

/**
 * A `next/link` with press physics.
 *
 * Kept as a thin local wrapper rather than living in `@apex/motion` because
 * the package must not depend on Next — each site brings its own router. The
 * physics, the ripple and the sheen all come from the shared hook, so a press
 * feels identical across the four properties.
 */
export function TactileLink({
  href,
  className,
  id,
  children,
  prefetch,
}: {
  href: string;
  className?: string;
  id?: string;
  children: React.ReactNode;
  prefetch?: boolean;
}) {
  const { props, overlay } = useTactile();

  return (
    <Link href={href} id={id} className={className} prefetch={prefetch} {...props}>
      {children}
      {overlay}
    </Link>
  );
}
