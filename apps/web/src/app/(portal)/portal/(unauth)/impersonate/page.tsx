"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Admin impersonation redemption.
 *
 * The heavy lifting (token check, session swap, cookie set) happens in
 * /api/portal/impersonate — a route handler, because cookies cannot be
 * modified during RSC render. This page simply fires that request and either
 * follows the redirect into the customer's portal or shows the rejection
 * reason returned by the API.
 */
export default function ImpersonatePage() {
  return (
    <Suspense fallback={<Waiting label="One moment — opening the portal for this customer…" />}>
      <ImpersonateFlow />
    </Suspense>
  );
}

function ImpersonateFlow() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const fired = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("That link is malformed.");
      return;
    }
    if (fired.current) return;
    fired.current = true;

    fetch(`/api/portal/impersonate?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        if (res.ok) {
          window.location.href = "/portal/";
          return;
        }
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(body?.error ?? "That access link is not recognised.");
      })
      .catch(() => setError("Something went wrong redeeming that link."));
  }, [token]);

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-6 shadow-[var(--shadow-sm)]">
        <h1 className="text-xl">Portal access</h1>
        <p className="mt-2 text-sm text-[var(--ink-secondary)]">
          {error ?? "One moment — opening the portal for this customer…"}
        </p>
      </div>
    </div>
  );
}

function Waiting({ label }: { label: string }) {
  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-6 shadow-[var(--shadow-sm)]">
        <h1 className="text-xl">Portal access</h1>
        <p className="mt-2 text-sm text-[var(--ink-secondary)]">{label}</p>
      </div>
    </div>
  );
}