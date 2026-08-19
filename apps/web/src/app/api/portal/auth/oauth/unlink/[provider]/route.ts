import { prisma } from "@apex/db";
import { verifyCsrf } from "@apex/auth";
import { NextResponse } from "next/server";
import { currentPortalUser } from "@/lib/portal/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PROVIDERS = ["google", "microsoft"] as const;

/**
 * Unlink an OAuth identity from the signed-in portal user.
 *
 * Only the current user's own rows can be removed (always scoped to the
 * session user id — never the `[provider]` fixture used by the form's
 * dynamic route). A user with no password and no remaining OAuth link
 * would be unable to sign in, so that case is refused loudly.
 *
 * CSRF: form posts must carry a signed `csrf`/`csrfSignature` pair (same
 * scheme as the sign-out route). A missing or tampered pair is refused
 * with 403 rather than unlinking anything.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider } = await params;

  if (!PROVIDERS.includes(provider as (typeof PROVIDERS)[number])) {
    return NextResponse.json({ error: "Unknown sign-in provider." }, { status: 400 });
  }
  const providerName = provider as (typeof PROVIDERS)[number];

  // Verify CSRF before any DB read. Form posts from the portal account page
  // carry the pair; cross-origin form posts cannot forge the signature.
  const contentType = request.headers.get("content-type") ?? "";
  const isForm =
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data");
  if (isForm) {
    const form = await request.formData().catch(() => null);
    const token = String(form?.get("csrf") ?? "");
    const signature = String(form?.get("csrfSignature") ?? "");
    if (!token || !signature || !verifyCsrf(token, signature)) {
      return NextResponse.json({ error: "Invalid request." }, { status: 403 });
    }
  }

  const user = await currentPortalUser();
  if (!user) {
    return NextResponse.json({ error: "You are not signed in." }, { status: 401 });
  }

  const [remaining, hasPassword] = await Promise.all([
    prisma.portalOAuthAccount.count({
      where: { userId: user.id, provider: { not: providerName } },
    }),
    prisma.portalUser.findUnique({
      where: { id: user.id },
      select: { passwordHash: true },
    }),
  ]);

  // Refuse to remove the only way in. Prevents self-lockout when a user has
  // a single OAuth link and never set a password.
  if (remaining === 0 && !hasPassword?.passwordHash) {
    return NextResponse.json(
      { error: "Set a password before unlinking — this is currently your only sign-in method." },
      { status: 409 },
    );
  }

  const deleted = await prisma.portalOAuthAccount.deleteMany({
    where: { userId: user.id, provider: providerName },
  });

  if (deleted.count > 0) {
    await prisma.portalAuditLog.create({
      data: {
        portalUserId: user.id,
        portalAccountId: user.portalAccountId,
        action: "oauth.unlinked",
        entityType: "PortalOAuthAccount",
        summary: `Unlinked ${providerName} sign-in`,
      },
    });
  }

  return NextResponse.json({ ok: true, unlinked: deleted.count });
}
