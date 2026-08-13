import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Twenty CRM integration.
 *
 * Twenty (https://twenty.com) is an open-source CRM alternative to Salesforce.
 * The CRM module here is the operational source of truth for leads; Twenty is
 * the partner-facing system the technology partner (ALI Technologies) works
 * out of for sales ops, deal management and forecasting.
 *
 * We sync by REST call to Twenty's GraphQL endpoint. Two operations:
 *
 *   - upsertPerson: write a Lead into Twenty as a Person + optional Company,
 *     with a deterministic external id we can use to reconcile later.
 *
 *   - upsertCompany: write a Company with the same external id.
 *
 * Twenty uses workspace-scoped API keys. The base URL is the workspace's
 * customer-facing hostname (e.g. https://api.twenty.com or a self-hosted
 * instance at https://crm.partner.example).
 *
 * Schema notes (Twenty v2, object-persistence API): object CRUD is exposed as
 * `createPerson`/`createCompany` (plus update/delete) mutations on /graphql,
 * which act as upserts when given `upsert: true`. Idempotency for people keys
 * off the unique `emails.primaryEmail`; for companies it keys off the unique
 * `domainName.primaryLinkUrl`. We additionally provision a custom unique
 * `externalId` text field on both objects so our `apex_lead_*`/`apex_co_*`
 * identifiers round-trip unchanged and webhook handler can resolve them
 * without a schema-dependent lookup. The old personUpsert/companyUpsert
 * mutations were removed upstream; `currentUser` also no longer exists on the
 * workspace schema.
 */

export interface TwentyConfig {
  /** Twenty workspace API base, e.g. https://api.twenty.com */
  baseUrl: string;
  /** API key issued by the workspace — passed as `Authorization: Bearer <key>`. */
  apiKey: string;
  /** Workspace slug — used in webhook payloads and to disambiguate multi-workspace setups. */
  workspaceSlug?: string;
}

export interface UpsertPersonInput {
  externalId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  city?: string;
  country?: string;
  /** Optional: link the person to a company by the company's externalId. */
  companyExternalId?: string;
  /** Custom field: which Apex campaign / surface produced this lead. */
  source?: string;
  /** Custom field: free-form notes pushed as a single field. */
  notes?: string;
}

export interface UpsertCompanyInput {
  externalId: string;
  name: string;
  domain?: string;
  employees?: number;
  industry?: string;
}

export class TwentyError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body?: unknown,
  ) {
    super(message);
    this.name = "TwentyError";
  }
}

export class TwentyClient {
  constructor(private readonly cfg: TwentyConfig) {
    if (!cfg.baseUrl) throw new Error("Twenty baseUrl is required");
    if (!cfg.apiKey) throw new Error("Twenty apiKey is required");
  }

  /** Upsert a Person (lead contact) into Twenty. Idempotent on `externalId`. */
  async upsertPerson(input: UpsertPersonInput): Promise<{ id: string; externalId: string }> {
    // Twenty v2 exposes object CRUD under `create<Object>` mutations that
    // behave as upserts when given `upsert: true`. Data flows through the
    // object's structured fields: name/emails/phones are aggregates, and the
    // custom `externalId` text field is our idempotency key.
    let companyId: string | undefined;
    if (input.companyExternalId) {
      companyId = await this.resolveCompanyId(input.companyExternalId);
    }

    const mutation = `
      mutation CreatePerson($data: PersonCreateInput!, $upsert: Boolean!) {
        createPerson(data: $data, upsert: $upsert) {
          id
        }
      }
    `;

    const variables = {
      data: {
        name: { firstName: input.firstName, lastName: input.lastName },
        emails: { primaryEmail: input.email },
        phones: input.phone ? { primaryPhoneNumber: input.phone } : undefined,
        jobTitle: input.jobTitle,
        city: input.city,
        // Custom fields are only present when the workspace has been extended
        // with them (see modules/crm README). Send them when provided and, if
        // Twenty rejects an unknown field, retry without the optional extras.
        ...(input.country ? { country: input.country } : {}),
        ...(input.source ? { source: input.source } : {}),
        ...(input.notes ? { notes: input.notes } : {}),
        companyId,
        externalId: input.externalId,
      },
      upsert: true,
    };

    try {
      const result = await this.gql<{ createPerson: { id: string } }>(mutation, variables);
      const upserted = result.createPerson;
      if (!upserted) {
        throw new TwentyError("Twenty returned no createPerson.id", 200);
      }
      return { id: upserted.id, externalId: input.externalId };
    } catch (error) {
      // A vanilla Twenty workspace may not have the custom `source` / `notes`
      // / `country` text fields. Drop the optional extras and retry with the
      // core-safe payload so a single unknown field never loses the lead sync.
      if (
        error instanceof TwentyError &&
        // Twenty phrases a missing custom field several ways depending on
        // version — `unknown field`, `Object person doesn't have any "source"
        // field.`, `Cannot query field "notes"`. Match all of them so a vanilla
        // workspace missing our optional extras still gets the core record.
        /unknown field|does(?:n'?t| not) have any|cannot query field/i.test(error.message) &&
        (input.country || input.source || input.notes)
      ) {
        const safe: typeof variables = {
          data: {
            name: { firstName: input.firstName, lastName: input.lastName },
            emails: { primaryEmail: input.email },
            phones: input.phone ? { primaryPhoneNumber: input.phone } : undefined,
            jobTitle: input.jobTitle,
            city: input.city,
            companyId,
            externalId: input.externalId,
          },
          upsert: true,
        };
        const result = await this.gql<{ createPerson: { id: string } }>(mutation, safe);
        const upserted = result.createPerson;
        if (!upserted) {
          throw new TwentyError("Twenty returned no createPerson.id", 200);
        }
        return { id: upserted.id, externalId: input.externalId };
      }
      throw error;
    }
  }

  /** Upsert a Company into Twenty. */
  async upsertCompany(input: UpsertCompanyInput): Promise<{ id: string; externalId: string }> {
    const mutation = `
      mutation CreateCompany($data: CompanyCreateInput!, $upsert: Boolean!) {
        createCompany(data: $data, upsert: $upsert) {
          id
        }
      }
    `;

    const variables = {
      data: {
        name: input.name,
        domainName: input.domain ? { primaryLinkUrl: input.domain } : undefined,
        externalId: input.externalId,
      },
      upsert: true,
    };

    const result = await this.gql<{ createCompany: { id: string } }>(mutation, variables);
    const upserted = result.createCompany;
    if (!upserted) {
      throw new TwentyError("Twenty returned no createCompany.id", 200);
    }
    return { id: upserted.id, externalId: input.externalId };
  }

  /**
   * Resolve the Twenty id of a company given its `externalId`, or undefined
   * when no match exists yet. We return undefined (rather than throwing) so a
   * missing company is a soft link failure — the Person upsert still succeeds
   * without the company association instead of aborting the whole lead sync.
   */
  private async resolveCompanyId(externalId: string): Promise<string | undefined> {
    const query = `
      query ResolveCompany($externalId: String!) {
        companies(filter: { externalId: { eq: $externalId } }) {
          edges {
            node { id }
          }
        }
      }
    `;

    const result = await this.gql<{
      companies: { edges: Array<{ node: { id: string } }> };
    }>(query, { externalId }).catch(() => undefined);

    return result?.companies?.edges?.[0]?.node?.id;
  }

  /**
   * Verify the workspace credential is live and the workspace is reachable.
   * Cheapest call: list a single company record, which exercises auth, the
   * workspace schema and the core query path in one round-trip.
   */
  async testConnection(): Promise<{ ok: boolean; detail: string }> {
    const query = `
      query TestConnection {
        companies(first: 1) {
          edges { node { id } }
        }
      }
    `;
    try {
      await this.gql<{ companies: { edges: Array<{ node: { id: string } }> } }>(query);
      return {
        ok: true,
        detail: `Connected to Twenty at ${this.cfg.baseUrl}${this.cfg.workspaceSlug ? ` (workspace ${this.cfg.workspaceSlug})` : ""}`,
      };
    } catch (error) {
      return { ok: false, detail: error instanceof Error ? error.message : String(error) };
    }
  }

  /**
   * Verify an inbound webhook signature.
   *
   * Twenty signs each webhook payload with HMAC-SHA256 over the raw body,
   * using the workspace's webhook signing secret as the key. The signature
   * arrives in `x-twenty-signature` as a hex string.
   */
  verifyWebhookSignature(
    rawBody: string,
    signatureHeader: string | null,
    signingSecret: string,
  ): boolean {
    if (!signatureHeader) return false;
    const expected = createHmac("sha256", signingSecret).update(rawBody).digest("hex");
    try {
      return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(signatureHeader, "hex"));
    } catch {
      return false;
    }
  }

  private async gql<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
    const res = await fetch(`${this.cfg.baseUrl.replace(/\/$/, "")}/graphql`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.cfg.apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query, variables }),
      signal: AbortSignal.timeout(15_000),
    });

    const text = await res.text();
    const parsed = text ? safeJson(text) : undefined;

    if (!res.ok) {
      throw new TwentyError(
        `Twenty GraphQL → ${res.status}: ${text.slice(0, 200)}`,
        res.status,
        parsed,
      );
    }

    // GraphQL responses can carry a 200 with `errors: [...]` when a single
    // operation failed. Surface the first one rather than letting the caller
    // silently work with `undefined` data.
    if (parsed && typeof parsed === "object" && "errors" in parsed) {
      const errs = (parsed as { errors: Array<{ message: string }> }).errors;
      if (errs && errs.length > 0) {
        throw new TwentyError(`Twenty: ${errs[0]?.message ?? "unknown error"}`, res.status, parsed);
      }
    }
    return (parsed as { data: T }).data;
  }
}

function safeJson(s: string): unknown {
  try {
    return JSON.parse(s);
  } catch {
    return undefined;
  }
}

/** Build a client from a stored `PartnerIntegration` config blob. */
export function clientFromConfig(cfg: TwentyConfig & { enabled?: boolean }): TwentyClient {
  return new TwentyClient(cfg);
}

/** Split a full name into first + last, sensibly handling missing pieces. */
export function splitName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = fullName.trim().replace(/\s+/g, " ");
  if (!trimmed) return { firstName: "—", lastName: "—" };
  const parts = trimmed.split(" ");
  if (parts.length === 1) return { firstName: parts[0]!, lastName: "—" };
  return { firstName: parts[0]!, lastName: parts.slice(1).join(" ") };
}

/** Stable external id for a lead, used to reconcile with Twenty across syncs. */
export function leadExternalId(leadId: string): string {
  return `apex_lead_${leadId}`;
}

/** Stable external id for a company. */
export function companyExternalId(companyName: string): string {
  const slug = companyName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_+$/g, "")
    .slice(0, 60);
  return `apex_co_${slug || "unknown"}`;
}
