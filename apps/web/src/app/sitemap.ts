import { prisma } from "@apex/db";
import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

/**
 * Generated from published content only.
 *
 * Campaign pages under /lp are deliberately absent: they duplicate solution
 * copy and exist for paid traffic. Indexing them would put them in competition
 * with the pages that should actually rank. /thank-you is absent for the same
 * class of reason — it would rank for the brand and send organic visitors to a
 * dead end.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [solutions, industries, products, services, bundles, caseStudies, insights] =
    await Promise.all([
      prisma.solution.findMany({
        where: { status: "LIVE" },
        select: { slug: true, updatedAt: true },
      }),
      prisma.industry.findMany({
        where: { status: "LIVE" },
        select: { slug: true, updatedAt: true },
      }),
      prisma.saasProduct.findMany({
        where: { status: "LIVE" },
        select: { slug: true, updatedAt: true },
      }),
      prisma.service.findMany({
        where: { status: "LIVE" },
        select: { slug: true, updatedAt: true },
      }),
      prisma.serviceBundle.findMany({
        where: { status: "LIVE" },
        select: { slug: true, updatedAt: true },
      }),
      prisma.caseStudy.findMany({
        where: { status: "LIVE" },
        select: { slug: true, updatedAt: true },
      }),
      prisma.insight.findMany({
        where: { status: "LIVE" },
        select: { slug: true, updatedAt: true },
      }),
    ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/services"), changeFrequency: "weekly", priority: 0.95 },
    { url: absoluteUrl("/saas"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/solutions"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/technology"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/industries"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/case-studies"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/insights"), changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/careers"), changeFrequency: "weekly", priority: 0.5 },
    { url: absoluteUrl("/contact"), changeFrequency: "yearly", priority: 0.8 },
    { url: absoluteUrl("/legal"), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/legal/privacy"), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/legal/terms"), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/legal/user-agreement"), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/legal/cookies"), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/legal/data-processing"), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/legal/subprocessors"), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/legal/acceptable-use"), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/legal/subscription"), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/legal/accessibility"), changeFrequency: "yearly", priority: 0.2 },
    {
      url: absoluteUrl("/campaigns/module-1-architecture-design"),
      changeFrequency: "weekly",
      priority: 0.85,
    },
  ];

  // Real lastModified values, taken from the record. A sitemap where every
  // page changed today teaches a crawler to ignore the field.
  const entry =
    (prefix: string, priority: number) =>
    (row: { slug: string; updatedAt: Date }): MetadataRoute.Sitemap[number] => ({
      url: absoluteUrl(`${prefix}/${row.slug}`),
      lastModified: row.updatedAt,
      changeFrequency: "monthly" as const,
      priority,
    });

  return [
    ...staticPages,
    ...services.map(entry("/services", 0.85)),
    ...bundles.map((b) => ({
      url: absoluteUrl(`/services/bundles/${b.slug}`),
      lastModified: b.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    ...products.map(entry("/saas", 0.9)),
    ...solutions.map(entry("/solutions", 0.8)),
    ...industries.map(entry("/industries", 0.6)),
    ...caseStudies.map(entry("/case-studies", 0.7)),
    ...insights.map(entry("/insights", 0.6)),
  ];
}
