import type { Metadata } from "next";

/**
 * Metadata for /gallery. The page is a client component (lightbox state),
 * and a client component cannot export `metadata`, so it lives in this
 * layout instead.
 */
export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Moments from across Apex — projects, events and people from every company in the group.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
