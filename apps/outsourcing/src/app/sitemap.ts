import type { MetadataRoute } from "next";
import { SERVICES, SERVICE_SLUGS } from "@/lib/nav";
import { absoluteUrl, BRAND } from "@/lib/brand";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/industries",
    "/case-studies",
    "/careers",
    "/insights",
    "/contact",
  ].map((p) => ({
    url: absoluteUrl(p || "/"),
    lastModified,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.8,
  }));

  const serviceRoutes = SERVICES.map((s) => ({
    url: absoluteUrl(s.href),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...serviceRoutes];
}

// Helper to silence unused import warnings if SERVICE_SLUGS isn't referenced.
void SERVICE_SLUGS;
void BRAND;
