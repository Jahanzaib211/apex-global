import { prisma } from "@apex/db";
import { Section, SectionHeading } from "@apex/ui";
import Link from "next/link";
import { requirePortalUserAccount } from "@/lib/portal/auth";

export const dynamic = "force-dynamic";

/**
 * Portal home — what's outstanding for this account.
 *
 * Renders four tiles: open invoices, open tickets, active projects, latest
 * document. Every query is scoped to the signed-in user's account so a
 * missing join is the only way data could leak.
 */
export default async function PortalHomePage() {
  const { user } = await requirePortalUserAccount();

  const [openInvoices, openTickets, activeProjects, latestDocument, account] = await Promise.all([
    prisma.invoice.count({
      where: {
        lead: { portalAccounts: { some: { id: user.portalAccountId } } },
        status: { in: ["SENT", "OVERDUE", "PROCESSING"] },
      },
    }),
    prisma.ticket.count({
      where: { portalAccountId: user.portalAccountId, status: { in: ["OPEN", "WAITING"] } },
    }),
    prisma.project.count({
      where: { portalAccountId: user.portalAccountId, status: { not: "COMPLETED" } },
    }),
    prisma.clientDocument.findFirst({
      where: { portalAccountId: user.portalAccountId, publishedAt: { not: null } },
      orderBy: { publishedAt: "desc" },
    }),
    prisma.portalAccount.findUnique({ where: { id: user.portalAccountId } }),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-3xl">Welcome back, {user.name.split(" ")[0]}</h1>
        <p className="mt-2 text-[var(--ink-secondary)]">
          {account?.name} · {user.role.toLowerCase()}
        </p>
      </header>

      <Section className="!py-0">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Tile
            href="/portal/invoices"
            label="Open invoices"
            value={openInvoices}
            tone={openInvoices > 0 ? "warn" : "neutral"}
          />
          <Tile
            href="/portal/tickets"
            label="Open tickets"
            value={openTickets}
            tone={openTickets > 0 ? "warn" : "neutral"}
          />
          <Tile href="/portal/projects" label="Active projects" value={activeProjects} />
          <Tile
            href="/portal/documents"
            label="Latest document"
            value={latestDocument?.title ?? latestDocument?.filename ?? "—"}
            small
          />
        </div>
      </Section>

      <Section className="!py-0">
        <SectionHeading eyebrow="Shortcuts" title="Where would you like to start?" />
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              href: "/portal/invoices",
              title: "Pay an invoice",
              body: "Open invoices and settle them via Hyperswitch.",
            },
            {
              href: "/portal/tickets/new",
              title: "Open a ticket",
              body: "Tell us what is wrong and we will be in touch.",
            },
            {
              href: "/portal/projects",
              title: "See project status",
              body: "Track tasks, milestones and approvals.",
            },
            {
              href: "/portal/documents",
              title: "Find a document",
              body: "Contracts, reports and shared files.",
            },
            {
              href: "/portal/account",
              title: "Manage your account",
              body: "Password, 2FA, OAuth links, active sessions.",
            },
            {
              href: "/portal/services",
              title: "Your services",
              body: "What we are running for you.",
            },
          ].map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group flex flex-col gap-2 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-5 transition-colors hover:border-[var(--color-amber-500)]"
            >
              <h3 className="font-semibold">{c.title}</h3>
              <p className="text-sm text-[var(--ink-secondary)]">{c.body}</p>
              <span className="text-2xs mt-1 font-medium tracking-[0.16em] text-[var(--color-amber-700)] uppercase">
                Open →
              </span>
            </Link>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Tile({
  href,
  label,
  value,
  tone = "neutral",
  small = false,
}: {
  href: string;
  label: string;
  value: number | string;
  tone?: "neutral" | "warn";
  small?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex flex-col gap-2 rounded-[var(--radius-lg)] border bg-[var(--bg-raised)] p-5 transition-colors hover:border-[var(--color-amber-500)] ${
        tone === "warn" ? "border-[var(--color-amber-500)]" : "border-[var(--border-default)]"
      }`}
    >
      <p className="text-2xs font-semibold tracking-[0.16em] text-[var(--ink-muted)] uppercase">
        {label}
      </p>
      <p className={`${small ? "text-base" : "text-2xl"} font-display font-semibold`}>{value}</p>
    </Link>
  );
}
