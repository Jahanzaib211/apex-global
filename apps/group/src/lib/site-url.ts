import { absoluteUrlFor, siteUrlFor } from "@apex/site-kit/site";

/**
 * This site's canonical public origin, and the helper for building absolute
 * URLs from it.
 *
 * Every metadata block, JSON-LD `url`, sitemap entry and robots directive on
 * this site previously hard-coded one of two wrong hostnames:
 * `https://apexgroup.example` (an RFC 2606 reserved domain — reachable by
 * nobody) in `metadataBase`, `robots.ts`, `sitemap.ts` and two JSON-LD blocks,
 * and `https://apexgroup.pk` in the JSON-LD of ten more pages. The live host is
 * `apex.apexgroupcompanies.com`.
 *
 * `siteUrlFor` resolves against `APEX_PUBLIC_HOSTNAMES`, ignoring a
 * `NEXT_PUBLIC_SITE_URL` that names a different Apex site — which matters here
 * because the single root `.env` all five apps build through points at the Tech
 * site. Local loopback overrides still work for dev and E2E.
 */
const DEV_ORIGIN = "http://localhost:4103";

export const SITE_URL = siteUrlFor("apex-group", DEV_ORIGIN);

/** Absolute URL on this site — `url("/contact")` → `https://apex…/contact`. */
export function url(path: string): string {
  return absoluteUrlFor("apex-group", path, DEV_ORIGIN);
}
