/**
 * PM2 process definitions for Apex Global.
 *
 * Matches the convention already running on this host, so `pm2 list` shows
 * Apex alongside the sibling projects rather than needing its own supervisor.
 *
 * Run from the repository root:
 *   pm2 start infra/ecosystem.config.cjs && pm2 save
 *
 * Note the scripts go through `pnpm --filter … start`, not `next start`
 * directly. Both apps read DATABASE_URL, AUTH_SECRET and ENCRYPTION_KEY from
 * the single root .env via a dotenv wrapper in their package scripts —
 * invoking Next directly starts a process that cannot reach the database.
 */
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");

/** Shared settings. Both apps bind to loopback; the tunnel is the only door. */
const base = {
  cwd: ROOT,
  interpreter: "none",
  exec_mode: "fork",
  instances: 1,
  autorestart: true,
  // A crash loop should be loud, not silent: 10 restarts inside the minimum
  // uptime window stops the process so it shows as errored rather than
  // flapping unnoticed.
  min_uptime: "30s",
  max_restarts: 10,
  restart_delay: 2000,
  time: true,
  env: { NODE_ENV: "production" },
};

module.exports = {
  apps: [
    {
      ...base,
      name: "apex-global-web",
      script: "pnpm",
      args: "--filter @apex/web start",
      max_memory_restart: "512M",
      error_file: path.join(ROOT, "logs/apex-global-web.error.log"),
      out_file: path.join(ROOT, "logs/apex-global-web.out.log"),
    },
    {
      // Deliberately NOT routed through the Cloudflare tunnel. It runs
      // persistently on 127.0.0.1:4301 and is reachable from this machine or
      // over Tailscale — an admin surface holding every lead and every stored
      // credential does not need to be on the public internet.
      ...base,
      name: "apex-global-console",
      script: "pnpm",
      args: "--filter @apex/console start",
      max_memory_restart: "384M",
      error_file: path.join(ROOT, "logs/apex-global-console.error.log"),
      out_file: path.join(ROOT, "logs/apex-global-console.out.log"),
    },
  ],
};
