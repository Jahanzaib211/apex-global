import { describe, expect, it } from "vitest";
import { APEX_GROUP } from "./apex-group";

describe("APEX_GROUP (outsourcing site)", () => {
  it("marks apex-outsourcing as self", () => {
    expect(APEX_GROUP.find((c) => c.id === "apex-outsourcing")?.self).toBe(true);
  });

  it("keeps the other entries unmarked", () => {
    expect(
      APEX_GROUP.filter((c) => c.id !== "apex-outsourcing" && c.self).map((c) => c.id),
    ).toEqual([]);
  });

  it("lists every Apex site exactly once", () => {
    const ids = APEX_GROUP.map((c) => c.id).sort();
    expect(ids).toEqual(
      [
        "apex-cloud",
        "apex-group",
        "apex-holdings",
        "apex-outsourcing",
        "apex-tech",
        "apex-tours",
      ].sort(),
    );
  });
});
