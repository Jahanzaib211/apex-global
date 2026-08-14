/**
 * Per-site navigation — types and helpers.
 *
 * `NavItem` is the union declared in `site.ts`. This module adds the search
 * helpers each site's header needs.
 */

import { isNavGroup, type NavGroup, type NavItem, type NavLeaf } from "./site";

/** Flatten a `NAV`-style array into a single list of `NavLeaf`s. */
export function flattenNav(items: readonly NavItem[]): NavLeaf[] {
  const out: NavLeaf[] = [];
  for (const item of items) {
    if (isNavGroup(item)) out.push({ label: item.label, href: item.href });
    else out.push(item);
    if (isNavGroup(item)) {
      for (const child of item.children) out.push(child);
    }
  }
  return out;
}

/** Return only top-level entries (children collapsed). Useful for a sitemap block. */
export function topLevel(items: readonly NavItem[]): readonly NavItem[] {
  return items;
}

/**
 * Return only items that match the current path. A header uses this to
 * highlight the active section. A group matches if the group's `href` is a
 * prefix of the current path; a leaf matches if its `href` equals the
 * current path exactly.
 */
export function activeGroup(items: readonly NavItem[], currentPath: string): NavGroup | undefined {
  for (const item of items) {
    if (isNavGroup(item)) {
      if (currentPath === item.href || currentPath.startsWith(`${item.href}/`)) return item;
    }
  }
  return undefined;
}
