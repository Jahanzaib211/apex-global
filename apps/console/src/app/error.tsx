"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Route-level error boundary.
 *
 * The console holds every lead and every stored credential; when a page throws,
 * an operator needs the error reference to hand to whoever is debugging, not
 * Next's blank default screen.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[console-error]", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold tracking-widest uppercase opacity-60">Error</p>
        <h1 className="mt-3 text-2xl font-semibold">This page failed to load</h1>
        <p className="mt-3 text-sm opacity-70">
          Nothing was changed. Retry, or go back to the dashboard.
        </p>
        {error.digest && (
          <p className="mt-3 font-mono text-xs opacity-60">Reference: {error.digest}</p>
        )}
        <div className="mt-8 flex justify-center gap-3">
          <button
            onClick={() => reset()}
            className="rounded-md border px-4 py-2 text-sm font-medium hover:opacity-80"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-md border px-4 py-2 text-sm font-medium hover:opacity-80"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
