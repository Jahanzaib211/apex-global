import { describe, expect, it } from "vitest";
import { absoluteUrl, NAV, siteUrl } from "./site";

/**
 * URL helpers power the canonical tags and the sitemap. Mis-building these
 * shows up as duplicate content or mixed schemes across stage/prod, so the
 * derivation rules are pinned here.
 */

describe("siteUrl", () => {
  it("returns NEXT_PUBLIC_SITE_URL when set", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://tech.apexgroupcompanies.com";
    expect(siteUrl()).toBe("https://tech.apexgroupcompanies.com");
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

describe("NAV", () => {
  it("exposes a client-login entry for consumers", () => {
    const labels = NAV.map((n) => ("label" in n ? n.label : ""));
    expect(labels).toContain("Client login");
  });

  it("keeps every entry's href rooted", () => {
    for (const item of NAV) {
      if ("href" in item) {
        expect(item.href.startsWith("/")).toBe(true);
      }
      if ("children" in item && item.children) {
        for (const child of item.children) {
          expect(child.href.startsWith("/")).toBe(true);
        }
      }
    }
  });
});
