/**
 * Re-exports the React-side attribution helpers from the sibling-local
 * client module, plus the shared `ATTRIBUTION_STORAGE_KEY` /
 * `readAttributionFromUrl` from `@apex/site-kit/attribution` for code that
 * runs on both sides.
 *
 * The split exists because `@apex/site-kit` is a pure-TypeScript library
 * with no React, so the `useEffect`-driven capture lives here.
 */
export {
  ATTRIBUTION_STORAGE_KEY,
  type AttributionPayload,
  readAttributionFromUrl,
} from "@apex/site-kit/attribution";

export {
  type Attribution,
  AttributionCapture,
  captureAttribution,
  readAttribution,
} from "./attribution.client";
