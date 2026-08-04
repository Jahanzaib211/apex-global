#!/usr/bin/env bash
#
# One-line health check for every Cloudflare tunnel on this host.
#
# Read-only: it starts nothing, stops nothing and changes nothing. Safe to run
# at any time, including during an incident.
#
# For each tunnel it reports the PM2 state, the number of HA connections the
# connector currently holds (from the metrics endpoint cloudflared already
# exposes), and the HTTP status of the public hostname.
#
# A healthy tunnel shows: online / 4 connections / 200.
#   0 connections  → the connector is running but not registered with Cloudflare
#   530 (or 1033)  → Cloudflare has the DNS route but no connector attached
#   000            → the hostname does not resolve at all
#
# Usage: infra/scripts/tunnels-status.sh
set -uo pipefail

# name | metrics port | public hostname ("-" if none)
TUNNELS=(
  "tunnel-nova|20001|nova.alilabsx.com"
  "tunnel-fox-hosting|20002|client.alilabsx.com"
  "tunnel-whmcs|20003|admin.alilabsx.com"
  "tunnel-apex-group|20004|apexgroupcompanies.com"
  "tunnel-apex-tours|20005|-"
  "tunnel-apex-outsourcing|20006|-"
  "tunnel-apex-holdings|20007|apexholdings.pk"
  "tunnel-apex-tech|20008|tech.apexgroupcompanies.com"
)

printf '%-26s %-10s %-6s %-32s %s\n' "PM2 PROCESS" "STATE" "CONNS" "HOSTNAME" "HTTP"
printf '%-26s %-10s %-6s %-32s %s\n' "--------------------------" "----------" "-----" \
  "--------------------------------" "----"

pm2_states="$(pm2 jlist 2>/dev/null || echo '[]')"

for row in "${TUNNELS[@]}"; do
  IFS='|' read -r name port host <<<"$row"

  state=$(printf '%s' "$pm2_states" | python3 -c "
import json,sys
try:
    procs = json.load(sys.stdin)
except Exception:
    print('?'); raise SystemExit
name = '$name'
match = next((p for p in procs if p['name'] == name), None)
print(match['pm2_env']['status'] if match else 'absent')
" 2>/dev/null || echo "?")

  # cloudflared exposes ha_connections on its metrics endpoint. Missing
  # endpoint means the process is not listening — report as "-" rather than 0,
  # since those are different failures.
  conns=$(curl -s --max-time 3 "http://127.0.0.1:${port}/metrics" 2>/dev/null \
    | awk '/^cloudflared_tunnel_ha_connections /{print $2; found=1} END{if(!found) print "-"}' \
    | head -1)
  [ -z "$conns" ] && conns="-"

  if [ "$host" = "-" ]; then
    code="n/a"
    host="(no public hostname)"
  else
    # curl prints 000 AND exits non-zero on a DNS failure, so the usual
    # `|| echo 000` fallback would concatenate into "000000".
    code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 8 "https://${host}" 2>/dev/null)
    [ -z "$code" ] && code="000"
  fi

  printf '%-26s %-10s %-6s %-32s %s\n' "$name" "$state" "$conns" "$host" "$code"
done

echo
echo "Apps behind the tunnels:"
for row in "apex-global-web|4300" "apex-global-console|4301"; do
  IFS='|' read -r app port <<<"$row"
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 "http://127.0.0.1:${port}/" 2>/dev/null)
  [ -z "$code" ] && code="000"
  printf '  %-24s 127.0.0.1:%-6s %s\n' "$app" "$port" "$code"
done

echo
echo "Inventory and remediation notes: infra/TUNNELS.md · ~/Desktop/TUNNEL-HARDENING.md"
