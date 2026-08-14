/**
 * `forwardLeadToApex` shared client for all four sibling properties.
 *
 * Every Apex site posts its contact forms to one pipeline on
 * `tech.apexgroupcompanies.com` so dedupe, attribution, AI scoring and CRM
 * sync happen once. Each sibling passed in different per-site IDs (some used
 * the value-as-defined `apex-group`, others their internal `apex-outsourcing`),
 * and copy-pasted the same code four times. This is the single source.
 */

import { appendFile, mkdir } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { createHmac } from "node:crypto";

import type { ApexSiteId } from "./site";

/** Re-exported under its canonical name so consumers don't have to remember two. */
export type { LeadInput } from "./lead-schema";

export interface Attribution {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  gclid?: string;
  fbclid?: string;
  msclkid?: string;
  referrer?: string;
  landingPath?: string;
  currentPath?: string;
}

export interface ApexLeadInput {
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  jobTitle?: string;
  country?: string;
  companySize?: string;
  /** What this site sells: "tour", "outsourcing", "holdings", "general". */
  interestType?: string;
  interestSlug?: string;
  budgetBand?: string;
  timeline?: string;
  requirements?: string;
  message?: string;
  attribution?: Attribution;
  /** Honeypot value from the form, forwarded so Apex applies the same trap. */
  company_website?: string;
}

export interface Visitor {
  /** The end user's address, not this server's. */
  ip?: string;
  userAgent?: string;
  country?: string;
}

export type ForwardResult =
  | { ok: true; id: string; wasNew: boolean }
  | { ok: false; reason: "unconfigured" | "rejected" | "unreachable"; status?: number };

export interface ForwardOptions {
  /** Which Apex property this is. Must match a key of LEAD_SITES in the Apex web app. */
  readonly site: ApexSiteId;
  /** Override the upstream endpoint (used by tests). */
  readonly endpoint?: string;
  /** Override the spool directory (used by tests). */
  readonly spoolDir?: string;
}

const DEFAULT_ENDPOINT = "https://tech.apexgroupcompanies.com/api/leads/partner";

/** Drop empty strings so optional columns stay null rather than "". */
function clean<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    if (typeof v === "string" && v.trim() === "") continue;
    out[k] = typeof v === "string" ? v.trim() : v;
  }
  return out as Partial<T>;
}

/**
 * Spool a signed payload for later replay. Re-exported as a private helper for
 * tests; consumers should only call `forwardLeadToApex`.
 */
export async function spool(
  site: ApexSiteId,
  reason: string,
  body: string,
  spoolDir: string,
): Promise<void> {
  try {
    await mkdir(spoolDir, { recursive: true });
    const day = new Date().toISOString().slice(0, 10);
    const line = `${JSON.stringify({ at: new Date().toISOString(), site, reason, body })}\n`;
    await appendFile(join(spoolDir, `${site}-${day}.jsonl`), line, "utf8");
  } catch (err) {
    console.error(`[apex-lead][${site}] SPOOL WRITE FAILED — enquiry is lost`, err);
  }
}

/**
 * Forward an enquiry to the Apex CRM.
 *
 * Best-effort by contract: this never throws and never rejects. A CRM that is
 * down must not turn into a failed form submission for a customer standing
 * in front of the page.
 *
 * Every failure path spools the signed payload to disk before returning, so a
 * follow-up batch can drain the spool into the upstream endpoint without
 * losing enquiries.
 */
export async function forwardLeadToApex(
  input: ApexLeadInput,
  visitor: Visitor = {},
  options: Partial<ForwardOptions> & { site: ApexSiteId },
): Promise<ForwardResult> {
  const site = options.site;
  const endpoint = options.endpoint ?? process.env.APEX_LEAD_ENDPOINT ?? DEFAULT_ENDPOINT;
  const secret = process.env.PARTNER_LEAD_SECRET ?? "";
  const spoolDir =
    options.spoolDir ?? process.env.APEX_LEAD_SPOOL_DIR ?? join(homedir(), ".apex-lead-spool");

  const post = async (body: string): Promise<Response> => {
    const timestamp = String(Math.floor(Date.now() / 1000));
    // Signed over `timestamp.site.body` so neither the payload nor the claimed
    // site can be altered in transit.
    const signature = createHmac("sha256", secret)
      .update(`${timestamp}.${site}.${body}`)
      .digest("hex");

    return fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-apex-site": site,
        "x-apex-timestamp": timestamp,
        "x-apex-signature": signature,
      },
      body,
      signal: AbortSignal.timeout(10_000),
    });
  };

  if (!secret) {
    console.warn(
      `[apex-lead][${site}] PARTNER_LEAD_SECRET is not set — enquiry not forwarded to the CRM`,
    );
    await spool(site, "unconfigured", JSON.stringify({ input, visitor }), spoolDir);
    return { ok: false, reason: "unconfigured" };
  }

  const body = JSON.stringify({
    ...clean({ ...input, attribution: undefined, company_website: undefined }),
    consentContact: true,
    company_website: input.company_website ?? "",
    attribution: clean({ ...(input.attribution ?? {}) }),
    visitor: clean({ ...visitor }),
  });

  // One retry, and only on 5xx or a network failure. The Apex endpoint keys
  // its dedupe on site + email + day, so a retry that actually did land the
  // first time is absorbed as a repeat rather than creating a second lead.
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await post(body);

      if (res.ok) {
        const data = (await res.json().catch(() => ({}))) as { id?: string; wasNew?: boolean };
        return { ok: true, id: data.id ?? "", wasNew: data.wasNew ?? true };
      }

      // 4xx is our bug (bad signature, bad payload) — retrying cannot fix it.
      // Spool anyway: the enquiry is still a real customer, and the payload is
      // the evidence needed to work out what was malformed.
      if (res.status < 500) {
        console.error(`[apex-lead][${site}] rejected with ${res.status}`);
        await spool(site, `rejected:${res.status}`, body, spoolDir);
        return { ok: false, reason: "rejected", status: res.status };
      }

      if (attempt === 1) {
        console.error(`[apex-lead][${site}] failed after retry with ${res.status}`);
        await spool(site, `unreachable:${res.status}`, body, spoolDir);
        return { ok: false, reason: "unreachable", status: res.status };
      }
    } catch (err) {
      if (attempt === 1) {
        console.error(`[apex-lead][${site}] unreachable`, err);
        await spool(site, "unreachable:network", body, spoolDir);
        return { ok: false, reason: "unreachable" };
      }
    }
  }

  await spool(site, "unreachable:exhausted", body, spoolDir);
  return { ok: false, reason: "unreachable" };
}

/** The visitor's real address, as seen through the Cloudflare tunnel. */
export function visitorFrom(req: Request): Visitor {
  const fwd = req.headers.get("x-forwarded-for");
  return clean({
    ip: fwd?.split(",")[0]?.trim() ?? req.headers.get("cf-connecting-ip") ?? undefined,
    userAgent: req.headers.get("user-agent") ?? undefined,
    country: req.headers.get("cf-ipcountry") ?? undefined,
  });
}
