"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Route-level error boundary. Without it a render error falls through to
 * Next's unstyled built-in screen, with no site chrome and no way back.
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
    <main className="bg-navy-800 flex min-h-[70vh] items-center text-white">
      <div className="container-x py-24">
        <span className="eyebrow !text-gold-400 mb-3 block">Something went wrong</span>
        <h1 className="font-display text-4xl md:text-5xl">We hit a snag on this page.</h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-white/65">
          The page failed to render. You can retry, or head back to the home page.
        </p>
        {error.digest && (
          <p className="mt-3 font-mono text-xs text-white/40">Reference: {error.digest}</p>
        )}
        <div className="mt-9 flex flex-wrap gap-3">
          <button onClick={() => reset()} className="btn-primary">
            Try again
          </button>
          <Link href="/" className="btn-ghost-light">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
