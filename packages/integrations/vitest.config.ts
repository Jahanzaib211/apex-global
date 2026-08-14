import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * This package had no vitest config, so it ran under the bare defaults and
 * `sync.ts` could not be imported at all — `server-only` throws outside a
 * server bundler. That is why the CRM sync sat at 0% coverage while the rest
 * of the package was tested, and why CI's coverage gate was red.
 *
 * The thresholds are restated here on purpose. Without a package-level config
 * vitest walked up to the root one and inherited them; now that this file
 * exists it takes precedence, so omitting them would have "fixed" CI by
 * deleting the gate rather than by covering the code.
 */
export default defineConfig({
  test: {
    name: "integrations",
    environment: "node",
    alias: {
      "server-only": fileURLToPath(new URL("./src/__mocks__/server-only.ts", import.meta.url)),
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      exclude: [
        "**/node_modules/**",
        "**/dist/**",
        "**/*.config.*",
        "**/*.d.ts",
        "src/__mocks__/**",
        // Test files score 100% against themselves and inflate the average,
        // which makes the threshold measure nothing.
        "**/*.test.ts",
        // A manual end-to-end probe run by hand against a live workspace, not
        // library code. Counting it only ever dragged the number down.
        "e2e-sync.mts",
      ],
      thresholds: {
        statements: 60,
        branches: 60,
        functions: 55,
        lines: 60,
      },
    },
  },
});
