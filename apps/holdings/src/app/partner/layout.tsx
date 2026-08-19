import type { Metadata } from "next";

/**
 * Metadata for /partner.
 *
 * The page itself is a client component (forms/filters), and a client
 * component cannot export `metadata` — which is why this route shipped the
 * root layout's title and description verbatim. A layout is a server
 * component, so the metadata lives here instead.
 */
export const metadata: Metadata = {
  title: "Partner With Us",
  description:
    "Strategic collaborations for developers, investors and channel partners looking to work with Apex Holdings.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
