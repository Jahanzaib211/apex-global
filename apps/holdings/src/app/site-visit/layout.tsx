import type { Metadata } from "next";

/**
 * Metadata for /site-visit.
 *
 * The page itself is a client component (forms/filters), and a client
 * component cannot export `metadata` — which is why this route shipped the
 * root layout's title and description verbatim. A layout is a server
 * component, so the metadata lives here instead.
 */
export const metadata: Metadata = {
  title: "Book a Site Visit",
  description:
    "Schedule a visit to any project in the Apex Holdings portfolio. Pick a project, a date and we will arrange the rest.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
