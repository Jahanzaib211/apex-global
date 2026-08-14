import Container from "@/components/Container";

/**
 * Skeleton shown while a route segment streams in.
 *
 * A `div`, not a `main`: Next keeps this mounted alongside the incoming page
 * during streaming, so a `main` here puts two `main` landmarks in the document
 * at once. Assistive technology treats that as two primary regions, and the
 * site-integrity suite fails the page for it. tours and holdings already got
 * this right; group and outsourcing did not.
 */
export default function Loading() {
  return (
    <div className="bg-cream flex min-h-[60vh] items-center">
      <Container>
        <div className="max-w-3xl py-24">
          <div className="bg-navy/10 h-3 w-32 animate-pulse rounded" />
          <div className="bg-navy/10 mt-6 h-12 w-3/4 animate-pulse rounded" />
          <div className="bg-navy/10 mt-3 h-12 w-2/4 animate-pulse rounded" />
          <div className="bg-navy/10 mt-8 h-5 w-full animate-pulse rounded" />
          <div className="bg-navy/10 mt-2 h-5 w-11/12 animate-pulse rounded" />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-navy/5 h-40 animate-pulse rounded" />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
