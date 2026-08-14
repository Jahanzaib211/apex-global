import { describe, expect, it } from "vitest";
import { CHATWOOT_BASE_URL, CHATWOOT_TOKENS, chatwootFor } from "./chatwoot";
import { APEX_PUBLIC_HOSTNAMES, type ApexSiteId } from "./site";

/**
 * The four marketing sites were briefly wired to one shared
 * `NEXT_PUBLIC_CHATWOOT_TOKEN`, which would have funnelled every brand's
 * conversations into the Tech inbox. These pin the property that prevents it.
 */

const MARKETING: ApexSiteId[] = [
  "apex-tech",
  "apex-group",
  "apex-holdings",
  "apex-outsourcing",
  "apex-tours",
];

describe("CHATWOOT_TOKENS", () => {
  it("covers every Apex site id", () => {
    expect(Object.keys(CHATWOOT_TOKENS).sort()).toEqual(Object.keys(APEX_PUBLIC_HOSTNAMES).sort());
  });

  it("gives every marketing site a token", () => {
    for (const id of MARKETING) {
      expect(CHATWOOT_TOKENS[id], id).toMatch(/^[A-Za-z0-9]{20,}$/);
    }
  });

  // The whole point: no two brands may share an inbox.
  it("never reuses a token across sites", () => {
    const tokens = MARKETING.map((id) => CHATWOOT_TOKENS[id]);
    expect(new Set(tokens).size).toBe(tokens.length);
  });

  it("leaves the mail surface without a widget", () => {
    expect(CHATWOOT_TOKENS["apex-cloud"]).toBe("");
  });
});

describe("chatwootFor", () => {
  const ORIGINAL = process.env.NEXT_PUBLIC_CHATWOOT_URL;
  const restore = () => {
    if (ORIGINAL === undefined) delete process.env.NEXT_PUBLIC_CHATWOOT_URL;
    else process.env.NEXT_PUBLIC_CHATWOOT_URL = ORIGINAL;
  };

  it("returns the site's own token and the shared host", () => {
    delete process.env.NEXT_PUBLIC_CHATWOOT_URL;
    const cfg = chatwootFor("apex-tours");
    expect(cfg.websiteToken).toBe(CHATWOOT_TOKENS["apex-tours"]);
    expect(cfg.baseUrl).toBe(CHATWOOT_BASE_URL);
    restore();
  });

  it("lets the host be pointed at a staging instance", () => {
    process.env.NEXT_PUBLIC_CHATWOOT_URL = "https://chat.staging.example/";
    expect(chatwootFor("apex-group").baseUrl).toBe("https://chat.staging.example");
    restore();
  });

  // The token deliberately has no env override — that mechanism is what made
  // every site share one inbox.
  it("does not let the environment change which inbox a site opens", () => {
    process.env.NEXT_PUBLIC_CHATWOOT_URL = "https://chat.staging.example";
    expect(chatwootFor("apex-holdings").websiteToken).toBe(CHATWOOT_TOKENS["apex-holdings"]);
    restore();
  });
});
