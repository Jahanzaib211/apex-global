import { test, expect } from "@playwright/test";

/**
 * Portal flows as a real customer:
 *  1. sign in with the owner password
 *  2. land on portal home (authenticated dashboard)
 *  3. request a password reset link from the forgot-password page
 *  4. sign out, then confirm the login page bounces the session
 */

const PORTAL_USER = "alilabsx@gmail.com";
const PORTAL_PASS = process.env.E2E_PORTAL_PASSWORD ?? "Jatt@1234567";

test.describe("Client portal flows", () => {
  test("owner can sign in and sees dashboard tiles", async ({ page }) => {
    await page.goto("/portal/login");
    await expect(page.getByRole("heading", { name: /Sign in/i })).toBeVisible();

    const email = page.locator("input[name='email']");
    const password = page.locator("input[name='password']");
    await email.fill(PORTAL_USER);
    await password.fill(PORTAL_PASS);
    await page.getByRole("button", { name: "Sign in" }).click();

    await page.waitForURL(/\/portal($|\?|\/)/, { timeout: 15_000 });
    await expect(page.getByRole("heading", { name: /^Welcome back,/ })).toBeVisible({
      timeout: 15_000,
    });
  });

  test("forgot password sends a reset link (privacy-preserving response)", async ({ page }) => {
    await page.goto("/portal/forgot-password");
    await expect(page.getByRole("heading", { name: /forgot/i }).first()).toBeVisible();

    await page.locator('input[name="email"]').fill("alilabsx@gmail.com");
    await page.getByRole("button", { name: /send reset/i }).click();

    await expect(
      page.getByText("If that email has an account, a reset link is on its way."),
    ).toBeVisible();
  });

  test("sign out clears the session", async ({ page, context }) => {
    await page.goto("/portal/login");
    await page.locator('input[name="email"]').fill(PORTAL_USER);
    await page.locator('input[name="password"]').fill(PORTAL_PASS);
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL(/\/portal($|\?|\/)/);

    // The button posts to /api/portal/auth/logout. That route used to have no
    // caller at all, with the real sign-out living in a server action.
    await page.getByRole("button", { name: "Sign out" }).click();
    await page.waitForURL(/\/portal\/login/, { timeout: 15_000 });
    await expect(page.locator('input[name="email"]')).toBeVisible();

    const session = (await context.cookies()).find((c) => c.name === "apex_portal_session");
    expect(session?.value ?? "").toBe("");
  });

  test("sign out refuses a forged cross-site post", async ({ request }) => {
    // No CSRF pair, so the route must refuse rather than log the user out.
    const response = await request.post("/api/portal/auth/logout", {
      form: { csrf: "forged", csrfSignature: "forged" },
      maxRedirects: 0,
    });
    expect(response.status()).toBe(403);
  });

  test("an invitation link reads its token from the path", async ({ page }) => {
    // The page is a [token] dynamic route. It used to read searchParams.token,
    // so a real invitation link rendered "Missing token" and the `?token=`
    // form every emitter built matched no route at all.
    await page.goto("/portal/accept-invitation/not-a-real-token");

    await expect(page.getByRole("heading", { name: /Invalid link/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Missing token/i })).toHaveCount(0);
  });
});
