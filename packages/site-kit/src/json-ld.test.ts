import { describe, expect, it } from "vitest";
import { jsonLdScript } from "./json-ld";

describe("jsonLdScript", () => {
  it("neutralises a closing script tag", () => {
    const out = jsonLdScript({ name: "</script><img src=x onerror=alert(1)>" });
    expect(out).not.toContain("</script>");
    expect(out).not.toContain("<");
    expect(out).not.toContain(">");
  });

  it("escapes ampersands, so an entity cannot rebuild a tag", () => {
    expect(jsonLdScript({ a: "&lt;/script&gt;" })).not.toContain("&");
  });

  it("escapes the JavaScript line terminators", () => {
    const out = jsonLdScript({ a: "one\u2028two\u2029three" });
    // The raw characters are gone; the JSON escape sequences replace them.
    expect(out).not.toContain("\u2028");
    expect(out).not.toContain("\u2029");
    expect(out).toContain("\\u2028");
    expect(out).toContain("\\u2029");
  });

  it("round-trips: escaping changes the bytes, never the data", () => {
    const graph = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Apex & Co </script>",
      note: "line\u2028break",
      list: [1, true, null, { nested: "a>b<c" }],
    };
    expect(JSON.parse(jsonLdScript(graph))).toEqual(graph);
  });

  it("leaves an ordinary graph readable", () => {
    expect(jsonLdScript({ "@type": "Organization", name: "Apex Global" })).toBe(
      '{"@type":"Organization","name":"Apex Global"}',
    );
  });
});
