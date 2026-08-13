import type { Metadata } from "next";
import { requirePermission } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Dev — Environment" };

/**
 * Environment viewer.
 *
 * Every key the process sees. Secrets are masked to last 4 characters or
 * fully hidden, depending on a name-based heuristic — never round-trip
 * them to the browser. The list is for diagnostics ("did the build pick
 * up the new STRIPE key?") rather than configuration management.
 */

const SECRET_PATTERNS = [/KEY/i, /SECRET/i, /TOKEN/i, /PASSWORD/i, /DSN/i, /CONNECTION_STRING/i];

function maskValue(key: string, value: string): string {
  if (!value) return "—";
  if (SECRET_PATTERNS.some((re) => re.test(key))) {
    if (value.length <= 8) return "•".repeat(value.length);
    return `${value.slice(0, 2)}${"•".repeat(Math.max(4, value.length - 6))}${value.slice(-2)}`;
  }
  return value;
}

export default async function DevEnvPage() {
  await requirePermission("core:admin");

  const entries = Object.entries(process.env)
    .filter(([k]) => k !== "PATH" && !k.startsWith("PATH_"))
    .sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl">Environment</h1>
        <p className="mt-1 max-w-2xl text-sm text-[var(--ink-secondary)]">
          Every environment variable visible to the server. Secrets are masked to last-4 (or full
          length if short). Use this page for diagnostics, not configuration.
        </p>
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-2xs border-b border-[var(--border-subtle)] text-left tracking-[0.16em] text-[var(--ink-muted)] uppercase">
              <th className="px-5 py-3 font-semibold">Key</th>
              <th className="px-5 py-3 font-semibold">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {entries.map(([k, v]) => (
              <tr key={k}>
                <td className="text-2xs px-5 py-2 font-mono">{k}</td>
                <td className="text-2xs px-5 py-2 font-mono text-[var(--ink-secondary)]">
                  {maskValue(k, String(v ?? ""))}
                </td>
              </tr>
            ))}
            {entries.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-5 py-6 text-center text-[var(--ink-secondary)]">
                  No environment variables visible.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
