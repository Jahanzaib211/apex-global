#!/usr/bin/env bash
# Apex — Mailcow + tunnel watchdog.
#
# Polls the public and internal endpoints every minute. If either probe fails
# it (a) restarts the mailcow docker stack and (b) restarts the PM2 cloud-apex
# tunnel. Repeats twice if a restart doesn't recover the service, then sleeps.
set -u

PUBLIC_URL=${PUBLIC_URL:-https://cloud.apexgroupcompanies.com/}
INTERNAL_URL=${INTERNAL_URL:-http://127.0.0.1:8085}
MAILCOW_HEALTH_URL=${MAILCOW_HEALTH_URL:-http://127.0.0.1:13306/}
MAILCOW_DIR=${MAILCOW_DIR:-/home/jahanzaib/Desktop/APEX GLOBAL/infra/mailcow-dockerized}
TUNNEL_PM2_NAME=${TUNNEL_PM2_NAME:-cloud-apex-tunnel}
STATE_DIR=${STATE_DIR:-/tmp/apex-watchdog}
LOG_FILE=${LOG_FILE:-/home/jahanzaib/Desktop/APEX GLOBAL/logs/mailcow-watchdog.log}

mkdir -p "$STATE_DIR" "$(dirname "$LOG_FILE")"

stamp() { date +"%Y-%m-%dT%H:%M:%S%z"; }
log()   { echo "[$(stamp)] $*" | tee -a "$LOG_FILE"; }

probe_ok() {
  local url=$1
  local timeout=${2:-10}
  local code
  code=$(curl -sk -o /dev/null -m "$timeout" -w '%{http_code}' "$url" 2>/dev/null || echo 000)
  case "$code" in 2*|3*) return 0 ;; *) return 1 ;; esac
}

probe_ok_or_db() {
  # Mailcow's /health route is unreachable without auth; a TCP connect
  # against mariadb is a cheap surrogate, plus a 200 on any nginx path.
  if [ -n "${1:-}" ] && [ "${1#tcp}" != "$1" ]; then
    local host=${1#tcp://}
    local hp=${host##*@}; local h=${hp%:*}; local p=${hp#*:}
    [ -z "$h" ] || [ -z "$p" ] && return 1
    timeout 5 bash -c "exec 3<>/dev/tcp/$h/$p" 2>/dev/null && return 0
    return 1
  fi
  probe_ok "$1" "$2"
}

restart_mailcow() {
  log "restarting mailcow stack (up)…"
  cd "$MAILCOW_DIR" || { log "  cd $MAILCOW_DIR failed"; return 1; }
  docker compose -f docker-compose.yml -f docker-compose.override.yml up -d postfix-mailcow dovecot-mailcow rspamd-mailcow 2>>"$LOG_FILE" >>"$LOG_FILE"
}

restart_tunnel() {
  log "restarting $TUNNEL_PM2_NAME (pm2)…"
  pm2 restart "$TUNNEL_PM2_NAME" >>"$LOG_FILE" 2>&1
}

failcounter() {
  local key=$1
  local file="$STATE_DIR/$key"
  local cur=$(cat "$file" 2>/dev/null || echo 0)
  cur=$((cur + 1))
  echo "$cur" > "$file"
  echo "$cur"
}

reset_failcounter() {
  rm -f "$STATE_DIR/$1"
}

main_loop() {
  while true; do
    # 1) Public origin (the actual reachable-facing test)
    if probe_ok "$PUBLIC_URL" 8; then
      reset_failcounter public
    else
      n=$(failcounter public)
      log "public probe failed ($n/3): $PUBLIC_URL"
      # tunnel is most likely down or Caddy is broken
      if [ "$n" -ge 2 ]; then
        restart_tunnel
        # also bounce mailcow in case Caddy lost upstream
        [ "$n" -ge 3 ] && restart_mailcow
      fi
    fi

    # 2) Internal mailcow front (Caddy on 8085)
    if probe_ok "$INTERNAL_URL" 4; then
      reset_failcounter internal
    else
      n=$(failcounter internal)
      log "internal probe failed ($n/3): $INTERNAL_URL"
      if [ "$n" -ge 2 ]; then
        restart_mailcow
      fi
    fi

    sleep 60
  done
}

main_loop
