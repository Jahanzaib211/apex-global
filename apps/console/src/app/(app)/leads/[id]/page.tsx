import { prisma, type LeadStage } from "@apex/db";
import { Button } from "@apex/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { audit } from "@/lib/audit";
import { requirePermission } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Lead" };

const STAGES: LeadStage[] = ["NEW", "QUALIFIED", "OPPORTUNITY", "CUSTOMER", "LOST"];

type Props = { params: Promise<{ id: string }> };

export default async function LeadPage({ params }: Props) {
  await requirePermission("crm:read");
  const { id } = await params;

  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      attribution: true,
      owner: { select: { id: true, name: true } },
      activities: { orderBy: { createdAt: "desc" }, include: { actor: { select: { name: true } } } },
    },
  });
  if (!lead) notFound();

  const users = await prisma.user.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  async function updateLead(formData: FormData) {
    "use server";

    // The authorisation check lives here, in the mutation. The UI hiding a
    // control is presentation; this is the control.
    const actor = await requirePermission("crm:write");

    const stage = String(formData.get("stage") ?? "") as LeadStage;
    const ownerId = String(formData.get("ownerId") ?? "") || null;
    const note = String(formData.get("note") ?? "").trim();

    const before = await prisma.lead.findUniqueOrThrow({ where: { id } });
    if (!STAGES.includes(stage)) throw new Error("Unknown stage");

    const stageChanged = before.stage !== stage;
    const ownerChanged = before.ownerId !== ownerId;

    await prisma.$transaction(async (tx) => {
      await tx.lead.update({
        where: { id },
        data: {
          stage,
          ownerId,
          qualifiedAt: stage === "QUALIFIED" && !before.qualifiedAt ? new Date() : before.qualifiedAt,
          convertedAt: stage === "CUSTOMER" && !before.convertedAt ? new Date() : before.convertedAt,
          lostAt: stage === "LOST" && !before.lostAt ? new Date() : before.lostAt,
        },
      });

      if (stageChanged) {
        await tx.leadActivity.create({
          data: {
            leadId: id,
            actorId: actor.id,
            type: "stage_change",
            summary: `Stage changed from ${before.stage} to ${stage}`,
          },
        });
      }
      if (ownerChanged) {
        await tx.leadActivity.create({
          data: {
            leadId: id,
            actorId: actor.id,
            type: "assignment",
            summary: ownerId ? "Lead assigned" : "Lead unassigned",
          },
        });
      }
      if (note) {
        await tx.leadActivity.create({
          data: { leadId: id, actorId: actor.id, type: "note", summary: "Note added", detail: note },
        });
      }
    });

    if (stageChanged || ownerChanged) {
      await audit({
        actor,
        action: stageChanged ? "lead.stage_changed" : "lead.assigned",
        entityType: "Lead",
        entityId: id,
        summary: `${before.name}: ${stageChanged ? `${before.stage} → ${stage}` : "reassigned"}`,
        changes: {
          ...(stageChanged ? { stage: { from: before.stage, to: stage } } : {}),
          ...(ownerChanged ? { ownerId: { from: before.ownerId ?? null, to: ownerId } } : {}),
        },
      });
    }

    redirect(`/leads/${id}`);
  }

  const attribution = lead.attribution;

  return (
    <div className="flex flex-col gap-7">
      <div>
        <Link href="/leads" className="text-sm text-[var(--ink-secondary)] hover:underline">
          ← All leads
        </Link>
        <h1 className="mt-3 text-2xl">{lead.name}</h1>
        <p className="mt-1 text-[var(--ink-secondary)]">
          {lead.companyName ? `${lead.companyName} · ` : ""}
          <a href={`mailto:${lead.email}`} className="underline underline-offset-4">
            {lead.email}
          </a>
          {lead.phone ? ` · ${lead.phone}` : ""}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col gap-6">
          <section className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-6">
            <h2 className="font-semibold">Enquiry</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                ["Interest", lead.interestSlug],
                ["Country", lead.country],
                ["Company size", lead.companySize],
                ["Budget", lead.budgetBand],
                ["Timeline", lead.timeline],
                ["Source", lead.sourceType],
              ].map(([label, value]) => (
                <div key={String(label)}>
                  <dt className="text-2xs uppercase tracking-[0.12em] text-[var(--ink-muted)]">
                    {label}
                  </dt>
                  <dd className="mt-0.5 text-sm">{value || "—"}</dd>
                </div>
              ))}
            </dl>

            {lead.message ? (
              <div className="mt-5 border-t border-[var(--border-subtle)] pt-5">
                <h3 className="text-2xs uppercase tracking-[0.12em] text-[var(--ink-muted)]">
                  Message
                </h3>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{lead.message}</p>
              </div>
            ) : null}
          </section>

          <section className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-6">
            <h2 className="font-semibold">Update</h2>
            <form action={updateLead} className="mt-4 flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5 text-sm font-medium">
                  Stage
                  <select
                    name="stage"
                    defaultValue={lead.stage}
                    className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-raised)] px-3 text-sm font-normal"
                  >
                    {STAGES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1.5 text-sm font-medium">
                  Owner
                  <select
                    name="ownerId"
                    defaultValue={lead.ownerId ?? ""}
                    className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-raised)] px-3 text-sm font-normal"
                  >
                    <option value="">Unassigned</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="flex flex-col gap-1.5 text-sm font-medium">
                Add a note
                <textarea
                  name="note"
                  rows={3}
                  className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-raised)] px-3 py-2 text-sm font-normal"
                />
              </label>

              <Button type="submit" className="self-start">
                Save
              </Button>
            </form>
          </section>

          <section className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)]">
            <h2 className="border-b border-[var(--border-subtle)] px-6 py-4 font-semibold">
              Activity
            </h2>
            <ol className="divide-y divide-[var(--border-subtle)]">
              {lead.activities.map((a) => (
                <li key={a.id} className="px-6 py-4">
                  <p className="text-sm font-medium">{a.summary}</p>
                  {a.detail ? (
                    <p className="mt-1 whitespace-pre-wrap text-sm text-[var(--ink-secondary)]">
                      {a.detail}
                    </p>
                  ) : null}
                  <p className="mt-1 text-2xs text-[var(--ink-muted)]">
                    {a.actor?.name ?? "System"} · {a.createdAt.toLocaleString("en-GB")}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="flex flex-col gap-6">
          <section className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-6">
            <h2 className="font-semibold">Attribution</h2>
            <p className="mt-1 text-xs text-[var(--ink-muted)]">
              Captured at submission. This is what makes spend answerable.
            </p>
            <dl className="mt-4 flex flex-col gap-3 text-sm">
              {[
                ["Source", attribution?.utmSource],
                ["Medium", attribution?.utmMedium],
                ["Campaign", attribution?.utmCampaign],
                ["Term", attribution?.utmTerm],
                ["Content", attribution?.utmContent],
                ["Google click id", attribution?.gclid],
                ["Meta click id", attribution?.fbclid],
                ["Landing page", attribution?.landingPath],
                ["Referrer", attribution?.referrer],
                ["Country", attribution?.country],
              ]
                .filter(([, v]) => v)
                .map(([label, value]) => (
                  <div key={String(label)} className="flex justify-between gap-4">
                    <dt className="shrink-0 text-[var(--ink-muted)]">{label}</dt>
                    <dd className="truncate text-right">{String(value)}</dd>
                  </div>
                ))}
            </dl>

            {!attribution?.utmSource && !attribution?.referrer ? (
              <p className="mt-3 text-sm text-[var(--ink-secondary)]">
                Direct visit — no campaign parameters on the link they followed.
              </p>
            ) : null}

            <p className="mt-4 border-t border-[var(--border-subtle)] pt-3 text-2xs text-[var(--ink-muted)]">
              Consent at submission: analytics {attribution?.consentAnalytics ? "yes" : "no"},
              marketing {attribution?.consentMarketing ? "yes" : "no"}. IP stored as a rotating hash
              only.
            </p>
          </section>

          {lead.aiSummary ? (
            <section className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-6">
              <h2 className="font-semibold">AI summary</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--ink-secondary)]">
                {lead.aiSummary}
              </p>
              {lead.aiScore != null ? (
                <p className="mt-3 text-sm">
                  Score <span className="font-display font-semibold">{lead.aiScore}</span>/100
                </p>
              ) : null}
              <p className="mt-3 text-2xs text-[var(--ink-muted)]">
                Advisory only — generated by {lead.aiModel ?? "a model"} and never used to action or
                discard a lead on its own.
              </p>
            </section>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
