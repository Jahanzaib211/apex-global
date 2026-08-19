import type { Metadata } from "next";

/**
 * Metadata for /careers.
 *
 * The page itself is a client component (forms/filters), and a client
 * component cannot export `metadata` — which is why this route shipped the
 * root layout's title and description verbatim. A layout is a server
 * component, so the metadata lives here instead.
 */
export const metadata: Metadata = {
  // `default` rather than a bare string: a string title is consumed by the
  // parent template and passes `template: null` to child routes, which
  // stripped the "· Apex Holdings" suffix off every page beneath this one.
  title: { default: "Careers", template: "%s · Apex Holdings" },
  description:
    "Build a career at Apex Holdings. Open roles across sales, marketing, operations and project coordination.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
