import { NextResponse } from "next/server";
import { z } from "zod";
import { redeemInvitation } from "@/lib/portal/invitations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  token: z.string().min(10).max(400),
  name: z.string().trim().min(2).max(120),
  password: z.string().min(8).max(200),
});

/**
 * POST /api/portal/auth/accept-invitation — redeem an invitation token.
 *
 * Caller: the accept page's server action calls `redeemInvitation` directly.
 * This route is the programmatic entry point for the same operation, and it
 * accepts form encoding as well as JSON so an ordinary HTML form can post to
 * it without JavaScript.
 */
export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  let body: unknown;
  try {
    if (contentType.includes("application/json")) {
      body = await request.json();
    } else {
      const form = await request.formData();
      body = Object.fromEntries(form.entries());
    }
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check your details." }, { status: 422 });
  }

  const result = await redeemInvitation(parsed.data);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ ok: true });
}
