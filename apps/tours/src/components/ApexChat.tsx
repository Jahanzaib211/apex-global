"use client";

import { useEffect } from "react";

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

const BASE_URL = process.env.NEXT_PUBLIC_CHATWOOT_URL ?? "";
const TOKEN = process.env.NEXT_PUBLIC_CHATWOOT_TOKEN ?? "";

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
