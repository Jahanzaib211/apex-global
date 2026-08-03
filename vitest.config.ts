import { defineConfig } from "vitest/config";

/**
 * Root Vitest configuration. Every package and module is a project here, so
 * `pnpm test` at the root runs the whole suite and CI gets one report.
 * Individual packages can still be run with `pnpm --filter @apex/ui test`.
 */
export default defineConfig({
  test: {
    projects: [
      "packages/*/vitest.config.ts",
      "modules/*/vitest.config.ts",
      "apps/*/vitest.config.ts",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      reportsDirectory: "./coverage",
      exclude: [
        "**/node_modules/**",
        "**/dist/**",
        "**/.next/**",
        "**/*.config.*",
        "**/tests/**",
        "**/*.d.ts",
        "packages/db/generated/**",
      ],
      thresholds: {
        // Raised as coverage grows. Business logic — validation, credibility
        // rules, attribution parsing, RBAC — is expected to stay near 100%.
        statements: 60,
        branches: 60,
        functions: 55,
        lines: 60,
      },
    },
  },
});
