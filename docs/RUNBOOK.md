# Runbook

## First-time setup

```bash
cp .env.example .env          # fill in the required values (see below)
pnpm install
pnpm services:up              # postgres, redis, minio, meilisearch
pnpm db:migrate
pnpm db:seed
pnpm dev                      # web :4300 · console :4301
```

Values you must generate before anything will start:

```bash
openssl rand -base64 32       # AUTH_SECRET
openssl rand -hex 32          # ENCRYPTION_KEY (AES-256-GCM, integrations vault)
```

`POSTGRES_PASSWORD`, `S3_SECRET_KEY` and `MEILI_MASTER_KEY` have no defaults on purpose — compose
refuses to start without them.

## Everyday commands

| Task | Command |
|---|---|
| Run everything | `pnpm dev` |
| Typecheck | `pnpm typecheck` |
| Lint | `pnpm lint` |
| Unit tests | `pnpm test` |
| End-to-end | `pnpm test:e2e` |
| Credibility audit | `pnpm audit:credibility` |
| Smoke test services | `pnpm smoke` |
| Inspect the database | `pnpm db:studio` |
| Stop services | `pnpm services:down` |

## Deploying

**Staging** — merging to `main` builds and deploys to the homelab. Verify there before promoting;
this is also where a migration's rollback path gets tested.

**Production** — tag a release (`vX.Y.Z`). CI builds images, runs migrations forward, deploys to the
VPS, then runs the smoke test against the live URL. If the smoke test fails, the previous image is
still running: nothing swaps until health checks pass.

## When something breaks

| Symptom | First check |
|---|---|
| Site returns 5xx | `docker compose -f infra/docker-compose.yml ps` — is postgres healthy? |
| Forms accept but no lead appears | Redis reachable? BullMQ worker running? Check the dead-letter queue |
| Published content not visible | Revalidation failed — republish, or check the ISR webhook logs |
| Console login fails | `AUTH_SECRET` changed, or clock skew breaking TOTP |
| Media 404s | MinIO bucket policy, or `S3_PUBLIC_URL` pointing at the wrong host |
| AI features error | Key expired — reconnect in Settings → Integrations and use "Test connection" |

## Backups

Nightly: `pg_dump` of the database, plus a MinIO sync, both encrypted before leaving the host and
written offsite.

**A backup that has never been restored is not a backup.** Restore into a scratch database quarterly
and confirm the row counts and the most recent lead. Record the date in this file when you do.

```bash
BACKUP_PASSPHRASE=... ./infra/scripts/backup-db.sh nightly
BACKUP_PASSPHRASE=... ./infra/scripts/restore-db.sh .backups/apex-nightly-<stamp>.sql.gz.enc
```

The restore script never touches the live database — it recreates a scratch one, restores into that,
and prints row counts plus the most recent lead so you can see the data actually came back.

| Restore drill | Date | Result |
|---|---|---|
| Initial (development database) | 2026-08-04 | Passed — 4 leads, 9 solutions, 2 case studies, 3 products, 1 user restored. Surfaced a stale draft product left behind by a slug rename; the seed now reports orphans. |
| _(next: production, before the first campaign)_ | | |

## Rotating a secret

1. Generate the new value.
2. Update it in the deployment environment (not in the repo).
3. Restart the affected service.
4. For `ENCRYPTION_KEY`, run the re-encryption task **before** retiring the old key — integration
   secrets are encrypted with it and become unreadable otherwise.
5. Record the rotation in the audit log.
