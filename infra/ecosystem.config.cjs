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
      // 1536M, not 512M. A Next.js 15 + Prisma server does not fit in 512M, so
      // pm2 SIGKILLed it on a loop — 407 restarts by 2026-08-14, against 5 for
      // every sibling app. The kill leaves no trace in the logs (they show only
      // clean "Ready in 299ms" restarts), which is why it went unnoticed.
      max_memory_restart: "1536M",
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
    {
      // Cloudflared tunnel dedicated to cloud.apexgroupcompanies.com. Mailcow
      // stack terminates at Caddy on 127.0.0.1:8067; this tunnel is the
      // overlay that publishes that origin over HTTPS at cloudflare's edge.
      //
      // The token is read from ~/.cloudflared/cloud-apex.token (mode 600), NOT
      // inlined here. It used to be inline, in this git-tracked file, in a repo
      // whose remote is the public github.com/Jahanzaib211/apex-global — it was
      // never actually committed, but it was one `git add -A` from being. An
      // inline token is also readable from `pm2 jlist`, from `ps auxww`, and
      // from ~/.pm2/dump.pm2. See infra/HARDENING-REPORT.md, Finding 5.
      //
      // NOTE: pm2 bakes args into its saved dump, so editing this file does not
      // change a running process. Applying a token change is delete + start +
      // save, never `pm2 restart` — see infra/TUNNELS.md.
      ...base,
      name: "cloud-apex-tunnel",
      script: "cloudflared",
      args: `tunnel run --token-file ${path.join(
        require("os").homedir(),
        ".cloudflared/cloud-apex.token",
      )}`,
      max_memory_restart: "128M",
      error_file: path.join(ROOT, "logs/cloud-apex-tunnel.error.log"),
      out_file: path.join(ROOT, "logs/cloud-apex-tunnel.out.log"),
    },
    {
      // Mailcow watchdog — polls public origin + internal Caddy every minute
      // and restarts the mailcow stack + the cloudflared tunnel via PM2 when
      // either probe fails three times in a row. Stays in the foreground so
      // PM2 can restart it on exit, but the loop is endless so it never
      // exits normally; set `max_restarts: 99` to allow PM2 to recycle it.
      ...base,
      name: "mailcow-watchdog",
      script: "infra/scripts/mailcow-watchdog.sh",
      max_memory_restart: "256M",
      min_uptime: "1m",
      max_restarts: 99,
      restart_delay: 5000,
      error_file: path.join(ROOT, "logs/mailcow-watchdog.error.log"),
      out_file: path.join(ROOT, "logs/mailcow-watchdog.out.log"),
    },
    {
      // Apex Global Outsourcing — migrated from the standalone sibling repo
      // ~/Desktop/APEX OUTSORCING/apex-outsourcing on 2026-08-13. Bind stays
      // 127.0.0.1:3100 so the existing Cloudflare tunnel
      // (tunnel-apex-outsourcing, infra/TUNNELS.md) needs no changes.
      //
      // Do not `pm2 start` until the sibling PM2 process `apex-outsourcing`
      // has been kept online for at least 30 minutes after the first build,
      // so a broken migration cannot take the public hostname down.
      ...base,
      name: "apex-outsourcing",
      env: { NODE_ENV: "production", PORT: "3100" },
      script: "pnpm",
      args: "--filter @apex/outsourcing start",
      max_memory_restart: "512M",
      error_file: path.join(ROOT, "logs/apex-outsourcing.error.log"),
      out_file: path.join(ROOT, "logs/apex-outsourcing.out.log"),
    },
    {
      // Apex Holdings — migrated from the standalone sibling repo
      // ~/Desktop/APEX HOLDINGS/apex-holdings on 2026-08-13. Origin stays
      // 127.0.0.1:3102 so the apex-holdings Cloudflare tunnel keeps serving.
      ...base,
      name: "apex-holdings",
      env: { NODE_ENV: "production", PORT: "3102" },
      script: "pnpm",
      args: "--filter @apex/holdings start",
      max_memory_restart: "512M",
      error_file: path.join(ROOT, "logs/apex-holdings.error.log"),
      out_file: path.join(ROOT, "logs/apex-holdings.out.log"),
    },
    {
      // Apex Tours — migrated from the standalone sibling repo
      // ~/Desktop/APEX TRAVEL N TOUR/apex-tours on 2026-08-13. Origin stays
      // 127.0.0.1:3001 so the apex-tours Cloudflare tunnel keeps serving.
      ...base,
      name: "apex-tours",
      env: { NODE_ENV: "production", PORT: "3001" },
      script: "pnpm",
      args: "--filter @apex/tours start",
      max_memory_restart: "512M",
      error_file: path.join(ROOT, "logs/apex-tours.error.log"),
      out_file: path.join(ROOT, "logs/apex-tours.out.log"),
    },
    {
      // Apex Group of Companies — migrated from the standalone sibling repo
      // ~/Desktop/apex-group on 2026-08-13. Origin stays 127.0.0.1:3103 so
      // the apex-group Cloudflare tunnel keeps serving.
      ...base,
      name: "apex-group",
      env: { NODE_ENV: "production", PORT: "3103" },
      script: "pnpm",
      args: "--filter @apex/group start",
      max_memory_restart: "512M",
      error_file: path.join(ROOT, "logs/apex-group.error.log"),
      out_file: path.join(ROOT, "logs/apex-group.out.log"),
    },
  ],
};
