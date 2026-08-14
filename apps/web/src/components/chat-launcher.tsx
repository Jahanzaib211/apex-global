"use client";

import { useEffect, useRef, useState } from "react";

export interface ChatLauncherProps {
  /** Base URL of the self-hosted Chatwoot (e.g. https://chat.….com). */
  chatwootUrl: string;
  /** Chatwoot website widget token. */
  chatwootToken: string;
  /** Launcher label, e.g. "Talk to a real person". */
  label: string;
}

interface ChatwootSdkConfig {
  websiteToken: string;
  baseUrl: string;
  hideMessageBubble?: boolean;
  position?: "left" | "right";
}

declare global {
  interface Window {
    chatwootSDK?: {
      run: (config: ChatwootSdkConfig) => void;
    };
    // Object exposed by the widget once `run` has executed. `toggle()` opens
    // or closes the conversation window regardless of whether it has been
    // opened before.
    $chatwoot?: { toggle: () => void; hasLoaded?: boolean; isOpen?: boolean };
    // The widget reads `chatwootSettings` on the page to honour presentation
    // tweaks such as hiding its own bubble. Setting it before `run()`
    // suppresses the duplicate floating bubble so the single launcher button
    // owns open + close.
    chatwootSettings?: {
      hideMessageBubble?: boolean;
      position?: "left" | "right";
    };
  }
}

/**
 * "Talk to a real person" launcher.
 *
 * Embeds the self-hosted Chatwoot widget (open-source live chat) when
 * configured and always offers WhatsApp as a second human channel. Nothing
 * here is AI — this is deliberately the anti-chatbot: a direct line to a
 * human on the team.
 *
 * The server component decides whether to render at all (reads the settings,
 * bails when chat is not configured); this component only mounts the SDK and
 * owns the tiny launcher UI. The script tag is keyed by URL so it is not
 * re-appended across route changes.
 *
 * The SDK's own floating bubble is hidden (`hideMessageBubble`) so the single
 * button below is the only control: it toggles the window open, and toggles
 * it closed again. Playwright remote channel drives the toggle. Open/closed
 * state is kept in sync through Chatwoot's `chatwoot:opened`/`chatwoot:closed`
 * window events so the label reads "Close chat" while expanded.
 */
export function ChatLauncher({ chatwootUrl, chatwootToken, label }: ChatLauncherProps) {
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  // Whether the visitor has shown intent to chat. The SDK is not fetched
  // until this is true — see the injection effect below for why.
  const [wanted, setWanted] = useState(false);
  const sdkReadyRef = useRef(false);
  const pendingOpenRef = useRef(false);

  // Client-only render: `document` does not exist in RSC.
  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    // Single source of truth for the button label / aria state.
    const onOpened = () => setOpen(true);
    const onClosed = () => setOpen(false);
    const sync = () => setOpen(Boolean(window.$chatwoot?.isOpen));
    const onReady = () => {
      sdkReadyRef.current = Boolean(window.$chatwoot?.hasLoaded);
      sync();
      // The visitor clicked before the SDK finished loading; honour the
      // intent once the conversation window is actually available.
      if (pendingOpenRef.current && sdkReadyRef.current) {
        pendingOpenRef.current = false;
        window.$chatwoot?.toggle();
      }
    };
    window.addEventListener("chatwoot:opened", onOpened);
    window.addEventListener("chatwoot:closed", onClosed);
    window.addEventListener("chatwoot:ready", onReady);
    return () => {
      window.removeEventListener("chatwoot:opened", onOpened);
      window.removeEventListener("chatwoot:closed", onClosed);
      window.removeEventListener("chatwoot:ready", onReady);
    };
  }, [ready]);

  // The Chatwoot SDK is 382 KB of JavaScript across 26 requests — more than
  // twice this entire application's bundle — and it pulls a Cloudflare
  // analytics beacon in behind it. This effect used to run on mount, so every
  // visitor paid all of it whether or not they ever opened chat, and the
  // Lighthouse budget went from 183 KB (inside its 180 KB allowance) to
  // 576 KB. Nobody saw it because the performance job had never completed a
  // run on the self-hosted runner.
  //
  // Now it loads on intent. `pointerenter` and `focus` on the launcher start
  // the fetch before the click lands, so in practice the window still opens
  // immediately; a click that beats the download is queued by
  // `pendingOpenRef` and honoured on `chatwoot:ready`. The comment above this
  // component always claimed the SDK was lazy — now it is.
  useEffect(() => {
    if (!ready || !wanted) return;
    const script = document.createElement("script");
    script.src = `${chatwootUrl.replace(/\/$/, "")}/packs/js/sdk.js`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.chatwootSettings = { hideMessageBubble: true, position: "right" };
      window.chatwootSDK?.run({
        websiteToken: chatwootToken,
        baseUrl: chatwootUrl,
        hideMessageBubble: true,
        position: "right",
      });
    };
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, [ready, wanted, chatwootUrl, chatwootToken]);

  return (
    <div className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-2 sm:right-6 sm:bottom-6">
      <button
        type="button"
        aria-expanded={open}
        onPointerEnter={() => setWanted(true)}
        onFocus={() => setWanted(true)}
        onClick={() => {
          setWanted(true);
          // Chatwoot's own toggle opens and closes the conversation window;
          // the closing animation runs in-place rather than tearing the
          // iframe out of the DOM. If the SDK is still loading, queue the
          // open so the first click is never silently lost.
          if (sdkReadyRef.current) {
            window.$chatwoot?.toggle();
          } else {
            pendingOpenRef.current = true;
          }
        }}
        className="inline-flex h-12 items-center gap-2 rounded-full bg-[var(--color-amber-500)] px-5 text-sm font-semibold text-[var(--color-navy-900)] shadow-[var(--shadow-lg)] transition-transform hover:scale-[1.02]"
      >
        <span className="relative flex h-2.5 w-2.5" aria-hidden>
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-navy-900)] opacity-60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--color-navy-900)]" />
        </span>
        {open ? "Close chat" : label}
      </button>
    </div>
  );
}
