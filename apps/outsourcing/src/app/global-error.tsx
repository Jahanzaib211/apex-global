"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="text-navy bg-white" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
        <div className="flex min-h-screen items-center justify-center p-6">
          <div className="max-w-xl text-center">
            <h1 className="font-display text-navy text-4xl font-extrabold md:text-5xl">
              Application error
            </h1>
            <p className="text-steel mt-4">
              A critical error occurred. Please try again, or return to the home page.
            </p>
            {error.digest && (
              <p className="text-steel mt-2 font-mono text-xs">Reference: {error.digest}</p>
            )}
            <div className="mt-8">
              <button onClick={() => reset()} className="btn-primary">
                Reload
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
