/** Skeleton shown while a route segment streams in. */
export default function Loading() {
  return (
    <div className="bg-white">
      <div className="container-x max-w-3xl py-24">
        <div className="h-3 w-32 animate-pulse rounded bg-slate-200" />
        <div className="mt-6 h-12 w-3/4 animate-pulse rounded bg-slate-200" />
        <div className="mt-3 h-12 w-2/4 animate-pulse rounded bg-slate-200" />
        <div className="mt-8 h-5 w-full animate-pulse rounded bg-slate-200" />
        <div className="mt-2 h-5 w-11/12 animate-pulse rounded bg-slate-200" />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      </div>
    </div>
  );
}
