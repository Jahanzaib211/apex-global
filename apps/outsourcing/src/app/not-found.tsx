import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/Container";

export const metadata: Metadata = {
  title: "Page not found — Apex Global Outsourcing",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center bg-white">
      <Container>
        <div className="mx-auto max-w-xl py-24 text-center">
          <div className="eyebrow justify-center">
            <span className="eyebrow-dot" /> 404
          </div>
          <h1 className="font-display text-navy mt-4 text-5xl font-extrabold md:text-6xl">
            We can't find <span className="gradient-text">that page.</span>
          </h1>
          <p className="text-steel mt-5 text-lg">
            The page you were looking for has moved, been retired, or never existed. Try one of
            these instead.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href="/" className="btn-primary">
              Back to Home
            </Link>
            <Link href="/services" className="btn-ghost">
              Explore Services
            </Link>
            <Link href="/contact" className="btn-ghost">
              Talk to Our Team
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
