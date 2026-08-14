/**
 * Client-side attribution — uses the shared `@apex/site-kit/attribution` URL
 * reader/storage key and adds the React `useEffect` hook locally because
 * `@apex/site-kit` is a pure TypeScript library.
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
