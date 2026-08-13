"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  token: string;
  error?: string;
}

export function ResetForm({ token, error: initialError }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const data = new FormData(event.currentTarget);
    const password = data.get("password");
    const confirm = data.get("confirm");
    if (password !== confirm) {
      setError("Passwords do not match.");
      setSubmitting(false);
      return;
    }
    try {
      const res = await fetch("/api/portal/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const body = (await res.json()) as { ok?: boolean; error?: string };
      if (res.ok && body.ok) {
        router.push("/portal/reset-password?saved=1");
        return;
      }
      setError(body.error ?? "Could not reset your password.");
    } catch {
      setError("We could not reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        New password
        <input
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={12}
          className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Confirm new password
        <input
          name="confirm"
          type="password"
          autoComplete="new-password"
          required
          minLength={12}
          className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
        />
      </label>
      <p className="text-2xs text-[var(--ink-muted)]">
        At least 12 characters, mixing three of: lowercase, uppercase, digits, symbols.
      </p>
      {error ? (
        <p
          role="alert"
          className="rounded-[var(--radius-md)] bg-[var(--color-danger-100)] px-3 py-2 text-sm text-[var(--color-danger-500)]"
        >
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex h-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent)] px-4 text-sm font-medium text-[var(--ink-on-accent)] transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-60"
      >
        {submitting ? "Saving…" : "Set password"}
      </button>
    </form>
  );
}
