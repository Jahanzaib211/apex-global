import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Not found",
  robots: { index: false, follow: false },
};

/** The console had no 404 page, so a mistyped URL rendered Next's default. */
export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold tracking-widest uppercase opacity-60">404</p>
        <h1 className="mt-3 text-2xl font-semibold">That page does not exist</h1>
        <p className="mt-3 text-sm opacity-70">
          The link may be out of date, or the record may have been deleted.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-md border px-4 py-2 text-sm font-medium hover:opacity-80"
        >
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}
