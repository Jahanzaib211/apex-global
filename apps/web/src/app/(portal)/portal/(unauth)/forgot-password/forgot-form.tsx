"use client";

import { useState } from "react";

interface Props {
  sent?: string;
  error?: string;
}

export function ForgotForm({ sent, error: initialError }: Props) {
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [message, setMessage] = useState<string | null>(
    sent ? "If that email has an account, a reset link is on its way." : null,
  );
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);
    const data = new FormData(event.currentTarget);
    try {
      const res = await fetch("/api/portal/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.get("email") }),
      });
      const body = (await res.json()) as { ok?: boolean; error?: string };
      if (res.ok && body.ok) {
        setMessage("If that email has an account, a reset link is on its way.");
      } else {
        setError(body.error ?? "Could not send the link.");
      }
    } catch {
      setError("We could not reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Email
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
        />
      </label>

      {error ? (
        <p
          role="alert"
          className="rounded-[var(--radius-md)] bg-[var(--color-danger-100)] px-3 py-2 text-sm text-[var(--color-danger-500)]"
        >
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="rounded-[var(--radius-md)] bg-[var(--color-success-100)] px-3 py-2 text-sm text-[var(--color-success-500)]">
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex h-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent)] px-4 text-sm font-medium text-[var(--ink-on-accent)] transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-60"
      >
        {submitting ? "Sending…" : "Send reset link"}
      </button>
    </form>
  );
}
