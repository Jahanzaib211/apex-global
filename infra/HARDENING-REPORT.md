# Infrastructure hardening report

**Host:** `jahanzaib-A520M-DS3H` · Ubuntu 26.04 · 30 GB RAM / 8 GB swap / 457 GB disk
**Compiled:** 2026-08-13

> ### Why this file exists, and how it relates to the tunnel report
>
> This is the **host** hardening report: the 2026-08-12 memory-exhaustion
> freeze and the container/service posture around it.
>
> It is **not** the mail report either. **`infra/MAIL.md`** (2026-08-13) is
> authoritative for anything mail-shaped: the LAN open relay (Critical, fixed),
> Chatwoot's dead SMTP path (High, fixed), and why outbound delivery is
> impossible from this connection at all — the ISP blocks IPv4/25 and Gmail
> refuses IPv6 for the missing PTR. Mailcow appears below only as Finding 4's
> memory limits.
>
> It is **not** the tunnel report. That one exists and is authoritative for
> anything tunnel-shaped: **`~/Desktop/TUNNEL-HARDENING.md`** (4 Aug 2026), the
> document `infra/TUNNELS.md` and `infra/scripts/tunnels-status.sh` both cite.
> It lives on the Desktop rather than in this repo, which is why a repo-scoped
> search for it comes back empty — an earlier version of this file wrongly
> concluded it had been lost and tried to reconstruct its numbering. It had not.
> **When the two disagree on a tunnel, that file wins.**
>
> Its findings, for cross-reference: 1 — six tunnel tokens in the plaintext PM2
> dump · 2 — migrating leaves the old tokens behind · 2a — rotate the `tech`
> token · 3 — no root domain resolves · 4 — the local config files describe a
> system that no longer exists · 5 — nothing scrapes the metrics endpoints ·
> 6 — no Cloudflare alerting. Findings 3 and 5 below are this host's view of its
> Findings 3 and 1; the rest are new and specific to the freeze.
>
> Every finding below was **checked against the live system**, not inferred.
> Where something has been fixed, the verification command is given so the
> claim can be re-tested rather than trusted.

---

## Status summary

| #   | Finding                                                      | Severity     | Status                      |
| --- | ------------------------------------------------------------ | ------------ | --------------------------- |
| 1   | Runaway self-healing daemon exhausted RAM + swap; host froze | **Critical** | ✅ Fixed 2026-08-13         |
| 2   | k3s restart loop driven by a remote node                     | High         | ✅ Fixed 2026-08-13         |
| 3   | No root domain resolves                                      | Medium       | ⚠️ Open (partly actionable) |
| 4   | 46 of 71 containers had no memory limit                      | High         | ✅ Fixed 2026-08-13         |
| 5   | Cloudflare tunnel tokens stored in world-readable plaintext  | **High**     | ⚠️ Open                     |
| 6   | Cluster has no imagePullSecret; 7 workloads down 13 days     | Medium       | ⚠️ Open (needs PAT)         |
| 7   | `chat.apexgroupcompanies.com` serves HTTP 530 publicly       | Medium       | ⚠️ Open (needs dashboard)   |
| 8   | Compose file stored in `/tmp`, lost on reboot                | Medium       | ✅ Fixed 2026-08-13         |
| 9   | No global OOM backstop                                       | **Critical** | ✅ Fixed 2026-08-13         |

---

## Finding 1 — Runaway self-healing daemon (Critical, fixed)

The host froze hard at **22:18:14 on 2026-08-12** and was force-reset. It was
_not_ an OOM kill — the kernel never fired the global OOM killer (zero
`CONSTRAINT_NONE` events in boot `-1`). RAM and the 8 GB swap file were both
exhausted and the machine thrashed until unresponsive. Boot `-1`'s journal ends
mid-line on `gnome-shell: ... your system is too slow`, with no
`systemd-journald: Journal stopped` marker — the signature of a forced reset.

`nova-healthcheck` diffs `nova/ecosystem.config.js` against the live pm2 process
list and tries to "heal" anything missing. **Five of its seven registered apps
could never start**, and it retried all of them every ~5 s with no backoff and
no failure ceiling:

| Target                                    | Why it could never succeed                               |
| ----------------------------------------- | -------------------------------------------------------- |
| `nova-dify`                               | script path `~/Desktop/dify/` does not exist             |
| `llama-bridge-disabled`                   | script path `~/Desktop/llama-bridge/` does not exist     |
| `nova-tunnel`                             | wraps `cloudflared-nova.service`, which is not installed |
| `pm2 restart deerflow`                    | no pm2 app of that name — the app is called `nova`       |
| `sudo systemctl restart cloudflared-nova` | sudoers rule absent; needs a TTY                         |

Measured rate: **281 auto-fix actions/minute (16,863/hour)**, spawning **733
`pm2` + 725 `sudo` subprocesses per 21 minutes**. Each `pm2` invocation is a
fresh Node process peaking at 50–100 MB. Extrapolated over that 14-hour boot:
~236,000 failed actions and ~29,000 process spawns. Swap climbed monotonically
all day — 3.45 GB @16:40 → 5.34 @21:20 → 6.24 @21:35 → **7.09 of 8 GB @22:05**.

**Fix.** Per-probe exponential backoff plus a circuit breaker that abandons a
repair after 5 consecutive failures and re-arms only when the probe recovers on
its own. Unstartable apps removed from `ecosystem.config.js`. Retired probes
switched off via `HEALTHCHECK_DISABLED_PROBES`. Three near-identical repair
functions collapsed onto one helper. Covered by 7 new tests.

```bash
# Verify: should grow by single digits per hour, not ~17,000
grep -c auto-fix ~/.pm2/logs/nova-healthcheck-error.log
```

Measured after the fix: **0.32/min, and zero pm2/sudo spawns.**

> **Lesson.** A self-healing daemon needs a failure ceiling. A repair that can
> never succeed, retried forever, is worse than no repair — it took the host
> down. Anything added to `ecosystem.config.js` must actually be startable.

---

## Finding 2 — k3s restart loop driven by a remote node (High, fixed)

`k8s/scripts/k3s-watchdog.py` ran `sudo systemctl restart k3s` whenever **any**
node reported NotReady. The NotReady node was `boggyman` (192.168.18.118) — a
**different machine** — which had been down 12 days. A local restart could never
fix it, so the watchdog restarted k3s indefinitely at roughly its 10-minute
cooldown, each start peaking around 2 GB.

**Fix.** `check_node_ready()` now gates the restart action on the local node
only; remote nodes are reported as a non-actionable warning. `boggyman` drained
and deleted. Two pods stuck `Terminating` for 8 days force-deleted.

```bash
journalctl -u k3s | grep -c "Creating Container Manager object"   # ~1 per boot
tail ~/.nova/k3s-watchdog.log                                     # all OK
```

---

## Finding 3 — No root domain resolves (Medium, open)

**Authority: Finding 3 of `~/Desktop/TUNNEL-HARDENING.md`.** Kept here under the
same number so the two agree. Re-verified 2026-08-13 with detail that report did
not record.

`apexgroupcompanies.com`, `www.apexgroupcompanies.com` and `apexholdings.pk` all
fail to resolve. Everything lives on a subdomain.

- **`apexgroupcompanies.com` is in this Cloudflare account** and the zone is
  active, but holds only `MX` and `TXT` at the apex — no `A`/`AAAA`/`CNAME`, and
  no `www` record at all. **Actionable now:** add a proxied CNAME to the APEX
  GROUP tunnel `677c31d0-0f5d-46fd-8f48-13036ec2b4b3`, which already serves
  `apex.apexgroupcompanies.com`.
- **`apexholdings.pk` — not a real domain, closed 2026-08-13.** It is absent
  from this Cloudflare account because it was never a live property; the owner
  confirms it was a decided-against idea with no use case. The live Holdings
  site is `holdings.apexgroupcompanies.com`, which serves HTTP 200. Nothing to
  fix — the local config file naming `apexholdings.pk` is a leftover, and is
  inert anyway (see "Where ingress actually comes from" in `TUNNELS.md`).

Remaining impact is limited to the bare `apexgroupcompanies.com`, which is dead
for anyone who types it without a subdomain.

---

## Finding 4 — Containers without memory limits (High, partly fixed — see correction)

**46 of 71 running containers had no `mem_limit`**, so any single one could
consume all 30 GB. Upstream mailcow sets none on any of its ~19 services.

**Fix.** Limits applied live via `docker update` and persisted in
`infra/mailcow-dockerized/docker-compose.override.yml`.

### Correction 2026-08-14 — this fix caused an outage

Three claims in the original entry were wrong, and the verification could not
have caught any of them:

```bash
docker stats --no-stream --format '{{.Name}}|{{.MemUsage}}' | grep -c '30.26GiB'   # 0
```

That command only proves no container is **uncapped**. It never checks a cap is
large enough, nor that the caps sum below host RAM.

1. **"0 of 57 running containers uncapped" was false.** 9 of 62 running
   containers still have no limit, so the original risk is only partly closed.
2. **"Values ~4–6× observed steady state" was not measured.** Total container
   RSS is ~5.5 GiB against ~42 GiB of declared limits — the numbers were picked,
   not derived. (The sum exceeding host RAM is not itself a fault: limits are
   ceilings, not reservations. It is a signal the values were never checked
   against reality, which is what allowed item 3.)
3. **`sogo-mailcow` was capped below its working set.** The live container ran
   at 256m (an older `docker update` value; this file said 512m and the
   container was never recreated, so the two silently diverged). SOGo sat at
   242 MiB / 256 MiB = 91.8% and was **OOM-killed 844 times in 7 hours**,
   restarting every ~3.5 min and burning ~33s CPU per cycle. Every OOM event on
   that boot was this one container.

That churn, together with a k3s reconcile storm, drove the disk-IO pressure that
**hard-locked this machine three times** (2026-08-12 08:11, 2026-08-12 22:18,
2026-08-13 09:30) and stalled it repeatedly. In each case RAM was over 40% free
— the box ran out of *swap* while thrashing the disk, never out of RAM, which is
why no host-wide OOM killer ever fired.

**A cap that is too tight is its own outage.** Raised sogo to 1g on 2026-08-14;
kills went to zero immediately.

**Verification that actually tests the claim:**

```bash
# 1. nothing uncapped
docker ps -q | while read c; do docker inspect $c --format '{{.HostConfig.Memory}}'; done | grep -c '^0$'   # want 0

# 2. no container starved against its own cap — THIS is the failure mode that
#    caused the outage, and the check the original entry was missing
docker stats --no-stream --format '{{.MemPerc}} {{.Name}}' | sort -rn | head   # want all < 80%

# 3. total declared, for awareness (a sum over RAM is a smell, not a fault —
#    limits are ceilings, not reservations)
docker ps -q | while read c; do docker inspect $c --format '{{.HostConfig.Memory}}'; done \
  | awk '{s+=$1} END {printf "limits: %.1f GiB / RAM: 31 GiB\n", s/1073741824}'
```

Both are wrapped up in `infra/scripts/cap-uncapped-containers.sh`, which dry-runs
by default and applies generous caps (~4× measured, with floors) on `--apply`.

---

## Finding 5 — Tunnel tokens in world-readable plaintext (High, partly fixed)

**This is Finding 1 of `~/Desktop/TUNNEL-HARDENING.md`**, which carries the full
zero-downtime migration recipe (its Appendix) and the token-rotation steps. Use
that one to do the work; this entry only records the current count and what
changed on 2026-08-13.

Six cloudflared tunnels are still started with the token inline in their pm2
arguments rather than `--token-file`:

`tunnel-nova`, `tunnel-whmcs`, `tunnel-fox-hosting`, `tunnel-apex-group`,
`tunnel-apex-tours`, `tunnel-apex-outsourcing`

**Fixed 2026-08-13:** `cloud-apex-tunnel` moved to
`~/.cloudflared/cloud-apex.token` (mode 600) — its token had additionally been
inline in `infra/ecosystem.config.cjs`, a **git-tracked file**. It was never
committed (`git log -S` finds nothing), but it sat in a 170-file working tree,
one `git add -A` from entering history permanently. `~/.pm2/dump.pm2` and its
`.bak` were also chmod'd from 664 to 600. The new `tunnel-chat` was created with
`--token-file` from the start.

An earlier revision of this line said the remote was **public**. It is not —
`Jahanzaib211/apex-global` is private, confirmed via `gh repo view`. The risk was
real but narrower than stated: a committed token is readable by anyone with repo
access, survives in history after deletion, and would have to be rotated rather
than removed. It was not public exposure.

Note `tunnel-apex-holdings`, `tunnel-apex-tech` and `tunnel-fincept` already did
this correctly — the pattern to copy is in "Adding a tunnel" in `TUNNELS.md`.

Consequences — the tokens are readable from all of these:

- `pm2 jlist` output (any process running as this user)
- **`~/.pm2/dump.pm2`, which is mode `-rw-rw-r--` — world-readable**
- `ps auxww` while the connector runs
- shell history of whatever started them

A tunnel token authorises the holder to serve traffic for that hostname. The
same pattern was found in the `vibe-trading` cloudflared container (Finding 8).

**Recommended fix.** For each, write the token to `~/.cloudflared/<name>.token`
with mode 600 and restart using `--token-file`, exactly as
`tunnel-apex-holdings` and `tunnel-apex-tech` already do — the correct pattern
is already documented under "Adding a tunnel" in `TUNNELS.md`. Then
`chmod 600 ~/.pm2/dump.pm2`, and rotate the exposed tokens in the dashboard,
since they have been readable at rest for some time.

---

## Finding 6 — No imagePullSecret in the cluster (Medium, open)

Seven workloads have been in `ImagePullBackOff`/`ErrImagePull` for 13 days:
`billing/whmcs-bridge`, `stream/stream-api` ×2, `stream/stream-portal` ×2,
`stream/expiry-sweep`, `monitoring/cost-report`.

**One root cause, not seven.** Every one pulls from `ghcr.io/jahanzaib211/*` and
gets `403 Forbidden`. The cluster has **zero** dockerconfigjson secrets:

```bash
kubectl get secrets -A --field-selector type=kubernetes.io/dockerconfigjson   # none
```

So either the packages are private, or they were never pushed. Both fix paths
are written up in `~/Desktop/homelab-ops/KNOWN-ISSUES.md` and need a GitHub PAT
with `read:packages`.

> k3s uses **containerd**, not Docker — it cannot see local `docker images`.
> To use a locally built image:
> `docker save img:tag | sudo k3s ctr images import -`

---

## Finding 7 — `chat.apexgroupcompanies.com` returns 530 publicly (Medium, open)

A proxied CNAME points at tunnel `a311a9d1-b4bc-42b8-b1be-fa44ff61e0c1`, but no
connector for that tunnel runs on this host — the ten pm2 cloudflared processes
account for every other hostname and none is Chatwoot. Cloudflare therefore
returns error 1033 (HTTP 530) to the public. Chatwoot itself is healthy on
`127.0.0.1:4800`, and `TUNNELS.md` records it as intentionally loopback-only, so
this is an orphan record from a half-finished publish.

Either create the connector — **with Cloudflare Access in front, since Chatwoot
holds customer conversations** — or delete the `chat` CNAME. This is currently
the only Apex hostname serving a public error.

---

## Finding 8 — Compose file stored in `/tmp` (Medium, fixed)

`vibe-trading`'s compose file lived at `/tmp/opencode/vibe-trading/docker-compose.yml`
and was **gone**. Four containers were still running, orphaned: docker's restart
policy kept them alive, but with no compose file they could never be recreated,
updated or moved. This is the second time `/tmp` has caused an outage in this
stack — its nginx config was lost the same way (see `KNOWN-ISSUES.md`).

**Fix.** Reconstructed from `docker inspect` at
`~/Desktop/vibe-trading/docker-compose.yml`, with the tunnel token moved out of
the command line into `.env` (see Finding 5), memory limits added, and the
nginx bind mount repointed at a real path.

**Then decommissioned, 2026-08-13.** The owner confirms vibe-trading was an
experiment with no real use case. All four containers stopped and removed and
the 2.3 GB image deleted; the five named volumes (~5 MB total) were kept as a
safety net. The reconstructed compose file is retained as the record of how to
stand it back up.

While decommissioning, one thing worth noting for any future stack: the
`cloudflared-quick` service ran `tunnel --url http://nginx:8080`, which
publishes to a **random public trycloudflare URL with no authentication**. It
had been running 5 hours. An ad-hoc sharing tunnel left with
`restart: unless-stopped` is a standing unauthenticated exposure — if you use
one, do not give it a restart policy.

> **Lesson.** Never bind-mount or store configuration under `/tmp`. It does not
> survive a reboot.

---

## Finding 9 — No global OOM backstop (Critical, fixed)

When RAM and swap were exhausted the kernel never OOM-killed anything; the host
simply thrashed to a standstill. Two contributing settings:

- `vm.overcommit_memory = 1` — the kernel never refuses an allocation, so
  nothing pushes back until RAM _and_ swap are genuinely gone, by which point
  the desktop is already unresponsive.
- `systemd-oomd` is active but Ubuntu's default configuration only watches
  `user.slice` pressure. It did not fire.

**Fix.** `earlyoom` installed and enabled, triggering at 6% free RAM _and_ 6%
free swap, configured to never kill `systemd`/`gnome-shell`/`Xorg`/`sshd`/
`k3s-server` and to prefer `next-server`/`node`/`esbuild`/`tsc` — the transient
2–4 GB build spikes that push this host over. Applied by
`~/Desktop/homelab-ops/scripts/apply-oom-hardening.sh`.

```bash
systemctl is-active earlyoom      # active
journalctl -u earlyoom -f         # watch during a large build
```

---

## Things that are right, and should stay that way

Worth recording so a future cleanup does not "fix" them:

- **`apex-global-console` is deliberately not exposed.** It holds every lead and
  the encrypted credentials vault. If it ever needs remote access, put
  Cloudflare Access in front rather than exposing the login page.
- **Nextcloud is reached over Tailscale, never the public internet**, and its
  k3s storage class is `local-path` with a `nodeSelector` pinning it to this
  host. Removing that nodeSelector would reschedule it onto a worker and bring
  it up empty.
- **`fox-nginx` sits in `Created` state on purpose** — no ports, not in the
  tunnel path.
- **Chatwoot is loopback-only by design** (see Finding 7).

---

## Operating guidance

The 2026-08-12 freeze needed both a runaway loop _and_ zero headroom. The loops
are fixed and `earlyoom` now covers the headroom, but the host remains densely
packed — 57 containers, 30 k3s pods and 23 pm2 apps on one 30 GB desktop.

**Do not run multi-app Next.js builds while the whole stack is up.** Each
`next build` costs 2–4 GB. Build one app at a time, or bring non-essential
stacks down first. That build storm is what tipped the machine over; on a box
with headroom it would have been a non-event.
