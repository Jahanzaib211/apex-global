import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * `convertLeadToCustomer` is what makes a console-issued invoice visible to the
 * customer: the portal's invoice query joins `invoice.lead.portalAccounts`, so
 * the `PortalAccount.leadId` link written here is the whole mechanism.
 *
 * The adoption branch is the interesting one. It used to look the account up by
 * rebuilding a slug (`self-<local>`), but the signup route writes
 * `self-<local>-<random>` — so the lookup never matched and every conversion of
 * a customer who had already signed up created a *second* account beside their
 * real one. These tests pin the email-based match that replaced it.
 *
 * Prisma and the mailer are mocked: this asserts the decision logic, not the
 * query builder or SMTP.
 */

const prisma = {
  lead: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  portalAccount: {
    findFirst: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
  },
  portalInvitation: {
    findFirst: vi.fn(),
    create: vi.fn(),
  },
  leadActivity: {
    create: vi.fn(),
  },
};

const sendInvitation = vi.fn();

vi.mock("@apex/db", () => ({ prisma }));
vi.mock("@apex/auth", () => ({ sendInvitation }));
vi.mock("server-only", () => ({}));

const { convertLeadToCustomer } = await import("./convert-lead");

const actor = { id: "usr_1", name: "Operator" };

beforeEach(() => {
  vi.clearAllMocks();
  // Defaults for the happy path; individual tests override what they care about.
  prisma.portalAccount.findFirst.mockResolvedValue(null);
  prisma.portalAccount.findUnique.mockResolvedValue(null);
  prisma.portalInvitation.findFirst.mockResolvedValue(null);
  prisma.portalInvitation.create.mockResolvedValue({});
  prisma.leadActivity.create.mockResolvedValue({});
  prisma.lead.update.mockResolvedValue({});
  sendInvitation.mockResolvedValue(undefined);
});

describe("convertLeadToCustomer", () => {
  it("is a no-op when the lead already has an account", async () => {
    prisma.lead.findUnique.mockResolvedValue({
      id: "lead_1",
      email: "a@b.com",
      name: "A",
      companyName: null,
      portalAccounts: [{ id: "acct_existing" }],
    });

    const result = await convertLeadToCustomer("lead_1", actor);

    expect(result).toEqual({
      portalAccountId: "acct_existing",
      created: false,
      invited: false,
    });
    expect(prisma.portalAccount.create).not.toHaveBeenCalled();
    expect(prisma.portalAccount.update).not.toHaveBeenCalled();
  });

  it("adopts the self-serve account belonging to the lead's email", async () => {
    prisma.lead.findUnique.mockResolvedValue({
      id: "lead_1",
      email: "Boogey@Example.com",
      name: "Boogeyman",
      companyName: "ablabs",
      portalAccounts: [],
    });
    prisma.portalAccount.findFirst.mockResolvedValue({ id: "acct_self", leadId: null });
    prisma.portalAccount.update.mockResolvedValue({ id: "acct_self", name: "ablabs" });

    const result = await convertLeadToCustomer("lead_1", actor);

    // Adopted, not duplicated — this is the regression that mattered.
    expect(prisma.portalAccount.create).not.toHaveBeenCalled();
    expect(prisma.portalAccount.update).toHaveBeenCalledWith({
      where: { id: "acct_self" },
      data: { leadId: "lead_1" },
    });
    expect(result).toEqual({ portalAccountId: "acct_self", created: false, invited: true });
  });

  it("matches the account by email case-insensitively and ignores already-linked ones", async () => {
    prisma.lead.findUnique.mockResolvedValue({
      id: "lead_1",
      email: "Boogey@Example.com",
      name: "Boogeyman",
      companyName: null,
      portalAccounts: [],
    });
    prisma.portalAccount.findFirst.mockResolvedValue({ id: "acct_self", leadId: null });
    prisma.portalAccount.update.mockResolvedValue({ id: "acct_self", name: "Boogeyman" });

    await convertLeadToCustomer("lead_1", actor);

    const where = prisma.portalAccount.findFirst.mock.calls[0]![0]!.where;
    // An account already tied to another lead must never be stolen.
    expect(where.leadId).toBeNull();
    expect(where.users.some.email).toEqual({
      equals: "Boogey@Example.com",
      mode: "insensitive",
    });
  });

  it("creates a fresh account when nothing matches", async () => {
    prisma.lead.findUnique.mockResolvedValue({
      id: "lead_1",
      email: "new@example.com",
      name: "New Person",
      companyName: "NewCo",
      portalAccounts: [],
    });
    prisma.portalAccount.findFirst.mockResolvedValue(null);
    prisma.portalAccount.create.mockResolvedValue({ id: "acct_new", name: "NewCo" });

    const result = await convertLeadToCustomer("lead_1", actor);

    expect(prisma.portalAccount.create).toHaveBeenCalled();
    const data = prisma.portalAccount.create.mock.calls[0]![0]!.data;
    expect(data.leadId).toBe("lead_1");
    expect(data.name).toBe("NewCo");
    expect(result.created).toBe(true);
  });

  it("still links the account when the invitation email fails", async () => {
    prisma.lead.findUnique.mockResolvedValue({
      id: "lead_1",
      email: "new@example.com",
      name: "New Person",
      companyName: null,
      portalAccounts: [],
    });
    prisma.portalAccount.create.mockResolvedValue({ id: "acct_new", name: "New Person" });
    sendInvitation.mockRejectedValue(new Error("smtp down"));

    const result = await convertLeadToCustomer("lead_1", actor);

    // The account + lead link are the valuable part; a mail hiccup must not
    // roll them back or throw.
    expect(result.portalAccountId).toBe("acct_new");
    expect(result.invited).toBe(false);
    expect(prisma.lead.update).toHaveBeenCalled();
  });

  it("does not re-invite when an unaccepted invitation already exists", async () => {
    prisma.lead.findUnique.mockResolvedValue({
      id: "lead_1",
      email: "new@example.com",
      name: "New Person",
      companyName: null,
      portalAccounts: [],
    });
    prisma.portalAccount.create.mockResolvedValue({ id: "acct_new", name: "New Person" });
    prisma.portalInvitation.findFirst.mockResolvedValue({ id: "inv_1" });

    const result = await convertLeadToCustomer("lead_1", actor);

    expect(prisma.portalInvitation.create).not.toHaveBeenCalled();
    expect(sendInvitation).not.toHaveBeenCalled();
    expect(result.invited).toBe(false);
  });

  it("throws when the lead does not exist", async () => {
    prisma.lead.findUnique.mockResolvedValue(null);
    await expect(convertLeadToCustomer("missing", actor)).rejects.toThrow(/not found/);
  });
});
