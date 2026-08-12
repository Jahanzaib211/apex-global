/**
 * No-op stand-in for Next.js's `server-only` package under vitest.
 *
 * `server-only` deliberately throws when resolved outside a React Server
 * Component, which is exactly what we want in the app and exactly what makes
 * server modules untestable in a plain node test runner. Aliasing it here
 * keeps the guard in the real build while letting the pure helpers inside
 * those modules be unit tested.
 */
export {};
