import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@apex/db";
import { open } from "@apex/integrations/vault";

/**
 * Catches every browser-side call the Hyperswitch widget app makes to
 * `/hyperswitch-api/*` and forwards it to the self-hosted router on
 * 127.0.0.1:8084. Three compatibility shims are applied:
 *
 * 1. **API key** — the router requires an API key header; the widget SDK
 *    only sends the clientSecret. We read the encrypted key from the vault
 *    and inject it.
 * 2. **`wallets`** — the router's session_tokens endpoint rejects bodies
 *    without a `wallets` field; the SDK never sends one. We add `wallets: []`
 *    to session_tokens POSTs.
 * 3. **JSON body** — the SDK never sends a body for GETs and sends
 *    `application/json` for POSTs; we preserve that.
 *
 * Headers like `host`, `content-length` are stripped so the upstream
 * router doesn't see the outer project's hostname.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return forward(request, await params);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return forward(request, await params);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return forward(request, await params);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return forward(request, await params);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return forward(request, await params);
}

async function forward(request: NextRequest, { path }: { path: string[] }) {
  const integration = await prisma.partnerIntegration.findUnique({
    where: { provider: "hyperswitch" },
  });
  if (!integration) {
    return new NextResponse(JSON.stringify({ error: "hyperswitch integration not configured" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
  const apiKey = open({
    ciphertext: integration.secretCiphertext ?? "",
    iv: integration.secretIv ?? "",
    tag: integration.secretTag ?? "",
  });
  if (!apiKey) {
    return new NextResponse(JSON.stringify({ error: "hyperswitch API key not configured" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }

  const upstreamPath = "/" + path.join("/");
  const upstreamUrl = `http://127.0.0.1:8084${upstreamPath}${request.nextUrl.search}`;
  console.log("[hs-api]", request.method, upstreamPath, "hasKey", !!apiKey);

  const headers = new Headers();
  headers.set("api-key", apiKey);
  headers.set("accept", request.headers.get("accept") ?? "application/json");

  let body: BodyInit | null = null;
  if (request.method !== "GET" && request.method !== "HEAD") {
    const raw = await request.text();
    if (raw) {
      let parsed: Record<string, unknown> | unknown[] | null = null;
      try {
        parsed = JSON.parse(raw);
      } catch {
        parsed = null;
      }
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        if (upstreamPath === "/payments/session_tokens" && !("wallets" in parsed)) {
          parsed.wallets = [];
        }
        headers.set("content-type", "application/json");
        body = JSON.stringify(parsed);
      } else {
        body = raw;
        const ct = request.headers.get("content-type");
        if (ct) headers.set("content-type", ct);
      }
    }
  }

  const response = await fetch(upstreamUrl, {
    method: request.method,
    headers,
    body,
  });

  const responseBody = await response.text();
  return new NextResponse(responseBody, {
    status: response.status,
    headers: {
      "content-type": response.headers.get("content-type") ?? "application/json",
    },
  });
}
