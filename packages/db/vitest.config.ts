import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "db",
    environment: "node",
    globals: true,
    include: ["prisma/**/*.test.ts", "src/**/*.test.ts"],
    coverage: {
      // The generated Prisma client is excluded for two reasons. It is
      // generated, so its coverage number means nothing — and more concretely
      // its runtime ships `//# sourceMappingURL=edge.js.map` without shipping
      // the map, so v8-to-istanbul throws ENOENT trying to read it and fails
      // the whole run. `pnpm test -- --coverage` in CI died on exactly that.
      exclude: ["generated/**", "prisma/schema/**", "**/*.config.*"],
    },
  },
});
