import type { Metadata } from "next";

/**
 * Metadata for /contact.
 *
 * The page itself is a client component (forms/filters), and a client
 * component cannot export `metadata` — which is why this route shipped the
 * root layout's title and description verbatim. A layout is a server
 * component, so the metadata lives here instead.
 */
export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to our team about a project, a partnership or a career. Offices in Lahore, Karachi and Islamabad.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
