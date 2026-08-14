import type { MetadataRoute } from "next";
import { url } from "@/lib/site-url";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api"] }],
    sitemap: url("/sitemap.xml"),
  };
}
