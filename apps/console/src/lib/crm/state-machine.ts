import "server-only";
import { prisma, type Lead, type LeadStage } from "@apex/db";
import { audit } from "@/lib/audit";
import type { SessionUser } from "@/lib/auth";

/**
 * Lead pipeline transitions driven by billing events.
 *
 * The operator never has to remember "did I move this lead to OPPORTUNITY?"
 * — issuing a quote or invoice for a lead is the commercial signal that the
 * enquiry became a deal, and a payment is the signal it became a customer.
 * Every transition is written to the lead activity feed and the audit log so
 * the change is attributable, and idempotent: a re-send or a re-check never
 * moves a lead backwards.
 */

const ACTIVITY = "stage_change";

async function transition(
  lead: Pick<Lead, "id" | "stage">,
  actor: SessionUser,
  to: LeadStage,
  summary: string,
): Promise<void> {
  await prisma.lead.update({ where: { id: lead.id }, data: { stage: to } });
  await prisma.leadActivity.create({
    data: {
      leadId: lead.id,
      actorId: actor.id,
      type: ACTIVITY,
      summary,
      meta: { from: lead.stage, to },
    },
  });
  await audit({
    actor,
    action: "crm.lead_stage_changed",
    entityType: "Lead",
    entityId: lead.id,
    summary,
    changes: { stage: { from: lead.stage, to } },
  });
}

export async function advanceLeadOnQuoteAccepted(
  lead: Pick<Lead, "id" | "stage">,
  actor: SessionUser,
  quoteNumber: string,
): Promise<void> {
  if (lead.stage !== "NEW" && lead.stage !== "QUALIFIED") return;
  await transition(
    lead,
    actor,
    "OPPORTUNITY",
    `Quote ${quoteNumber} accepted — ${lead.stage} → OPPORTUNITY`,
  );
}

export async function advanceLeadOnInvoiceSent(
  lead: Pick<Lead, "id" | "stage">,
  actor: SessionUser,
  invoiceNumber: string,
): Promise<void> {
  if (lead.stage !== "NEW" && lead.stage !== "QUALIFIED") return;
  await transition(
    lead,
    actor,
    "OPPORTUNITY",
    `Invoice ${invoiceNumber} sent — ${lead.stage} → OPPORTUNITY`,
  );
}

export async function advanceLeadOnInvoicePaid(
  lead: Pick<Lead, "id" | "stage" | "valueAmount">,
  actor: SessionUser,
  invoiceNumber: string,
  totalAmount: number,
): Promise<void> {
  if (lead.stage === "CUSTOMER" || lead.stage === "LOST") return;

  const next: LeadStage = "CUSTOMER";
  const valueAmount = Math.max(lead.valueAmount ?? 0, totalAmount);
  await prisma.lead.update({
    where: { id: lead.id },
    data: { stage: next, valueAmount, convertedAt: new Date() },
  });
  await prisma.leadActivity.create({
    data: {
      leadId: lead.id,
      actorId: actor.id,
      type: ACTIVITY,
      summary: `Invoice ${invoiceNumber} paid — ${lead.stage} → CUSTOMER`,
      meta: { from: lead.stage, to: next, valueAmount, invoiceNumber },
    },
  });
  await audit({
    actor,
    action: "crm.lead_stage_changed",
    entityType: "Lead",
    entityId: lead.id,
    summary: `Invoice ${invoiceNumber} paid — ${lead.stage} → CUSTOMER`,
    changes: {
      stage: { from: lead.stage, to: next },
      valueAmount: { from: String(lead.valueAmount ?? 0), to: String(valueAmount) },
    },
  });
}