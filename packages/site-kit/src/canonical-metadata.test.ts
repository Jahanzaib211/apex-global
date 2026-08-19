import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Guards the canonical-URL regression that de-indexed four sites.
 *
 * Every root layout used to declare `alternates: { canonical: "/" }`. Next
 * merges metadata into a single accumulator across route segments and only
 * overwrites the keys a segment actually declares
 * (`lib/metadata/resolve-metadata.js`), so a page that never mentions
 * `alternates` inherits the root's. The string "/" resolves against
 * `metadataBase` to the site root regardless of pathname, so all ~79 pages on
 * tours, holdings, group and outsourcing emitted
 * `<link rel="canonical" href="https://<site>/">` — telling Google every page
 * was a duplicate of the homepage.
 *
 * Deleting the key is NOT the fix: `resolveAlternates` returns null when
 * `alternates` is absent and no canonical tag is emitted at all. The fix is a
 * URL *instance*, which `resolveAlternateUrl` resolves against the current
 * pathname via `new URL(pathname, url)`.
 */
const REPO_ROOT = join(import.meta.dirname, "..", "..", "..");

const ROOT_LAYOUTS = [
  "apps/tours/src/app/layout.tsx",
  "apps/holdings/src/app/layout.tsx",
  "apps/group/src/app/layout.tsx",
  "apps/outsourcing/src/app/layout.tsx",
] as const;

describe("root layout canonical metadata", () => {
  it.each(ROOT_LAYOUTS)("%s declares a canonical", (relPath) => {
    const source = readFileSync(join(REPO_ROOT, relPath), "utf8");
    expect(source).toMatch(/alternates:\s*\{\s*canonical:/);
  });

  it.each(ROOT_LAYOUTS)("%s does not canonicalise every page to the root", (relPath) => {
    const source = readFileSync(join(REPO_ROOT, relPath), "utf8");
    // A bare string canonical in a *root* layout is inherited by every child
    // page and resolves to the same URL on all of them.
    expect(source).not.toMatch(/canonical:\s*["'`]/);
  });

  it.each(ROOT_LAYOUTS)("%s uses a URL instance so each page canonicalises to itself", (relPath) => {
    const source = readFileSync(join(REPO_ROOT, relPath), "utf8");
    expect(source).toMatch(/canonical:\s*new URL\(/);
  });
});
