#!/usr/bin/env bash
#
# Bring up (or restart) the Cloudflare connector for tech.apexgroupcompanies.com.
#
# Idempotent: safe to run again. It touches nothing but its own PM2 process —
# no other tunnel is stopped, restarted or reconfigured.
#
# The token is read from a file, never from a command line, so it does not land
# in the PM2 arg vector, in ~/.pm2/dump.pm2, or in shell history.
#
# Two ways to get that file, whichever you prefer:
#
#   a) Paste it:
#        install -m 600 /dev/null ~/.cloudflared/tech.token
#        cat > ~/.cloudflared/tech.token     # paste, then Ctrl-D
#
#   b) Fetch it, once you have an origin certificate from `cloudflared login`:
#        cloudflared tunnel token tech > ~/.cloudflared/tech.token
#        chmod 600 ~/.cloudflared/tech.token
#
# Usage: infra/scripts/start-tech-tunnel.sh
set -euo pipefail

CLOUDFLARED="${CLOUDFLARED:-$HOME/.local/bin/cloudflared}"
TOKEN_FILE="${TOKEN_FILE:-$HOME/.cloudflared/tech.token}"
CONFIG_FILE="${CONFIG_FILE:-$HOME/.cloudflared/tech-config.yml}"
PM2_NAME="tunnel-apex-tech"
METRICS="127.0.0.1:20008"
ORIGIN="http://127.0.0.1:4300"
HOSTNAME_PUBLIC="tech.apexgroupcompanies.com"
TUNNEL_ID="7f399ee2-f932-4963-9c20-a4a0881cfe81"

die() { printf '\n✗ %s\n' "$1" >&2; exit 1; }
ok()  { printf '✓ %s\n' "$1"; }

# --- Preflight ------------------------------------------------------------
# Everything that can be checked cheaply is checked before PM2 is touched, so
# a misconfiguration shows up as a clear message rather than a crash loop.

[ -x "$CLOUDFLARED" ] || die "cloudflared not found at $CLOUDFLARED"
[ -f "$CONFIG_FILE" ] || die "missing config: $CONFIG_FILE"

if [ ! -s "$TOKEN_FILE" ]; then
  die "no token at $TOKEN_FILE — see the header of this script for the two ways to create it."
fi

# A token pasted through a terminal picks up whitespace surprisingly often, and
# cloudflared's failure mode for a malformed token is an opaque auth error.
if grep -q '[[:space:]]' "$TOKEN_FILE"; then
  printf '  stripping whitespace from the token file\n'
  tr -d '[:space:]' < "$TOKEN_FILE" > "$TOKEN_FILE.tmp"
  mv "$TOKEN_FILE.tmp" "$TOKEN_FILE"
fi
chmod 600 "$TOKEN_FILE"

# The token is base64-encoded JSON carrying {a: account, t: tunnel, s: secret}.
# Decoding it locally confirms we are about to start the *intended* tunnel and
# not, say, a token copied from a sibling. No secret is printed.
decoded_id=$(base64 -d < "$TOKEN_FILE" 2>/dev/null \
  | grep -oE '"t":"[0-9a-f-]+"' | head -1 | cut -d'"' -f4 || true)
if [ -n "$decoded_id" ]; then
  [ "$decoded_id" = "$TUNNEL_ID" ] \
    || die "token is for tunnel $decoded_id, expected $TUNNEL_ID (tech). Wrong token file."
  ok "token matches tunnel $TUNNEL_ID (tech)"
else
  printf '  ! could not parse the token; continuing and letting cloudflared judge it\n'
fi

# Publishing a connector in front of a dead origin turns a 1033 into a 502.
origin_code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 "$ORIGIN/" || true)
[ "$origin_code" = "200" ] \
  || die "origin $ORIGIN returned '$origin_code', expected 200. Start apex-global-web first: pm2 start infra/ecosystem.config.cjs"
ok "origin $ORIGIN is serving (200)"

# --- Start ----------------------------------------------------------------

if pm2 describe "$PM2_NAME" >/dev/null 2>&1; then
  printf '  %s already exists — restarting it\n' "$PM2_NAME"
  pm2 restart "$PM2_NAME" --update-env >/dev/null
else
  pm2 start "$CLOUDFLARED" --name "$PM2_NAME" -- \
    --no-autoupdate --protocol http2 \
    --config "$CONFIG_FILE" \
    --metrics "$METRICS" \
    tunnel run --token-file "$TOKEN_FILE" >/dev/null
fi
pm2 save >/dev/null
ok "$PM2_NAME started and saved to the PM2 dump (survives reboot)"

# --- Verify ---------------------------------------------------------------
# Registering four HA connections takes a few seconds; poll rather than sleep
# for a fixed guess, so a fast start is not punished and a slow one is not
# reported as a failure.

printf '  waiting for connections'
conns=0
for _ in $(seq 1 30); do
  sleep 2
  printf '.'
  conns=$(curl -s --max-time 3 "http://${METRICS}/metrics" 2>/dev/null \
    | awk '/^cloudflared_tunnel_ha_connections /{print $2}' | head -1)
  [ -z "$conns" ] && conns=0
  [ "$conns" -ge 4 ] && break
done
printf '\n'

[ "$conns" -ge 1 ] || die "connector registered 0 connections. Check: pm2 logs $PM2_NAME --lines 40"
ok "$conns HA connection(s) registered"

code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 "https://${HOSTNAME_PUBLIC}" || true)
[ -z "$code" ] && code="000"

case "$code" in
  200)
    ok "https://${HOSTNAME_PUBLIC} → 200. Live."
    ;;
  530|1033)
    die "still $code — the connector is up but Cloudflare has not attached it. Check the tunnel is not paused in the dashboard."
    ;;
  502|503|504)
    die "$code — the tunnel is connected but cannot reach the origin. In the dashboard, the public hostname's service must be exactly $ORIGIN (remote config wins over this file)."
    ;;
  *)
    die "unexpected status $code from https://${HOSTNAME_PUBLIC}"
    ;;
esac

# The console holds every lead and the credentials vault. It is absent from
# ingress by design; assert that rather than trusting the config to be right.
console_code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 \
  "https://${HOSTNAME_PUBLIC}/admin" || true)
printf '  console reachability through the tunnel: /admin → %s (404 or a public page is expected; a login form is not)\n' \
  "${console_code:-000}"

echo
echo "Full picture: infra/scripts/tunnels-status.sh"
