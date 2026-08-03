import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "db",
    environment: "node",
    globals: true,
    include: ["prisma/**/*.test.ts", "src/**/*.test.ts"],
  },
});
