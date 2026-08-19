import { test, expect, type BrowserContext, type Page } from "@playwright/test";
import { prisma } from "@apex/db";
import { randomBytes } from "node:crypto";
import { LIVE_WEB, PORTAL_EMAIL, portalSignIn, shot } from "./_helpers";

/**
 * Live smoke: read-only checks against the deployed origin through the
 * Cloudflare tunnel. Everything here runs against the production build, so it
 * only makes sense on the deploy host (same machine, same DB).
 *
 * One shared signed-in context for the whole spec: the live app rate-limits
 * sign-ins (5 per email, 10 per IP, per 10 minutes), and every attempt on the
 * live origin counts against the production bucket.
 */
test.describe("live smoke", () => {
  let invoiceId = "";
  let invoiceNumber = "";
  let ctx: BrowserContext;
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    // The signed-in customer's account owns no invoices in production data, so
    // the smoke creates one the same way a console user would: a lead linked
    // to the customer's portal account plus a DRAFT invoice. Removed again
    // after the run; only reads happen against the live app.
    const suffix = randomBytes(3).toString("hex");
    const account = await prisma.portalAccount.findFirst({
      where: { users: { some: { email: PORTAL_EMAIL } } },
    });
    if (!account) throw new Error(`No portal account for ${PORTAL_EMAIL}`);

    const invoice = await prisma.$transaction(async (tx) => {
      const lead = await tx.lead.create({
        data: {
          name: `Live Smoke ${suffix}`,
          email: `live-smoke-${suffix}@apex.example.com`,
          companyName: "Live Smoke Ltd",
          stage: "NEW",
          portalAccounts: { connect: { id: account.id } },
        },
      });
      return tx.invoice.create({
        data: {
          number: `INV-LS-${suffix}`,
          customerName: `Live Smoke ${suffix}`,
          customerEmail: `live-smoke-${suffix}@apex.example.com`,
          leadId: lead.id,
          subtotalAmount: 125000,
          taxAmount: 0,
          totalAmount: 125000,
          currency: "USD",
          lineItems: [
            { description: "Live smoke line", quantity: 1, unitAmount: 125000, currency: "USD" },
          ],
        },
      });
    });
    invoiceId = invoice.id;
    invoiceNumber = invoice.number;

    ctx = await browser.newContext({ baseURL: LIVE_WEB });
    page = await ctx.newPage();
    await portalSignIn(page, LIVE_WEB);
  });

  test.afterAll(async () => {
    if (!invoiceId) return;
    const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } });
    if (invoice?.leadId) await prisma.lead.delete({ where: { id: invoice.leadId } });
    await prisma.invoice.delete({ where: { id: invoiceId } });
    await ctx.close();
  });

  test("portal sign-in and invoices list on the live origin", async () => {
    await expect(page.getByRole("heading", { name: /Welcome back/i })).toBeVisible({
      timeout: 15_000,
    });
    await shot(page, "live-01-portal-home");

    await page.goto(`${LIVE_WEB}/portal/invoices`);
    await expect(page.getByRole("heading", { name: /Your invoices/i })).toBeVisible({
      timeout: 15_000,
    });
    await shot(page, "live-02-invoices");
  });

  test("an invoice detail renders and its PDF downloads on the live origin", async () => {
    await page.goto(`${LIVE_WEB}/portal/invoices`);
    const row = page.locator(`a[href="/portal/invoices/${invoiceId}"]`);
    await expect(row).toBeVisible({ timeout: 15_000 });

    await page.goto(`${LIVE_WEB}/portal/invoices/${invoiceId}`);
    await expect(page.getByText(`Invoice ${invoiceNumber}`, { exact: false })).toBeVisible({
      timeout: 15_000,
    });
    await shot(page, "live-03-invoice-detail");

    const pdf = await page.request.get(`${LIVE_WEB}/api/portal/invoices/${invoiceId}/pdf`);
    expect(pdf.status()).toBe(200);
    expect(pdf.headers()["content-type"]).toContain("text/html");
  });

  test("public contact page renders on the live origin", async () => {
    await page.goto(`${LIVE_WEB}/contact`);
    await expect(page.getByRole("heading", { name: /Let's build what's next/i })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByRole("button", { name: /Send enquiry/i })).toBeVisible();
  });
});