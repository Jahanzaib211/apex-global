import { absoluteUrlFor, siteUrlFor } from "@apex/site-kit/site";

/**
 * This site's canonical public origin.
 *
 * The app declared no `metadataBase`, so it emitted no canonical tag at all and
 * every relative OpenGraph URL resolved against nothing. It also shipped no
 * sitemap and no robots.txt.
 *
 * `siteUrlFor` ignores a `NEXT_PUBLIC_SITE_URL` that names a different Apex
 * site — necessary because the single root `.env` every app builds through
 * points at the Tech site.
 */
const DEV_ORIGIN = "http://localhost:4101";

export const SITE_URL = siteUrlFor("apex-tours", DEV_ORIGIN);

/** Absolute URL on this site — `url("/vehicles")`. */
export function url(path: string): string {
  return absoluteUrlFor("apex-tours", path, DEV_ORIGIN);
}
