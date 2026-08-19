import type { MetadataRoute } from "next";
import { url } from "@/lib/site-url";
import { insights } from "@/data/insights";
import { events } from "@/data/events";

/**
 * The sitemap was a hand-typed list of 19 routes with no `lastModified` and no
 * dynamic generation at all, so every published insight and every event was
 * invisible to it — the two sections that actually grow. It also omitted
 * /cookies and /disclaimer.
 *
 * Insights and events are now generated from the same data modules the pages
 * render from, so a new article or event cannot ship without entering the
 * sitemap. Follows the pattern already used by apps/holdings.
 */
const STATIC_ROUTES = [
  "/",
  "/about",
  "/leadership",
  "/companies",
  "/companies/tech-solution",
  "/companies/outsourcing",
  "/companies/tours-travels",
  "/companies/holdings",
  "/consultancy",
  "/ecosystem",
  "/search",
  "/contact",
  "/partnerships",
  "/careers",
  "/insights",
  "/events",
  "/gallery",
  "/privacy",
  "/terms",
  "/cookies",
  "/disclaimer",
] as const;

/** Legal boilerplate ranks for nothing and should not compete with the rest. */
const LOW_PRIORITY = new Set<string>(["/privacy", "/terms", "/cookies", "/disclaimer"]);

/** A dated entry is more useful to a crawler than today's timestamp. */
function dateOf(value: string): Date {
  const parsed = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: url(route),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: route === "/" ? 1 : LOW_PRIORITY.has(route) ? 0.3 : 0.7,
  }));

  const insightEntries = insights.map((item) => ({
    url: url(`/insights/${item.slug}`),
    lastModified: dateOf(item.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const eventEntries = events.map((item) => ({
    url: url(`/events/${item.slug}`),
    lastModified: dateOf(item.endDate ?? item.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...insightEntries, ...eventEntries];
}
