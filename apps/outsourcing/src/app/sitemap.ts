import type { MetadataRoute } from "next";
import { SERVICES } from "@/lib/nav";
import { absoluteUrl } from "@/lib/brand";

/**
 * The four legal routes — /privacy, /terms, /cookies and /security — existed as
 * pages but were absent from the sitemap. /security in particular is a page
 * buyers look for by name.
 *
 * The file previously ended with `void SERVICE_SLUGS; void BRAND;` to silence
 * unused-import warnings; the imports are simply gone instead.
 */
const STATIC_ROUTES = [
  "/",
  "/about",
  "/services",
  "/industries",
  "/case-studies",
  "/careers",
  "/insights",
  "/contact",
  "/security",
  "/privacy",
  "/terms",
  "/cookies",
] as const;

const LOW_PRIORITY = new Set<string>(["/privacy", "/terms", "/cookies"]);

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes = STATIC_ROUTES.map((path) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : LOW_PRIORITY.has(path) ? 0.3 : 0.8,
  }));

  const serviceRoutes = SERVICES.map((s) => ({
    url: absoluteUrl(s.href),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...serviceRoutes];
}
