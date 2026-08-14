import { promises as fs } from "node:fs";
import path from "node:path";

const DATA_DIR = process.env.APEX_HOLDINGS_DATA_DIR || path.resolve(process.cwd(), ".data");

export const SUBMISSIONS_DIR = path.join(DATA_DIR, "submissions");
export const SUBMISSION_CAP = Number.parseInt(
  process.env.APEX_HOLDINGS_SUBMISSION_CAP || "1000",
  10,
);

const DRY_RUN = (process.env.APEX_HOLDINGS_DRY_RUN || "false").toLowerCase() === "true";

export type SubmissionKind = "contact" | "site-visit" | "partner" | "careers";

export interface SubmissionEnvelope<T> {
  kind: SubmissionKind;
  receivedAt: string;
  ip: string | null;
  userAgent: string | null;
  payload: T;
}

export async function ensureDataDir(): Promise<void> {
  if (DRY_RUN) return;
  await fs.mkdir(SUBMISSIONS_DIR, { recursive: true });
}

export async function persistSubmission<T>(envelope: SubmissionEnvelope<T>): Promise<void> {
  if (DRY_RUN) return;
  await ensureDataDir();
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const file = path.join(SUBMISSIONS_DIR, `${envelope.kind}-${stamp}-${randomSuffix()}.json`);
  await fs.writeFile(file, JSON.stringify(envelope, null, 2), { mode: 0o640 });
  await enforceCap();
}

async function enforceCap(): Promise<void> {
  if (DRY_RUN) return;
  const entries = await fs.readdir(SUBMISSIONS_DIR).catch(() => []);
  if (entries.length <= SUBMISSION_CAP) return;
  const sorted = entries.sort();
  const overflow = entries.length - SUBMISSION_CAP;
  for (let i = 0; i < overflow; i++) {
    await fs.unlink(path.join(SUBMISSIONS_DIR, sorted[i]!)).catch(() => undefined);
  }
}

function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 8);
}
