import type { ReactNode } from "react";

/** Layout-level container with the project's standard max-width. */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`container-x ${className}`}>{children}</div>;
}
