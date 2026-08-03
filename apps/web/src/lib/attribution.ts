/**
 * First-touch attribution — the client-safe half.
 *
 * Captured in the browser on the landing page and carried to submission, then
 * written in the same transaction as the lead. It cannot be reconstructed
 * afterwards, which is why it is stored even when the fields are empty.
 *
 * Anything needing node:crypto lives in `attribution.server.ts`; importing it
 * here would pull the crypto module into the client bundle and fail the build.
 */

export const ATTRIBUTION_STORAGE_KEY = "apex.attribution.v1";

export interface AttributionPayload {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  gclid?: string;
  fbclid?: string;
  msclkid?: string;
  referrer?: string;
  landingPath?: string;
  currentPath?: string;
  consentAnalytics?: boolean;
  consentMarketing?: boolean;
}

/** Reads campaign parameters from a URL. Runs in the browser. */
export function readAttributionFromUrl(url: URL, referrer: string): AttributionPayload {
  const p = url.searchParams;
  const get = (k: string) => p.get(k)?.slice(0, 200) || undefined;

  return {
    utmSource: get("utm_source"),
    utmMedium: get("utm_medium"),
    utmCampaign: get("utm_campaign"),
    utmTerm: get("utm_term"),
    utmContent: get("utm_content"),
    gclid: get("gclid"),
    fbclid: get("fbclid"),
    msclkid: get("msclkid"),
    // Only external referrers are interesting; our own pages are noise.
    referrer: referrer && !referrer.startsWith(url.origin) ? referrer.slice(0, 500) : undefined,
    landingPath: url.pathname,
  };
}
