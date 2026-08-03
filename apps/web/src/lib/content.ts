import { prisma } from "@apex/db";
import { cache } from "react";

/**
 * Read layer for the public site.
 *
 * Every query filters on `status: "LIVE"`. Draft and internal content is
 * invisible here by construction rather than by remembering a where clause —
 * this module is the only way `apps/web` reaches the database.
 */

export const getSettings = cache(async (): Promise<Record<string, string>> => {
  const rows = await prisma.setting.findMany();
  return Object.fromEntries(
    rows.map((r) => [r.key, typeof r.value === "string" ? r.value : JSON.stringify(r.value)]),
  );
});

export const getSolutions = cache(async () =>
  prisma.solution.findMany({
    where: { status: "LIVE" },
    orderBy: { order: "asc" },
    select: {
      slug: true,
      name: true,
      tagline: true,
      summary: true,
      icon: true,
      outcomes: true,
    },
  }),
);

export const getSolution = cache(async (slug: string) =>
  prisma.solution.findFirst({
    where: { slug, status: "LIVE" },
    include: {
      seo: true,
      faqs: { where: { status: "LIVE" }, orderBy: { order: "asc" } },
      industries: { where: { status: "LIVE" }, select: { slug: true, name: true, tagline: true } },
      caseStudies: {
        where: { status: "LIVE" },
        select: { slug: true, title: true, summary: true, anonymousLabel: true, clientName: true },
      },
    },
  }),
);

export const getIndustries = cache(async () =>
  prisma.industry.findMany({
    where: { status: "LIVE" },
    orderBy: { order: "asc" },
    select: { slug: true, name: true, tagline: true, challenge: true },
  }),
);

export const getIndustry = cache(async (slug: string) =>
  prisma.industry.findFirst({
    where: { slug, status: "LIVE" },
    include: {
      seo: true,
      solutions: { where: { status: "LIVE" }, select: { slug: true, name: true, tagline: true } },
      caseStudies: {
        where: { status: "LIVE" },
        select: { slug: true, title: true, summary: true, anonymousLabel: true, clientName: true },
      },
    },
  }),
);

export const getProducts = cache(async () =>
  prisma.saasProduct.findMany({
    where: { status: "LIVE" },
    orderBy: { order: "asc" },
    select: {
      slug: true,
      name: true,
      tagline: true,
      summary: true,
      category: true,
      origin: true,
      upstreamName: true,
      upstreamUrl: true,
      upstreamLicense: true,
      demoAvailable: true,
      trialAvailable: true,
      isPubliclyReachable: true,
      publicUrl: true,
    },
  }),
);

export const getProduct = cache(async (slug: string) =>
  prisma.saasProduct.findFirst({
    where: { slug, status: "LIVE" },
    include: {
      seo: true,
      features: { orderBy: { order: "asc" } },
      screenshots: { orderBy: { order: "asc" } },
      plans: { orderBy: { order: "asc" }, include: { features: { orderBy: { order: "asc" } } } },
      integrations: { orderBy: { order: "asc" } },
      faqs: { where: { status: "LIVE" }, orderBy: { order: "asc" } },
    },
  }),
);

export const getTechProof = cache(async () =>
  prisma.techProofEntry.findMany({
    where: { status: "LIVE" },
    orderBy: { order: "asc" },
    include: { evidence: { orderBy: { order: "asc" } } },
  }),
);

export const getCaseStudies = cache(async () =>
  prisma.caseStudy.findMany({
    where: { status: "LIVE" },
    orderBy: { publishedAt: "desc" },
    include: {
      metrics: { orderBy: { order: "asc" } },
      industry: { select: { slug: true, name: true } },
      solutions: { select: { slug: true, name: true } },
    },
  }),
);

export const getCaseStudy = cache(async (slug: string) =>
  prisma.caseStudy.findFirst({
    where: { slug, status: "LIVE" },
    include: {
      seo: true,
      metrics: { orderBy: { order: "asc" } },
      industry: { select: { slug: true, name: true } },
      solutions: { select: { slug: true, name: true } },
    },
  }),
);

export const getInsights = cache(async () =>
  prisma.insight.findMany({
    where: { status: "LIVE" },
    orderBy: { publishedAt: "desc" },
    select: {
      slug: true,
      title: true,
      excerpt: true,
      category: true,
      readingMinutes: true,
      authorName: true,
      publishedAt: true,
    },
  }),
);

export const getInsight = cache(async (slug: string) =>
  prisma.insight.findFirst({ where: { slug, status: "LIVE" }, include: { seo: true } }),
);

export const getJobs = cache(async () =>
  prisma.jobPosting.findMany({
    where: { status: "LIVE" },
    orderBy: { publishedAt: "desc" },
  }),
);

export const getGeneralFaqs = cache(async () =>
  prisma.faq.findMany({
    where: { status: "LIVE", scope: "general" },
    orderBy: { order: "asc" },
  }),
);

export const getLandingPage = cache(async (slug: string) =>
  prisma.landingPage.findFirst({ where: { slug, status: "LIVE" } }),
);

export const getTestimonials = cache(async () =>
  prisma.testimonial.findMany({
    // Consent is checked here as well as in the audit. Two independent gates,
    // because this is the one that runs on every request.
    where: { status: "LIVE", consent: true },
    orderBy: { order: "asc" },
  }),
);

/** A case study's public name: the client only when consent is on record. */
export function displayClient(study: {
  clientName: string | null;
  clientConsent?: boolean;
  anonymousLabel: string;
}): string {
  return study.clientConsent && study.clientName ? study.clientName : study.anonymousLabel;
}
