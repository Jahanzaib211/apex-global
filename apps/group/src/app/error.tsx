"use client";

import { useEffect } from "react";
import Container from "@/components/Container";
import Button from "@/components/Button";

/**
 * Route-level error boundary.
 *
 * Without this file a render error anywhere under app/ falls through to Next's
 * built-in error screen — an unstyled page with none of the site's chrome and
 * no way back. Only apps/outsourcing had one.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
     
    console.error("[page-error]", error);
  }, [error]);

  return (
    <main className="bg-navy flex min-h-[70vh] items-center py-32 text-white">
      <Container>
        <p className="text-gold text-xs font-semibold tracking-[.25em] uppercase">
          Something went wrong
        </p>
        <h1 className="font-display mt-3 text-4xl md:text-6xl">We hit a snag on this page.</h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-white/65">
          The page failed to render. You can retry, or head back to the home page.
        </p>
        {error.digest && (
          <p className="mt-3 font-mono text-xs text-white/40">Reference: {error.digest}</p>
        )}
        <div className="mt-9 flex flex-wrap gap-3">
          <button
            onClick={() => reset()}
            className="bg-gold text-navy rounded-sm px-5 py-3 text-sm font-semibold transition hover:bg-white"
          >
            Try again
          </button>
          <Button href="/" variant="outline-gold">
            Back to Home
          </Button>
        </div>
      </Container>
    </main>
  );
}
