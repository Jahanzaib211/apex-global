import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    alias: {
      "server-only": fileURLToPath(new URL("./src/__mocks__/server-only.ts", import.meta.url)),
    },
  },
});
