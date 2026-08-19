/**
 * Route-level loading state.
 *
 * The four brand sites each ship one; this app had none, so a slow server
 * component rendered nothing at all until it resolved.
 */
export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[40vh] items-center justify-center"
    >
      <span className="sr-only">Loading</span>
      <span
        aria-hidden
        className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent opacity-40"
      />
    </div>
  );
}
