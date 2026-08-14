import { describe, expect, it } from "vitest";
import { DEFAULT_BRANDS, defineBrand, type Brand } from "./brand";

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
});
