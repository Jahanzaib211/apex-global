import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Campaign pages, the conversion page and the API are not for crawlers.
        // Each page also carries its own noindex; this is belt and braces,
        // since a disallowed page can still be indexed if linked externally.
        disallow: ["/lp/", "/thank-you", "/api/"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
