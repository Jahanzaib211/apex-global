#!/usr/bin/env bash
#
# Nightly database backup: dump, encrypt, ship offsite, prune.
#
# Encryption happens before the file leaves the host, so an offsite target
# that is later compromised yields ciphertext. Requires BACKUP_PASSPHRASE.
#
# Usage: backup-db.sh [label]     (label defaults to "nightly")
set -euo pipefail

LABEL="${1:-nightly}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BACKUP_DIR="${APEX_BACKUP_DIR:-$ROOT/.backups}"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
KEEP_DAYS="${APEX_BACKUP_KEEP_DAYS:-30}"

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
: "${BACKUP_PASSPHRASE:?BACKUP_PASSPHRASE is required — refusing to write an unencrypted dump}"

mkdir -p "$BACKUP_DIR"
OUT="$BACKUP_DIR/apex-${LABEL}-${STAMP}.sql.gz.enc"


echo "Dumping database → $OUT"
run_pg_dump --no-owner --no-privileges "$PG_URL" \
  | gzip -9 \
  | openssl enc -aes-256-cbc -pbkdf2 -iter 200000 -salt -pass env:BACKUP_PASSPHRASE \
  > "$OUT"

SIZE=$(du -h "$OUT" | cut -f1)
echo "Wrote $SIZE"

# A zero-byte or absurdly small dump means the pipeline failed silently.
MIN_BYTES="${APEX_BACKUP_MIN_BYTES:-4096}"
ACTUAL=$(stat -c%s "$OUT")
if [ "$ACTUAL" -lt "$MIN_BYTES" ]; then
  echo "ERROR: backup is only ${ACTUAL} bytes — treating as a failed dump." >&2
  rm -f "$OUT"
  exit 1
fi

if [ -n "${APEX_BACKUP_REMOTE:-}" ]; then
  echo "Copying to $APEX_BACKUP_REMOTE"
  rsync -a --partial "$OUT" "$APEX_BACKUP_REMOTE/"
fi

echo "Pruning local backups older than ${KEEP_DAYS} days"
find "$BACKUP_DIR" -name 'apex-*.sql.gz.enc' -mtime "+${KEEP_DAYS}" -delete

echo "Done. Restore with: infra/scripts/restore-db.sh $OUT"
