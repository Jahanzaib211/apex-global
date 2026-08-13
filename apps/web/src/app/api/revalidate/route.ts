import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Manual cache invalidation. The console calls this after publishing content
 * or purging a route (`apps/console/src/lib/revalidate.ts`) — console and web
 * are separate processes, so the console's own `revalidatePath` cannot reach
 * this app's ISR cache. Authenticated by a shared secret in the
 * `x-revalidate-secret` header.
 */
export async function POST(req: Request) {
  const expected = process.env.REVALIDATE_SECRET;

  // Refuse rather than compare against `undefined`. An unset secret is a
  // misconfiguration, and answering 403 to a correctly-configured caller
  // reads as a rejected credential instead of a missing one.
  if (!expected) {
    return NextResponse.json({ error: "Revalidation is not configured." }, { status: 503 });
  }

  if (!secretMatches(req.headers.get("x-revalidate-secret"), expected)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await req.json().catch(() => ({}))) as { paths?: string[]; tags?: string[] };

  for (const path of body.paths ?? []) {
    revalidatePath(path);
  }
  for (const tag of body.tags ?? []) {
    revalidateTag(tag);
  }

  // Always revalidate the layout so the new content reaches every page that
  // shares chrome with the changed surface.
  revalidatePath("/", "layout");

  return NextResponse.json({
    revalidated: {
      paths: body.paths ?? [],
      tags: body.tags ?? [],
      layout: true,
      now: new Date().toISOString(),
    },
  });
}

/**
 * Constant-time comparison. `!==` on a secret leaks its length and, over enough
 * requests, its prefix — cheap to avoid, tedious to discover.
 */
function secretMatches(given: string | null, expected: string): boolean {
  if (!given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
