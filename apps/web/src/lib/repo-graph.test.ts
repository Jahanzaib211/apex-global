import { describe, expect, it } from "vitest";
import graphData from "./repo-graph.json";

describe("repo-graph dataset (graphify export)", () => {
  it("has the expected shape", () => {
    expect(graphData).toBeDefined();
    expect(Array.isArray(graphData.nodes)).toBe(true);
    expect(Array.isArray(graphData.links)).toBe(true);
    expect(graphData.sources).toBeTypeOf("object");
  });

  it("ships no source text — the graph is topology, not a code dump", () => {
    // The public graph is proof the system is real, but the code behind each
    // node must never leave the repository. If a snapshot regresses in, this
    // test fails before the export leaks a file.
    const sources = graphData.sources as Record<string, string>;
    expect(Object.keys(sources)).toHaveLength(0);
    for (const v of Object.values(sources)) {
      expect(typeof v).toBe("string");
      expect(v.length).toBe(0);
    }
  });

  it("ships a non-trivial, non-degenerate graph", () => {
    expect(graphData.nodes.length).toBeGreaterThan(400);
    expect(graphData.nodes.length).toBeLessThan(1200);
    expect(graphData.links.length).toBeGreaterThan(500);
  });

  it("every node has a position, label, file, community and degree", () => {
    for (const n of graphData.nodes) {
      expect(Number.isFinite(n.x)).toBe(true);
      expect(Number.isFinite(n.y)).toBe(true);
      expect(typeof n.label).toBe("string");
      expect(typeof n.file).toBe("string");
      expect(Number.isFinite(n.c)).toBe(true);
      expect(Number.isFinite(n.d)).toBe(true);
    }
  });

  it("every link references valid node ids", () => {
    const ids = new Set(graphData.nodes.map((n) => n.id));
    for (const link of graphData.links) {
      const a = link?.[0] ?? "";
      const b = link?.[1] ?? "";
      expect(a).not.toBe("");
      expect(b).not.toBe("");
      expect(ids.has(a)).toBe(true);
      expect(ids.has(b)).toBe(true);
    }
  });

  it("no node id appears twice", () => {
    const ids = graphData.nodes.map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
