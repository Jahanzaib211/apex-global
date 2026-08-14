import { headers } from "next/headers";
import { forwardLeadToApex, type ApexLeadAttribution } from "@/lib/apex-lead";

/**
 * Adapter between this site's form payloads and the Apex CRM.
 *
 * Every enquiry form here is a server action that used to `console.log` its
 * payload and return `{ ok: true }` — the partnership enquiries, site-visit
 * bookings, consultancy requests and career applications on the group's
 * flagship site were all being written to a log line and discarded. This puts
 * them into the same pipeline as every other Apex enquiry.
 *
 * The forms disagree on field names (`fullName` vs `name`, `proposal` vs
 * `message` vs `notes`) and each carries fields no other form has. Rather than
 * a bespoke mapping per form, the common identity fields are picked by alias
 * and everything left over is rendered into a readable block so nothing the
 * customer typed is lost.
 */

const NAME_KEYS = ["fullName", "name", "contactName", "applicantName"];
const EMAIL_KEYS = ["email", "emailAddress"];
const PHONE_KEYS = ["phone", "phoneNumber", "mobile", "whatsapp"];
const COMPANY_KEYS = ["company", "companyName", "organisation", "organization"];
const TITLE_KEYS = ["position", "jobTitle", "role", "designation"];
const COUNTRY_KEYS = ["country"];
const MESSAGE_KEYS = ["message", "proposal", "notes", "details", "comments", "requirements"];

/** Fields consumed by a dedicated column, or not worth repeating in the summary. */
const CONSUMED = new Set([
  ...NAME_KEYS,
  ...EMAIL_KEYS,
  ...PHONE_KEYS,
  ...COMPANY_KEYS,
  ...TITLE_KEYS,
  ...COUNTRY_KEYS,
  ...MESSAGE_KEYS,
  "consent",
  "attribution",
  "source",
]);

type Payload = Record<string, unknown>;

/**
 * Flatten one level of nesting.
 *
 * The consultancy form groups its fields into `contact`, `profile`, `business`
 * and `requirement` objects; the others are flat. Flattening first means the
 * alias lookup below finds `contact.email` without every caller having to
 * reshape its payload.
 */
function flatten(payload: Payload): Payload {
  const out: Payload = {};
  for (const [k, v] of Object.entries(payload)) {
    if (v && typeof v === "object" && !Array.isArray(v)) {
      for (const [ik, iv] of Object.entries(v as Payload)) {
        // An outer key of the same name wins — it is the more specific answer.
        if (!(ik in out)) out[ik] = iv;
      }
    } else if (!(k in out)) {
      out[k] = v;
    }
  }
  // Outer scalars take precedence over anything hoisted from a nested object.
  for (const [k, v] of Object.entries(payload)) {
    if (!v || typeof v !== "object" || Array.isArray(v)) out[k] = v;
  }
  return out;
}

function pick(payload: Payload, keys: string[]): string | undefined {
  for (const k of keys) {
    const v = payload[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return undefined;
}

/** Turn `partnershipType` into `Partnership type`, for a human reading the CRM. */
function label(key: string): string {
  const spaced = key.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase();
}

function leftovers(payload: Payload): string | undefined {
  const lines: string[] = [];
  for (const [k, v] of Object.entries(payload)) {
    if (CONSUMED.has(k)) continue;
    if (v === undefined || v === null || v === "") continue;
    // Multi-select answers (the consultancy form's `topics`) are real content.
    if (Array.isArray(v)) {
      if (v.length) lines.push(`${label(k)}: ${v.join(", ")}`);
      continue;
    }
    if (typeof v === "object") continue;
    lines.push(`${label(k)}: ${String(v)}`);
  }
  return lines.length ? lines.join("\n") : undefined;
}

/**
 * Outcome of recording an enquiry.
 *
 * This used to return void, which meant a server action had no way to tell that
 * forwarding had failed — the visitor was shown a success message either way.
 * `forwardLeadToApex` now spools failures to disk so nothing is lost, but the
 * caller should still be able to see what happened, and to decide whether to
 * soften what it tells the visitor.
 */
export interface RecordResult {
  /** True when the CRM accepted the enquiry. False means it was spooled. */
  ok: boolean;
  /** Why it failed, when it did. */
  reason?: string;
}

export async function recordGroupEnquiry(args: {
  /** Human label for where this came from, e.g. "Apex Group — Partnership". */
  source: string;
  /** Routing hint for the CRM: which group business this is about. */
  interestType?: string;
  interestSlug?: string;
  payload: Payload;
}): Promise<RecordResult> {
  const { source } = args;
  const payload = flatten(args.payload);

  const name = pick(payload, NAME_KEYS);
  const email = pick(payload, EMAIL_KEYS);
  const phone = pick(payload, PHONE_KEYS);

  // The CRM keys people on email. A newsletter signup has one; a form that
  // somehow reached us without either is not a lead we can act on, and is
  // better dropped here than stored as an unreachable record.
  if (!email) {
    console.warn(`[group-enquiry] ${source}: no email in payload — not forwarded`);
    return { ok: false, reason: "no_email" };
  }

  const h = await headers();

  const detail = leftovers(payload);
  const message = pick(payload, MESSAGE_KEYS);

  const result = await forwardLeadToApex(
    {
      // Newsletter forms collect an address and nothing else.
      name: name ?? email.split("@")[0] ?? "Unknown",
      email,
      phone,
      companyName: pick(payload, COMPANY_KEYS),
      jobTitle: pick(payload, TITLE_KEYS),
      country: pick(payload, COUNTRY_KEYS),
      interestType: args.interestType ?? "general",
      interestSlug: args.interestSlug,
      message,
      requirements: detail ? `${source}\n\n${detail}` : source,
      attribution: payload.attribution as ApexLeadAttribution | undefined,
    },
    {
      ip: h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("cf-connecting-ip") ?? undefined,
      userAgent: h.get("user-agent") ?? undefined,
      country: h.get("cf-ipcountry") ?? undefined,
    },
    { site: "apex-group" },
  );

  if (!result.ok) {
    // Not lost — forwardLeadToApex has spooled it to .apex-lead-spool for replay.
    console.error(
      `[group-enquiry] ${source}: not forwarded (${result.reason}) — spooled for replay`,
    );
    return { ok: false, reason: result.reason };
  }

  return { ok: true };
}
