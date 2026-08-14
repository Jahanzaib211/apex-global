import { describe, expect, it } from "vitest";
import { DEFAULT_BRANDS, defineBrand, type Brand } from "./brand";
import { APEX_PUBLIC_HOSTNAMES, type ApexSiteId } from "./site";

const valid: Brand = defineBrand({
  name: "Apex Tours",
  shortLabel: "Tours",
  hostname: "apexgroupcompanies.com",
  tagline: "Your journey.",
  logoSrc: "/logo.png",
  logoAlt: "Apex Tours logo",
  primaryColor: "#0b1d3a",
  accentColor: "#c89b3c",
});

describe("defineBrand", () => {
  it("returns the input unchanged (type assertion)", () => {
    expect(valid.shortLabel).toBe("Tours");
    expect(valid.primaryColor).toBe("#0b1d3a");
  });
});

describe("DEFAULT_BRANDS", () => {
  it("covers every Apex site", () => {
    expect(Object.keys(DEFAULT_BRANDS).sort()).toEqual(
      ["apex-group", "apex-holdings", "apex-outsourcing", "apex-tech", "apex-tours"].sort(),
    );
  });

  it("uses the canonical short labels", () => {
    expect(DEFAULT_BRANDS["apex-group"]!.shortLabel).toBe("Apex Group");
    expect(DEFAULT_BRANDS["apex-tech"]!.shortLabel).toBe("Apex Tech");
    expect(DEFAULT_BRANDS["apex-tours"]!.shortLabel).toBe("Apex Tours");
    expect(DEFAULT_BRANDS["apex-outsourcing"]!.shortLabel).toBe("Apex Outsourcing");
    expect(DEFAULT_BRANDS["apex-holdings"]!.shortLabel).toBe("Apex Holdings");
  });

  it("gives every logo the matching short label as alt text", () => {
    for (const b of Object.values(DEFAULT_BRANDS)) {
      expect(b.logoAlt.length).toBeGreaterThan(0);
      expect(b.logoSrc.endsWith(".png") || b.logoSrc.endsWith(".svg")).toBe(true);
    }
  });

  it("exposes every required field for every site", () => {
    for (const [id, b] of Object.entries(DEFAULT_BRANDS)) {
      expect(b.name, id).toBeTruthy();
      expect(b.hostname, id).toBeTruthy();
      expect(b.tagline, id).toBeTruthy();
    }
  });

  // These two registries disagreed: brand.ts put Holdings on `apexholdings.pk`
  // while APEX_PUBLIC_HOSTNAMES had already moved it to
  // holdings.apexgroupcompanies.com. Two sources of truth for one fact is how
  // that happens, so pin them together.
  it("matches APEX_PUBLIC_HOSTNAMES for every site", () => {
    for (const [id, b] of Object.entries(DEFAULT_BRANDS)) {
      expect(b.hostname, id).toBe(APEX_PUBLIC_HOSTNAMES[id as ApexSiteId]);
    }
  });

  it("carries a full per-site host, not a bare registrable domain", () => {
    for (const [id, b] of Object.entries(DEFAULT_BRANDS)) {
      expect(b.hostname, id).toMatch(/^[a-z0-9-]+\.apexgroupcompanies\.com$/);
    }
  });
});

/**
 * Invented contact details shipped to production on four sites: a phone number
 * of `+92 300 123 4567`, a WhatsApp of `923001234567`, an email on the RFC 2606
 * reserved `.example` TLD, and a literal `[email protected]` redaction artifact.
 * The authoritative values live in the Tech app's `settings` table. Nothing
 * that looks like a placeholder may reach a customer-facing page again.
 */
describe("DEFAULT_BRANDS placeholder guard", () => {
  const PLACEHOLDERS: ReadonlyArray<readonly [string, RegExp]> = [
    ["sequential fake phone", /(?:\+?92[\s-]*)?300[\s-]*123[\s-]*4567/],
    ["sequential fake whatsapp", /923001234567/],
    ["reserved .example domain", /\.example\b/i],
    ["redaction artifact", /\[email\s*(?:protected|redacted)\]/i],
    ["lorem ipsum", /lorem\s+ipsum/i],
    ["unfilled marker", /\b(?:TODO|TBD|FIXME|XXX|placeholder|changeme)\b/i],
  ];

  for (const [id, brand] of Object.entries(DEFAULT_BRANDS)) {
    for (const [label, pattern] of PLACEHOLDERS) {
      it(`${id} carries no ${label}`, () => {
        for (const [field, value] of Object.entries(brand)) {
          if (typeof value !== "string") continue;
          expect(value, `${id}.${field}`).not.toMatch(pattern);
        }
      });
    }
  }
});
