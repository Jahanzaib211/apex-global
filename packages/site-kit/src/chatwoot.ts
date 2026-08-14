import type { ApexSiteId } from "./site";

/**
 * Live-chat configuration, per Apex property.
 *
 * Each site has its own Chatwoot inbox so the agent answering can see which
 * brand a conversation arrived on — a tour question and an outsourcing RFP
 * need different people and different answers. A shared token looks identical
 * in a screenshot and is wrong in the inbox, which is exactly the mistake this
 * module exists to prevent: the four marketing sites were briefly wired to a
 * single `NEXT_PUBLIC_CHATWOOT_TOKEN`, which would have funnelled every
 * conversation from all four brands into the Tech inbox.
 *
 * The website token is **not a secret**. It is `NEXT_PUBLIC_` by nature —
 * Chatwoot's widget ships it to every browser that loads the page, and it only
 * identifies which inbox to open. Keeping it in code rather than in the
 * environment is what makes it per-site: all five apps build from one root
 * `.env`, so anything read from there is necessarily the same value everywhere.
 *
 * `tests/e2e/public/group-chat-widget.spec.ts` asserts each live site serves
 * its own token.
 */

/** Where the self-hosted Chatwoot instance lives. */
export const CHATWOOT_BASE_URL = "https://chat.apexgroupcompanies.com";

/** Website token per property. Public by design; see the note above. */
export const CHATWOOT_TOKENS: Readonly<Record<ApexSiteId, string>> = {
  "apex-tech": "BwtQt74nqfPep16bMSHJrXZB",
  "apex-group": "8ifuvAsh77ZAc3CfAV1vv29z",
  "apex-holdings": "DCBe85BZciTqg3GtMZqM8Lkc",
  "apex-outsourcing": "HCkV3Ez6Njd3XpYhgXiaw6nr",
  "apex-tours": "kzvNNCuZqvKhTu9Pb3hsGiut",
  // Apex Cloud is the Mailcow surface, not a marketing site; it mounts no widget.
  "apex-cloud": "",
} as const;

export interface ChatwootConfig {
  readonly baseUrl: string;
  readonly websiteToken: string;
}

/**
 * Resolve the widget configuration for one site.
 *
 * `NEXT_PUBLIC_CHATWOOT_URL` may override the host for a staging instance. The
 * token deliberately has no environment override — that is the mechanism that
 * made every site share one inbox.
 */
export function chatwootFor(siteId: ApexSiteId): ChatwootConfig {
  const fromEnv = process.env.NEXT_PUBLIC_CHATWOOT_URL?.trim().replace(/\/$/, "");
  return {
    baseUrl: fromEnv && fromEnv.length > 0 ? fromEnv : CHATWOOT_BASE_URL,
    websiteToken: CHATWOOT_TOKENS[siteId],
  };
}
