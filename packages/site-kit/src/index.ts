/**
 * `@apex/site-kit` — shared infra for the five Apex marketing sites.
 *
 * Everything in this package was either lifted from `@apex/web` (Tech, the
 * donor) or extracted from the byte-near-identical `src/lib/*.ts` files
 * that exist in all four sibling repos before migration. A single change
 * here updates all five sites; before the move the same fix had to be
 * applied to four hand-maintained copies.
 *
 * The package is a pure TypeScript library on purpose — no React, no Next,
 * no tailwind. Every consumer (apps/web on Next 15/React 19 and the four
 * migrated siblings on Next 14/React 18) compiles it through its own
 * pipeline, so a runtime-React peer-dependency here would break half of
 * them.
 */

export * from "./site";
export * from "./partner-signature";
export * from "./lead-schema";
export * from "./form-guards";
export * from "./attribution";
export * from "./attribution.server";
export * from "./social";
export * from "./brand";
export * from "./nav";
export * from "./forward-lead";
