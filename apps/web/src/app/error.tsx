"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ButtonLink, Section } from "@apex/ui";

/**
 * Route-level error boundary. Without it a render error falls through to
 * Next's unstyled built-in screen, with none of the site's chrome.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("[page-error]", error);
  }, [error]);

  return (
    <Section tone="page" className="py-28 md:py-36">
      <div className="mx-auto max-w-xl text-center">
        <p className="font-display text-6xl font-semibold text-[var(--color-amber-500)]">!</p>
        <h1 className="mt-6 text-3xl">Something went wrong</h1>
        <p className="mt-4 text-[var(--ink-secondary)]">
          This page failed to render. You can retry, or head back to the home page.
        </p>
        {error.digest && (
          <p className="mt-3 font-mono text-xs text-[var(--ink-secondary)]">
            Reference: {error.digest}
          </p>
        )}
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={() => reset()}
            className="rounded-md bg-[var(--color-amber-500)] px-5 py-2.5 text-sm font-semibold text-[var(--ink-inverse,#0b1d3a)]"
          >
            Try again
          </button>
          <ButtonLink href="/">Back to home</ButtonLink>
          <Link
            href="/status"
            className="px-2 py-2 text-sm font-medium underline-offset-4 hover:underline"
          >
            Check service status →
          </Link>
        </div>
      </div>
    </Section>
  );
}
