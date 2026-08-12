import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // `server-only` throws by design when resolved outside a React Server
      // Component, which would fail any test that touches a server module.
      // The guard still applies in the real build; this only stubs it out
      // for the node test runner.
      "server-only": fileURLToPath(new URL("./src/test/server-only-stub.ts", import.meta.url)),
    },
  },
  test: {
    name: "web",
    environment: "node",
    globals: true,
    include: ["src/**/*.test.{ts,tsx}"],
    // Unit tests cover pure helpers; server/Next integration is exercised by
    // the e2e suite. An app with no unit tests yet must not fail the run.
    passWithNoTests: true,
  },
});
