import { prisma, type PublishStatus } from "@apex/db";
import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { audit } from "@/lib/audit";
import { purgeWebCache } from "@/lib/revalidate";
import { requirePermission } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Content" };

/**
 * Content overview with publish control.
 *
 * Full field-level editing is not built yet — this is the part that matters
 * first, because it is what lets someone take a page down without a deploy.
 */
type Kind =
  | "solution"
  | "product"
  | "service"
  | "bundle"
  | "endpoint"
  | "caseStudy"
  | "insight"
  | "landingPage";

export default async function ContentPage() {
  await requirePermission("cms:read");

  const [solutions, products, services, bundles, endpoints, caseStudies, insights, landingPages] =
    await Promise.all([
      prisma.solution.findMany({
        orderBy: { order: "asc" },
        select: { id: true, slug: true, name: true, status: true, updatedAt: true },
      }),
      prisma.saasProduct.findMany({
        orderBy: { order: "asc" },
        select: { id: true, slug: true, name: true, status: true, updatedAt: true },
      }),
      prisma.service.findMany({
        orderBy: { order: "asc" },
        select: {
          id: true,
          slug: true,
          name: true,
          status: true,
          updatedAt: true,
          flatFeeAmount: true,
          feeCurrency: true,
        },
      }),
      prisma.serviceBundle.findMany({
        orderBy: { order: "asc" },
        select: {
          id: true,
          slug: true,
          name: true,
          status: true,
          updatedAt: true,
          bundlePriceAmount: true,
          feeCurrency: true,
        },
      }),
      prisma.liveEndpoint.findMany({
        orderBy: { order: "asc" },
        select: { id: true, slug: true, name: true, status: true, updatedAt: true, kind: true },
      }),
      prisma.caseStudy.findMany({
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          slug: true,
          title: true,
          status: true,
          updatedAt: true,
          clientName: true,
          clientConsent: true,
        },
      }),
      prisma.insight.findMany({
        orderBy: { updatedAt: "desc" },
        select: { id: true, slug: true, title: true, status: true, updatedAt: true },
      }),
      prisma.landingPage.findMany({
        orderBy: { updatedAt: "desc" },
        select: { id: true, slug: true, headline: true, status: true, updatedAt: true },
      }),
    ]);

  async function setStatus(formData: FormData) {
    "use server";
    const actor = await requirePermission("cms:publish");

    const kind = String(formData.get("kind") ?? "") as Kind;
    const id = String(formData.get("id") ?? "");
    const status = String(formData.get("status") ?? "") as PublishStatus;

    if (!["DRAFT", "LIVE", "INTERNAL", "ARCHIVED"].includes(status)) {
      throw new Error("Unknown status");
    }

    const publishedAt = status === "LIVE" ? new Date() : null;

    switch (kind) {
      case "solution":
        await prisma.solution.update({ where: { id }, data: { status, publishedAt } });
        break;
      case "product":
        await prisma.saasProduct.update({ where: { id }, data: { status, publishedAt } });
        break;
      case "service":
        await prisma.service.update({ where: { id }, data: { status, publishedAt } });
        break;
      case "bundle":
        await prisma.serviceBundle.update({ where: { id }, data: { status, publishedAt } });
        break;
      case "endpoint":
        await prisma.liveEndpoint.update({ where: { id }, data: { status, publishedAt } });
        break;
      case "caseStudy":
        await prisma.caseStudy.update({ where: { id }, data: { status, publishedAt } });
        break;
      case "insight":
        await prisma.insight.update({ where: { id }, data: { status, publishedAt } });
        break;
      case "landingPage":
        await prisma.landingPage.update({ where: { id }, data: { status } });
        break;
      default:
        throw new Error("Unknown content type");
    }

    await audit({
      actor,
      action: status === "LIVE" ? "content.published" : "content.unpublished",
      entityType: kind,
      entityId: id,
      summary: `${kind} set to ${status}`,
    });

    // Push the change to the public site immediately rather than waiting for
    // the ISR window — publishing that takes five minutes to appear reads as
    // broken and gets clicked twice. The local `revalidatePath` only clears the
    // console's cache, so the purge has to cross to the web app over HTTP.
    revalidatePath("/", "layout");
    await purgeWebCache({ paths: ["/"] });
    redirect("/content");
  }

  const groups: Array<{
    kind: Kind;
    label: string;
    rows: Array<{
      id: string;
      slug: string;
      title: string;
      status: PublishStatus;
      updatedAt: Date;
      note?: string;
    }>;
  }> = [
    {
      kind: "solution",
      label: "Solutions",
      rows: solutions.map((s) => ({
        id: s.id,
        slug: s.slug,
        title: s.name,
        status: s.status,
        updatedAt: s.updatedAt,
      })),
    },
    {
      kind: "product",
      label: "SaaS products",
      rows: products.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.name,
        status: p.status,
        updatedAt: p.updatedAt,
      })),
    },
    {
      kind: "service",
      label: "Productised services",
      rows: services.map((s) => ({
        id: s.id,
        slug: s.slug,
        title: s.name,
        status: s.status,
        updatedAt: s.updatedAt,
        note: `${s.feeCurrency} ${s.flatFeeAmount.toLocaleString()}`,
      })),
    },
    {
      kind: "bundle",
      label: "Service bundles",
      rows: bundles.map((b) => ({
        id: b.id,
        slug: b.slug,
        title: b.name,
        status: b.status,
        updatedAt: b.updatedAt,
        note: `${b.feeCurrency} ${b.bundlePriceAmount.toLocaleString()}`,
      })),
    },
    {
      kind: "endpoint",
      label: "Live endpoints (proof)",
      rows: endpoints.map((e) => ({
        id: e.id,
        slug: e.slug,
        title: e.name,
        status: e.status,
        updatedAt: e.updatedAt,
        note: e.kind,
      })),
    },
    {
      kind: "caseStudy",
      label: "Case studies",
      rows: caseStudies.map((c) => ({
        id: c.id,
        slug: c.slug,
        title: c.title,
        status: c.status,
        updatedAt: c.updatedAt,
        note: c.clientName
          ? c.clientConsent
            ? `Named: ${c.clientName}`
            : `Anonymised — no consent recorded for ${c.clientName}`
          : "Anonymised",
      })),
    },
    {
      kind: "insight",
      label: "Insights",
      rows: insights.map((i) => ({
        id: i.id,
        slug: i.slug,
        title: i.title,
        status: i.status,
        updatedAt: i.updatedAt,
      })),
    },
    {
      kind: "landingPage",
      label: "Campaign pages",
      rows: landingPages.map((l) => ({
        id: l.id,
        slug: l.slug,
        title: l.headline,
        status: l.status,
        updatedAt: l.updatedAt,
      })),
    },
  ];

  return (
    <div className="flex flex-col gap-9">
      <div>
        <h1 className="text-2xl">Content</h1>
        <p className="mt-1 max-w-2xl text-[var(--ink-secondary)]">
          Publishing state for everything the public site can render. Only <code>LIVE</code> content
          is visible to visitors.
        </p>
      </div>

      {groups.map((group) => (
        <section key={group.kind}>
          <h2 className="text-lg font-semibold">{group.label}</h2>
          <div className="scroll-x mt-4 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)]">
            <table className="w-full min-w-[44rem] text-sm">
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {group.rows.map((row) => (
                  <tr key={row.id}>
                    <td className="px-5 py-3">
                      <p className="font-medium">{row.title}</p>
                      <p className="text-2xs text-[var(--ink-muted)]">
                        /{row.slug}
                        {row.note ? ` · ${row.note}` : ""}
                      </p>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-2xs rounded-full px-2.5 py-0.5 font-medium uppercase ${
                          row.status === "LIVE"
                            ? "bg-[var(--color-success-100)] text-[var(--color-success-500)]"
                            : "bg-[var(--bg-sunken)] text-[var(--ink-secondary)]"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="text-2xs px-5 py-3 text-[var(--ink-muted)]">
                      {row.updatedAt.toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <form action={setStatus} className="inline-flex gap-2">
                        <input type="hidden" name="kind" value={group.kind} />
                        <input type="hidden" name="id" value={row.id} />
                        <input
                          type="hidden"
                          name="status"
                          value={row.status === "LIVE" ? "DRAFT" : "LIVE"}
                        />
                        <button
                          type="submit"
                          className="rounded-[var(--radius-sm)] border border-[var(--border-default)] px-3 py-1.5 text-xs transition-colors hover:border-[var(--border-strong)]"
                        >
                          {row.status === "LIVE" ? "Unpublish" : "Publish"}
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
