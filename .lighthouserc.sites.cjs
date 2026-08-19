/**
 * Performance and SEO budget for the four brand sites.
 *
 * README.md promises "Mobile LCP <= 2.0 s, Lighthouse >= 95, enforced in CI",
 * but .lighthouserc.json collected four URLs and all four were apps/web. Tours,
 * holdings, outsourcing and group — 96 of the estate's ~120 public pages — had
 * no enforcement at all.
 *
 * This is the gate that keeps the SEO work from regressing: `categories:seo`
 * at 1.0 fails on a duplicate title or a canonical pointing somewhere else,
 * which is exactly how ~79 pages came to canonicalise to their homepage
 * without anyone noticing.
 *
 * One file rather than four, selected by LH_SITE, so the budgets cannot drift
 * apart between sites the way the four copies of apex-group.ts did.
 */
// Dedicated ports in the 488x range, deliberately NOT the production ports
// (tours 3001, outsourcing 3100, holdings 3102, group 3103). Those are bound
// by the live PM2 servers on this host, and lhci's startServerCommand does not
// fail when a port is already listening — it silently measures whatever is
// already there. A first run of this config pointed at 3001 and profiled the
// live site instead of the build, reporting markup that had already been fixed.
const SITES = {
  tours: {
    port: 4881,
    filter: "@apex/tours",
    urls: ["/", "/umrah-packages", "/saudi-car-rental/makkah", "/vehicles", "/contact"],
  },
  holdings: {
    port: 4882,
    filter: "@apex/holdings",
    urls: ["/", "/projects", "/services", "/about", "/contact"],
  },
  group: {
    port: 4883,
    filter: "@apex/group",
    urls: ["/", "/companies", "/insights", "/ecosystem", "/contact"],
  },
  outsourcing: {
    port: 4884,
    filter: "@apex/outsourcing",
    urls: ["/", "/services", "/industries", "/security", "/contact"],
  },
};

const site = SITES[process.env.LH_SITE];
if (!site) {
  throw new Error(
    `LH_SITE must be one of ${Object.keys(SITES).join(", ")} — got ${process.env.LH_SITE}`,
  );
}

const base = `http://localhost:${site.port}`;

module.exports = {
  ci: {
    collect: {
      startServerCommand: `PORT=${site.port} pnpm --filter ${site.filter} start`,
      startServerReadyPattern: "Ready in|started server on",
      startServerReadyTimeout: 60000,
      url: site.urls.map((u) => `${base}${u}`),
      numberOfRuns: 3,
      settings: {
        preset: "desktop",
        emulatedFormFactor: "mobile",
        throttlingMethod: "simulate",
      },
    },
    assert: {
      assertMatrix: [
        {
          matchingUrlPattern: ".*",
          assertions: {
            "categories:performance": ["error", { minScore: 0.95 }],
            "categories:accessibility": ["error", { minScore: 0.95 }],
            "categories:best-practices": ["error", { minScore: 0.95 }],
            // The whole point of this file. A duplicate title, a missing
            // description or a canonical that does not self-reference drops
            // this below 1.0.
            "categories:seo": ["error", { minScore: 1 }],
            "largest-contentful-paint": ["error", { maxNumericValue: 2000 }],
            "cumulative-layout-shift": ["error", { maxNumericValue: 0.05 }],
            "total-blocking-time": ["error", { maxNumericValue: 200 }],
            "first-contentful-paint": ["error", { maxNumericValue: 1500 }],
            "resource-summary:script:size": ["error", { maxNumericValue: 184320 }],
            "resource-summary:font:size": ["error", { maxNumericValue: 153600 }],
            // All four sites now self-host fonts and load no third-party asset;
            // this asserts it stays that way.
            "resource-summary:third-party:count": ["error", { maxNumericValue: 0 }],
            "uses-responsive-images": "error",
            "uses-text-compression": "error",
          },
        },
      ],
    },
    upload: { target: "temporary-public-storage" },
  },
};
