/** Skeleton shown while a route segment streams in. */
export default function Loading() {
  return (
    <div className="container-page section">
      <div className="mx-auto max-w-3xl">
        <div className="bg-sand-200 h-3 w-32 animate-pulse rounded-full" />
        <div className="bg-sand-200 mt-6 h-12 w-3/4 animate-pulse rounded-xl" />
        <div className="bg-sand-200 mt-3 h-12 w-2/4 animate-pulse rounded-xl" />
        <div className="bg-sand-200 mt-8 h-5 w-full animate-pulse rounded" />
        <div className="bg-sand-200 mt-2 h-5 w-11/12 animate-pulse rounded" />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-sand-100 h-40 animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
