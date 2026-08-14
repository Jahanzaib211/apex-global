import { loadEnvFile } from "node:process";
loadEnvFile("/home/jahanzaib/Desktop/APEX GLOBAL/.env");
import pg from "pg";
const c = new pg.Client({ connectionString: process.env.DATABASE_URL });
await c.connect();
const q = async (tbl, cols) => {
  try {
    const r = await c.query(
      `SELECT ${cols.map((x) => `"${x}"`).join(", ")} FROM "${tbl}" ORDER BY "order"`,
    );
    console.log(`── ${tbl} ──`);
    r.rows.forEach((x) => console.log("  ", Object.values(x).filter(Boolean).join(" | ")));
  } catch (e) {
    console.log(`── ${tbl} ── ERR ${e.message}`);
  }
};
await q("tech_proof_entries", ["title", "upstreamName", "category"]);
await q("live_endpoints", ["name", "kind", "upstreamName"]);
await q("saas_products", ["name", "status"]);
await c.end();
