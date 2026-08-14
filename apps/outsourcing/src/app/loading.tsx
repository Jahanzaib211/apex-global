import { Container } from "@/components/Container";

export default function Loading() {
  return (
    <main className="flex min-h-[60vh] items-center bg-white">
      <Container>
        <div className="mx-auto max-w-3xl py-24">
          <div className="bg-line h-3 w-32 animate-pulse rounded" />
          <div className="bg-line mt-6 h-12 w-3/4 animate-pulse rounded" />
          <div className="bg-line mt-3 h-12 w-2/4 animate-pulse rounded" />
          <div className="bg-line mt-8 h-5 w-full animate-pulse rounded" />
          <div className="bg-line mt-2 h-5 w-11/12 animate-pulse rounded" />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-line/60 h-40 animate-pulse rounded-2xl" />
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}
