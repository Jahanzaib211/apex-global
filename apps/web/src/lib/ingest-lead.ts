import "server-only";
import { prisma, type Prisma, type Lead, type LeadSourceType } from "@apex/db";
import { notifyNewLead } from "@apex/auth";
import { syncLeadToTwenty } from "@apex/integrations";
import { clientCountry, clientIp, dedupeKey, hashIp } from "@/lib/attribution.server";
import { enrichLeadInBackground } from "@/lib/enrich";

/**
 * The one path a lead takes into the CRM.
 *
 * Five public sites now feed this pipeline — the Apex Tech site's contact and
 * demo forms, plus the four group properties posting server-to-server through
 * /api/leads/partner. They had drifted into separate copies of the same
 * transaction, which is how the demo-request route ended up never notifying
 * ops: the highest-intent enquiry we receive was the one nobody was told
 * about. One function, one set of guarantees, one place to fix.
 *
 * What is guaranteed here:
 *   - the lead and its attribution commit together, or not at all
 *   - a repeat submission inside the dedupe window appends, never duplicates
 *   - side effects (enrich, notify, CRM sync) run only after the commit and
 *     can never roll it back
 */

/** The Apex properties allowed to write into this pipeline. */
export const LEAD_SITES = {
  "tech": "Apex Global Tech",
  "apex-group": "Apex Group of Companies",
  "apex-holdings": "Apex Holdings",
  "apex-outsourcing": "Apex Outsourcing",
  "apex-tours": "Apex Tours",
} as const;

export type LeadSite = keyof typeof LEAD_SITES;

export function isLeadSite(value: string): value is LeadSite {
  return Object.prototype.hasOwnProperty.call(LEAD_SITES, value);
}

/**
 * `string | null` throughout, not `string | undefined`: the contact form's
 * schema normalises empty fields to undefined while the demo form's leaves
 * them null, and Prisma treats both as "no value" on an optional column.
 * Accepting both here is what lets the two forms share one writer.
 */
export interface LeadAttributionInput {
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmTerm?: string | null;
  utmContent?: string | null;
  gclid?: string | null;
  fbclid?: string | null;
  msclkid?: string | null;
  referrer?: string | null;
  landingPath?: string | null;
  currentPath?: string | null;
  consentAnalytics?: boolean;
  consentMarketing?: boolean;
}

export interface LeadFields {
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  jobTitle?: string;
  country?: string;
  companySize?: string;
  interestType?: string;
  interestSlug?: string;
  requirements?: string;
  budgetBand?: string;
  timeline?: string;
  message?: string;
}

/**
 * The real end user, when the request did not come from their browser.
 *
 * A partner-site submission reaches us server-to-server, so the request
 * headers describe that site's server: one IP for every enquiry it ever
 * forwards, and its own fetch user-agent. Left alone that would give every
 * partner lead an identical IP hash and no country, quietly destroying the
 * geo and duplicate signals for four of the five sites. The sending origin
 * passes the visitor's details through inside the signed body instead.
 */
export interface VisitorOverride {
  ip?: string;
  userAgent?: string;
  country?: string;
}

export interface IngestLeadOptions<T = undefined> {
  input: LeadFields;
  attribution?: LeadAttributionInput;
  headers: Headers;
  visitor?: VisitorOverride;
  /** Which property captured this. Drives the dedupe window and CRM routing. */
  sourceSite: LeadSite;
  sourceType: LeadSourceType;
  /** Activity line written when the lead is first created. */
  activitySummary: string;
  /**
   * Runs inside the same transaction, after the lead exists. Use for records
   * that must not survive a rolled-back lead — the DemoRequest row, for one.
   */
  extend?: (tx: Prisma.TransactionClient, lead: Lead) => Promise<T>;
  /** Set false only for flows that deliberately stay silent. */
  notify?: boolean;
}

export interface IngestLeadResult<T = undefined> {
  lead: Lead;
  wasNew: boolean;
  extended: T;
}

export async function ingestLead<T = undefined>(
  options: IngestLeadOptions<T>,
): Promise<IngestLeadResult<T>> {
  const { input, headers, sourceSite, sourceType, activitySummary, extend, notify = true } = options;

  const attribution = options.attribution ?? {};
  const visitor = options.visitor ?? {};
  const ip = visitor.ip ?? clientIp(headers);
  const country = visitor.country ?? clientCountry(headers);
  const userAgent = (visitor.userAgent ?? headers.get("user-agent") ?? undefined)?.slice(0, 500);
  const key = dedupeKey(input.email, sourceSite);

  // One transaction: a lead without its attribution is a lead we cannot
  // attribute to spend, which defeats the purpose of collecting it.
  const { lead, wasNew, extended } = await prisma.$transaction(async (tx) => {
    const existing = await tx.lead.findUnique({ where: { dedupeKey: key } });

    if (existing) {
      // Same person, same site, same day. Append rather than duplicating, so
      // sales does not call twice and the original attribution is preserved.
      await tx.leadActivity.create({
        data: {
          leadId: existing.id,
          type: "note",
          summary: "Repeat submission on the same day",
          detail: input.message ?? input.requirements ?? null,
        },
      });

      const extendedValue = extend ? await extend(tx, existing) : (undefined as T);
      return { lead: existing, wasNew: false, extended: extendedValue };
    }

    const created = await tx.lead.create({
      data: {
        name: input.name,
        email: input.email,
        phone: input.phone,
        companyName: input.companyName,
        jobTitle: input.jobTitle,
        country: input.country ?? country,
        countryCode: country,
        companySize: input.companySize,
        interestType: input.interestType ?? "general",
        interestSlug: input.interestSlug,
        requirements: input.requirements,
        budgetBand: input.budgetBand,
        timeline: input.timeline,
        message: input.message,
        sourceType,
        sourceSite,
        dedupeKey: key,
        attribution: {
          create: {
            utmSource: attribution.utmSource,
            utmMedium: attribution.utmMedium,
            utmCampaign: attribution.utmCampaign,
            utmTerm: attribution.utmTerm,
            utmContent: attribution.utmContent,
            gclid: attribution.gclid,
            fbclid: attribution.fbclid,
            msclkid: attribution.msclkid,
            referrer: attribution.referrer,
            landingPath: attribution.landingPath,
            currentPath: attribution.currentPath,
            userAgent,
            // Hashed, never stored raw.
            ipHash: hashIp(ip),
            country,
            consentAnalytics: attribution.consentAnalytics ?? false,
            consentMarketing: attribution.consentMarketing ?? false,
          },
        },
        activities: {
          create: {
            type: "stage_change",
            summary: activitySummary,
            meta: {
              landingPath: attribution.landingPath ?? null,
              sourceSite,
            },
          },
        },
      },
    });

    const extendedValue = extend ? await extend(tx, created) : (undefined as T);
    return { lead: created, wasNew: true, extended: extendedValue };
  });

  // Everything below runs after the commit and is never awaited. A slow model,
  // a dead mail server or an unreachable CRM must not delay the response or
  // lose the enquiry — the record is already safe, and all three are
  // conveniences layered on top of it.
  //
  // Only on first capture: a repeat submission inside the window would
  // otherwise re-notify and re-score a lead sales has already seen.
  if (wasNew) {
    void enrichLeadInBackground(lead.id);

    if (notify) {
      void notifyNewLead({
        name: lead.name,
        email: lead.email,
        companyName: lead.companyName,
        phone: lead.phone,
        message: lead.message,
        source: lead.sourceType,
        siteLabel: LEAD_SITES[sourceSite],
        interest: lead.interestSlug ?? lead.interestType,
      }).catch((err) => console.error("[leads] notify failed", err));
    }

    void syncLeadToTwenty(lead.id);
  }

  // TODO(modules/crm): notification and server-side conversion delivery move
  // onto BullMQ with the worker tier, for retries and a dead-letter queue.
  // Until then a crash between the commit and these calls loses the side
  // effect but never the lead.

  return { lead, wasNew, extended };
}
