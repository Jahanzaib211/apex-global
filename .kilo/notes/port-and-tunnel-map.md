# Port-and-Tunnel Map — five Apex sites, 2026-08-13

Generated: 2026-08-13 from `pm2 jlist` and `infra/TUNNELS.md`. Each
migrated app must bind to its exact origin port and tunnel; the
PM2 task name and the `cwd` change, but the port does not.

## Per-site mapping

| Public hostname                      | PM2 process        | Loopback port    | Standalone build path today (cwd of PM2 task)                           | New cwd after Phase 4           |
| ------------------------------------ | ------------------ | ---------------- | ----------------------------------------------------------------------- | ------------------------------- |
| `apex.apexgroupcompanies.com`        | `apex-group`       | `127.0.0.1:3103` | `~/Desktop/apex-group/.next/standalone/server.js`                       | `APEX GLOBAL/apps/group/`       |
| `tours.apexgroupcompanies.com`       | `apex-tours`       | `127.0.0.1:3001` | `~/Desktop/APEX TRAVEL N TOUR/apex-tours/.next/standalone/server.js`    | `APEX GLOBAL/apps/tours/`       |
| `holdings.apexgroupcompanies.com`    | `apex-holdings`    | `127.0.0.1:3102` | `~/Desktop/APEX HOLDINGS/apex-holdings/.next/standalone/server.js`      | `APEX GLOBAL/apps/holdings/`    |
| `outsourcing.apexgroupcompanies.com` | `apex-outsourcing` | `127.0.0.1:3100` | `~/Desktop/APEX OUTSORCING/apex-outsourcing/.next/standalone/server.js` | `APEX GLOBAL/apps/outsourcing/` |
| `tech.apexgroupcompanies.com`        | `apex-global-web`  | `127.0.0.1:4300` | `APEX GLOBAL/apps/web/.next/standalone/server.js`                       | (unchanged)                     |

> Source of ports: `pm2 jlist` (current) +
> `apex-*/ecosystem.config.cjs` (codified).
> Holdings's `env_production` still claims `NEXT_PUBLIC_SITE_URL=
https://apexholdings.pk` even though the live hostname is
> `holdings.apexgroupcompanies.com`. The migration MUST fix this — the
> `@apex/site-kit/brand.ts` change is the natural home.

## Tunnel to site

The Cloudflare tunnels never move. Their ingress rule is set in the
Cloudflare dashboard (not the local config — see `infra/TUNNELS.md`
"Where ingress actually comes from"). Confirm against
`infra/scripts/tunnels-status.sh`:

| Cloudflare tunnel name | Tunnel UUID                            | Origin (must stay) |
| ---------------------- | -------------------------------------- | ------------------ |
| `APEX GROUP`           | `677c31d0-0f5d-46fd-8f48-13036ec2b4b3` | `127.0.0.1:3103`   |
| `APEX TRAVEL N TOUR`   | `80df5f7a-0864-4873-905b-170bbadd858f` | `127.0.0.1:3001`   |
| `APEX HOLDINGS`        | dashboard-managed                      | `127.0.0.1:3102`   |
| `APEX OUTSOURCING`     | `5f401d60-c64a-4468-b947-235a5f3a6641` | `127.0.0.1:3100`   |
| `tech`                 | `7f399ee2-f932-4963-9c20-a4a0881cfe81` | `127.0.0.1:4300`   |

The migration swaps what listens on those loopback ports — the
tunnels see no change.

## PM2 task rewrite during Phase 4

For each migrated site, add a new entry to `infra/ecosystem.config.cjs`:

```
{
  ...base,
  name: 'apex-group',  // unchanged for zero-impact cutover
  script: 'pnpm',
  args: '--filter @apex/group start',
  cwd:  ROOT,  // APEX GLOBAL
  max_memory_restart: '512M',
  env: {
    NODE_ENV: 'production',
    PORT: '3103',
    HOSTNAME: '127.0.0.1',
    APEX_GROUP_DATA_DIR: '/home/jahanzaib/.apex/data/group',
    NEXT_PUBLIC_SITE_URL: 'https://apex.apexgroupcompanies.com',
    // PARTNER_LEAD_SECRET same value the old standalone read
    PARTNER_LEAD_SECRET: process.env.PARTNER_LEAD_SECRET,
  },
  error_file: path.join(ROOT, 'logs/apex-group.error.log'),
  out_file:   path.join(ROOT, 'logs/apex-group.out.log'),
},
```

Repeat for `apex-tours`, `apex-holdings`, `apex-outsourcing`.

### Cutover order (per site)

1. Build: `pnpm --filter @apex/<site> build`.
2. Write `.data` symlink in the new location to the old:
   `ln -sfn ~/Desktop/<old>/.data APEX GLOBAL/apps/<site>/.data`.
3. `pm2 start infra/ecosystem.config.cjs --only apex-<site>`.
4. Confirm `pm2 jlist` shows two processes with the same name
   (delete + start will fail without that — use `pm2 delete
apex-<site>; pm2 start …; pm2 save`).
5. Smoke-test: `curl -fsS -o /dev/null -w '%{http_code}\n'
https://<site>.apexgroupcompanies.com/` must remain 200 throughout.
6. After 30 minutes soak, `pm2 save`, document in `infra/TUNNELS.md`
   if any metadata changed.

## Health endpoints to probe after every cutover

The donor (`apps/web/src/app/api/health/route.ts`) ships a `/api/health`
endpoint. The siblings do not. Phase 4 adds `/api/health` to each
migrated app:

```bash
for s in group tours holdings outsourcing; do
  curl -fsS -o /dev/null -w "$s HTTP %{http_code}\n" \
    "http://127.0.0.1:$(case $s in group) echo 3103 ;; tours) echo 3001 ;; holdings) echo 3102 ;; outsourcing) echo 3100 ;; esac)/api/health"
done
```
