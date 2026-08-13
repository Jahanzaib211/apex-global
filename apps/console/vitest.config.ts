import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "console",
    environment: "node",
    globals: true,
    include: ["src/**/*.test.{ts,tsx}"],
    // Console logic is DB + server-action bound and exercised through the e2e
    // suite; unit tests land here as pure helpers emerge. No tests must not
    // fail the umbrella `pnpm test`.
    passWithNoTests: true,
  },
});
