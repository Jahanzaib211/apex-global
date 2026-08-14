import { defineConfig, devices } from "@playwright/test";
import { SITES, baseUrlFor } from "./tests/e2e/sites/site-matrix";

const WEB_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:4300";
const CONSOLE_URL = process.env.CONSOLE_URL ?? "http://localhost:4301";
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  reporter: isCI ? [["html"], ["github"]] : [["list"]],
  timeout: 45_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL: WEB_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "public-desktop",
      testMatch: /public\/.*\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      // Ad traffic is mobile-first. If the money path breaks on a phone,
      // it breaks where it costs us.
      name: "public-mobile",
      testMatch: /public\/.*\.spec\.ts/,
      use: { ...devices["Pixel 7"] },
    },
    {
      name: "portal",
      testMatch: /portal\/.*\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "console",
      testMatch: /console\/.*\.spec\.ts/,
      use: { ...devices["Desktop Chrome"], baseURL: CONSOLE_URL },
    },
    {
      name: "surfaces",
      testMatch: /surfaces\/.*\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      // One project, not one per site: the sites/ specs address each origin
      // absolutely from SITES, so a per-site project would re-run all four
      // sites' assertions four times over. Each test title names its site.
      name: "sites",
      testMatch: /sites\/.*\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      // Travel and property traffic is overwhelmingly mobile; if the money path
      // breaks on a phone it breaks where it costs us.
      name: "site-mobile",
      testMatch: /sites\/controls\.spec\.ts/,
      use: { ...devices["Pixel 7"] },
    },
  ],

  webServer: [
    ...(isCI
      ? [
          {
            command: "pnpm --filter @apex/web start",
            url: WEB_URL,
            reuseExistingServer: false,
            timeout: 120_000,
          },
          {
            command: "pnpm --filter @apex/console start",
            url: CONSOLE_URL,
            reuseExistingServer: false,
            timeout: 120_000,
          },
        ]
      : []),
    // `reuseExistingServer: false` is load-bearing. These sites' production
    // ports are already bound by PM2 on the deploy host, so reusing whatever
    // answers would test the live Next 14 build instead of the one under test.
    // The testPort values exist to keep the two apart.
    ...SITES.map((site) => ({
      command: `PORT=${site.testPort} pnpm --filter @apex/${site.id} start`,
      url: baseUrlFor(site),
      reuseExistingServer: false,
      timeout: 180_000,
    })),
  ],
});
