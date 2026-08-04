import { defineConfig } from "vitest/config";

export default defineConfig({
  test: { name: "module-kit", environment: "node", globals: true, include: ["src/**/*.test.ts"] },
});
