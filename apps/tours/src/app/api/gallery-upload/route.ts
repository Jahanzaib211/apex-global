/**
 * Local API for "Submit your photos" — accepts an image upload from a
 * traveller on the gallery page and persists it under `public/uploads/`
 * with a UUID filename. The docx-mandated alternative was a plain
 * <input type="file">; this is the same surface, just server-side for
 * the form's `action` attribute.
 *
 * Limits (docx):
 *   • Image MIME only (image/jpeg, image/png, image/webp)
 *   • 5 MB max file size
 *
 * On rejection the route returns a plain 400 with a one-line message.
 * The "Submit your photos" EnquireButton on /gallery points at this
 * endpoint as its form target.
 */
import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads", "gallery");
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(req: Request): Promise<Response> {
  const form = await req.formData().catch(() => null);
  if (!form) {
    return new NextResponse("Could not parse the form body.", { status: 400 });
  }

  const file = form.get("photo");
  const caption = String(form.get("caption") ?? "").slice(0, 500);

  if (!(file instanceof File)) {
    return new NextResponse("A photo file is required.", { status: 400 });
  }
  if (file.size === 0 || file.size > MAX_BYTES) {
    return new NextResponse("Photo must be between 1 byte and 5 MB.", { status: 400 });
  }
  if (!ALLOWED_MIME.has(file.type)) {
    return new NextResponse("Only JPEG, PNG, and WebP images are accepted.", { status: 400 });
  }

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const name = `${randomUUID()}.${ext}`;
  const destination = join(UPLOAD_DIR, name);

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(destination, buffer);

  return NextResponse.json({
    ok: true,
    file: `/uploads/gallery/${name}`,
    bytes: file.size,
    caption,
  });
}
