/**
 * Cross-site constants — the things every Apex property needs to agree on,
 * or a footer link goes dead in five places at once.
 *
 * This module is the single source of truth. The four sibling repos
 * (apex-group, apex-tours, apex-holdings, apex-outsourcing) used to hand-roll
 * their own copies of `APEX_GROUP` in `src/lib/apex-group.ts`; a single edit
 * here updates all five public sites.
 *
 * `Apex Cloud` is in the list, was pulled once when its origin returned 502,
 * and was restored when that was fixed — a dead entry here is a dead link in
 * five footers.
 */

/** The five Apex public properties (Cloud is included as the optional sixth). */
export type ApexSiteId =
  "apex-group" | "apex-tech" | "apex-cloud" | "apex-tours" | "apex-outsourcing" | "apex-holdings";

export interface GroupCompany {
  readonly id: ApexSiteId;
  readonly label: string;
  /** Public hostname with scheme. Used as the `href` for sibling footers and the companies nav. */
  readonly href: string;
  /**
   * Mark the entry that links back to this site. The site's own footer uses
   * the `/` shortcut rather than re-linking its own hostname.
   */
  readonly self?: boolean;
}

/**
 * The canonical list of group companies. `self` is unset on every entry —
 * each consumer marks its own row with `withSelf(...)`.
 *
 * `Apex Cloud` was temporarily removed during a Mailcow outage and restored
 * when it came back; do not re-add it lightly, every consumer links to it.
 */
export const APEX_GROUP: readonly GroupCompany[] = [
  {
    id: "apex-group",
    label: "Apex Group of Companies",
    href: "https://apex.apexgroupcompanies.com",
  },
  {
    id: "apex-tech",
    label: "Apex Global Tech Solution",
    href: "https://tech.apexgroupcompanies.com",
  },
  { id: "apex-cloud", label: "Apex Cloud", href: "https://cloud.apexgroupcompanies.com" },
  { id: "apex-tours", label: "Apex Tours", href: "https://tours.apexgroupcompanies.com" },
  {
    id: "apex-outsourcing",
    label: "Apex Outsourcing",
    href: "https://outsourcing.apexgroupcompanies.com",
  },
  { id: "apex-holdings", label: "Apex Holdings", href: "https://holdings.apexgroupcompanies.com" },
] as const;

/**
 * Returns a fresh copy of `APEX_GROUP` with the row whose `id` matches
 * `siteId` marked `self: true`. Callers import the const, freeze it, render
 * into a footer — never mutate the original.
 *
 * @example
 *   export const GROUP_COMPANIES = withSelf('apex-tours');
 */
export function withSelf(siteId: ApexSiteId): GroupCompany[] {
  return APEX_GROUP.map((c) => (c.id === siteId ? { ...c, self: true } : { ...c, self: false }));
}

/** Required: every Apex site has these exact public hosts. */
export const APEX_PUBLIC_HOSTNAMES: Readonly<Record<ApexSiteId, string>> = {
  "apex-group": "apex.apexgroupcompanies.com",
  "apex-tech": "tech.apexgroupcompanies.com",
  "apex-cloud": "cloud.apexgroupcompanies.com",
  "apex-tours": "tours.apexgroupcompanies.com",
  "apex-outsourcing": "outsourcing.apexgroupcompanies.com",
  "apex-holdings": "holdings.apexgroupcompanies.com",
} as const;

/**
 * Read the canonical public URL, defaulting to localhost in dev.
 *
 * The `fallback` argument lets sites with a non-4300 dev port (e.g. the
 * `@apex/web` donor binds to 4300, the four migrated siblings bind to
 * 3001-3103) override without setting an env var.
 *
 * Prefer `siteUrlFor(siteId)` for anything that reaches a crawler — see the
 * note there on why a bare env read is not safe in this monorepo.
 */
export function siteUrl(fallback = "http://localhost:4300"): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? fallback).replace(/\/$/, "");
}

/** Join `siteUrl()` with a path, adding the leading slash if missing. */
export function absoluteUrl(path: string): string {
  return `${siteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * The canonical public origin for one specific Apex site.
 *
 * `siteUrl()` reads `NEXT_PUBLIC_SITE_URL` and trusts it. That is wrong here:
 * there is a single root `.env` holding
 * `NEXT_PUBLIC_SITE_URL=https://tech.apexgroupcompanies.com`, and all five
 * apps build through `dotenv -e ../../.env`. So a production build of any
 * non-Tech site inlined **Tech's** hostname into its own canonical tag,
 * og:url, og:image and sitemap. A canonical pointing at a different site is a
 * deindexing risk, not a cosmetic bug, and `NEXT_PUBLIC_*` is inlined at build
 * time so a restart never corrects it.
 *
 * This resolver is self-correcting: the env var is honoured only when it
 * actually names this site's host (so per-environment overrides and local
 * loopback still work), and otherwise the compiled-in canonical hostname wins.
 * A misconfigured or shared env can no longer publish the wrong domain.
 */
export function siteUrlFor(siteId: ApexSiteId, devFallback = "http://localhost:4300"): string {
  const canonical = `https://${APEX_PUBLIC_HOSTNAMES[siteId]}`;
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");

  if (fromEnv) {
    let host: string | undefined;
    try {
      host = new URL(fromEnv).hostname;
    } catch {
      host = undefined;
    }
    // Honour the override only when it names this site. A loopback or
    // *.localhost origin is always allowed so dev and E2E can point anywhere.
    if (host === APEX_PUBLIC_HOSTNAMES[siteId]) return fromEnv;
    if (host === "localhost" || host === "127.0.0.1" || host?.endsWith(".localhost")) {
      return fromEnv;
    }
  }

  return process.env.NODE_ENV === "production" ? canonical : devFallback;
}

/** Join `siteUrlFor(siteId)` with a path, adding the leading slash if missing. */
export function absoluteUrlFor(siteId: ApexSiteId, path: string, devFallback?: string): string {
  const base = siteUrlFor(siteId, devFallback);
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/* ------------------------------------------------------------------ */
/* Navigation — types only. Each site defines its own NAV array.      */
/* ------------------------------------------------------------------ */

export type NavLeaf = {
  readonly label: string;
  readonly href: string;
  readonly description?: string;
};
export type NavGroup = {
  readonly label: string;
  readonly href: string;
  readonly children: readonly NavLeaf[];
};
export type NavItem = NavLeaf | NavGroup;
export function isNavGroup(item: NavItem): item is NavGroup {
  return "children" in item;
}

/* ------------------------------------------------------------------ */
/* Footer legal links — generic shape, per-site path layout.          */
/* ------------------------------------------------------------------ */

export interface FooterLegalLink {
  readonly label: string;
  readonly href: string;
}

/**
 * Common legal link labels every Apex site publishes. The actual paths
 * are per-site (`/legal/privacy` on Tech, `/privacy` on Tours) — the
 * consumer site passes its own concrete links through `@apex/site-kit`
 * re-export. This block exists so the label spellings stay consistent.
 */
export const FOOTER_LEGAL_LABELS = [
  "Privacy",
  "Terms",
  "Cookies",
  "Disclaimer",
  "All legal documents",
] as const;
