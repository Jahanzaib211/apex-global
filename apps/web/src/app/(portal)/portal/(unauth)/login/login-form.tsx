"use client";

import { useState, useTransition } from "react";
import Link from "next/link";

interface Props {
  next?: string;
  initialError?: string;
  sent?: string;
  oauthError?: string;
}

export function LoginForm({ next, initialError, sent, oauthError }: Props) {
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [message, setMessage] = useState<string | null>(
    sent ? "We sent you a magic sign-in link. Check your inbox." : null,
  );
  const [submitting, setSubmitting] = useState(false);
  const [pending, startTransition] = useTransition();
  const [mode, setMode] = useState<"password" | "magic">(oauthError ? "magic" : "password");

  async function signInWithPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const data = new FormData(event.currentTarget);
    try {
      const res = await fetch("/api/portal/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          password: data.get("password"),
          next: next ?? null,
        }),
      });
      const body = (await res.json()) as { ok?: boolean; next?: string; error?: string };
      if (res.ok && body.ok) {
        // Hard navigation so the (protected) layout is re-rendered with the
        // new session cookie. A soft `router.push` would be served from the
        // App Router's client-side cache and the previous user's name would
        // briefly appear in the header on the destination page.
        startTransition(() => {
          window.location.assign(body.next ?? "/portal/");
        });
        return;
      }
      setError(body.error ?? "Sign-in failed.");
    } catch {
      setError("We could not reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function sendMagicLink(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);
    const data = new FormData(event.currentTarget);
    try {
      const res = await fetch("/api/portal/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          password: null,
          magic: true,
          next: next ?? null,
        }),
      });
      const body = (await res.json()) as { ok?: boolean; error?: string };
      if (res.ok && body.ok) {
        setMessage("If that email has an account, a sign-in link is on its way.");
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
    <>
      <div className="mb-5 flex rounded-[var(--radius-md)] bg-[var(--bg-sunken)] p-1 text-sm">
        <button
          type="button"
          onClick={() => {
            setMode("password");
            setError(null);
          }}
          className={`flex-1 rounded-[var(--radius-sm)] py-1.5 font-medium transition-colors ${
            mode === "password" ? "bg-[var(--bg-raised)] shadow-sm" : "text-[var(--ink-secondary)]"
          }`}
        >
          Password
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("magic");
            setError(null);
          }}
          className={`flex-1 rounded-[var(--radius-sm)] py-1.5 font-medium transition-colors ${
            mode === "magic" ? "bg-[var(--bg-raised)] shadow-sm" : "text-[var(--ink-secondary)]"
          }`}
        >
          Magic link
        </button>
      </div>

      {mode === "password" ? (
        <form onSubmit={signInWithPassword} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Email
            <input
              name="email"
              type="email"
              autoComplete="username"
              required
              className="h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-sm font-normal"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Password
            <input
              name="password"
              type="password"
              autoComplete="current-password"
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

          <button
            type="submit"
            disabled={submitting || pending}
            className="inline-flex h-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent)] px-4 text-sm font-medium text-[var(--ink-on-accent)] transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-60"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>

          <p className="text-center text-sm">
            <Link
              href="/portal/forgot-password"
              className="text-[var(--ink-secondary)] underline-offset-4 hover:underline"
            >
              Forgot password?
            </Link>
          </p>
        </form>
      ) : (
        <form onSubmit={sendMagicLink} className="flex flex-col gap-4">
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
            {submitting ? "Sending…" : "Send sign-in link"}
          </button>

          <p className="text-2xs text-center text-[var(--ink-muted)]">
            We never store your password when you use a magic link. The link is single-use and
            expires in 24 hours.
          </p>
        </form>
      )}
    </>
  );
}
