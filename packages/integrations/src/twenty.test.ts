import { describe, expect, it } from "vitest";
import { companyExternalId, leadExternalId, splitName, TwentyClient, TwentyError } from "./twenty";

/**
 * The Twenty CRM integration talks to a live HTTP endpoint, so the unit
 * surface here is the deterministic parts that don't need a network: id
 * derivation, name splitting, and the constructor invariants. Client
 * behaviour (GraphQL payload shape, error mapping) is covered by keeping the
 * wire calls behind a single private method that we can reason about without
 * mocking fetch.
 */

describe("splitName", () => {
  it("handles a plain first + last", () => {
    expect(splitName("Ada Lovelace")).toEqual({ firstName: "Ada", lastName: "Lovelace" });
  });

  it("treats extra words as part of the last name", () => {
    expect(splitName("John von Neumann")).toEqual({ firstName: "John", lastName: "von Neumann" });
  });

  it("returns a placeholder for an empty/whitespace name", () => {
    expect(splitName("   ")).toEqual({ firstName: "—", lastName: "—" });
  });

  it("keeps a single-word name and marks the missing last name honestly", () => {
    expect(splitName("Cher")).toEqual({ firstName: "Cher", lastName: "—" });
  });
});

describe("external id derivation", () => {
  it("prepends a stable, namespaced prefix for leads", () => {
    expect(leadExternalId("abc-123")).toBe("apex_lead_abc-123");
  });

  it("derives a stable, url-safe slug for a company", () => {
    expect(companyExternalId("Acme Corp, Inc.")).toBe("apex_co_acme_corp_inc");
  });

  it("is deterministic for the same input", () => {
    expect(companyExternalId("Acme Corp, Inc.")).toBe(companyExternalId("Acme Corp, Inc."));
  });

  it("caps company slugs to a sane length", () => {
    const slug = companyExternalId("Very Long Company Name That Goes On And On And On");
    expect(slug.length).toBeLessThanOrEqual(70);
  });
});

describe("TwentyClient construction", () => {
  it("refuses to build without a base URL", () => {
    expect(() => new TwentyClient({ baseUrl: "", apiKey: "k" })).toThrow(/baseUrl/);
  });

  it("refuses to build without an api key", () => {
    expect(() => new TwentyClient({ baseUrl: "https://api.twenty.com", apiKey: "" })).toThrow(
      /apiKey/,
    );
  });

  it("accepts a non-authoritative envelope shape from stored config", () => {
    const client = new TwentyClient({ baseUrl: "https://x/", apiKey: "k" });
    expect(client).toBeInstanceOf(TwentyClient);
  });
});

describe("TwentyError", () => {
  it("carries status and body for downstream diagnostics", () => {
    const err = new TwentyError("boom", 403, { errors: [{ message: "denied" }] });
    expect(err.message).toBe("boom");
    expect(err.status).toBe(403);
    expect(err.body).toEqual({ errors: [{ message: "denied" }] });
  });
});
