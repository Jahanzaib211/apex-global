import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  APEX_GROUP,
  APEX_PUBLIC_HOSTNAMES,
  FOOTER_LEGAL_LABELS,
  absoluteUrl,
  absoluteUrlFor,
  isNavGroup,
  siteUrl,
  siteUrlFor,
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

describe("siteUrlFor", () => {
  const ORIGINAL_ENV = process.env.NEXT_PUBLIC_SITE_URL;
  const ORIGINAL_NODE_ENV = process.env.NODE_ENV;

  beforeEach(() => {
    process.env.NODE_ENV = "production";
  });

  afterEach(() => {
    if (ORIGINAL_ENV === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
    else process.env.NEXT_PUBLIC_SITE_URL = ORIGINAL_ENV;
    process.env.NODE_ENV = ORIGINAL_NODE_ENV;
  });

  // The regression this whole function exists for: one root .env holds Tech's
  // URL and every app builds through it, so each non-Tech site was inlining
  // tech.apexgroupcompanies.com into its own canonical tag and sitemap.
  it("ignores a NEXT_PUBLIC_SITE_URL that names a different Apex site", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://tech.apexgroupcompanies.com";
    expect(siteUrlFor("apex-group")).toBe("https://apex.apexgroupcompanies.com");
    expect(siteUrlFor("apex-tours")).toBe("https://tours.apexgroupcompanies.com");
    expect(siteUrlFor("apex-holdings")).toBe("https://holdings.apexgroupcompanies.com");
    expect(siteUrlFor("apex-outsourcing")).toBe("https://outsourcing.apexgroupcompanies.com");
  });

  it("honours NEXT_PUBLIC_SITE_URL when it does name this site", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://tech.apexgroupcompanies.com";
    expect(siteUrlFor("apex-tech")).toBe("https://tech.apexgroupcompanies.com");
  });

  it("allows loopback overrides so dev and E2E can point anywhere", () => {
    for (const origin of ["http://localhost:3103", "http://127.0.0.1:3001"]) {
      process.env.NEXT_PUBLIC_SITE_URL = origin;
      expect(siteUrlFor("apex-group")).toBe(origin);
    }
  });

  it("strips a trailing slash from an accepted override", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://apex.apexgroupcompanies.com/";
    expect(siteUrlFor("apex-group")).toBe("https://apex.apexgroupcompanies.com");
  });

  it("falls back to the canonical host in production when unset", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    for (const id of Object.keys(APEX_PUBLIC_HOSTNAMES) as Array<
      keyof typeof APEX_PUBLIC_HOSTNAMES
    >) {
      expect(siteUrlFor(id)).toBe(`https://${APEX_PUBLIC_HOSTNAMES[id]}`);
    }
  });

  it("falls back to the dev origin outside production", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    process.env.NODE_ENV = "development";
    expect(siteUrlFor("apex-tours", "http://localhost:4101")).toBe("http://localhost:4101");
  });

  it("ignores a malformed override rather than publishing it", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "not-a-url";
    expect(siteUrlFor("apex-group")).toBe("https://apex.apexgroupcompanies.com");
  });

  it("never returns a placeholder or reserved domain", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    for (const id of Object.keys(APEX_PUBLIC_HOSTNAMES) as Array<
      keyof typeof APEX_PUBLIC_HOSTNAMES
    >) {
      expect(siteUrlFor(id)).not.toMatch(/\.example|\.test|\.invalid|localhost/);
    }
  });
});

describe("absoluteUrlFor", () => {
  it("joins against the site's own canonical origin", () => {
    process.env.NODE_ENV = "production";
    process.env.NEXT_PUBLIC_SITE_URL = "https://tech.apexgroupcompanies.com";
    expect(absoluteUrlFor("apex-group", "/contact")).toBe(
      "https://apex.apexgroupcompanies.com/contact",
    );
    expect(absoluteUrlFor("apex-group", "contact")).toBe(
      "https://apex.apexgroupcompanies.com/contact",
    );
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
