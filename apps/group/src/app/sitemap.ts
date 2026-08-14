import type { MetadataRoute } from "next";
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
    url: `https://apexgroup.example${route}`,
    changeFrequency: "weekly",
    priority: index === 0 ? 1 : 0.7,
  }));
}
