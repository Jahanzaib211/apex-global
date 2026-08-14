"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";

/**
 * Route-level error boundary. Without it a render error falls through to
 * Next's unstyled built-in screen, with none of the site's chrome and no way
 * back. Only apps/outsourcing had one.
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
    <section className="bg-navy-grad grain relative overflow-hidden text-white">
      <div className="container-narrow section text-center">
        <AlertTriangle size={56} className="text-gold-300 mx-auto mb-6" />
        <div className="eyebrow !text-gold-300 mb-3">Something went wrong</div>
        <h1 className="heading-xl mb-4 !text-white">We hit a snag on this page.</h1>
        <p className="mx-auto max-w-xl text-lg text-white/75">
          The page failed to load. You can try again, or head back to the home page.
        </p>
        {error.digest && (
          <p className="mt-4 font-mono text-xs text-white/45">Reference: {error.digest}</p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button onClick={() => reset()} className="btn-primary">
            Try again
          </button>
          <Link href="/" className="btn-secondary">
            <ArrowLeft size={16} /> Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
