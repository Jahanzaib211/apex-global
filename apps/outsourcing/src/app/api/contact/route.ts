import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { logger } from "@/lib/logger";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { forwardLeadToApex, visitorFrom, type ApexLeadAttribution } from "@/lib/apex-lead";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ContactPayload = {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  country?: string;
  service?: string;
  resources?: string;
  industry?: string;
  startDate?: string;
  message?: string;
  /** utm_* / gclid captured on landing, forwarded so paid traffic stays attributable. */
  attribution?: ApexLeadAttribution;
};

const REQUIRED: Array<keyof ContactPayload> = ["name", "company", "email", "phone", "country"];

// Conservative regex for an RFC-5322-lite email check. Server-of-truth, not the source of truth.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Cap stored submissions per process to avoid unbounded disk growth on a single box.
const MAX_SUBMISSIONS = 1000;

function isEmail(v: string): boolean {
  return EMAIL_RE.test(v);
}

function ipFor(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

async function persist(submission: object): Promise<void> {
  const dataRoot = process.env.APEX_DATA_DIR
    ? path.resolve(process.env.APEX_DATA_DIR)
    : path.resolve(process.cwd(), "..", "..", ".data");
  const dir = path.join(dataRoot, "submissions");
  await fs.mkdir(dir, { recursive: true });

  // Rotate: if we exceed the cap, delete the oldest files.
  try {
    const files = await fs.readdir(dir);
    const jsonFiles = files.filter((f) => f.endsWith(".json"));
    if (jsonFiles.length >= MAX_SUBMISSIONS) {
      const sorted = jsonFiles.sort();
      const toDelete = sorted.slice(0, jsonFiles.length - MAX_SUBMISSIONS + 1);
      await Promise.all(toDelete.map((f) => fs.unlink(path.join(dir, f)).catch(() => {})));
    }
  } catch {
    // best-effort rotation
  }

  const id = `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const filepath = path.join(dir, `${id}.json`);
  await fs.writeFile(filepath, JSON.stringify({ id, ...submission }, null, 2), "utf8");
  return;
}

export async function POST(req: Request): Promise<NextResponse> {
  const ip = ipFor(req);
  const log = logger.child({ route: "POST /api/contact", ip });

  // Rate limit: 5 submissions / IP / minute.
  const rl = rateLimit(clientKey(req, "contact"), { limit: 5, windowMs: 60_000 });
  if (!rl.allowed) {
    log.warn("rate limited", { retryAfterMs: rl.retryAfterMs });
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again shortly." },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil(rl.retryAfterMs / 1000).toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": Math.ceil(rl.resetAt / 1000).toString(),
        },
      },
    );
  }

  let body: ContactPayload;
  try {
    body = (await req.json()) as ContactPayload;
  } catch {
    log.warn("invalid json body");
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const missing = REQUIRED.filter((k) => !body[k] || String(body[k]).trim() === "");
  if (missing.length) {
    log.info("missing required fields", { missing });
    return NextResponse.json(
      { ok: false, error: `Missing required fields: ${missing.join(", ")}` },
      { status: 400 },
    );
  }

  if (!isEmail(String(body.email))) {
    log.info("invalid email", { email: String(body.email) });
    return NextResponse.json({ ok: false, error: "Invalid email address" }, { status: 400 });
  }

  const submission = {
    receivedAt: new Date().toISOString(),
    ip,
    userAgent: req.headers.get("user-agent") ?? null,
    payload: body,
  };

  try {
    await persist(submission);
  } catch (err) {
    log.error("failed to persist submission", { err: String(err) });
    // We still 200 — we don't want a disk failure to leak to the user.
  }

  // Forward into the Apex CRM. The JSON file written above stays as the
  // backstop — it is what proves an enquiry arrived even when the CRM was
  // unreachable — but the CRM is where this enquiry actually gets worked.
  const forwarded = await forwardLeadToApex(
    {
      name: String(body.name),
      email: String(body.email),
      phone: body.phone,
      companyName: body.company,
      country: body.country,
      interestType: "outsourcing",
      interestSlug: body.service,
      timeline: body.startDate,
      requirements: body.resources
        ? `Resources needed: ${body.resources}${body.industry ? ` · Industry: ${body.industry}` : ""}`
        : body.industry
          ? `Industry: ${body.industry}`
          : undefined,
      message: body.message,
      attribution: body.attribution,
    },
    visitorFrom(req),
    { site: "apex-outsourcing" },
  );

  if (!forwarded.ok) {
    log.warn("stored locally but not forwarded to the CRM", { reason: forwarded.reason });
  }

  log.info("submission accepted", { email: String(body.email), company: String(body.company) });

  return NextResponse.json(
    {
      ok: true,
      id: submission.receivedAt,
      receivedAt: submission.receivedAt,
    },
    { headers: { "X-RateLimit-Remaining": String(rl.remaining) } },
  );
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    ok: true,
    endpoint: "contact",
    method: "POST",
    required: REQUIRED,
  });
}
