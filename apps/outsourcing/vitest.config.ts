import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "outsourcing",
    environment: "node",
    globals: true,
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    css: false,
  },
});
