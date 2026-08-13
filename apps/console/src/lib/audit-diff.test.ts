import { describe, expect, it } from "vitest";
import { diff } from "./audit-diff";

/**
 * The audit diff is what lets an operator see exactly what changed on a
 * record — before/after on the changed fields only. Pinning it matters
 * because every privileged action in the console feeds through it, and a diff
 * that swallowed or overstated changes would undercut the audit trail.
 */

describe("diff", () => {
  it("reports only the keys that actually differ", () => {
    const before: Record<string, unknown> = { name: "old", settings: 1, unchanged: true };
    const after: Record<string, unknown> = { name: "new", unchanged: true, extra: "added" };
    const result = diff(before, after);
    expect(Object.keys(result)).toEqual(["name", "extra"]);
  });

  it("stringifies scalar values", () => {
    const result = diff({ count: 1, on: false }, { count: 2 });
    expect(result.count).toEqual({ from: "1", to: "2" });
  });

  it("normalises dates to ISO strings", () => {
    const from = new Date("2026-01-01T00:00:00Z");
    const to = new Date("2026-01-02T00:00:00Z");
    expect(diff({ when: from }, { when: to }).when).toEqual({
      from: from.toISOString(),
      to: to.toISOString(),
    });
  });

  it("treats a missing value as null", () => {
    const result = diff({ a: "x" }, { a: undefined });
    expect(result.a).toEqual({ from: "x", to: null });
  });

  it("returns an empty diff when nothing changed", () => {
    expect(diff({ a: 1, b: "x" }, { a: 1, b: "x" })).toEqual({});
  });
});
