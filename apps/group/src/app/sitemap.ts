import type { MetadataRoute } from "next";
import { url } from "@/lib/site-url";
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
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
  ];
  return routes.map((route, index) => ({
    url: url(route),
    changeFrequency: "weekly",
    priority: index === 0 ? 1 : 0.7,
  }));
}
