import { prisma } from "@apex/db";
import { SectionHeading } from "@apex/ui";
import Link from "next/link";
import { requirePortalUserAccount } from "@/lib/portal/auth";

export const dynamic = "force-dynamic";

export default async function PortalDocumentsPage() {
  const { user } = await requirePortalUserAccount();

  const docs = await prisma.clientDocument.findMany({
    where: { portalAccountId: user.portalAccountId, publishedAt: { not: null } },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-8">
      <SectionHeading
        eyebrow="Documents"
        title="Shared documents"
        lede="Contracts, reports, deliverables — anything the Apex team has shared with you."
      />

      {docs.length === 0 ? (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] bg-[var(--bg-raised)] p-8 text-center">
          <h2 className="text-lg font-semibold">No shared documents yet</h2>
          <p className="mt-2 text-sm text-[var(--ink-secondary)]">
            Files shared by your Apex team will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {docs.map((d) => (
            <Link
              key={d.id}
              href={`/portal/api/documents/${d.id}`}
              className="flex items-center justify-between gap-3 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-4 transition-colors hover:border-[var(--color-amber-500)]"
            >
              <div>
                <p className="font-medium">{d.title ?? d.filename}</p>
                <p className="text-2xs text-[var(--ink-muted)]">
                  {d.mimeType} · {(d.bytes / 1024).toFixed(1)} KB · shared{" "}
                  {d.publishedAt?.toLocaleDateString("en-GB")}
                </p>
              </div>
              <span className="text-2xs font-medium text-[var(--color-amber-700)] uppercase">
                Download
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
