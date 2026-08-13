import { describe, expect, it } from "vitest";
import { assertDependencies, defineModule, navigationFor, permissionCatalogue } from "./index";
import { modules } from "./registry";

describe("defineModule", () => {
  it("rejects a planned module that declares navigation", () => {
    // Otherwise the console shows a live link to a page nobody has built.
    expect(() =>
      defineModule({
        id: "future",
        name: "Future",
        description: "",
        status: "planned",
        nav: [{ label: "Future", href: "/future", permission: "future:read" }],
        permissions: [{ key: "future:read", label: "Read" }],
      }),
    ).toThrow(/planned but declares navigation/);
  });

  it("rejects a nav entry gated by a permission the module does not own", () => {
    expect(() =>
      defineModule({
        id: "thing",
        name: "Thing",
        description: "",
        status: "active",
        nav: [{ label: "Thing", href: "/thing", permission: "other:read" }],
        permissions: [{ key: "thing:read", label: "Read" }],
      }),
    ).toThrow(/does not declare/);
  });

  it("requires permission keys to be namespaced", () => {
    expect(() =>
      defineModule({
        id: "thing",
        name: "Thing",
        description: "",
        status: "active",
        permissions: [{ key: "read", label: "Read" }],
      }),
    ).toThrow(/must be namespaced/);
  });

  it("accepts a well-formed module", () => {
    const m = defineModule({
      id: "thing",
      name: "Thing",
      description: "",
      status: "active",
      nav: [{ label: "Thing", href: "/thing", permission: "thing:read" }],
      permissions: [{ key: "thing:read", label: "Read" }],
    });
    expect(m.jobs).toEqual([]);
    expect(m.dependsOn).toEqual([]);
  });
});

describe("assertDependencies", () => {
  it("rejects a dependency on an unknown module", () => {
    const m = defineModule({
      id: "a",
      name: "A",
      description: "",
      status: "active",
      dependsOn: ["nope"],
    });
    expect(() => assertDependencies([m])).toThrow(/unknown module/);
  });

  it("rejects an active module depending on a planned one", () => {
    // Shipping this would mean a live feature calling into unbuilt code.
    const planned = defineModule({ id: "b", name: "B", description: "", status: "planned" });
    const active = defineModule({
      id: "a",
      name: "A",
      description: "",
      status: "active",
      dependsOn: ["b"],
    });
    expect(() => assertDependencies([active, planned])).toThrow(/only planned/);
  });
});

describe("navigationFor", () => {
  it("shows only what the user's permissions allow", () => {
    const nav = navigationFor(modules, ["crm:read"]);
    expect(nav.map((n) => n.label)).toEqual(["Leads"]);
  });

  it("returns nothing for a user with no permissions", () => {
    expect(navigationFor(modules, [])).toEqual([]);
  });

  it("never surfaces navigation from a planned module", () => {
    const everyPermission = permissionCatalogue(modules).map((p) => p.key);
    const hrefs = navigationFor(modules, everyPermission).map((n) => n.href);
    // `billing` is planned; even an omnipotent user must not see a link to it.
    expect(hrefs).not.toContain("/billing");
  });
});

describe("the real registry", () => {
  it("has consistent dependencies", () => {
    expect(() => assertDependencies(modules)).not.toThrow();
  });

  it("has unique module ids", () => {
    const ids = modules.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has globally unique permission keys", () => {
    const keys = permissionCatalogue(modules).map((p) => p.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("has globally unique job queue names", () => {
    const names = modules.flatMap((m) => m.jobs.map((j) => j.name));
    expect(new Set(names).size).toBe(names.length);
  });

  it("gives every module a spec to point at", () => {
    for (const m of modules) {
      expect(m.description.length).toBeGreaterThan(0);
    }
  });
});
