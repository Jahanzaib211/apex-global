import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: [
      {
        // `server-only` throws by design outside a server bundler. The guard
        // still applies in the app builds, where it matters; here it must be
        // a no-op so the runtime module is testable.
        find: /^server-only$/,
        replacement: fileURLToPath(new URL("./tests/server-only-stub.ts", import.meta.url)),
      },
    ],
  },
  test: { name: "ai", environment: "node", globals: true, include: ["src/**/*.test.ts"] },
});
