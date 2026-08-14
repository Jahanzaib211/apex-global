#!/usr/bin/env bash
# Apex — cap the containers that still have no memory limit.
#
#   ./infra/scripts/cap-uncapped-containers.sh            # dry run (default)
#   ./infra/scripts/cap-uncapped-containers.sh --apply     # actually set them
#
# Context (2026-08-14). HARDENING-REPORT.md Finding 4 claimed "0 of 57 running
# containers uncapped". That was wrong — 9 of 62 have no limit, so any one of
# them can still take the whole host.
#
# The values below are deliberately GENEROUS. The same Finding capped SOGo at
# 256m against a 242 MiB working set and produced 844 OOM kills in 7 hours,
# which is a large part of why this machine locked up three times. A cap that is
# too tight is its own outage. Every number here is roughly 4x observed steady
# state with a floor, and build/database containers get extra room because they
# spike.
#
# A note on the total: limits are ceilings, not reservations, so the sum
# exceeding host RAM is normal and is NOT itself a fault. What matters is
# (a) nothing is uncapped and (b) nothing runs near its own cap. This script
# reports both.
set -uo pipefail

APPLY=false
[ "${1:-}" = "--apply" ] && APPLY=true

# container                              limit  rationale
CAPS="
buildx_buildkit_addonbuilder0            6g     build daemon; spikes hard during image builds
mailcowdockerized-postfix-mailcow-1      512m   20 MiB idle, but spikes on large messages
deer-flow-autoheal                       128m   2.5 MiB, a polling shell loop
twenty-server-1                          2g     525 MiB steady
twenty-worker-1                          2g     518 MiB steady
twenty-db-1                              1g     postgres; 32 MiB idle is not its ceiling
twenty-redis-1                           512m   19 MiB steady
twenty-apex-db-1                         1g     postgres; same reasoning as twenty-db-1
twenty-apex-redis-1                      512m   6 MiB steady
"

$APPLY || echo "DRY RUN — nothing will change. Re-run with --apply to set these."
echo
printf '%-40s %-8s %-8s %s\n' CONTAINER CURRENT NEWCAP RATIONALE
printf '%-40s %-8s %-8s %s\n' "----------------------------------------" "-------" "-------" "---------"

echo "$CAPS" | while read -r name limit rationale; do
  [ -z "${name:-}" ] && continue

  if ! docker inspect "$name" >/dev/null 2>&1; then
    printf '%-40s %-8s %-8s %s\n' "$name" "-" "-" "NOT PRESENT, skipped"
    continue
  fi

  existing=$(docker inspect "$name" --format '{{.HostConfig.Memory}}' 2>/dev/null)
  if [ "$existing" != "0" ]; then
    printf '%-40s %-8s %-8s %s\n' "$name" "-" "-" "already capped, skipped"
    continue
  fi

  cur=$(docker stats --no-stream --format '{{.MemUsage}}' "$name" 2>/dev/null | awk -F' / ' '{print $1}')
  printf '%-40s %-8s %-8s %s\n' "$name" "${cur:-?}" "$limit" "$rationale"

  if $APPLY; then
    docker update --memory "$limit" --memory-swap "$limit" "$name" >/dev/null 2>&1 \
      && echo "    applied" \
      || echo "    FAILED — check 'docker update --memory $limit $name'"
  fi
done

echo
echo "=== containers running near their cap (want everything well under 80%) ==="
docker stats --no-stream --format '{{.MemPerc}}\t{{.Name}}\t{{.MemUsage}}' 2>/dev/null \
  | sed 's/%//' | sort -rn | head -6 \
  | awk -F'\t' '{flag = ($1+0 >= 80) ? "  <-- TOO TIGHT" : ""; printf "  %5.1f%%  %-40s %s%s\n", $1, $2, $3, flag}'

echo
docker ps -q 2>/dev/null | while read -r c; do docker inspect "$c" --format '{{.HostConfig.Memory}}'; done \
  | awk '{s+=$1; if($1==0) u++} END {printf "  declared limits: %.1f GiB   still uncapped: %d\n", s/1073741824, u+0}'

echo
if $APPLY; then
  cat <<'EOF'
NOTE: `docker update` alone does not survive `docker compose up --force-recreate`.
      Mirror these into the relevant compose files, or they will silently revert
      — that divergence is exactly what left SOGo running at 256m for a day
      while its override file said 512m.
EOF
fi
