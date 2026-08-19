import { execSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, type Page } from "@playwright/test";

/**
 * Shared helpers for the journey spec (tests/e2e/journey).
 *
 * The journey is host-bound by design: it reads the local Mailcow capture
 * mailbox (docker exec into the dovecot container), expects the local
 * Hyperswitch router on 127.0.0.1:8084, and finishes the payment on the live
 * Cloudflare origin. Run it on the deploy host with:
 *
 *   E2E_SMTP_MAILCOW=1 pnpm exec playwright test --project=journey
 */

export const WEB_LOCAL = process.env.E2E_WEB_URL ?? "http://localhost:4890";
export const CONSOLE_URL = process.env.E2E_CONSOLE_URL ?? "http://localhost:4891";
export const LIVE_WEB = "https://tech.apexgroupcompanies.com";

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "alilabsx@gmail.com";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Jatt@1234567";
export const PORTAL_EMAIL = "alilabsx@gmail.com";
export const PORTAL_PASSWORD = process.env.E2E_PORTAL_PASSWORD ?? "Jatt@1234567";

/** Mailbox every app email lands in when the apps relay to Mailcow. */
export const CAPTURE_EMAIL = "capture@cloud.apexgroupcompanies.com";

/** The real portal account the journey's lead is linked to (invoice visibility). */
export const JOURNEY_ACCOUNT_NAME = "Apex Global";

const HERE = dirname(fileURLToPath(import.meta.url));
export const SHOT_DIR = process.env.JOURNEY_SHOT_DIR ?? join(HERE, "shots");

export async function shot(page: Page, name: string) {
  mkdirSync(SHOT_DIR, { recursive: true });
  await page.screenshot({ path: join(SHOT_DIR, `${name}.png`), fullPage: false });
}

export async function adminSignIn(page: Page) {
  await page.goto(`${CONSOLE_URL}/login`);
  await page.getByLabel("Email").fill(ADMIN_EMAIL);
  await page.getByLabel("Password").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(new RegExp(`^${CONSOLE_URL}/?$`), { timeout: 15_000 });
}

export async function portalSignIn(page: Page, origin: string) {
  await page.goto(`${origin}/portal/login`);
  await page.locator('input[name="email"]').fill(PORTAL_EMAIL);
  await page.locator('input[name="password"]').fill(PORTAL_PASSWORD);
  await Promise.all([
    page.waitForURL(
      (url) => url.pathname === "/portal" || url.pathname === "/portal/" || url.pathname.startsWith("/portal?"),
      { timeout: 15_000 },
    ),
    page.getByRole("button", { name: "Sign in" }).click(),
  ]);
  await page.locator("header").first().waitFor({ state: "visible", timeout: 15_000 });
}

/**
 * Route every /api request through `x-forwarded-for: <ip>` so the contact
 * form's submissions count against a per-test visitor, not the shared host
 * (the /api/leads limiter caps at 5 per 10 minutes per IP).
 */
export async function spoofPageIp(page: Page, ip: string) {
  await page.route("**/api/**", (route) => {
    const headers = { ...route.request().headers(), "x-forwarded-for": ip };
    void route.continue({ headers });
  });
}

const DOVECOT = "mailcowdockerized-dovecot-mailcow-1";

/** Decrypted text of every message in the capture mailbox (doveadm decrypts). */
export function readCaptureMail(): string {
  try {
    const raw = execSync(
      `docker exec ${DOVECOT} doveadm fetch -u ${CAPTURE_EMAIL} text.utf8 all 2>/dev/null`,
      { encoding: "utf8", timeout: 15_000 },
    );
    return raw
      .split(/\n(?=text\.utf8:)/)
      .filter((chunk) => chunk.startsWith("text.utf8:"))
      .map((chunk) => chunk.replace(/^text\.utf8:\s*/, "").trim())
      .join("\n---\n");
  } catch {
    return "";
  }
}

/** Poll Mailcow until a captured message contains `needle`, or fail. */
export async function waitForCaptureMail(needle: string, timeoutMs = 45_000) {
  const deadline = Date.now() + timeoutMs;
  let mail = "";
  while (Date.now() < deadline) {
    mail = readCaptureMail();
    if (mail.includes(needle)) return mail;
    await new Promise((r) => setTimeout(r, 2_000));
  }
  throw new Error(`Mailcow capture mailbox never contained "${needle}". Last read:\n${mail.slice(0, 800)}`);
}

/** A unique lead label for one journey run, so runs never collide. */
export function runLabel() {
  const stamp = new Date().toISOString().slice(0, 16).replace(/[-:T]/g, "");
  return `JNY-${stamp}`;
}