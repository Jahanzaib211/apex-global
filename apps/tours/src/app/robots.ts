import type { MetadataRoute } from "next";
import { url } from "@/lib/site-url";

/** The site shipped no robots.txt at all before this. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api"] }],
    sitemap: url("/sitemap.xml"),
    host: url("/"),
  };
}
