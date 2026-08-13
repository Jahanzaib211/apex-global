import { Button } from "@apex/ui";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { audit } from "@/lib/audit";
import { purgeWebCache } from "@/lib/revalidate";
import { requirePermission } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Dev — Cache" };

/**
 * Manual cache revalidation.
 *
 * Triggered by the public site's `s-maxage=300` and Cloudflare's
 * stale-while-revalidate. Without manual intervention, public pages take
 * up to 5 minutes to reflect changes after a publish. This page lets an
 * operator force revalidation per route group.
 */

const ROUTE_GROUPS = [
  { label: "Homepage", path: "/" },
  { label: "Services index", path: "/services" },
  { label: "Solutions index", path: "/solutions" },
  { label: "SaaS index", path: "/saas" },
  { label: "Industries index", path: "/industries" },
  { label: "Technology", path: "/technology" },
  { label: "Case studies", path: "/case-studies" },
  { label: "About", path: "/about" },
  { label: "Insights", path: "/insights" },
  { label: "Careers", path: "/careers" },
  { label: "Contact", path: "/contact" },
  { label: "Status", path: "/status" },
];

export default async function DevCachePage() {
  await requirePermission("core:admin");

  async function revalidate(formData: FormData) {
    "use server";
    const actor = await requirePermission("core:admin");
    const path = String(formData.get("path") ?? "/");
    const group = String(formData.get("group") ?? "");
    revalidatePath(path);
    revalidatePath("/", "layout");
    // The route being purged lives in the web app, a separate process — the
    // two calls above only clear the console's own cache.
    await purgeWebCache({ paths: [path] });
    await audit({
      actor,
      action: "dev.cache_revalidated",
      entityType: "Route",
      entityId: path,
      summary: `Revalidated ${group} (${path})`,
    });
    redirect("/dev/cache");
  }

  async function revalidateAll() {
    "use server";
    const actor = await requirePermission("core:admin");
    revalidatePath("/", "layout");
    for (const g of ROUTE_GROUPS) revalidatePath(g.path);
    await purgeWebCache({ paths: ROUTE_GROUPS.map((g) => g.path) });
    await audit({
      actor,
      action: "dev.cache_revalidated",
      entityType: "Route",
      entityId: "*",
      summary: "Revalidated all routes",
    });
    redirect("/dev/cache");
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="text-2xl">Cache</h1>
          <p className="mt-1 max-w-2xl text-sm text-[var(--ink-secondary)]">
            Force ISR revalidation per route group. Each call also revalidates the site layout
            (status banner, partner pill).
          </p>
        </div>
        <form action={revalidateAll}>
          <Button type="submit" variant="primary" size="sm">
            Revalidate all
          </Button>
        </form>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ROUTE_GROUPS.map((g) => (
          <form
            key={g.path}
            action={revalidate}
            className="flex items-center justify-between gap-3 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-4"
          >
            <div>
              <p className="font-medium">{g.label}</p>
              <p className="text-2xs text-[var(--ink-muted)]">{g.path}</p>
            </div>
            <input type="hidden" name="path" value={g.path} />
            <input type="hidden" name="group" value={g.label} />
            <Button type="submit" variant="secondary" size="sm">
              Purge
            </Button>
          </form>
        ))}
      </div>
    </div>
  );
}
