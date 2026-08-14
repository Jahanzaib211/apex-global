import { describe, expect, it } from "vitest";
import { site } from "@/data/site";

/**
 * Pins the Apex Web Tweaks 2026-08-13 item "Office Address needs
 * updation" — the listed address must include the named building /
 * block / street, and acknowledge the Karachi + Islamabad satellite
 * offices that Holdings runs.
 */
describe("Holdings site address", () => {
  it("names the primary Lahore building and block", () => {
    expect(site.address).toMatch(/Office 1201/);
    expect(site.address).toMatch(/Block [A-Z]/);
    expect(site.address).toMatch(/Lahore/);
  });

  it("lists Karachi and Islamabad as the satellite offices", () => {
    expect(site.address).toMatch(/Karachi/);
    expect(site.address).toMatch(/Islamabad/);
  });

  it("points to the live apexgroupcompanies.com hostname (not apexholdings.pk)", () => {
    expect(site.url).toBe("https://holdings.apexgroupcompanies.com");
  });
});
