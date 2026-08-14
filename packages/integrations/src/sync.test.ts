import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * `syncLeadToTwenty` is the path a captured lead takes into the partner CRM.
 *
 * It is deliberately failure-tolerant — every error is swallowed and reported
 * rather than thrown, because losing a lead is worse than a failed sync. That
 * design makes it exactly the kind of code that can silently stop working, so
 * each refusal reason is pinned here by name.
 *
 * The database, the vault and the Twenty client are all mocked: this asserts
 * the decision logic, not Prisma or the wire format.
 */

const prisma = {
  partnerIntegration: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  lead: {
    findUnique: vi.fn(),
  },
};

const upsertCompany = vi.fn();
const upsertPerson = vi.fn();
const open = vi.fn();

vi.mock("@apex/db", () => ({ prisma }));
vi.mock("./vault", () => ({ open }));

vi.mock("./twenty", async (importOriginal) => {
  // Keep the real id/name helpers — they are pure and already tested, and
  // stubbing them would hide a change in the external-id contract.
  const actual = await importOriginal<typeof import("./twenty")>();
  return {
    ...actual,
    clientFromConfig: () => ({ upsertCompany, upsertPerson }),
  };
});

const { syncLeadToTwenty } = await import("./sync");
const { TwentyError } = await import("./twenty");

/** An enabled integration with a decryptable key. */
function enabledIntegration(config: Record<string, unknown> = {}) {
  return {
    provider: "twenty-crm",
    isEnabled: true,
    secretCiphertext: "cipher",
    secretIv: "iv",
    secretTag: "tag",
    config,
  };
}

function lead(overrides: Record<string, unknown> = {}) {
  return {
    id: "lead_1",
    name: "Ada Lovelace",
    email: "ada@example.org",
    phone: null,
    jobTitle: null,
    country: null,
    companyName: null,
    message: null,
    requirements: null,
    sourceType: "web",
    attribution: null,
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  open.mockReturnValue("decrypted-api-key");
  prisma.partnerIntegration.update.mockResolvedValue({});
  upsertCompany.mockResolvedValue({});
  upsertPerson.mockResolvedValue({});
});

describe("refusals", () => {
  it("declines when the integration row does not exist", async () => {
    prisma.partnerIntegration.findUnique.mockResolvedValue(null);

    const result = await syncLeadToTwenty("lead_1");

    expect(result.ok).toBe(false);
    expect(result.detail).toMatch(/not enabled/i);
    expect(prisma.lead.findUnique).not.toHaveBeenCalled();
  });

  it("declines when the integration exists but is disabled", async () => {
    prisma.partnerIntegration.findUnique.mockResolvedValue({
      ...enabledIntegration(),
      isEnabled: false,
    });

    const result = await syncLeadToTwenty("lead_1");

    expect(result.ok).toBe(false);
    expect(result.detail).toMatch(/not enabled/i);
    expect(upsertPerson).not.toHaveBeenCalled();
  });

  it("names the lead it could not find", async () => {
    prisma.partnerIntegration.findUnique.mockResolvedValue(enabledIntegration());
    prisma.lead.findUnique.mockResolvedValue(null);

    const result = await syncLeadToTwenty("missing_lead");

    expect(result.ok).toBe(false);
    expect(result.detail).toContain("missing_lead");
  });

  it("declines when the API key is not configured", async () => {
    prisma.partnerIntegration.findUnique.mockResolvedValue({
      ...enabledIntegration(),
      secretCiphertext: null,
    });
    prisma.lead.findUnique.mockResolvedValue(lead());

    const result = await syncLeadToTwenty("lead_1");

    expect(result.ok).toBe(false);
    expect(result.detail).toMatch(/api key not configured/i);
    // The vault is never opened when there is nothing to open.
    expect(open).not.toHaveBeenCalled();
  });

  it("stamps every refusal with a timestamp", async () => {
    prisma.partnerIntegration.findUnique.mockResolvedValue(null);
    const result = await syncLeadToTwenty("lead_1");
    expect(result.syncedAt).toBeInstanceOf(Date);
  });
});

describe("a successful sync", () => {
  beforeEach(() => {
    prisma.partnerIntegration.findUnique.mockResolvedValue(
      enabledIntegration({ baseUrl: "https://crm.example", workspaceSlug: "apex" }),
    );
  });

  it("upserts the person and reports the address it synced", async () => {
    prisma.lead.findUnique.mockResolvedValue(lead());

    const result = await syncLeadToTwenty("lead_1");

    expect(result.ok).toBe(true);
    expect(result.detail).toContain("ada@example.org");
    expect(upsertPerson).toHaveBeenCalledTimes(1);
  });

  it("splits the name and carries the stable external id", async () => {
    prisma.lead.findUnique.mockResolvedValue(lead());

    await syncLeadToTwenty("lead_1");

    expect(upsertPerson).toHaveBeenCalledWith(
      expect.objectContaining({
        externalId: "apex_lead_lead_1",
        firstName: "Ada",
        lastName: "Lovelace",
        email: "ada@example.org",
      }),
    );
  });

  it("creates the company before the person, so the link resolves on insert", async () => {
    prisma.lead.findUnique.mockResolvedValue(lead({ companyName: "Acme Corp, Inc." }));

    await syncLeadToTwenty("lead_1");

    expect(upsertCompany).toHaveBeenCalledWith({
      externalId: "apex_co_acme_corp_inc",
      name: "Acme Corp, Inc.",
    });
    expect(upsertCompany.mock.invocationCallOrder[0]).toBeLessThan(
      upsertPerson.mock.invocationCallOrder[0]!,
    );
    expect(upsertPerson).toHaveBeenCalledWith(
      expect.objectContaining({ companyExternalId: "apex_co_acme_corp_inc" }),
    );
  });

  it("does not touch companies when the lead gave none", async () => {
    prisma.lead.findUnique.mockResolvedValue(lead());

    await syncLeadToTwenty("lead_1");

    expect(upsertCompany).not.toHaveBeenCalled();
    expect(upsertPerson).toHaveBeenCalledWith(
      expect.objectContaining({ companyExternalId: undefined }),
    );
  });

  it("prefers the lead's own country over the attributed one", async () => {
    prisma.lead.findUnique.mockResolvedValue(
      lead({ country: "PK", attribution: { country: "SA", utmSource: null } }),
    );

    await syncLeadToTwenty("lead_1");

    expect(upsertPerson).toHaveBeenCalledWith(expect.objectContaining({ country: "PK" }));
  });

  it("falls back to the attributed country when the lead gave none", async () => {
    prisma.lead.findUnique.mockResolvedValue(
      lead({ attribution: { country: "SA", utmSource: null } }),
    );

    await syncLeadToTwenty("lead_1");

    expect(upsertPerson).toHaveBeenCalledWith(expect.objectContaining({ country: "SA" }));
  });

  it("reports the campaign as the source when one was captured", async () => {
    prisma.lead.findUnique.mockResolvedValue(
      lead({ attribution: { country: null, utmSource: "google" } }),
    );

    await syncLeadToTwenty("lead_1");

    expect(upsertPerson).toHaveBeenCalledWith(expect.objectContaining({ source: "google" }));
  });

  it("falls back to the lead's own source type with no campaign", async () => {
    prisma.lead.findUnique.mockResolvedValue(lead({ sourceType: "referral" }));

    await syncLeadToTwenty("lead_1");

    expect(upsertPerson).toHaveBeenCalledWith(expect.objectContaining({ source: "referral" }));
  });

  it("sends the message as notes, falling back to requirements", async () => {
    prisma.lead.findUnique.mockResolvedValue(lead({ requirements: "Needs 20 seats" }));

    await syncLeadToTwenty("lead_1");

    expect(upsertPerson).toHaveBeenCalledWith(expect.objectContaining({ notes: "Needs 20 seats" }));
  });

  it("records the outcome against the integration", async () => {
    prisma.lead.findUnique.mockResolvedValue(lead());

    await syncLeadToTwenty("lead_1");

    expect(prisma.partnerIntegration.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { provider: "twenty-crm" },
        data: expect.objectContaining({
          lastEventKind: expect.stringContaining("sync.ok"),
        }),
      }),
    );
  });
});

describe("failure handling", () => {
  beforeEach(() => {
    prisma.partnerIntegration.findUnique.mockResolvedValue(enabledIntegration());
    prisma.lead.findUnique.mockResolvedValue(lead());
  });

  it("never throws — a failed sync must not lose the lead", async () => {
    upsertPerson.mockRejectedValue(new Error("connection reset"));

    await expect(syncLeadToTwenty("lead_1")).resolves.toEqual(
      expect.objectContaining({ ok: false }),
    );
  });

  it("surfaces a plain error's message", async () => {
    upsertPerson.mockRejectedValue(new Error("connection reset"));

    const result = await syncLeadToTwenty("lead_1");

    expect(result.detail).toContain("connection reset");
  });

  it("includes the response body on a TwentyError, truncated", async () => {
    upsertPerson.mockRejectedValue(
      new TwentyError("Unprocessable", 422, { errors: ["email taken"] }),
    );

    const result = await syncLeadToTwenty("lead_1");

    expect(result.detail).toContain("Unprocessable");
    expect(result.detail).toContain("email taken");
  });

  it("stringifies a thrown non-Error", async () => {
    upsertPerson.mockRejectedValue("something odd");

    const result = await syncLeadToTwenty("lead_1");

    expect(result.detail).toContain("something odd");
  });

  it("records the failure against the integration", async () => {
    upsertPerson.mockRejectedValue(new Error("connection reset"));

    await syncLeadToTwenty("lead_1");

    expect(prisma.partnerIntegration.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          lastEventKind: expect.stringContaining("sync.error"),
        }),
      }),
    );
  });

  it("still reports the sync when recording the event itself fails", async () => {
    // markEvent swallows its own errors on purpose: the sync status is the
    // thing that matters, not the bookkeeping.
    prisma.partnerIntegration.update.mockRejectedValue(new Error("db gone"));

    const result = await syncLeadToTwenty("lead_1");

    expect(result.ok).toBe(true);
  });
});
