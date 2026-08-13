import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Metadata } from "next";
import { requirePermission } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Dev — Errors" };

/**
 * Recent error log tail.
 *
 * Reads the most recent `logs/apex-global-web.error.log` and `apex-global-console.error.log`
 * from disk. The console renders the last ~200 lines of each. This is a
 * no-substitute-for-proper-logging page — its purpose is "show me what
 * broke in the last hour" without SSH.
 */

const TAIL_LINES = 200;

async function tail(path: string): Promise<string[]> {
  try {
    const buf = await readFile(path, "utf8");
    const lines = buf.split("\n").filter(Boolean);
    return lines.slice(-TAIL_LINES);
  } catch {
    return [];
  }
}

export default async function DevErrorsPage() {
  await requirePermission("core:admin");

  const logRoot = join(process.cwd(), "..", "..", "logs");
  const webErrors = await tail(join(logRoot, "apex-global-web.error.log"));
  const consoleErrors = await tail(join(logRoot, "apex-global-console.error.log"));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl">Errors</h1>
        <p className="mt-1 max-w-2xl text-sm text-[var(--ink-secondary)]">
          Tail of the production error logs from each running app. Last 200 lines per file. Install
          a proper log sink for anything beyond diagnostics.
        </p>
      </div>

      <LogPanel title="apex-global-web" lines={webErrors} />
      <LogPanel title="apex-global-console" lines={consoleErrors} />
    </div>
  );
}

function LogPanel({ title, lines }: { title: string; lines: string[] }) {
  return (
    <section className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)]">
      <header className="flex items-baseline justify-between border-b border-[var(--border-subtle)] px-5 py-3">
        <h2 className="font-mono text-sm font-semibold">{title}</h2>
        <p className="text-2xs text-[var(--ink-muted)]">{lines.length} lines</p>
      </header>
      <pre className="text-2xs max-h-[32rem] overflow-auto px-5 py-4 font-mono leading-relaxed text-[var(--ink-secondary)]">
        {lines.length === 0
          ? "No errors logged. Either everything is fine, or the file is empty — both are good outcomes."
          : lines.join("\n")}
      </pre>
    </section>
  );
}
