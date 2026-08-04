# Deployment

> **Currently live on the homelab**, published at
> **https://tech.apexgroupcompanies.com** through a Cloudflare tunnel. See
> [Homelab publishing](#homelab-publishing-current) below. The VPS route
> described after it is the production target for when ad spend starts.

## Homelab publishing (current)

Both apps run under PM2 on loopback; a Cloudflare tunnel is the only door in.

```bash
pnpm build                                    # NEXT_PUBLIC_SITE_URL is baked in at build time
pm2 start infra/ecosystem.config.cjs
pm2 save                                      # survives reboot via pm2-jahanzaib.service
```

| Process | Bind | Published |
|---|---|---|
| `apex-global-web` | `127.0.0.1:4300` | Yes — tech.apexgroupcompanies.com |
| `apex-global-console` | `127.0.0.1:4301` | **No.** Local or Tailscale only |
| `tunnel-apex-tech` | metrics `127.0.0.1:20008` | — |

The tunnel:

```bash
# Token goes in a file, never on a command line (it would land in ~/.pm2/dump.pm2)
install -m 600 /dev/null ~/.cloudflared/tech.token
cat > ~/.cloudflared/tech.token               # paste from the Cloudflare dashboard, Ctrl-D

pm2 start ~/.local/bin/cloudflared --name tunnel-apex-tech -- \
  --no-autoupdate --protocol http2 \
  --config ~/.cloudflared/tech-config.yml \
  --metrics 127.0.0.1:20008 \
  tunnel run --token-file ~/.cloudflared/tech.token
pm2 save
```

Health at a glance: `./infra/scripts/tunnels-status.sh`
(healthy = `online / 4 / 200`). Inventory: [`TUNNELS.md`](TUNNELS.md).

**Changing the public hostname requires a rebuild, not a restart.**
`NEXT_PUBLIC_SITE_URL` is inlined by Next at build time, and it drives every
canonical URL, OG tag and `sitemap.xml` entry. Update `.env`, update the
`seo.siteUrl` setting, then `pnpm build`.

---

## VPS production (target)

Two environments. **Production runs on a rented VPS**, not on the homelab —
a sales site that goes down with a domestic power cut or ISP outage is
unaffordable in the middle of a paid campaign, and £30/month is cheap
insurance. **Staging runs on the homelab**, where the hardware is already paid
for and downtime costs nothing.

| | Production | Staging |
|---|---|---|
| Host | Managed VPS (2 vCPU / 4 GB is enough to start) | Homelab |
| Deploys on | A tagged release (`vX.Y.Z`) | Every merge to `main` |
| Public via | Cloudflare tunnel → CDN + WAF | Cloudflare tunnel |
| Database | Postgres in Compose, loopback-bound | Same |

Both bind every service to `127.0.0.1`. Public reachability comes from an
outbound tunnel, so neither host has an inbound port to scan.

## First-time provisioning

```bash
# On the target host
git clone git@github.com:Jahanzaib211/apex-global.git ~/apex-global
cd ~/apex-global
cp .env.example .env      # then fill it in — see below

corepack enable
pnpm install --frozen-lockfile
pnpm services:up
pnpm db:migrate
pnpm db:seed
pnpm db:seed:admin        # prints the admin password once
pnpm build

pm2 start infra/ecosystem.config.cjs
pm2 save
```

Values that must be generated per environment — never copied between them:

```bash
openssl rand -base64 32   # AUTH_SECRET
openssl rand -hex 32      # ENCRYPTION_KEY
openssl rand -base64 24   # BACKUP_PASSPHRASE
```

> **`ENCRYPTION_KEY` is not recoverable.** Every stored provider credential is
> sealed with it. Lose it and the vault contents are gone — the keys must be
> re-entered. Back it up somewhere other than this server.

## The tunnel

```bash
cloudflared tunnel create apex-prod
cloudflared tunnel route dns apex-prod <your-domain>
cloudflared tunnel route dns apex-prod console.<your-domain>
```

`infra/cloudflared.yml`:

```yaml
tunnel: <tunnel-id>
credentials-file: /home/<user>/.cloudflared/<tunnel-id>.json
ingress:
  - hostname: <your-domain>
    service: http://127.0.0.1:4300
  - hostname: console.<your-domain>
    service: http://127.0.0.1:4301
  - service: http_status:404
```

Run it under PM2 alongside everything else:
`pm2 start cloudflared --name tunnel-apex -- tunnel --config infra/cloudflared.yml run`

**Put the console behind Cloudflare Access** as well as its own login. Two
independent gates on an admin surface is the right number.

## Releasing

```bash
git tag v0.1.0 && git push origin v0.1.0
```

CI verifies the tagged commit (lint, typecheck, tests, credibility audit,
build), takes a pre-deploy backup, migrates forward, deploys, and smoke-tests
the live URL. The previous process keeps serving until the health check
passes, so a failed deploy is a non-event for visitors.

Migrations are forward-only and are applied to staging first — that is where
the rollback path gets tested, not production.

## Backups

```bash
crontab -e
0 3 * * * cd ~/apex-global && ./infra/scripts/backup-db.sh nightly >> logs/backup.log 2>&1
```

Dumps are gzipped and AES-encrypted **before** leaving the host, so an offsite
target that is later compromised yields ciphertext. Set `APEX_BACKUP_REMOTE`
to rsync them somewhere else; local copies are pruned after 30 days.

The script refuses to keep a suspiciously small dump — a silently truncated
backup is worse than a missing one, because it looks like success.

### The drill

```bash
./infra/scripts/restore-db.sh .backups/apex-nightly-<stamp>.sql.gz.enc
```

Restores into a scratch database, never the live one, and prints row counts
and the most recent lead. Run it quarterly and **record the date in
`docs/RUNBOOK.md`** — an untested backup is an assumption.

## Before the first real campaign

- [ ] Domain chosen and `NEXT_PUBLIC_SITE_URL` set (a placeholder domain in
      production breaks canonicals, OG tags and the sitemap)
- [ ] `TURNSTILE_SECRET_KEY` set — without it the form accepts submissions
      with no bot challenge and logs an error on every request
- [ ] `SMTP_*` and `LEAD_NOTIFY_TO` set, or nobody is told a lead arrived
- [ ] `org.email` and `org.whatsapp` filled in from the console, or the
      contact page shows a phone number and nothing else
- [ ] Restore drill run once and dated
- [ ] Console reachable only through Cloudflare Access
