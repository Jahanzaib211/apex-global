"use client";

import Link from "next/link";
import { useTactile } from "@apex/motion/tactile";

/**
 * A `next/link` with press physics.
 *
 * A thin local wrapper rather than something in `@apex/motion`, because the
 * package deliberately does not depend on Next — each site brings its own
 * router. The physics, ripple and sheen come from the shared hook, so a press
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
