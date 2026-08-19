"use client";

import { useState } from "react";

/**
 * "Sign in as" — mints a single-use impersonation link for a portal user and
 * opens it in a new tab, landing the operator inside the customer's portal.
 */
export function ImpersonateButton({ userId, disabled }: { userId: string; disabled?: boolean }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <span className="flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={busy || disabled}
        onClick={async () => {
          setBusy(true);
          setError(null);
          try {
            const res = await fetch(`/api/console/portal-users/${userId}/impersonate`, {
              method: "POST",
            });
            if (!res.ok) {
              const body = (await res.json().catch(() => null)) as { error?: string } | null;
              throw new Error(body?.error ?? "Could not create the link.");
            }
            const { url } = (await res.json()) as { url: string };
            window.open(url, "_blank", "noopener");
          } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong.");
          } finally {
            setBusy(false);
          }
        }}
        className="rounded-[var(--radius-sm)] border border-[var(--border-default)] px-2 py-1 text-xs disabled:opacity-50 hover:border-[var(--border-strong)]"
      >
        {busy ? "Creating…" : "Sign in as"}
      </button>
      {error ? <span className="text-xs text-[var(--color-danger-700)]">{error}</span> : null}
    </span>
  );
}