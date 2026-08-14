import { absoluteUrlFor, siteUrlFor } from "@apex/site-kit/site";

/**
 * This site's canonical public origin.
 *
 * The app previously declared no `metadataBase` at all, so every relative
 * OpenGraph and canonical URL resolved against nothing, and it shipped neither
 * a sitemap nor a robots.txt. It also predates the move off `apexholdings.pk`,
 * which is not a domain Apex owns.
 *
 * `siteUrlFor` resolves against `APEX_PUBLIC_HOSTNAMES` and ignores a
 * `NEXT_PUBLIC_SITE_URL` naming a different Apex site — which matters because
 * the single root `.env` every app builds through points at the Tech site.
 */
const DEV_ORIGIN = "http://localhost:4102";

export const SITE_URL = siteUrlFor("apex-holdings", DEV_ORIGIN);

/** Absolute URL on this site — `url("/projects")`. */
export function url(path: string): string {
  return absoluteUrlFor("apex-holdings", path, DEV_ORIGIN);
}
