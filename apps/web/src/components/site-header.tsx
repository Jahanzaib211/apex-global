import { ClientSiteHeader } from "@/components/site-header-client";

/**
 * Server-rendered header. Kept as its own component so it can remain a server
 * component boundary while the interactive bits (scroll state, mobile menu)
 * live in the client implementation.
 */
export function SiteHeader() {
  return <ClientSiteHeader />;
}
