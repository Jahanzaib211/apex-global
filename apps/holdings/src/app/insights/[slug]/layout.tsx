import type { Metadata } from "next";
import { jsonLdProps } from "@apex/site-kit/json-ld";
import { articleSchema, breadcrumbs } from "@/lib/structured-data";
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

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = insights.find((i) => i.slug === slug);
  if (!item) return children;
  const schema = articleSchema({
    title: item.title,
    excerpt: item.excerpt,
    author: item.author,
    date: item.date,
    slug: item.slug,
  });
  const trail = breadcrumbs([
    { name: "Insights", path: "/insights" },
    { name: item.title, path: `/insights/${item.slug}` },
  ]);
  return (
    <>
      <script type="application/ld+json" {...jsonLdProps(schema)} />
      <script type="application/ld+json" {...jsonLdProps(trail)} />
      {children}
    </>
  );
}
