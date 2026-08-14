import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "site-kit",
    environment: "node",
    globals: true,
    include: ["src/**/*.test.ts"],
  },
});
