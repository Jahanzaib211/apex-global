/**
 * Social profiles for the Apex Outsourcing site.
 *
 * Canonical handles live in `@apex/site-kit/social`. This module exposes
 * them in the shape the existing `Footer.tsx` expects (a 3-tuple of
 * `linkedin`, `facebook`, `instagram` — the icons the footer renders).
 *
 * This used to carry `twitter` instead of `instagram`, which inverted the
 * facts: Apex publishes an Instagram handle and does not publish a Twitter
 * one, so the footer rendered a permanently disabled "coming soon" pill and
 * omitted a profile that exists. The footer still falls back to that
 * disabled state for any entry whose href is empty, so publishing a new
 * handle is a one-line change here.
 */
import { APEX_SOCIALS } from "@apex/site-kit/social";

function find(platform: "linkedin" | "facebook" | "instagram" | "twitter"): string {
  return APEX_SOCIALS.find((s) => s.platform === platform)?.href ?? "";
}

export const SOCIAL = {
  linkedin: { label: "LinkedIn", href: find("linkedin") },
  facebook: { label: "Facebook", href: find("facebook") },
  instagram: { label: "Instagram", href: find("instagram") },
} as const;

export type SocialKey = keyof typeof SOCIAL;
