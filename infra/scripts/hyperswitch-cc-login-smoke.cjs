#!/usr/bin/env node
// End-to-end smoke test for the Hyperswitch Control Center login.
//
// Drives a real headless chromium through the sign-in form and asserts the
// dashboard is reachable. Lived in the Kangro Flights repo until 2026-08-17;
// moved here because it tests this stack's infrastructure, not that app — and
// because it carries this machine's credentials, which must not ship with an
// application.
//
//   node infra/scripts/hyperswitch-cc-login-smoke.cjs
//
// Override with HS_CC_URL / HS_EMAIL / HS_PASSWORD.

const { chromium } = require('playwright');

const CC_URL = process.env.HS_CC_URL || 'http://127.0.0.1:9090';
const EMAIL  = process.env.HS_EMAIL  || 'alilabsx@gmail.com';
const PASS   = process.env.HS_PASSWORD || 'Jatt@1234567';
const SCREENSHOT = process.env.HS_SCREENSHOT || '/tmp/hs-cc-login.png';
const EXEC = process.env.CHROME_PATH || '/home/jahanzaib/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome';

let fails = 0;
function check(name, ok, detail) {
  console.log(`  ${ok ? '✓' : '✗'} ${name}${ok ? '' : ' — ' + detail}`);
  if (!ok) fails++;
}

async function main() {
  const browser = await chromium.launch({ executablePath: EXEC, headless: true, args: ['--no-sandbox'] });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  console.log('CC smoke test against ' + CC_URL);
  console.log('');

  console.log('Loading login page:');
  await page.goto(CC_URL, { waitUntil: 'networkidle', timeout: 30_000 });
  await page.waitForSelector('input[placeholder="Enter your Email"]', { timeout: 30_000 });
  await page.screenshot({ path: SCREENSHOT, fullPage: true });
  check('login page rendered', true, `screenshot: ${SCREENSHOT}`);

  const emailInput = page.locator('input[placeholder="Enter your Email"]').first();
  const passInput  = page.locator('input[placeholder="Enter your Password"]').first();

  await emailInput.fill(EMAIL);
  await passInput.fill(PASS);

  console.log('Submitting login:');
  await page.locator('button:visible:has-text("Continue")').first().click();

  // The router's v2 signin returns token_type "totp": with
  // [user] force_two_factor_auth = false the CC shows a skippable 2FA setup
  // screen before the dashboard. Skip it — it reappears every login until
  // someone actually enrols an authenticator.
  const skip = page.locator('button:visible:has-text("Skip now")').first();
  try {
    await skip.waitFor({ timeout: 15_000 });
    console.log('  2FA setup screen shown — clicking "Skip now"');
    await skip.click();
  } catch {
    console.log('  no 2FA screen (already enrolled or skipped)');
  }

  await page.waitForTimeout(8000);
  await page.screenshot({ path: SCREENSHOT.replace('.png', '-after.png'), fullPage: true });

  const bodyText = (await page.locator('body').innerText()).slice(0, 2000);
  const hasError = /invalid|incorrect|registration|failed|wrong|denied/i.test(bodyText);
  const hasLoginForm = await emailInput.isVisible().catch(() => false);
  check('login form is gone after submit', !hasLoginForm, 'login form still visible');
  check('no error message on page', !hasError, 'login error visible');

  const url = page.url();
  check('URL changed off /login', !/login$/.test(url), `still at ${url}`);
  check('dashboard chrome rendered', /Overview|Connectors|Analytics/.test(bodyText), 'sidebar not found');

  await browser.close();

  console.log(fails === 0
    ? '\nHyperswitch CC login: ALL CHECKS PASSED ✓\n'
    : `\nHyperswitch CC login: ${fails} CHECKS FAILED ✗\n`);
  process.exit(fails === 0 ? 0 : 1);
}

main().catch((e) => { console.error('crashed:', e); process.exit(2); });
