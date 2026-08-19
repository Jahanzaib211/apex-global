import type { Metadata } from "next";
import { jsonLdProps } from "@apex/site-kit/json-ld";
import { jobPostingSchema, breadcrumbs } from "@/lib/structured-data";
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
    // `item.location` is "Lahore · Karachi · Islamabad" on most roles, which
    // pushed the title past 60 characters. The role name alone is the query.
    title: item.title,
    description: item.summary.slice(0, 155),
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
  const item = careers.find((c) => c.slug === slug);
  if (!item) return children;
  const schema = jobPostingSchema({
    title: item.title,
    summary: item.summary,
    department: item.department,
    location: item.location,
    type: item.type,
    slug: item.slug,
  });
  const trail = breadcrumbs([
    { name: "Careers", path: "/careers" },
    { name: item.title, path: `/careers/${item.slug}` },
  ]);
  return (
    <>
      <script type="application/ld+json" {...jsonLdProps(schema)} />
      <script type="application/ld+json" {...jsonLdProps(trail)} />
      {children}
    </>
  );
}
