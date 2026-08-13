import { prisma } from "@apex/db";
import { SectionHeading } from "@apex/ui";
import Link from "next/link";
import { requirePortalUserAccount } from "@/lib/portal/auth";

export const dynamic = "force-dynamic";

export default async function PortalServicesPage() {
  const { user } = await requirePortalUserAccount();

  // Pull the invoices tied to this account and treat each one as a "service"
  // for portal display purposes — every invoice is one engagement we are
  // running for the client.
  const services = await prisma.invoice.findMany({
    where: { lead: { portalAccounts: { some: { id: user.portalAccountId } } } },
    orderBy: { createdAt: "desc" },
    include: { quote: true },
  });

  return (
    <div className="flex flex-col gap-8">
      <SectionHeading
        eyebrow="Services"
        title="What we are running for you"
        lede="Each line below is an active or past engagement with the Apex team."
      />

      {services.length === 0 ? (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] bg-[var(--bg-raised)] p-8 text-center">
          <h2 className="text-lg font-semibold">No services yet</h2>
          <p className="mt-2 text-sm text-[var(--ink-secondary)]">
            Active engagements appear here once an invoice is issued.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {services.map((s) => (
            <article
              key={s.id}
              className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-5"
            >
              <p className="text-2xs font-semibold tracking-[0.16em] text-[var(--color-amber-700)] uppercase">
                {s.quote?.serviceSlug ?? s.quote?.productSlug ?? "Custom"}
              </p>
              <p className="text-lg font-semibold">{s.notes ?? s.number}</p>
              <p className="text-2xs text-[var(--ink-muted)]">
                {s.currency} {(s.totalAmount / 100).toLocaleString()} · {s.status.toLowerCase()}
              </p>
              <Link
                href={`/portal/invoices/${s.id}`}
                className="mt-auto self-start text-sm font-medium underline-offset-4 hover:underline"
              >
                See invoice →
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
