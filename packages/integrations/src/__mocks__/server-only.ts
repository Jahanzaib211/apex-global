/**
 * No-op stand-in for Next.js's `server-only` package under vitest.
 *
 * `server-only` throws by design when resolved outside a React Server
 * Component. That guard is correct in the real build and is exactly what made
 * `sync.ts` — the CRM sync — impossible to unit test. Aliasing it here keeps
 * the guard in production while letting the module be exercised.
 */
export {};
