import "server-only";
import type { SessionPortalUser } from "@apex/auth";

/**
 * Per-page scoping helpers.
 *
 * The portal uses row-level filters inline at the query call site rather
 * than a generic wrapper, because Prisma's generated types don't play
 * nicely with deeply-typed higher-order query helpers. These helpers
 * exist to:
 *
 *   1. Centralise the join clause so a missing `portalAccountId` filter
 *      is the only way a row could leak.
 *   2. Make the security property visible at the call site.
 *
 * `scopedWhere` returns the join shape; pages spread it into `where`.
 */

export function portalAccountJoin(user: SessionPortalUser) {
  return { portalAccounts: { some: { id: user.portalAccountId } } };
}

/**
 * For models that have a direct `portalAccountId` column (Ticket, Project,
 * ClientDocument), the join is a single equality check.
 */
export function portalAccountEq(user: SessionPortalUser) {
  return { portalAccountId: user.portalAccountId };
}
