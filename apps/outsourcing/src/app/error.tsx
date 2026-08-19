"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/Container";

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
    <main className="flex min-h-[70vh] items-center bg-white">
      <Container>
        <div className="mx-auto max-w-xl py-24 text-center">
          <div className="eyebrow justify-center">
            <span className="eyebrow-dot" /> Something went wrong
          </div>
          <h1 className="font-display text-navy mt-4 text-5xl font-extrabold md:text-6xl">
            We hit a snag <span className="gradient-text">on this page.</span>
          </h1>
          <p className="text-steel mt-5 text-lg">
            The page failed to render. Our team has been notified. You can retry, or head back home.
          </p>
          {error.digest && (
            <p className="text-steel mt-3 font-mono text-xs">Reference: {error.digest}</p>
          )}
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <button onClick={() => reset()} className="btn-primary">
              Try again
            </button>
            <Link href="/" className="btn-ghost">
              Back to Home
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
