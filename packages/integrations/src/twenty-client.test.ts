import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TwentyClient, TwentyError, clientFromConfig } from "./twenty";

/**
 * The GraphQL transport and the upsert mutations.
 *
 * `twenty.test.ts` covers the pure helpers — name splitting and external-id
 * derivation. This file covers the part that talks to the network, by stubbing
 * `fetch` rather than reaching a live workspace.
 *
 * The error mapping is the point. Twenty answers a failed operation with a
 * **200** carrying `errors: [...]`, so a client that only checks the HTTP
 * status reports success and hands the caller `undefined` data. Each of those
 * paths is pinned below.
 */

const BASE = "https://crm.example";

function client(overrides: Partial<{ baseUrl: string; apiKey: string }> = {}) {
  return new TwentyClient({ baseUrl: BASE, apiKey: "key_123", ...overrides });
}

/** Build a fetch stub that answers once with the given status and body. */
function respondWith(body: unknown, status = 200) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    text: async () => (typeof body === "string" ? body : JSON.stringify(body)),
  });
}

beforeEach(() => {
  vi.stubGlobal("fetch", respondWith({ data: {} }));
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("transport", () => {
  it("posts to the /graphql endpoint of the configured base url", async () => {
    const fetchMock = respondWith({ data: { createCompany: { id: "c1" } } });
    vi.stubGlobal("fetch", fetchMock);

    await client().upsertCompany({ externalId: "apex_co_acme", name: "Acme" });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]![0]).toBe(`${BASE}/graphql`);
  });

  it("strips a trailing slash rather than posting to //graphql", async () => {
    const fetchMock = respondWith({ data: { createCompany: { id: "c1" } } });
    vi.stubGlobal("fetch", fetchMock);

    await client({ baseUrl: `${BASE}/` }).upsertCompany({
      externalId: "apex_co_acme",
      name: "Acme",
    });

    expect(fetchMock.mock.calls[0]![0]).toBe(`${BASE}/graphql`);
  });

  it("sends the api key as a bearer token", async () => {
    const fetchMock = respondWith({ data: { createCompany: { id: "c1" } } });
    vi.stubGlobal("fetch", fetchMock);

    await client().upsertCompany({ externalId: "apex_co_acme", name: "Acme" });

    const init = fetchMock.mock.calls[0]![1] as { headers: Record<string, string> };
    expect(init.headers.Authorization).toBe("Bearer key_123");
    expect(init.headers["Content-Type"]).toBe("application/json");
  });

  it("raises a TwentyError carrying the status on a non-2xx", async () => {
    vi.stubGlobal("fetch", respondWith({ message: "nope" }, 401));

    await expect(
      client().upsertCompany({ externalId: "apex_co_acme", name: "Acme" }),
    ).rejects.toMatchObject({ status: 401 });
  });

  it("raises on a 200 that carries GraphQL errors", async () => {
    // The failure mode this exists for: HTTP says fine, the operation did not.
    vi.stubGlobal("fetch", respondWith({ errors: [{ message: "duplicate externalId" }] }));

    await expect(
      client().upsertCompany({ externalId: "apex_co_acme", name: "Acme" }),
    ).rejects.toThrow(/duplicate externalId/);
  });

  it("survives a body that is not JSON", async () => {
    vi.stubGlobal("fetch", respondWith("<html>502 Bad Gateway</html>", 502));

    await expect(
      client().upsertCompany({ externalId: "apex_co_acme", name: "Acme" }),
    ).rejects.toBeInstanceOf(TwentyError);
  });
});

describe("upsertCompany", () => {
  it("returns the new id alongside the external id it was given", async () => {
    vi.stubGlobal("fetch", respondWith({ data: { createCompany: { id: "c_99" } } }));

    const result = await client().upsertCompany({ externalId: "apex_co_acme", name: "Acme" });

    expect(result).toEqual({ id: "c_99", externalId: "apex_co_acme" });
  });

  it("asks for an upsert, so a repeat sync is not a duplicate", async () => {
    const fetchMock = respondWith({ data: { createCompany: { id: "c_99" } } });
    vi.stubGlobal("fetch", fetchMock);

    await client().upsertCompany({ externalId: "apex_co_acme", name: "Acme" });

    const body = JSON.parse((fetchMock.mock.calls[0]![1] as { body: string }).body);
    expect(body.variables.upsert).toBe(true);
    expect(body.variables.data.externalId).toBe("apex_co_acme");
  });

  it("omits the domain when none was supplied", async () => {
    const fetchMock = respondWith({ data: { createCompany: { id: "c_99" } } });
    vi.stubGlobal("fetch", fetchMock);

    await client().upsertCompany({ externalId: "apex_co_acme", name: "Acme" });

    const body = JSON.parse((fetchMock.mock.calls[0]![1] as { body: string }).body);
    expect(body.variables.data.domainName).toBeUndefined();
  });

  it("wraps a supplied domain in Twenty's link shape", async () => {
    const fetchMock = respondWith({ data: { createCompany: { id: "c_99" } } });
    vi.stubGlobal("fetch", fetchMock);

    await client().upsertCompany({
      externalId: "apex_co_acme",
      name: "Acme",
      domain: "acme.test",
    });

    const body = JSON.parse((fetchMock.mock.calls[0]![1] as { body: string }).body);
    expect(body.variables.data.domainName).toEqual({ primaryLinkUrl: "acme.test" });
  });

  it("refuses a response with no id rather than returning undefined", async () => {
    vi.stubGlobal("fetch", respondWith({ data: {} }));

    await expect(
      client().upsertCompany({ externalId: "apex_co_acme", name: "Acme" }),
    ).rejects.toThrow(/no createCompany\.id/);
  });
});

describe("clientFromConfig", () => {
  it("builds a usable client from a stored config blob", async () => {
    vi.stubGlobal("fetch", respondWith({ data: { createCompany: { id: "c_1" } } }));

    const built = clientFromConfig({ baseUrl: BASE, apiKey: "key", enabled: true });

    expect(built).toBeInstanceOf(TwentyClient);
    await expect(
      built.upsertCompany({ externalId: "apex_co_x", name: "X" }),
    ).resolves.toMatchObject({ id: "c_1" });
  });
});

describe("testConnection", () => {
  it("reports ok when the workspace answers", async () => {
    vi.stubGlobal("fetch", respondWith({ data: { currentWorkspace: { id: "w1" } } }));

    const result = await client().testConnection();

    expect(result.ok).toBe(true);
  });

  it("reports the reason rather than throwing when it does not", async () => {
    vi.stubGlobal("fetch", respondWith({ message: "unauthorized" }, 401));

    const result = await client().testConnection();

    expect(result.ok).toBe(false);
    expect(result.detail.length).toBeGreaterThan(0);
  });
});

describe("TwentyError", () => {
  it("keeps the status and body for the caller to log", () => {
    const err = new TwentyError("boom", 422, { errors: ["bad email"] });

    expect(err).toBeInstanceOf(Error);
    expect(err.status).toBe(422);
    expect(err.body).toEqual({ errors: ["bad email"] });
    expect(err.name).toBe("TwentyError");
  });
});
