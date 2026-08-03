import { defineConfig, devices } from "@playwright/test";

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
      name: "console",
      testMatch: /console\/.*\.spec\.ts/,
      use: { ...devices["Desktop Chrome"], baseURL: CONSOLE_URL },
    },
  ],

  webServer: isCI
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
    : undefined,
});
