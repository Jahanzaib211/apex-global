import "server-only";

/**
 * Purge the public site's cache from the console.
 *
 * The console and the web app are separate PM2 processes with separate Next
 * caches. Calling `revalidatePath` in the console only clears the console's own
 * cache — publishing a record here left the public page serving stale content
 * until its ISR window expired. This crosses the process boundary properly.
 *
 * Configure `WEB_ORIGIN` and `REVALIDATE_SECRET`; both apps read the same
 * secret from the repo-root `.env`.
 */
const WEB_ORIGIN = (process.env.WEB_ORIGIN ?? "http://127.0.0.1:4300").replace(/\/$/, "");

export type PurgeResult = { ok: true } | { ok: false; reason: string };

export async function purgeWebCache(input: {
  paths?: string[];
  tags?: string[];
}): Promise<PurgeResult> {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    console.warn("REVALIDATE_SECRET is not set — the public site's cache was not purged.");
    return { ok: false, reason: "not configured" };
  }

  try {
    const res = await fetch(`${WEB_ORIGIN}/api/revalidate`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-revalidate-secret": secret,
      },
      body: JSON.stringify({ paths: input.paths ?? [], tags: input.tags ?? [] }),
      // A cache purge must never hold up the publish it follows. If the web app
      // is slow or down, the content is already saved and ISR will catch up.
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn(`Cache purge failed: ${WEB_ORIGIN} answered ${res.status}.`);
      return { ok: false, reason: `HTTP ${res.status}` };
    }
    return { ok: true };
  } catch (error) {
    console.warn(`Cache purge could not reach ${WEB_ORIGIN}: ${(error as Error).message}`);
    return { ok: false, reason: (error as Error).message };
  }
}
