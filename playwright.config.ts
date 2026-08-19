import { config as loadEnv } from "dotenv";
import { defineConfig, devices } from "@playwright/test";

// The suite is black-box by design and talks to the apps over HTTP. The one
// exception is the console lockout reset, which needs DATABASE_URL — and the
// app processes get it from dotenv, so the test runner should too.
loadEnv();

import { SITES, baseUrlFor } from "./tests/e2e/sites/site-matrix";

// Dedicated ports, for the same reason the marketing sites have them: 4300
// and 4301 are bound by PM2 on the deploy host, so a suite that pointed at
// them tested whatever production happened to be serving. That is not a
// hypothetical — a local run did exactly this and reported seventeen failures
// that were nothing but a PM2 process holding a build that had since been
// replaced on disk. Every chunk 404'd, so the pages had no client JavaScript
// at all, and the suite dutifully reported broken forms and a missing canvas.
const WEB_TEST_PORT = 4890;
const CONSOLE_TEST_PORT = 4891;
// Deliberately E2E-prefixed rather than reading NEXT_PUBLIC_SITE_URL. That
// variable is set in the repo `.env` to the *live* Tech URL, because the apps
// build through it — so once this file started loading .env, the suite tried
// to bind a web server to https://tech.apexgroupcompanies.com. An override
// meant for the tests should have a name that only the tests use.
const WEB_URL = process.env.E2E_WEB_URL ?? `http://localhost:${WEB_TEST_PORT}`;
const CONSOLE_URL = process.env.E2E_CONSOLE_URL ?? `http://localhost:${CONSOLE_TEST_PORT}`;
const isCI = !!process.env.CI;
// The journey project sends real app mail (invoice emails, portal links) and
// asserts it arrived by reading the local Mailcow capture mailbox. That only
// works if the apps under test relay to 127.0.0.1:25 instead of the Brevo
// relay from .env, so the webServer entries add the override only when the
// journey run asks for it (E2E_SMTP_MAILCOW=1). All other projects keep the
// .env relay untouched.
const smtpMailcow = process.env.E2E_SMTP_MAILCOW === "1";
const mailcowEnv = smtpMailcow
  ? { SMTP_HOST: "127.0.0.1", SMTP_PORT: "25", LEAD_NOTIFY_TO: "capture@cloud.apexgroupcompanies.com" }
  : undefined;

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
    // The end-to-end journey: one serial spec that walks a lead from the
    // public contact form through the console (quote/invoice create, edit,
    // send, payment) into the customer's portal (sign in, view, pay with a
    // sandbox card) and back. It needs the local Mailcow, the local
    // Hyperswitch router and the live Cloudflare tunnels, so it only runs on
    // the deploy host, never in CI:
    //   E2E_SMTP_MAILCOW=1 pnpm exec playwright test --project=journey
    ...(isCI
      ? []
      : [
          {
            name: "journey",
            testMatch: /journey\/.*\.spec\.ts/,
            fullyParallel: false,
            workers: 1,
            use: { ...devices["Desktop Chrome"] },
          },
        ]),
    // Host audit, not a build gate: these probe the deploy host's loopback
    // services and the live Cloudflare tunnels. A CI runner has neither, so
    // the project is skipped there and run on the host instead.
    ...(isCI
      ? []
      : [
          {
            name: "surfaces",
            testMatch: /surfaces\/.*\.spec\.ts/,
            use: { ...devices["Desktop Chrome"] },
          },
        ]),
    {
      // One project, not one per site: the sites/ specs address each origin
      // absolutely from SITES, so a per-site project would re-run all four
      // sites' assertions four times over. Each test title names its site.
      name: "sites",
      testMatch: /sites\/.*\.spec\.ts/,
      testIgnore: /sites\/perf\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    // Frame-rate measurement, pinned to a single worker: run in parallel the
    // same page reports anywhere from 11 to 52fps, because the measurement
    // competes for the CPU.
    //
    // That pin only holds *within* this project — Playwright still runs
    // projects alongside each other, so in CI perf was contending with the
    // whole rest of the suite, and a shared runner with software rendering
    // makes the number meaningless anyway. It is therefore skipped in CI and
    // run deliberately on real hardware:
    //   pnpm exec playwright test --project=perf
    ...(isCI
      ? []
      : [
          {
            name: "perf",
            testMatch: /sites\/perf\.spec\.ts/,
            fullyParallel: false,
            workers: 1,
            use: { ...devices["Desktop Chrome"] },
          },
        ]),
    {
      // Travel and property traffic is overwhelmingly mobile; if the money path
      // breaks on a phone it breaks where it costs us.
      name: "site-mobile",
      testMatch: /sites\/controls\.spec\.ts/,
      use: { ...devices["Pixel 7"] },
    },
  ],

  webServer: [
    // Started everywhere, not only in CI. The local run used to skip these and
    // address whatever answered on the production port instead.
    {
      command: `PORT=${WEB_TEST_PORT} pnpm --filter @apex/web start`,
      url: WEB_URL,
      reuseExistingServer: false,
      timeout: 180_000,
      env: mailcowEnv,
    },
    {
      command: `PORT=${CONSOLE_TEST_PORT} pnpm --filter @apex/console start`,
      url: CONSOLE_URL,
      reuseExistingServer: false,
      timeout: 180_000,
      env: mailcowEnv,
    },
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
