"use client";

import { useEffect } from "react";
import {
  ATTRIBUTION_STORAGE_KEY,
  type AttributionPayload,
  readAttributionFromUrl,
} from "@apex/site-kit/attribution";

/** Sibling-local React side of attribution capture. The pure-TS URL reader
 * lives in `@apex/site-kit/attribution`; this module adds the `useEffect`
 * hook so the root layout can drop in `<AttributionCapture/>`.
 */
export type Attribution = AttributionPayload;

export function captureAttribution(): void {
  if (typeof window === "undefined") return;

  try {
    if (window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY)) return;
    const data = readAttributionFromUrl(new URL(window.location.href), document.referrer ?? "");
    window.sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Private browsing or storage quota error must never break the page.
  }
}

export function readAttribution(): Attribution {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    const stored: Attribution = raw ? JSON.parse(raw) : {};
    return { ...stored, currentPath: window.location.pathname.slice(0, 300) };
  } catch {
    return {};
  }
}

export function AttributionCapture(): null {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
