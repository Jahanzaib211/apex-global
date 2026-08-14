import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export function GET() {
  return NextResponse.json(
    {
      name: "apex-group",
      version: process.env.npm_package_version || "1.0.0",
      buildSha: process.env.BUILD_SHA || "dev",
      builtAt: process.env.BUILD_TIME || new Date().toISOString(),
      node: process.version,
      next: "14.2.x",
      env: process.env.NODE_ENV || "development",
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
