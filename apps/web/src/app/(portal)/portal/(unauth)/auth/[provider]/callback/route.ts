import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";
import { prisma } from "@apex/db";
import {
  exchangeCodeForTokens,
  fetchUserInfo,
  getProvider,
  issuePortalSession,
  PORTAL_SESSION_COOKIE,
  PORTAL_SESSION_TTL_SECONDS,
  verifyState,
  type OAuthProvider,
} from "@apex/auth";
import { clientIp } from "@/lib/portal/auth";
import { currentOAuthRedirectUri } from "@/lib/portal/oauth";

/**
 * OAuth callback.
 *
 * The provider redirects the user here with `?code=...&state=...`. We verify
 * the signed state and nonce, exchange the code for tokens, fetch the
 * profile, and either link the OAuth identity to an existing portal user
 * (matched by OAuth link, then by email) or fail closed.
 *
 * OAuth is explicitly **not** a signup path: a verified email with no
 * existing portal user is refused, so the user must be invited by an
 * operator before they can sign in with Google/Microsoft. Existing users
 * (including self-serve signup users) can link OAuth to their account by
 * signing in via email first and using the account page's "Link" button.
 *
 * Inactive accounts are refused in both lookup branches: a deactivated
 * user with a previously-linked OAuth identity is not silently reactivated
 * by a fresh sign-in attempt.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider } = await params;
  const code = request.nextUrl.searchParams.get("code") ?? undefined;
  const state = request.nextUrl.searchParams.get("state") ?? undefined;
  const error = request.nextUrl.searchParams.get("error") ?? undefined;

  if (error) redirect(`/portal/login?error=${encodeURIComponent(error)}`);
  if (!code || !state) redirect("/portal/login?error=Missing+OAuth+parameters");

  const signed = verifyState(state);
  if (!signed || signed.provider !== provider) {
    redirect("/portal/login?error=Invalid+OAuth+state");
  }

  const store = await cookies();
  const cookieRaw = store.get("apex_portal_oauth_state")?.value;
  if (!cookieRaw) redirect("/portal/login?error=OAuth+state+cookie+missing");
  let cookieData: { nonce?: string; state?: string; provider?: string; next?: string };
  try {
    cookieData = JSON.parse(cookieRaw);
  } catch {
    redirect("/portal/login?error=OAuth+state+cookie+corrupt");
  }
  if (!cookieData || cookieData.nonce !== signed.nonce || cookieData.state !== state) {
    redirect("/portal/login?error=OAuth+state+mismatch");
  }
  store.delete("apex_portal_oauth_state");

  if (provider !== "google" && provider !== "microsoft") {
    redirect("/portal/login?error=Unknown+OAuth+provider");
  }
  const p = provider as OAuthProvider;

  const redirectUri = await currentOAuthRedirectUri(p);

  let tokens;
  try {
    tokens = await exchangeCodeForTokens({ provider: p, code, redirectUri });
  } catch (error) {
    redirect(`/portal/login?error=${encodeURIComponent((error as Error).message)}`);
  }

  let profile;
  try {
    profile = await fetchUserInfo(p, tokens.accessToken);
  } catch (error) {
    redirect(`/portal/login?error=${encodeURIComponent((error as Error).message)}`);
  }

  if (!profile.emailVerified) {
    redirect("/portal/login?error=Email+is+not+verified+at+the+provider");
  }

  // Find a portal user either by OAuth link or by email. We do not create a
  // brand-new account from OAuth alone — the operator must invite the email
  // first. If the email has no portal user, fail closed.
  let user = await prisma.portalUser.findFirst({
    where: {
      oauthAccounts: { some: { provider: p, providerAccountId: profile.providerAccountId } },
    },
    include: { portalAccount: true },
  });
  if (user && !user.isActive) {
    redirect("/portal/login?error=This+account+has+been+deactivated");
  }
  if (!user) {
    user = await prisma.portalUser.findUnique({
      where: { email: profile.email },
      include: { portalAccount: true },
    });
    if (!user) {
      redirect("/portal/login?error=No+portal+account+exists+for+that+email");
    }
    if (!user.isActive) {
      redirect("/portal/login?error=This+account+has+been+deactivated");
    }
    // Link the OAuth identity to the existing user.
    await prisma.portalOAuthAccount.upsert({
      where: {
        provider_providerAccountId: {
          provider: p,
          providerAccountId: profile.providerAccountId,
        },
      },
      create: {
        userId: user.id,
        provider: p,
        providerAccountId: profile.providerAccountId,
        expiresAt: tokens.expiresAt,
        scopes: getProvider(p).scope,
      },
      update: {
        userId: user.id,
        expiresAt: tokens.expiresAt,
        scopes: getProvider(p).scope,
      },
    });
  }

  if (!user.emailVerifiedAt) {
    // Mark verified since the OAuth provider has already verified the email.
    await prisma.portalUser.update({
      where: { id: user.id },
      data: { emailVerifiedAt: new Date() },
    });
  }

  const session = issuePortalSession();
  const ip = await clientIp();
  await prisma.portalSession.create({
    data: {
      userId: user.id,
      tokenHash: session.hash,
      expiresAt: session.expiresAt,
      ipAddress: ip,
      userAgent: `oauth:${p}`,
    },
  });
  await prisma.portalUser.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date(), failedLogins: 0, lockedUntil: null },
  });
  await prisma.portalAuditLog.create({
    data: {
      portalAccountId: user.portalAccountId,
      portalUserId: user.id,
      action: "user.signed_in",
      entityType: "PortalUser",
      entityId: user.id,
      summary: `Signed in via ${p}`,
      ipAddress: ip,
    },
  });

  const target =
    signed.next && signed.next.startsWith("/") && !signed.next.startsWith("//")
      ? signed.next
      : "/portal/";
  const cookieStore = await cookies();
  cookieStore.set(PORTAL_SESSION_COOKIE, session.raw, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: PORTAL_SESSION_TTL_SECONDS,
  });
  redirect(target);
}
