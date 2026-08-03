import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "ui",
    environment: "jsdom",
    globals: true,
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["./tests/setup.ts"],
  },
});
