import type { MetadataRoute } from "next";
import { url } from "@/lib/site-url";

/**
 * The site shipped no sitemap, leaving all 25 routes — including every
 * city-level car-rental landing page, which is what this site ranks on — for
 * crawlers to find by link-following alone.
 */
const ROUTES = [
  "/",
  "/about",
  "/blog",
  "/careers",
  "/car-rental-with-driver",
  "/contact",
  "/custom-package",
  "/destinations",
  "/disclaimer",
  "/gallery",
  "/group-package",
  "/hajj-packages",
  "/hajj-umrah",
  "/hajj-umrah/guide",
  "/pakistan-car-rental",
  "/privacy",
  "/saudi-car-rental",
  "/saudi-car-rental/jeddah",
  "/saudi-car-rental/madinah",
  "/saudi-car-rental/makkah",
  "/saudi-car-rental/riyadh",
  "/self-drive-car-rental",
  "/terms",
  "/umrah-packages",
  "/vehicles",
] as const;

/** Money pages get a higher priority than the legal boilerplate. */
const LOW_PRIORITY = new Set<string>(["/privacy", "/terms", "/disclaimer"]);

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map((route) => ({
    url: url(route),
    lastModified,
    changeFrequency: "weekly" as const,
    priority: route === "/" ? 1 : LOW_PRIORITY.has(route) ? 0.3 : 0.8,
  }));
}
