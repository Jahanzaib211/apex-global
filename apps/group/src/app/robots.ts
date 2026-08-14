import type { MetadataRoute } from "next";
import { url } from "@/lib/site-url";
export default function robots(): MetadataRoute.Robots {
  return {
    // No /admin disallow: this site no longer has one. Administration lives in
    // apps/console, which is not published through a tunnel at all.
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api"] }],
    sitemap: url("/sitemap.xml"),
  };
}
