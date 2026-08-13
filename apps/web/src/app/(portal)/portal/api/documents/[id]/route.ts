import { prisma } from "@apex/db";
import { normalizeObjectKey, presignedGetUrl, s3Config } from "@apex/integrations";
import { NextResponse } from "next/server";
import { requirePortalUserAccount } from "@/lib/portal/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /portal/api/documents/[id] — download a shared client document.
 *
 * Scopes the lookup to the signed-in account, then issues a short-lived
 * presigned URL straight to object storage so the byte stream never passes
 * through the app server. The row exists only if the team has shared the
 * document (King or client uploads land through the console flow).
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user } = await requirePortalUserAccount();

  const doc = await prisma.clientDocument.findFirst({
    where: { id, portalAccountId: user.portalAccountId, publishedAt: { not: null } },
  });
  if (!doc) {
    return NextResponse.json({ error: "Document not found." }, { status: 404 });
  }

  try {
    const key = normalizeObjectKey(doc.key);
    const url = presignedGetUrl(key, { expiresInSeconds: 5 * 60, ...s3Config(process.env) });
    return NextResponse.redirect(url, { status: 303 });
  } catch (error) {
    console.error("Document download failed", error);
    return NextResponse.json(
      { error: "The file could not be retrieved right now. Please try again." },
      { status: 503 },
    );
  }
}
