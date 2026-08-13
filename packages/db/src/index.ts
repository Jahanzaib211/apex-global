import { PrismaClient } from "../generated/client/index.js";

export * from "../generated/client/index.js";

declare global {
  var __apexPrisma: PrismaClient | undefined;
}

function createClient(): PrismaClient {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

/**
 * Single client per process. Next.js dev reloads the module graph on every
 * edit, and a fresh PrismaClient each time exhausts the connection pool within
 * a few minutes — hence the global.
 */
export const prisma: PrismaClient = globalThis.__apexPrisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__apexPrisma = prisma;
}
