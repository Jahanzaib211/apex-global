import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

/** The site had no 404 page, so a bad URL rendered Next's unstyled default. */
export default function NotFound() {
  return (
    <div className="bg-navy-800 flex min-h-[70vh] items-center text-white">
      <div className="container-x py-24">
        <p className="text-gold-400 font-display text-[clamp(6rem,20vw,16rem)] leading-none">404</p>
        <h1 className="font-display mt-3 text-4xl md:text-5xl">This page has moved.</h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-white/65">
          The page you are looking for has moved or no longer exists.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/" className="btn-primary">
            Back to Home
          </Link>
          <Link href="/projects" className="btn-ghost-light">
            Browse Projects
          </Link>
        </div>
      </div>
    </div>
  );
}
