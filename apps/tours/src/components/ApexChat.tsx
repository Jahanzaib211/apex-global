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
const { baseUrl: BASE_URL, websiteToken: TOKEN } = chatwootFor("apex-tours");

export function ApexChat(): null {
  useEffect(() => {
    if (!BASE_URL || !TOKEN) return;
    // Next.js remounts on client navigation; the SDK must load once.
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
  }, []);

  return null;
}
