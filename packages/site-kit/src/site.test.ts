import { describe, expect, it } from "vitest";
import {
  APEX_GROUP,
  APEX_PUBLIC_HOSTNAMES,
  FOOTER_LEGAL_LABELS,
  absoluteUrl,
  isNavGroup,
  siteUrl,
  withSelf,
} from "./site";

describe("APEX_GROUP", () => {
  it("lists all six group companies in stable order", () => {
    expect(APEX_GROUP.map((c) => c.id)).toEqual([
      "apex-group",
      "apex-tech",
      "apex-cloud",
      "apex-tours",
      "apex-outsourcing",
      "apex-holdings",
    ]);
  });

  it("gives every entry an https public hostname with no trailing slash", () => {
    for (const c of APEX_GROUP) {
      expect(c.href.startsWith("https://")).toBe(true);
      expect(c.href.endsWith("/")).toBe(false);
    }
  });

  it("never marks any entry self by default", () => {
    expect(APEX_GROUP.every((c) => c.self === undefined)).toBe(true);
  });

  it("covers every ApexSiteId exactly once", () => {
    const ids = APEX_GROUP.map((c) => c.id).sort();
    expect(ids).toEqual(Object.keys(APEX_PUBLIC_HOSTNAMES).sort());
  });
});

describe("withSelf", () => {
  it("marks only the requested row", () => {
    const list = withSelf("apex-tours");
    expect(list.filter((c) => c.self).map((c) => c.id)).toEqual(["apex-tours"]);
  });

  it("does not mutate the original array", () => {
    withSelf("apex-tech");
    expect(APEX_GROUP.find((c) => c.id === "apex-tech")?.self).toBeUndefined();
  });

  it("supports every site id without throwing", () => {
    for (const id of Object.keys(APEX_PUBLIC_HOSTNAMES) as Array<
      keyof typeof APEX_PUBLIC_HOSTNAMES
    >) {
      expect(() => withSelf(id)).not.toThrow();
    }
  });
});

describe("siteUrl", () => {
  it("returns NEXT_PUBLIC_SITE_URL when set", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://tours.apexgroupcompanies.com";
    expect(siteUrl()).toBe("https://tours.apexgroupcompanies.com");
  });

  it("strips a trailing slash", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com/";
    expect(siteUrl()).toBe("https://example.com");
  });

  it("falls back to localhost", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    expect(siteUrl()).toBe("http://localhost:4300");
  });
});

describe("absoluteUrl", () => {
  it("joins a leading-slash path", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";
    expect(absoluteUrl("/services")).toBe("https://example.com/services");
  });

  it("adds a missing leading slash", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";
    expect(absoluteUrl("services")).toBe("https://example.com/services");
  });
});

describe("isNavGroup", () => {
  it("returns true only for items that declare children", () => {
    const leaf = { label: "About", href: "/about" };
    const group = { label: "Services", href: "/services", children: [] };
    expect(isNavGroup(leaf)).toBe(false);
    expect(isNavGroup(group)).toBe(true);
  });
});

describe("FOOTER_LEGAL_LABELS", () => {
  it("includes Privacy, Terms, Cookies, Disclaimer, All legal documents", () => {
    expect(FOOTER_LEGAL_LABELS).toContain("Privacy");
    expect(FOOTER_LEGAL_LABELS).toContain("Terms");
    expect(FOOTER_LEGAL_LABELS).toContain("Cookies");
    expect(FOOTER_LEGAL_LABELS).toContain("Disclaimer");
    expect(FOOTER_LEGAL_LABELS).toContain("All legal documents");
  });
});
