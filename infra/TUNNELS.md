# Cloudflare Tunnels — inventory

Every tunnel running on this host. Check state with:

```bash
./infra/scripts/tunnels-status.sh
```

Read-only; safe during an incident.

| PM2 process               | Cloudflare tunnel  | Tunnel ID                              | Public hostname                      | Origin                            | Metrics | Token                                             |
| ------------------------- | ------------------ | -------------------------------------- | ------------------------------------ | --------------------------------- | ------- | ------------------------------------------------- |
| `tunnel-nova`             | NOVA               | `1e6cb156-0584-4c42-ad99-d1cb4ffb723b` | nova.alilabsx.com                    | `127.0.0.1:2026`                  | 20001   | inline ⚠                                          |
| `tunnel-fox-hosting`      | FOX HOSTING        | `2a31dc3a-1d00-439a-9338-598e4965de90` | client.alilabsx.com                  | `127.0.0.1:4200`                  | 20002   | inline ⚠                                          |
| `tunnel-whmcs`            | WHMCS              | `efb1095f-2bab-4129-badc-ae802fd44eab` | admin.alilabsx.com                   | `127.0.0.1:4201`                  | 20003   | inline ⚠                                          |
| `tunnel-apex-group`       | APEX GROUP         | `677c31d0-0f5d-46fd-8f48-13036ec2b4b3` | apex.apexgroupcompanies.com          | `127.0.0.1:3103`                  | 20004   | inline ⚠                                          |
| `tunnel-apex-tours`       | APEX TRAVEL N TOUR | `80df5f7a-0864-4873-905b-170bbadd858f` | tours.apexgroupcompanies.com †       | `127.0.0.1:3001`                  | 20005   | inline ⚠                                          |
| `tunnel-apex-outsourcing` | APEX OUTSOURCING   | `5f401d60-c64a-4468-b947-235a5f3a6641` | outsourcing.apexgroupcompanies.com † | `127.0.0.1:3100`                  | 20006   | inline ⚠                                          |
| `tunnel-apex-holdings`    | APEX HOLDINGS      | see dashboard                          | holdings.apexgroupcompanies.com †    | `127.0.0.1:3102`                  | 20007   | `~/.cloudflared/apex-holdings.token`              |
| `tunnel-apex-tech`        | tech               | `7f399ee2-f932-4963-9c20-a4a0881cfe81` | **tech.apexgroupcompanies.com**      | `127.0.0.1:4300`                  | 20008   | `~/.cloudflared/tech.token` (rotate — see report) |
| `tunnel-fincept`          | fincept            | `882027dc-b5bb-4b62-a0eb-24ce8f622125` | fincept.apexgroupcompanies.com ‡     | `127.0.0.1:6080`                  | 20010   | `~/.cloudflared/fincept.token`                    |
| `tunnel-chat`             | chat               | `a311a9d1-b4bc-42b8-b1be-fa44ff61e0c1` | **chat.apexgroupcompanies.com**      | `127.0.0.1:4800` (chatwoot-web) § | 20011   | `~/.cloudflared/chat.token`                       |
| `cloud-apex-tunnel`       | cloud (mailcow)    | `97d3536e-4bf3-4bc6-aa33-2c07674af70c` | **cloud.apexgroupcompanies.com**     | `127.0.0.1:8085` (caddy)          | — *     | `~/.cloudflared/cloud-apex.token`                 |

§ **`chat` was an orphaned DNS record until 2026-08-13** — the CNAME existed and
pointed at tunnel `a311a9d1-…`, but no connector for it ran, so Cloudflare
returned error 1033 (HTTP 530) to the public. That single missing connector was
the only thing blocking group-wide live chat: Chatwoot was healthy, all five
website inboxes existed, and every site was already built with its own token.
Closed by registering `tunnel-chat` above.

⚠️ **The origin is `:4800`, not `:4801`.** The container named `chatwoot-nginx`
publishes `127.0.0.1:4801`, but it reverse-proxies the _Apex tech marketing
site_ — verified by response body: `:4801` returns "Apex Global Tech Solution",
`:4800` returns the Chatwoot dashboard bundle. An earlier plan specified `:4801`
because it was written while Chatwoot was down and only the nginx container was
answering. Pointing this tunnel at `:4801` would serve the marketing site at
`chat.apexgroupcompanies.com`.

⚠️ **Chatwoot is now public and holds customer conversations.** It is protected
by its own login only — there is no Cloudflare Access in front, unlike the
console, which is deliberately unpublished for the same class of reason. Worth
adding Access here.

All nine tunnels verified serving **HTTP 200** with 4 HA connections on 4 Aug 2026
(cloud-apex-tunnel verified 8 Aug 2026; it runs without a `--metrics` flag, so
the metrics column is `-` and `tunnels-status.sh` shows `-` connections).
Chatwoot is **loopback only** (no tunnel, no public hostname) — see the "Adding a
tunnel" section when a public host for it is wanted.

† The local config file names a different hostname (`apex-tours.local`,
`apex-outsourcing.local`, `apexholdings.pk`). Those files are **not
authoritative** — see the section below. The column above records what each
connector actually serves, taken from its log.
‡ **`tunnel-fincept` was missing from this table entirely** until 2026-08-13,
which is how its metrics port came to be advertised as free below. It exposes a
VNC desktop to the public internet behind VNC auth only — no Cloudflare Access
in front. Worth revisiting; see `HARDENING-REPORT.md`.

⚠ Token stored inline in the PM2 args, so it is readable in `pm2 jlist` and in
plaintext inside `~/.pm2/dump.pm2`. Not urgent, but see the hardening report.

`cloud-apex-tunnel` was moved off an inline token on 2026-08-13 — its token had
been sitting in `infra/ecosystem.config.cjs`, a git-tracked file. (An earlier
note here called the remote public; it is private. The token would still have
entered history permanently on any `git add -A`, and would then need rotating
rather than deleting.) It now reads `~/.cloudflared/cloud-apex.token` (mode 600), and
`~/.pm2/dump.pm2` was chmod'd to 600. **Six tunnels still carry inline tokens**
(Finding 5 in `HARDENING-REPORT.md`). Remember that pm2 bakes args into its saved
dump: applying a token change is `pm2 delete` + `start` + `save`, never
`pm2 restart`.

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

The hardening report this file cites is **`~/Desktop/TUNNEL-HARDENING.md`**
(4 Aug 2026) — on the Desktop, not in this repo, which is why searching the repo
for it comes up empty. It is the authority for anything tunnel-shaped, and its
Appendix carries the zero-downtime connector-replacement recipe.

A companion [HARDENING-REPORT.md](HARDENING-REPORT.md) covers the **host** side —
the 2026-08-12 memory freeze, container limits, service posture. Where the two
overlap they are cross-numbered: the inline-token issue is Finding 1 there and
Finding 5 here; root domains is Finding 3 in both.

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

**Next free metrics port: 20011.** This previously said 20010, but
`tunnel-fincept` already holds 20010 — it was simply absent from the table
above, so the number looked free. (20009 is taken by the cloud/mailcow tunnel's
slot in `tunnels-status.sh`, even though that connector exposes no metrics port.)

## Apps behind the tunnels

| PM2 process           | Port             | Published?                                    |
| --------------------- | ---------------- | --------------------------------------------- |
| `apex-global-web`     | `127.0.0.1:4300` | Yes — tech.apexgroupcompanies.com             |
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
