# Persist PM2 across reboots

Run this one-liner (interactive sudo password):

```bash
sudo env PATH="$PATH:/usr/bin" \
  /home/jahanzaib/.npm-global/lib/node_modules/pm2/bin/pm2 startup systemd \
  -u jahanzaib --hp /home/jahanzaib
```

After it prints a success line, run:

```bash
pm2 resurrect       # picks up the saved dump (/home/jahanzaib/.pm2/dump.pm2)
```

To remove auto-start later:

```bash
sudo env PATH="$PATH:/usr/bin" \
  /home/jahanzaib/.npm-global/lib/node_modules/pm2/bin/pm2 unstartup systemd \
  -u jahanzaib --hp /home/jahanzaib
```

## What's managed today

| PM2 name              | what it does                                                  |
| --------------------- | ------------------------------------------------------------- |
| `apex-global-web`     | Public tech site (next start)                                 |
| `apex-global-console` | Dev/ops admin console (localhost:4301, not on the tunnel)     |
| `cloud-apex-tunnel`   | Cloudflared tunnel to cloud.apexgroupcompanies.com            |
| `mailcow-watchdog`    | 1-minute probe loop that restarts mailcow + tunnel on failure |

Logs are written to `/home/jahanzaib/Desktop/APEX GLOBAL/logs/<name>.out-*.log`
and `pm2-webmail` overloads are in `infra/scripts/mailcow-watchdog.sh`.
