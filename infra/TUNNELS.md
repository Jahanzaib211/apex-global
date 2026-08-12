# Cloudflare Tunnels — inventory

Every tunnel running on this host. Check state with:

```bash
./infra/scripts/tunnels-status.sh
```

Read-only; safe during an incident.

| PM2 process | Cloudflare tunnel | Tunnel ID | Public hostname | Origin | Metrics | Token |
|---|---|---|---|---|---|---|
| `tunnel-nova` | NOVA | `1e6cb156-0584-4c42-ad99-d1cb4ffb723b` | nova.alilabsx.com | `127.0.0.1:2026` | 20001 | inline ⚠ |
| `tunnel-fox-hosting` | FOX HOSTING | `2a31dc3a-1d00-439a-9338-598e4965de90` | client.alilabsx.com | `127.0.0.1:4200` | 20002 | inline ⚠ |
| `tunnel-whmcs` | WHMCS | `efb1095f-2bab-4129-badc-ae802fd44eab` | admin.alilabsx.com | `127.0.0.1:4201` | 20003 | inline ⚠ |
| `tunnel-apex-group` | APEX GROUP | `677c31d0-0f5d-46fd-8f48-13036ec2b4b3` | apex.apexgroupcompanies.com | `127.0.0.1:3103` | 20004 | inline ⚠ |
| `tunnel-apex-tours` | APEX TRAVEL N TOUR | `80df5f7a-0864-4873-905b-170bbadd858f` | tours.apexgroupcompanies.com † | `127.0.0.1:3001` | 20005 | inline ⚠ |
| `tunnel-apex-outsourcing` | APEX OUTSOURCING | `5f401d60-c64a-4468-b947-235a5f3a6641` | outsourcing.apexgroupcompanies.com † | `127.0.0.1:3100` | 20006 | inline ⚠ |
| `tunnel-apex-holdings` | APEX HOLDINGS | see dashboard | holdings.apexgroupcompanies.com † | `127.0.0.1:3102` | 20007 | `~/.cloudflared/apex-holdings.token` |
| `tunnel-apex-tech` | tech | `7f399ee2-f932-4963-9c20-a4a0881cfe81` | **tech.apexgroupcompanies.com** | `127.0.0.1:4300` | 20008 | `~/.cloudflared/tech.token` (rotate — see report) |
| `cloud-apex-tunnel` | cloud (mailcow) | see dashboard | **cloud.apexgroupcompanies.com** | `127.0.0.1:8085` (caddy) | — * | inline ⚠ |

| — loopback only — | Chatwoot | — | *(no connector — but see ⛔ below)* | `127.0.0.1:4800` | — | — |

⛔ **Orphaned DNS record — `chat.apexgroupcompanies.com` returns 530 publicly.**
Found 2026-08-13. A proxied CNAME exists in the zone pointing at tunnel
`a311a9d1-b4bc-42b8-b1be-fa44ff61e0c1`, but **no connector for that tunnel runs
on this host** — the ten pm2 cloudflared processes cover every other row in this
table and none of them is Chatwoot. So Cloudflare accepts the request, finds no
connector, and serves error 1033 (HTTP 530) to the public. Chatwoot itself is
healthy on `127.0.0.1:4800`.

Two ways to close it, both needing the dashboard:
- **Publish it** — create the connector for that tunnel with origin
  `127.0.0.1:4800` and follow "Adding a tunnel" below. Note the console warning
  above applies: Chatwoot holds customer conversations, so put Cloudflare Access
  in front rather than exposing it bare.
- **Retire it** — delete the `chat` CNAME from the zone so the hostname stops
  answering with an error page.

Until then this is the only Apex hostname serving a public error.

All nine tunnels verified serving **HTTP 200** with 4 HA connections on 4 Aug 2026
(cloud-apex-tunnel verified 8 Aug 2026; it runs without a `--metrics` flag, so
the metrics column is `-` and `tunnels-status.sh` shows `-` connections).
Chatwoot is **loopback only** (no tunnel, no public hostname) — see the "Adding a
tunnel" section when a public host for it is wanted.

† The local config file names a different hostname (`apex-tours.local`,
`apex-outsourcing.local`, `apexholdings.pk`). Those files are **not
authoritative** — see the section below. The column above records what each
connector actually serves, taken from its log.
⚠ Token stored inline in the PM2 args, so it is readable in `pm2 jlist` and in
plaintext inside `~/.pm2/dump.pm2`. Not urgent, but see the hardening report.

Note also that no **root** domain resolves — `apexgroupcompanies.com`, `www.`
and `apexholdings.pk` all return nothing. Everything lives on a subdomain.
That is Finding 3 in the hardening report.

Re-verified 2026-08-13, with detail the finding did not record:

- `apexgroupcompanies.com` **is** in this Cloudflare account (zone active), but
  the zone holds only `MX` and `TXT` at the apex — no `A`/`AAAA`/`CNAME`, and no
  `www` record at all. Adding a proxied CNAME to the APEX GROUP tunnel
  (`677c31d0-…`, already serving `apex.`) would light both up.
- `apexholdings.pk` is **not in this Cloudflare account** at all, so no API
  token here can fix it. It needs adding to Cloudflare, or fixing at whatever
  registrar/DNS host currently holds it.

The hardening report this file cites had been lost — it existed only as these
references. It has been reconstructed at [HARDENING-REPORT.md](HARDENING-REPORT.md),
with the original numbering preserved (Finding 3 = root domains) and every
finding re-verified against the live host. The inline-token issue flagged in the
table above is **Finding 5** there.

## Where ingress actually comes from

Every tunnel here is created in the dashboard and run with a token, which makes
it **remotely managed**: cloudflared downloads its ingress rules from Cloudflare
and logs `Updated to new configuration …` on connect. The local
`~/.cloudflared/*-config.yml` files supply process-level settings (metrics,
protocol, timeouts) and **document** the intended routing, but their `ingress:`
blocks do not decide anything.

Practical consequence: **editing a config file will not change where traffic
goes.** Change the public hostname in the dashboard. To see what a connector is
really serving:

```bash
grep -ho 'Updated to new configuration.*' ~/.pm2/logs/tunnel-<name>-error.log | tail -1
```

Read the log file directly rather than going through `pm2 logs --lines N` — the
config line is printed once at connect, so on a long-running connector it has
usually scrolled past whatever window you ask for.

That command is how the hostname column above was corrected. **Four of the
eight rows were wrong**, all copied from config files: `apex-tours` and
`apex-outsourcing` were listed as unreachable `.local` placeholders when both
serve live subdomains, `apex-holdings` was listed under `apexholdings.pk`, and
`apex-group` under the bare root domain.

**Next little port: 20010** (20009 is taken by the cloud/mailcow tunnel's slot in
`tunnels-status.sh`, even though that connector exposes no metrics port).

## Apps behind the tunnels

| PM2 process | Port | Published? |
|---|---|---|
| `apex-global-web` | `127.0.0.1:4300` | Yes — tech.apexgroupcompanies.com |
| `apex-global-console` | `127.0.0.1:4301` | **No, deliberately.** Local or Tailscale only |

The console holds every lead and the encrypted credentials vault. It is absent
from the tunnel's ingress rules on purpose — if you ever want it remotely
reachable, put Cloudflare Access in front rather than exposing the login page.

## Adding a tunnel

1. Create it in the Cloudflare dashboard and add the public hostname route.
2. Write the token to a file, never into a command line:
   ```bash
   install -m 600 /dev/null ~/.cloudflared/<name>.token
   cat > ~/.cloudflared/<name>.token   # paste, then Ctrl-D
   ```
3. Copy `~/.cloudflared/tech-config.yml` as the template and edit the header,
   hostname and origin port.
4. Start it, taking the next free metrics port:
   ```bash
   pm2 start ~/.local/bin/cloudflared --name tunnel-<name> -- \
     --no-autoupdate --protocol http2 \
     --config ~/.cloudflared/<name>-config.yml \
     --metrics 127.0.0.1:200NN \
     tunnel run --token-file ~/.cloudflared/<name>.token
   pm2 save
   ```
5. Add a row to the table above and to `TUNNELS` in `tunnels-status.sh`.

`pm2 save` is what makes it survive a reboot — `pm2-jahanzaib.service` restores
the saved dump at boot. Skipping it means the tunnel dies with the machine.
