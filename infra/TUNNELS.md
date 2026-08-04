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
| `tunnel-apex-group` | APEX GROUP | `677c31d0-0f5d-46fd-8f48-13036ec2b4b3` | apexgroupcompanies.com † | `127.0.0.1:3103` | 20004 | inline ⚠ |
| `tunnel-apex-tours` | APEX TRAVEL N TOUR | `80df5f7a-0864-4873-905b-170bbadd858f` | apex-tours.local ‡ | `127.0.0.1:3001` | 20005 | inline ⚠ |
| `tunnel-apex-outsourcing` | APEX OUTSOURCING | `5f401d60-c64a-4468-b947-235a5f3a6641` | apex-outsourcing.local ‡ | `127.0.0.1:3100` | 20006 | inline ⚠ |
| `tunnel-apex-holdings` | APEX HOLDINGS | see dashboard | apexholdings.pk † | `127.0.0.1:3102` | 20007 | `~/.cloudflared/apex-holdings.token` |
| `tunnel-apex-tech` | tech | `7f399ee2-f932-4963-9c20-a4a0881cfe81` | **tech.apexgroupcompanies.com** | `127.0.0.1:4300` | 20008 | `~/.cloudflared/tech.token` |

† Hostname does not currently resolve — the connector is healthy, but the DNS
record is missing. See the hardening report.
‡ `.local` placeholder; nothing publicly reachable by design.
⚠ Token stored inline in the PM2 args, so it is readable in `pm2 jlist` and in
plaintext inside `~/.pm2/dump.pm2`. Not urgent, but see the hardening report.

**Next free metrics port: 20009.**

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
