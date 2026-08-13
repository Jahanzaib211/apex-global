import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const serverOnlyPath = require.resolve("server-only");
process.on("uncaughtException", () => {});
console.log("server-only path:", serverOnlyPath);
const { syncLeadToTwenty } = await import("./src/sync.ts");
const leadId = process.env.LEAD_ID!;
const result = await syncLeadToTwenty(leadId);
console.log("SYNC_RESULT", JSON.stringify(result));
