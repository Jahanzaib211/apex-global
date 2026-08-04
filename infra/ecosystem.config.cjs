/**
 * PM2 process definitions.
 *
 * Matches the convention already running on the homelab, so `pm2 list` shows
 * Apex alongside everything else rather than needing its own supervisor.
 *
 * Both apps bind to loopback. Public reachability comes from the Cloudflare
 * tunnel, so there is no inbound port to scan even on the VPS.
 */
module.exports = {
  apps: [
    {
      name: "apex-web",
      cwd: "./apps/web",
      script: "node_modules/.bin/next",
      args: "start -p 4300 -H 127.0.0.1",
      instances: 1,
      autorestart: true,
      max_memory_restart: "512M",
      env: { NODE_ENV: "production" },
      // A crash loop should be loud, not silent — 10 restarts inside the
      // minimum uptime window stops the process so the alert fires.
      min_uptime: "30s",
      max_restarts: 10,
      error_file: "./logs/apex-web.error.log",
      out_file: "./logs/apex-web.out.log",
      time: true,
    },
    {
      name: "apex-console",
      cwd: "./apps/console",
      script: "node_modules/.bin/next",
      args: "start -p 4301 -H 127.0.0.1",
      instances: 1,
      autorestart: true,
      max_memory_restart: "384M",
      env: { NODE_ENV: "production" },
      min_uptime: "30s",
      max_restarts: 10,
      error_file: "./logs/apex-console.error.log",
      out_file: "./logs/apex-console.out.log",
      time: true,
    },
  ],
};
