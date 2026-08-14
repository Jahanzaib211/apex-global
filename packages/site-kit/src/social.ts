/**
 * The canonical social-links registry for all five Apex sites.
 *
 * Each site picks the entries it actually publishes. The default set is the
 * Tech site's three (Instagram, Facebook, LinkedIn) — the other four sites
 * were missing footer socials entirely and now share this so the audit log
 * stops showing "zero social links on Tours, Outsourcing, and the Main
 * Site" in three places at once.
 *
 * SVG icons are intentionally absent here; this is a data module. The
 * `@apex/ui` icon set renders them.
 */

export type SocialPlatform =
  "instagram" | "facebook" | "linkedin" | "twitter" | "youtube" | "tiktok";

export interface SocialEntry {
  readonly platform: SocialPlatform;
  readonly label: string;
  /** Absolute URL with scheme. The footer renders it as `target="_blank"` `rel="noopener noreferrer"`. */
  readonly href: string;
}

/**
 * Apex group-level handles. Override per-site where a property has its own
 * dedicated page (Tours runs its own Instagram, Tech runs its own LinkedIn,
 * etc.).
 *
 * `href` strings are the canonical handles Apex owns as of the migration
 * date. Sites that publish different handles override at the call site by
 * importing the const then returning a custom array.
 */
export const APEX_SOCIALS: readonly SocialEntry[] = [
  {
    platform: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/apex-global-tech-solution",
  },
  {
    platform: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/share/1F8H6VoshA",
  },
  {
    platform: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/apexglobaltechsolution",
  },
];

/**
 * Pick just the entries for the platforms a site actually publishes. Keeping
 * the selection logic here means a footer cannot silently drop a platform
 * mid-deploy — every drop goes through this helper.
 */
export function selectSocials(platforms: readonly SocialPlatform[]): SocialEntry[] {
  return APEX_SOCIALS.filter((s) => platforms.includes(s.platform));
}
