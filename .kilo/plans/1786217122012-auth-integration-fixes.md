# Fix auth & integration blockers (mailcow, Chatwoot reply, Hyperswitch auth)

**Edge-proxy policy:** use **nginx** as the reverse-proxy layer across the stack wherever a proxy is needed (replacing Next.js rewrites / ad-hoc setups). Chatwoot is the concrete case below; apply the same nginx pattern to any other service that needs a public/edge path (e.g. Hyperswitch control center when exposed).

**Out of scope (per user):** OpenWebUI — leave as-is (its e2e test may remain skipped).

## Confirmed root causes

### 1. Mailcow admin login — broken password hash format (DB)

- `verify_hash()` in `mailcow-dockerized` (`/web/inc/functions.inc.php:854`) **requires a `{SCHEME}` prefix** (e.g. `{BLF-CRYPT}`). A raw `$2y$10$…` bcrypt hash does not match the regex, so it falls through to `return false`.
- The `admin` table row for `admin` currently holds a **raw** bcrypt hash (no prefix) → `check_login()` → `admin_login()` returns `false` → POST `/admin/` re-renders the login page (HTTP 200), never redirecting to `/admin/dashboard`.
- Verified: raw hash → `verify_hash` FAIL; `{BLF-CRYPT}`+hash → OK (simulated in php-fpm).
- Redis sessions are fine (php-fpm connects + auths to `redis:6379`); this is purely the hash format.

### 2. Chatwoot agent reply — `/cable` websocket not proxied (nginx)

- Inbox 1 (`Apex Global Live Chat`) is `Channel::WebWidget`. Visitor→agent works over HTTP; **agent→visitor delivery is real-time via ActionCable websocket at `/cable`**.
- Public host `tech.apexgroupcompanies.com` is the **Next.js app** (Cloudflare tunnel → `127.0.0.1:4300`). It only rewrites `/packs/*` and `/widget` to Chatwoot (`127.0.0.1:4800`); `/cable` and `/api/v1/widget` are **not** proxied.
- The **agent dashboard works fine** when reached directly at `http://127.0.0.1:4800/app/accounts/4/dashboard` (local/loopback). The breakage is only the **public visitor widget**: agent replies are pushed over ActionCable at `/cable`, which the public host does not proxy → the visitor never receives them.
- `curl https://tech.apexgroupcompanies.com/cable` → HTTP 404 from Next.js (`x-nextjs-prerender: 1`). Visitor widget can never open the socket → agent replies never arrive.
- `TUNNELS.md` confirms Chatwoot is loopback-only; the widget is served same-origin via Next rewrites.

### 3. Hyperswitch control-center login — `user` feature not compiled (OSS build)

- Running image `juspaydotin/hyperswitch-router:nightly-standalone` (built today) answers **all** `/api/v1/auth/*`, `/user*`, `/auth/user*` with **404** (only `/accounts/login` exists → 400). The compiled binary lacks the `user` feature, so owner login cannot function. The owner row exists in Postgres (`user` / `user_authentication_methods` / `user_roles`, linked to merchant `apex_revenue_1786220515`) but cannot authenticate.
- The existing test only asserts the login _form renders_ (already green); the real blocker is functional auth.

---

## Fixes

### Task 1 — Mailcow password hash (DB fix, deterministic)

Set the hash WITH the required `{BLF-CRYPT}` prefix using mailcow's own hashing:

```bash
HASH=$(docker exec mailcowdockerized-php-fpm-mailcow-1 php -r 'echo password_hash("Apex-Mailcow-Admin!2026", PASSWORD_BCRYPT);')
docker exec mailcowdockerized-mysql-mailcow-1 mysql -umailcow -p'01wrWIYlXNTppEqKeJGQfA18BvbN' mailcow \
  -e "UPDATE admin SET password=CONCAT('{BLF-CRYPT}', '$HASH') WHERE username='admin';"
```

- Keep the test default `Apex-Mailcow-Admin!2026` (already in `MASTER-CREDENTIALS.md`, `signs.spec.ts`, `mailcow-admin.spec.ts`).
- Validate: Playwright `mailcow admin` test passes; or `curl` GET `/admin/` → POST creds → expect 302 to `/admin/dashboard`.

### Task 2 — Chatwoot websocket via nginx (nginx as the stack edge; other apps use it)

Add a `chatwoot-nginx` reverse proxy. Keep the widget same-origin on `tech.apexgroupcompanies.com` → no test/CORS changes. The agent dashboard continues to be used directly at `127.0.0.1:4800` (local/loopback) — only the public visitor widget paths need proxying. This is the reference nginx pattern to reuse for any other service needing an edge path.

`infra/docker-compose.chatwoot.yml` — add service (loopback only):

```yaml
chatwoot-nginx:
  image: nginx:alpine
  container_name: chatwoot-nginx
  ports: ["127.0.0.1:4801:80"]
  volumes: ["./nginx/chatwoot-proxy.conf:/etc/nginx/conf.d/default.conf:ro"]
  restart: unless-stopped
```

`infra/chatwoot/nginx/chatwoot-proxy.conf` (only Chatwoot _widget_ paths; everything else → Next.js so Next `/api` routes are untouched):

```nginx
server {
  listen 80;
  location /cable {
    proxy_pass http://127.0.0.1:4800;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_read_timeout 3600s;
  }
  location /api/v1/widget { proxy_pass http://127.0.0.1:4800; proxy_set_header Host $host; proxy_set_header X-Real-IP $remote_addr; }
  location /packs { proxy_pass http://127.0.0.1:4800; proxy_set_header Host $host; }
  location /widget { proxy_pass http://127.0.0.1:4800; proxy_set_header Host $host; }
  location / { proxy_pass http://127.0.0.1:4300; proxy_set_header Host $host; proxy_set_header X-Real-IP $remote_addr; }
}
```

- **Operational step (Cloudflare dashboard, remotely-managed per TUNNELS.md):** change the `tech.apexgroupcompanies.com` tunnel origin from `127.0.0.1:4300` → `127.0.0.1:4801` (chatwoot-nginx). nginx then splits Chatwoot paths → Chatwoot, rest → Next.js.
- Remove the now-redundant Next.js Chatwoot rewrites (`apps/web/next.config.*` `/packs`, `/widget`) to avoid confusion (optional; nginx handles them).
- `CHATWOOT_FRONTEND_URL` stays `https://tech.apexgroupcompanies.com` (same host). Widget `chatwootUrl` is sourced from site setting `chatwoot.base_url` (see `chat-launcher-gate.tsx:15`) — leave as the tech host.
- Validate: `curl -i https://tech.apexgroupcompanies.com/cable` returns ActionCable response (not 404); open site → start conversation → **agent reply appears in the visitor widget in real time**. `chatwoot-widget.spec.ts` stays green (no host change). Optionally add an agent-reply e2e check.

### Task 3 — Hyperswitch user auth (OSS / first-principles)

Enable the `user` feature in the router so `/api/v1/auth/*` exist:

1. **Try a published feature-inclusive image first** (fast): test `juspaydotin/hyperswitch-router:nightly` or a recent release tag; verify `POST /api/v1/auth/user/login` returns non-404 (e.g. 400/200). If yes, point `infra/docker-compose.hyperswitch.yml` `hyperswitch-router` image there.
2. **Fallback — build from OSS source with the `user` feature** (canonical, per "use OSS"): build `hyperswitch-router` with `--features user` (official Dockerfile supports a build arg), deploy as the `hyperswitch-router` service.

- After enabling: confirm owner login at `http://127.0.0.1:9090/dashboard` with `alilabsx@gmail.com` / `Jatt@1234567`. Re-verify the owner DB rows (`user`, `user_authentication_methods`, `user_roles`, merchant link `apex_revenue_1786220515`); set `is_verified=true` if the CC requires verification.
- Optionally extend the `hyperswitch control center` test to perform a real login (not just assert the form) so the fix is regression-guarded.
- Validate: `curl -X POST /api/v1/auth/user/login` returns 200 with valid creds; CC dashboard shows "Merchants"/"Create a Merchant".

### Task 4 — OpenWebUI: out of scope (per user)

- Skipped per explicit instruction. The `open-webui` e2e test may remain skipped; no further action.

---

## Final validation

- `pnpm exec playwright test --project=surfaces --project=public --project=portal --reporter=list` → **0 failed** (OpenWebUI allowed to remain skipped per user).
- `pnpm lint` and `pnpm typecheck` green.

## Risks / open questions

- **Chatwoot**: the tech tunnel origin change is a Cloudflare **dashboard** operation (remotely managed, per TUNNELS.md) — needs dashboard access; if unavailable, fall back to a dedicated hostname `chat.apexgroupcompanies.com` → `chatwoot-nginx` (also a dashboard step) and update site setting `chatwoot.base_url` + the `chatwoot-widget.spec.ts` host.
- **Hyperswitch**: source build is a heavy Rust compile; prefer a published feature-inclusive image first.
- Confirm exact site-setting store for `chatwoot.base_url` / `chatwoot.token` (loaded by `chat-launcher-gate.tsx`) before editing.
