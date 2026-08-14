import type { MetadataRoute } from "next";
import { url } from "@/lib/site-url";
import { projects } from "@/data/projects";
import { careers, events, insights, services } from "@/data/content";

/**
 * The site shipped no sitemap at all, so 31 static routes plus every project,
 * insight, event, career and service detail page were left for crawlers to
 * discover by link-following alone.
 *
 * Dynamic sections are generated from the same data modules the pages render
 * from, so a new entry cannot be published without also appearing here.
 */
const STATIC_ROUTES = [
  "/",
  "/about",
  "/about/leadership",
  "/about/vision",
  "/about/why-apex",
  "/careers",
  "/contact",
  "/developments",
  "/developments/future-pipeline",
  "/developments/owned-projects",
  "/developments/vision",
  "/events",
  "/gallery",
  "/insights",
  "/partner",
  "/projects",
  "/projects/commercial",
  "/projects/mixed-use",
  "/projects/plots-apartments",
  "/projects/residential",
  "/services",
  "/site-visit",
  "/testimonials",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: url(route),
    lastModified,
    changeFrequency: "weekly" as const,
    priority: route === "/" ? 1 : 0.7,
  }));

  const dynamicEntries = [
    ...projects.map((p) => `/projects/${p.slug}`),
    ...insights.map((i) => `/insights/${i.slug}`),
    ...events.map((e) => `/events/${e.slug}`),
    ...careers.map((c) => `/careers/${c.slug}`),
    ...services.map((s) => `/services/${s.slug}`),
  ].map((path) => ({
    url: url(path),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...dynamicEntries];
}
