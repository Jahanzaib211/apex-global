import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-static";

const BUILD_SHA = process.env.VERCEL_GIT_COMMIT_SHA || process.env.GIT_SHA || "local";
const BUILD_TIME = process.env.BUILD_TIME || new Date().toISOString();

export function GET(): NextResponse {
  return NextResponse.json(
    {
      name: "apex-holdings",
      version: process.env.npm_package_version || "1.0.0",
      buildSha: BUILD_SHA,
      buildTime: BUILD_TIME,
      node: process.version,
      next: process.env.NEXT_RUNTIME || "nodejs",
    },
    {
      headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=60" },
    },
  );
}
