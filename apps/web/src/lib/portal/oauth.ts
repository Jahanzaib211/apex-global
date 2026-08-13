import { headers } from "next/headers";
import type { OAuthProvider } from "@apex/auth";

/**
 * The OAuth redirect URI, derived in exactly one place.
 *
 * Both the start route and the callback route have to send a byte-identical
 * `redirect_uri` — the provider compares the value used at authorisation with
 * the value sent at token exchange and rejects the exchange on any mismatch.
 * Building it twice is how the two drifted apart and left the callback
 * unreachable, so the string is derived here and nowhere else.
 *
 * The path must match the route file at
 * `(portal)/portal/(unauth)/auth/[provider]/callback/route.ts`, which resolves
 * to `/portal/auth/<provider>/callback` once the route groups drop out.
 */
export function portalOAuthRedirectUri(provider: OAuthProvider, origin: string): string {
  return `${origin}/portal/auth/${provider}/callback`;
}

/** The public origin of this request, honouring the tunnel's forwarded proto. */
export async function requestOrigin(): Promise<string> {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "https";
  const host = h.get("host") ?? "tech.apexgroupcompanies.com";
  return `${proto}://${host}`;
}

/** Convenience for route handlers: the redirect URI for the current request. */
export async function currentOAuthRedirectUri(provider: OAuthProvider): Promise<string> {
  return portalOAuthRedirectUri(provider, await requestOrigin());
}
