import type { Metadata } from "next";
import { insights } from "@/data/content";

/**
 * Metadata for /insights/[slug].
 *
 * The page is a client component — it reads the slug with `useParams` — and a
 * client component cannot export `generateMetadata`. Without this every
 * article shipped the root layout's title and description, so all of them
 * looked identical to a crawler.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = insights.find((i) => i.slug === slug);
  if (!item) return { title: "Article not found" };
  return {
    title: item.title,
    description: item.excerpt.slice(0, 155),
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
