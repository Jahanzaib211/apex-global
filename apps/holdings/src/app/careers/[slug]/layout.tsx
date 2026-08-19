import type { Metadata } from "next";
import { careers } from "@/data/content";

/**
 * Metadata for /careers/[slug].
 *
 * The page is a client component — it reads the slug with `useParams` — and a
 * client component cannot export `generateMetadata`. Without this every
 * role shipped the root layout's title and description, so all of them
 * looked identical to a crawler.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = careers.find((c) => c.slug === slug);
  if (!item) return { title: "Role not found" };
  return {
    title: `${item.title} — ${item.location}`,
    description: item.summary.slice(0, 155),
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
