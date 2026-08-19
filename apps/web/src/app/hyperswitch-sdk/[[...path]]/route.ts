/**
 * Proxy to the self-hosted Hyperswitch web SDK app.
 *
 * The widget app expects to be served from the domain root and uses absolute
 * paths (`/app.js`, `/app.css`, `/icons/...`) in its HTML. We serve it under
 * /hyperswitch-sdk/ so it doesn't collide with the web app's own routes, and
 * rewrite those absolute paths to relative ones so the iframe's base URL
 * resolves them correctly.
 *
 * The patched HyperLoader script lives at apps/web/public/hyperswitch-sdk/v1/
 * and is served by Next.js's static handler before this route handler runs.
 *
 * Non-HTML responses pass through unchanged.
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const WEB_SDK = "http://127.0.0.1:9056";
const PATCHED_LOADER_PATH = join(process.cwd(), "public", "hyperswitch-sdk", "v1", "HyperLoader.js");

function rewriteHtml(html: string): string {
  let out = html;
  out = out.replaceAll('href="/', 'href="');
  out = out.replaceAll('src="/', 'src="');
  out = out.replaceAll('"/icons/', '"icons/');
  out = out.replace(/srcset="([^"]+)"/g, (_match, srcset: string) => {
    const rewritten = srcset
      .split(",")
      .map((part) => {
        const [url = "", ...rest] = part.trim().split(/\s+/);
        if (url.startsWith("/")) return [url.slice(1), ...rest].join(" ");
        return [url, ...rest].join(" ");
      })
      .join(", ");
    return `srcset="${rewritten}"`;
  });
  // The widget app's built-in CSP references HTTPS origins we don't serve
  // (api.hyperswitch.io, beta.hyperswitch.io) and forbids inline scripts/
  // connect-src to our own /hyperswitch-api/ path. Replace it with one that
  // matches our self-hosted setup. The parent page (portal checkout) is on
  // the same origin, so we only need to allow our own host and the SDK's
  // external dependencies.
  out = out.replace(
    /<meta http-equiv="Content-Security-Policy" content="[^"]*">/,
    '<meta http-equiv="Content-Security-Policy" content="default-src \'self\' https://*.hyperswitch.io https://*.braintreegateway.com https://*.trustpay.eu https://applepay.cdn-apple.com https://pay.google.com https://img.mpay.samsung.com https://x.klarnacdn.net https://www.paypal.com https://cdn.plaid.com https://js.verygoodvault.com https://vgs-collect-keeper.apps.verygood.systems https://fonts.googleapis.com https://fonts.gstatic.com data: blob: wss://*.hyperswitch.io; script-src \'self\' \'unsafe-inline\' https://*.hyperswitch.io https://*.braintreegateway.com https://*.trustpay.eu https://applepay.cdn-apple.com https://pay.google.com https://img.mpay.samsung.com https://x.klarnacdn.net https://www.paypal.com https://cdn.plaid.com https://js.verygoodvault.com https://vgs-collect-keeper.apps.verygood.systems blob:; style-src \'self\' \'unsafe-inline\' https://fonts.googleapis.com; frame-src \'self\' https:; connect-src \'self\' https://*.hyperswitch.io https://*.braintreegateway.com https://pay.google.com https://www.paypal.com blob: wss://*.hyperswitch.io;">',
  );
  return out;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path?: string[] }> },
) {
  const { path } = await params;
  const segments = path ?? [];

  if (segments[0] === "v1" && segments[1] === "HyperLoader.js") {
    try {
      const body = await readFile(PATCHED_LOADER_PATH);
      return new Response(body, {
        status: 200,
        headers: {
          "content-type": "application/javascript; charset=utf-8",
          "cache-control": "public, max-age=3600",
        },
      });
    } catch {
      return new Response("HyperLoader not found", { status: 500 });
    }
  }

  const upstreamPath = "/" + segments.join("/") + new URL(request.url).search;
  const upstreamUrl = WEB_SDK + (upstreamPath === "/" ? "/" : upstreamPath);

  const response = await fetch(upstreamUrl, {
    headers: { Accept: request.headers.get("accept") ?? "*/*" },
  });

  const contentType = response.headers.get("content-type") ?? "";
  const isHtml = contentType.includes("text/html");

  // The Next.js global headers add `X-Frame-Options: DENY` to every response,
  // which would block the widget iframe from rendering. Drop it (and any other
  // frame-ancestor restrictions) for responses served from this route.
  const passthroughHeaders = new Headers();
  response.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (lower === "x-frame-options" || lower === "content-security-policy") return;
    passthroughHeaders.set(key, value);
  });

  if (isHtml) {
    const body = await response.text();
    const rewritten = rewriteHtml(body);
    passthroughHeaders.set("content-type", contentType);
    passthroughHeaders.set("cache-control", "no-store");
    return new Response(rewritten, {
      status: response.status,
      headers: passthroughHeaders,
    });
  }

  const body = await response.arrayBuffer();
  passthroughHeaders.set("content-type", contentType);
  passthroughHeaders.set("cache-control", "public, max-age=3600");
  return new Response(body, {
    status: response.status,
    headers: passthroughHeaders,
  });
}