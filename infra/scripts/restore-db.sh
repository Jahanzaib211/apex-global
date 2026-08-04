#!/usr/bin/env bash
#
# Restore a backup into a scratch database and report what came back.
#
# This is the drill, not a production restore: it never touches the live
# database. A backup that has never been restored is an assumption, and
# assumptions fail on the day you need them.
#
# Usage: restore-db.sh <encrypted-dump> [scratch-db-name]
set -euo pipefail

DUMP="${1:?path to an encrypted dump is required}"
SCRATCH="${2:-apex_restore_drill}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# shellcheck disable=SC1091
[ -f "$ROOT/.env" ] && set -a && . "$ROOT/.env" && set +a

: "${DATABASE_URL:?DATABASE_URL is required}"

# Postgres runs in a container, so the client tools may not exist on the host.
# Fall back to running them inside it. Two rewrites are needed for that path:
# libpq rejects Prisma's ?schema=... parameter, and inside the container the
# server is on its own 5432 rather than the host-mapped port.
PG_CONTAINER="${APEX_PG_CONTAINER:-apex-postgres}"
PG_URL="${DATABASE_URL%%\?*}"

if command -v pg_dump >/dev/null 2>&1; then
  run_pg_dump() { pg_dump "$@"; }
  run_psql() { psql "$@"; }
else
  PG_URL="$(printf '%s' "$PG_URL" | sed -E 's#@[^/]+/#@127.0.0.1:5432/#')"
  run_pg_dump() { docker exec -i "$PG_CONTAINER" pg_dump "$@"; }
  run_psql() { docker exec -i "$PG_CONTAINER" psql "$@"; }
fi
: "${BACKUP_PASSPHRASE:?BACKUP_PASSPHRASE is required}"

BASE="${PG_URL%/*}"
SCRATCH_URL="${BASE}/${SCRATCH}"

echo "Recreating scratch database ${SCRATCH}"
run_psql "${BASE}/postgres" -c "DROP DATABASE IF EXISTS ${SCRATCH};" >/dev/null
run_psql "${BASE}/postgres" -c "CREATE DATABASE ${SCRATCH};" >/dev/null

echo "Restoring $DUMP"
openssl enc -d -aes-256-cbc -pbkdf2 -iter 200000 -pass env:BACKUP_PASSPHRASE -in "$DUMP" \
  | gunzip \
  | run_psql --quiet "$SCRATCH_URL" >/dev/null

echo
echo "Restored. Row counts:"
run_psql "$SCRATCH_URL" -At -c "
  SELECT 'leads: '        || count(*) FROM leads
  UNION ALL SELECT 'solutions: '     || count(*) FROM solutions
  UNION ALL SELECT 'case_studies: '  || count(*) FROM case_studies
  UNION ALL SELECT 'saas_products: ' || count(*) FROM saas_products
  UNION ALL SELECT 'users: '         || count(*) FROM users
  UNION ALL SELECT 'audit rows: '    || count(*) FROM audit_log;"

echo
echo "Most recent lead in the restore:"
run_psql "$SCRATCH_URL" -At -c \
  "SELECT coalesce(max(\"createdAt\")::text, '(none)') FROM leads;"

echo
echo "Drill complete. Record the date in docs/RUNBOOK.md."
echo "Scratch database ${SCRATCH} left in place for inspection; drop it when done."
