import { describe, expect, it } from "vitest";
import { activeGroup, flattenNav } from "./nav";
import type { NavItem } from "./site";

const sample: NavItem[] = [
  { label: "About", href: "/about" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Car Rental", href: "/services/car-rental" },
      { label: "Umrah", href: "/services/umrah" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

describe("flattenNav", () => {
  it("includes both top-level and child entries", () => {
    const labels = flattenNav(sample).map((n) => n.label);
    expect(labels).toEqual(["About", "Services", "Car Rental", "Umrah", "Contact"]);
  });

  it("preserves href order so a navbar can render in order", () => {
    const hrefs = flattenNav(sample).map((n) => n.href);
    expect(hrefs).toEqual([
      "/about",
      "/services",
      "/services/car-rental",
      "/services/umrah",
      "/contact",
    ]);
  });
});

describe("activeGroup", () => {
  it("returns the group whose href exactly matches the current path", () => {
    const g = activeGroup(sample, "/services");
    expect(g?.label).toBe("Services");
  });

  it("returns the group whose href is a prefix of the current path", () => {
    const g = activeGroup(sample, "/services/car-rental");
    expect(g?.label).toBe("Services");
  });

  it("returns undefined when no group matches", () => {
    expect(activeGroup(sample, "/about")).toBeUndefined();
    expect(activeGroup(sample, "/")).toBeUndefined();
  });
});
