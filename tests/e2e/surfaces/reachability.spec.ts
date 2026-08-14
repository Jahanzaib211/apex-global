import { test, expect } from "@playwright/test";

/**
 * Every front-end surface on this host, public and loopback.
 *
 * One row per service. `auth` marks surfaces whose sign-in flow is itself
 * covered in signins.spec.ts. This file only answers the cheapest question
 * first: does the door answer?
 */

type Surface = {
  name: string;
  url: string;
  note?: string;
  /**
   * Why this surface is not currently expected to answer. Set it and the row
   * is reported as skipped with the reason rather than deleted — a service
   * that has been retired should say so, not vanish from the inventory.
   */
  notDeployed?: string;
};

const PUBLIC: Surface[] = [
  {
    name: "apex-tech (main site)",
    url: "https://tech.apexgroupcompanies.com",
    note: "-> 127.0.0.1:4300 via tunnel-apex-tech",
  },
  {
    name: "apex-tech client portal",
    url: "https://tech.apexgroupcompanies.com/portal/login",
    note: "auth surface",
  },
  {
    name: "apex-cloud mail (mailcow)",
    url: "https://cloud.apexgroupcompanies.com",
    note: "mailcow, -> caddy :8085",
  },
  {
    name: "apex-cloud mail admin login",
    url: "https://cloud.apexgroupcompanies.com/admin/",
    note: "auth surface",
  },
  {
    name: "apex-group corporate",
    url: "https://apex.apexgroupcompanies.com",
    note: "-> 127.0.0.1:3103",
  },
  {
    name: "apex-tours",
    url: "https://tours.apexgroupcompanies.com",
    note: "-> 127.0.0.1:3001",
  },
  {
    name: "apex-outsourcing",
    url: "https://outsourcing.apexgroupcompanies.com",
    note: "-> 127.0.0.1:3100",
  },
  {
    name: "apex-holdings",
    url: "https://holdings.apexgroupcompanies.com",
    note: "-> 127.0.0.1:3102",
  },
  {
    name: "nova gateway (deer-flow)",
    url: "https://nova.alilabsx.com",
    note: "-> 127.0.0.1:2026",
  },
  {
    name: "fox-hosting client portal",
    url: "https://client.alilabsx.com",
    note: "-> 127.0.0.1:4200",
  },
  {
    name: "fox-whmcs admin",
    url: "https://admin.alilabsx.com",
    note: "-> 127.0.0.1:4201, admin login",
  },
];

const CHATWOOT_PUBLIC: Surface = {
  name: "chatwoot agent login",
  url: "https://chat.apexgroupcompanies.com/app/login",
  note: "auth surface; the widget SDK the four marketing sites load is served from the same origin",
};

const LOOPBACK: Surface[] = [
  { name: "apex web", url: "http://127.0.0.1:4300" },
  { name: "apex console", url: "http://127.0.0.1:4301/login" },
  // Root, not /auth/sign_in: the sign-in route redirects to FRONTEND_URL
  // (https://chat.apexgroupcompanies.com), and Rails refuses a cross-host
  // redirect from a loopback request with UnsafeRedirectError -> 500. The
  // public auth surface is asserted in PUBLIC below.
  { name: "chatwoot helpdesk", url: "http://127.0.0.1:4800/" },
  { name: "twenty CRM", url: "http://127.0.0.1:3008" },
  { name: "hyperswitch control center", url: "http://127.0.0.1:9090" },
  { name: "hyperswitch web sdk", url: "http://127.0.0.1:9056" },
  { name: "open-webui", url: "http://127.0.0.1:3030" },
  { name: "fox-frontend", url: "http://127.0.0.1:4200" },
  { name: "fox-whmcs", url: "http://127.0.0.1:4201/admin/" },
  { name: "fox-license", url: "http://127.0.0.1:4202" },
  { name: "genesis-web", url: "http://127.0.0.1:3000" },
  { name: "genesis-api", url: "http://127.0.0.1:4001" },
  { name: "apex-seo-platform", url: "http://127.0.0.1:3002" },
  { name: "nova-ops", url: "http://127.0.0.1:4100" },
  {
    name: "bullion-desk",
    url: "http://127.0.0.1:9000",
    notDeployed: "no process in pm2 or docker and no project directory on this host",
  },
  {
    name: "vibe-trading",
    url: "http://127.0.0.1:8899",
    notDeployed: "project exists at ~/Desktop/vibe-trading but nothing runs it",
  },
  { name: "apex-group", url: "http://127.0.0.1:3103" },
  { name: "apex-tours", url: "http://127.0.0.1:3001" },
  { name: "apex-outsourcing", url: "http://127.0.0.1:3100" },
  { name: "apex-holdings", url: "http://127.0.0.1:3102" },
  { name: "deer-flow gateway", url: "http://127.0.0.1:2026" },
  { name: "minio (api)", url: "http://127.0.0.1:9020/minio/health/live" },
  { name: "minio (console UI)", url: "http://127.0.0.1:9021" },
  { name: "meilisearch", url: "http://127.0.0.1:7701/health" },
];

test.describe("reachability: every surface answers", () => {
  for (const surface of [...PUBLIC, CHATWOOT_PUBLIC, ...LOOPBACK]) {
    test(`${surface.name} (${surface.url}) answers`, async ({ request }) => {
      test.setTimeout(60_000);
      test.skip(Boolean(surface.notDeployed), surface.notDeployed ?? "");
      const res = await request.get(surface.url, {
        timeout: 20_000,
        maxRedirects: 10,
      });
      expect(res.status(), `${surface.url} should answer (got ${res.status()})`).toBeLessThan(500);
    });
  }
});
