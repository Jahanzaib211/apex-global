import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";
import {
  type OAuthProvider,
  buildAuthorizeUrl,
  newNonce,
  signState,
  getProvider,
} from "@apex/auth";
import { currentOAuthRedirectUri } from "@/lib/portal/oauth";

/**
 * OAuth sign-in start.
 *
 * Generates a signed state containing the provider, return URL and a nonce.
 * Stores the nonce in a short-lived cookie so the callback can compare it,
 * then redirects to the provider's authorisation endpoint.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider } = await params;
  const next = request.nextUrl.searchParams.get("next") ?? undefined;

  if (provider !== "google" && provider !== "microsoft") {
    redirect("/portal/login?error=Unknown+sign-in+provider");
  }

  try {
    getProvider(provider as OAuthProvider);
  } catch {
    redirect(`/portal/login?error=${encodeURIComponent(`${provider} sign-in is not configured`)}`);
  }

  const nonce = newNonce();
  const state = signState({
    provider: provider as OAuthProvider,
    next: next ?? "/portal/",
    nonce,
    issuedAt: Date.now(),
  });

  const redirectUri = await currentOAuthRedirectUri(provider as OAuthProvider);

  const url = buildAuthorizeUrl({
    provider: provider as OAuthProvider,
    redirectUri,
    state,
  });

  const store = await cookies();
  store.set(
    "apex_portal_oauth_state",
    JSON.stringify({ nonce, state, provider, next: next ?? "/portal/" }),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 10 * 60,
    },
  );

  redirect(url);
}
