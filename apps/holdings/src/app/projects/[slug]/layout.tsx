import type { Metadata } from "next";
import { projectBySlug } from "@/data/projects";

/**
 * Metadata for /projects/[slug].
 *
 * The page is a client component — it reads the slug with `useParams` — and a
 * client component cannot export `generateMetadata`. Without this every
 * project shipped the root layout's title and description, so all of them
 * looked identical to a crawler.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = projectBySlug(slug);
  if (!item) return { title: "Project not found" };
  return {
    title: `${item.name}, ${item.city}`,
    description: item.summary.slice(0, 155),
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
