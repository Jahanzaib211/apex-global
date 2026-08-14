"use client";

import { useEffect } from "react";
import { chatwootFor } from "@apex/site-kit/chatwoot";

/**
 * Apex live chat (self-hosted Chatwoot).
 *
 * Each Apex property has its own Chatwoot inbox, so the agent answering can
 * see which brand a conversation arrived on — a tour question and an
 * outsourcing RFP need different people and different answers.
 *
 * Renders nothing when unconfigured. A chat bubble that opens onto nobody is
 * worse than no bubble: it promises a human is waiting.
 */

declare global {
  interface Window {
    chatwootSettings?: Record<string, unknown>;
    chatwootSDK?: { run: (opts: { websiteToken: string; baseUrl: string }) => void };
  }
}

// This site's own inbox, not a shared environment variable: all five apps
// build from one root .env, so a NEXT_PUBLIC_ token there is necessarily the
// same value everywhere and would funnel every brand's conversations into one
// inbox. See packages/site-kit/src/chatwoot.ts.
const { baseUrl: BASE_URL, websiteToken: TOKEN } = chatwootFor("apex-outsourcing");

/**
 * Loaded on first interaction, not on mount.
 *
 * The SDK is 382 KB of JavaScript over 26 requests — more than twice a whole
 * site's bundle — and Cloudflare adds an analytics beacon to the iframe it
 * serves. Loading that on mount put the estate three times over its 180 KB
 * script budget, which went unnoticed because the performance job had never
 * completed a run.
 *
 * Any of these means a real visitor is present: a pointer press, a key, a
 * scroll, a touch. All four fire long before anyone reaches for a chat
 * bubble, so the bubble still appears well within a reading pause — it simply
 * no longer competes with the page for the first paint. A crawler, or a
 * visitor who bounces without touching anything, never downloads it.
 */
const INTENT_EVENTS = ["pointerdown", "keydown", "touchstart", "scroll"] as const;

export function ApexChat(): null {
  useEffect(() => {
    if (!BASE_URL || !TOKEN) return;
    // Next.js remounts on client navigation; the SDK must load once.
    if (document.getElementById("chatwoot-sdk")) return;

    let loaded = false;
    const load = () => {
      if (loaded) return;
      loaded = true;
      teardown();
      if (document.getElementById("chatwoot-sdk")) return;

      window.chatwootSettings = {
        position: "right",
        type: "expanded_bubble",
        launcherTitle: "Chat with us",
      };

      const script = document.createElement("script");
      script.id = "chatwoot-sdk";
      script.src = `${BASE_URL}/packs/js/sdk.js`;
      script.defer = true;
      script.async = true;
      script.onload = () => {
        window.chatwootSDK?.run({ websiteToken: TOKEN, baseUrl: BASE_URL });
      };
      document.head.appendChild(script);
    };

    const teardown = () => {
      for (const e of INTENT_EVENTS) window.removeEventListener(e, load);
    };

    for (const e of INTENT_EVENTS) {
      window.addEventListener(e, load, { once: true, passive: true });
    }
    return teardown;
  }, []);

  return null;
}
