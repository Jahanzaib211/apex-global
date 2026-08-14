"use client";

import { useEffect } from "react";
import {
  ATTRIBUTION_STORAGE_KEY,
  type AttributionPayload,
  readAttributionFromUrl,
} from "@apex/site-kit/attribution";

/**
 * Client-side attribution helpers — sibling-local because they reference the
 * React `useEffect` hook and `sessionStorage`, neither of which belong in the
 * pure-TS `@apex/site-kit` package.
 *
 * The storage key and the URL→payload reader are shared so all five sites
 * capture the same shape.
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
