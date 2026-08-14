# Mail report — Mailcow, delivery, and why nothing left the building

**Host:** `jahanzaib-A520M-DS3H` · Ubuntu 26.04
**Stack:** `infra/mailcow-dockerized/` · `MAILCOW_HOSTNAME=cloud.apexgroupcompanies.com`
**Compiled:** 2026-08-13

> ### Why this file exists, and how it relates to the other two reports
>
> This is the **mail** report. `HARDENING-REPORT.md` is the host report and
> `TUNNELS.md` (with `~/Desktop/TUNNEL-HARDENING.md` behind it) is authoritative
> for anything tunnel-shaped. This file is authoritative for anything
> mail-shaped, and it is the answer to _"why does Nova say a reset link was sent
> when nothing arrives?"_
>
> Where the three overlap they are cross-referenced rather than duplicated. The
> public exposure of the Mailcow admin UI (Finding 5 here) is the same class of
> issue as Chatwoot's in `TUNNELS.md`.
>
> Every finding below was **measured against the live system**, not inferred.
> Verification commands are given so claims can be re-tested rather than
> trusted. Two long-standing claims turned out to be false; they are recorded in
> _Corrections_ at the bottom rather than quietly dropped.

---

## Status summary

| #   | Finding                                                                 | Severity     | Status                              |
| --- | ----------------------------------------------------------------------- | ------------ | ----------------------------------- |
| 1   | Unauthenticated open relay for the entire home LAN                      | **Critical** | ✅ Fixed 2026-08-13                 |
| 2   | Chatwoot mail completely dead — `SMTP_ADDRESS` unreachable from its net | **High**     | ✅ Fixed 2026-08-13                 |
| 3   | Outbound delivery impossible — ISP blocks IPv4/25, no PTR for IPv6      | **High**     | ⛔ Not fixable on this machine      |
| 4   | Inbound impossible — MX malformed, and its target is an HTTP tunnel     | Medium       | ⚠️ Open (needs a decision)          |
| 5   | Mailcow admin UI + SOGo published to the public internet                | Medium       | ⚠️ Open                             |
| 6   | SPF absent on the sending domain, under a strict DMARC policy           | Medium       | ⏸ Deferred until Finding 3 resolves |

**The headline: `status=sent` has never been anything but zero.** Not one
message has ever been delivered from this host. Mailcow is not at fault — it
accepts, queues, and correctly reports what happens next. The wall is the ISP's.

---

## Finding 1 — Unauthenticated open relay for the whole LAN (Critical, fixed)

`mynetworks` had been widened to include `192.168.0.0/16`. That is this
machine's own home LAN (the box is `192.168.18.23`), and Postfix binds
`0.0.0.0` on 25/465/587 with Docker publishing all three on every interface.

**Any device on the wifi could send mail as `apexgroupcompanies.com` with no
authentication.** This was proven, not assumed — from a LAN source address,
with no credentials:

```
MAIL FROM: <ceo@apexgroupcompanies.com>  ->  250 2.1.0 Ok
RCPT TO:   <someone@gmail.com>           ->  250 2.1.5 Ok      # external!
```

That is the exact shape of abuse that gets a domain onto a blocklist, and it
would have been attributed to Apex.

**Fix.** Narrowed to localhost plus Mailcow's own network:

```
mynetworks = 127.0.0.0/8 [::1]/128 172.31.1.0/24
```

Three details worth keeping:

- **It is narrower than the obvious fix.** The stated intent was "let Docker
  containers relay", implemented as `172.16.0.0/12` — which trusts _every_
  container on the host, not just Mailcow's. `IPV4_NETWORK=172.31.1` and all 18
  `mailcow-*` containers sit on `172.31.1.0/24`, so that is what is trusted.
- **The old `172.22.1.0/24` entry was stale** and matched nothing;
  `172.16.0.0/12` had been silently doing that job. Removing the /12 without
  adding `172.31.1.0/24` would have broken Mailcow's internals.
- **It lives in `extra.cf`, not `main.cf`.** `postfix.sh` truncates `main.cf` at
  the `# Overrides #` marker on every container start and re-appends `extra.cf`,
  so the previous value (written by `postconf -e`) would have silently reverted
  on the next restart. Accidental safety is not safety.

**Verify** — the first must be refused, the rest must still work:

```bash
# 1. external relay from the LAN, unauthenticated -> expect 454 Relay access denied
# 2. localhost submission (Nova / APEX GLOBAL)     -> expect 250
# 3. inbound to a local mailbox                    -> expect 250
# 4. mailcow-internal 172.31.1.x                   -> expect 250
docker exec mailcowdockerized-postfix-mailcow-1 postconf -h mynetworks
grep '^mynetworks' infra/mailcow-dockerized/data/conf/postfix/extra.cf
```

All four were re-verified after the change.

---

## Finding 2 — Chatwoot's mail was completely dead (High, fixed)

`CHATWOOT_SMTP_ADDRESS=127.0.0.1`, but `chatwoot-web` and `chatwoot-sidekiq` run
on the `apex-chatwoot_default` **bridge network**, not host networking. Inside
those containers `127.0.0.1` is the container itself, so every send died with
`Connection refused`. Silently, and forever.

```
chatwoot-web -> 127.0.0.1:587    Connection refused
chatwoot-web -> 172.24.0.1:587   220 cloud.apexgroupcompanies.com ESMTP Postcow
```

**Fix.** `.env:56` → `CHATWOOT_SMTP_ADDRESS=172.24.0.1` (the bridge gateway,
i.e. the host). Credentials were verified to authenticate against Mailcow before
the change, then the app tier was recreated. Chatwoot deliberately sits
_outside_ `mynetworks`, so it authenticates rather than receiving unauthenticated
relay.

`chatwoot-smtp` stays retired — it was a redundant second Postfix, and its own
compose comment ("the docker bridge NAT blocks outbound 25 from this host") was
an early, half-right brush with Finding 3.

**Caveat.** If the `apex-chatwoot_default` network is ever deleted and
recreated, Docker may assign a different gateway. Re-check with:

```bash
docker inspect chatwoot-web --format '{{range .NetworkSettings.Networks}}{{.Gateway}}{{end}}'
```

---

## Finding 3 — Outbound delivery is impossible from this connection (High, not fixable here)

Two independent routes exist to the internet on port 25. Both are closed, and
**both blockers belong to the ISP.**

| Route         | Result                                                                                                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **IPv4 : 25** | **Blocked by the ISP.** Gmail, Outlook, Hotmail, Yandex and iCloud MX all time out. 587/465 connect fine, and there is no local `iptables`/`ufw` rule — so it is not this host. |
| **IPv6 : 25** | **Reachable, but refused.** Real `220 mx.google.com` banners, full transaction accepted through `RCPT`, then rejected at `DATA`.                                                |

The IPv6 rejection, in Gmail's own words:

```
550 5.7.1 [2400:adc5:18a:8800::3] Gmail has detected that this message does not
5.7.1 meet IPv6 sending guidelines regarding PTR records and authentication
5.7.1 https://support.google.com/mail/?p=IPv6AuthError
```

Supporting facts:

| Fact                      | Value                                                                                |
| ------------------------- | ------------------------------------------------------------------------------------ |
| ISP                       | **AS9541 Cyber Internet Services (Pvt) Ltd** (Cybernet / StormFiber), PK             |
| Public IPv4               | `101.53.238.247` — **Spamhaus PBL** `127.0.0.11`, no PTR                             |
| Public IPv6               | `2400:adc5:18a:8800::/64` from `2400:adc5:180::/42` — no PTR                         |
| IPv6 lease                | `valid_lft` ~21h, `dynamic` — **the address rotates daily**                          |
| Reverse DNS               | `jahanzaib-A520M-DS3H` (an mDNS artifact, not a delegated public PTR)                |
| `cloud.apex…` resolves to | Cloudflare (`104.21.12.214`, `2606:4700:…`) — can never forward-confirm to this host |

**This was tested the cheap way.** Rather than enabling IPv6 inside Mailcow —
which would have meant `ENABLE_IPV6=true`, a ULA/NAT66 or `SNAT6_TO_SOURCE`
workaround, and a full stack recreate — one real message was sent to Gmail
direct from the host, which already has working IPv6. Same answer, **zero
downtime**, no config churn. The Mailcow IPv6 work was therefore never done and
should not be: it would reach this identical wall, and the rotating prefix would
break SPF roughly every 24 hours anyway.

### What would actually fix it

**Option A — a business line from Cybernet.** Ask for three things: a **static
IP**, a **PTR** set to `mail.cloud.apexgroupcompanies.com`, and **outbound
TCP/25 unblocked**. Consumer FTTH gets none of the three; business plans usually
get all three. Once the IP is static, the Spamhaus listing is self-removable —
it is `127.0.0.11`, the Spamhaus-maintained list, which permits self-service
removal (unlike `127.0.0.10`, which only the ISP can lift).

**Option B — your own relay on a small VPS**, joined over WireGuard. Still your
own Postfix, no SaaS, and you control the PTR. It also fixes Finding 4, which
the Cloudflare tunnel fundamentally cannot.

**Option C — a SaaS smarthost.** Fastest, free tier, but external.

**Do not** install BIND or PowerDNS to "create a PTR". Reverse DNS only works if
the address owner delegates the reverse zone to your nameserver, which
residential ISPs do not do. And delegation would not help here regardless, since
the prefix is dynamic — a PTR for an address you no longer hold is worthless.
**Static comes before reverse DNS, always.**

**Verify:**

```bash
docker logs mailcowdockerized-postfix-mailcow-1 2>&1 | grep -c 'status=sent'   # 0 today
docker exec mailcowdockerized-postfix-mailcow-1 postqueue -p
```

---

## Finding 4 — Inbound mail is impossible, two ways (Medium, open)

**The MX target is malformed, on both domains.** Cloudflare stores it as
`mail.cloud`, which resolves as the absolute name `mail.cloud.` and does not
exist. **Nobody can send mail to either domain.** This predates the Mailcow
migration, and it is why `MASTER-CREDENTIALS.md` reading "MX … configured"
looked fine at a glance — a record exists, it simply points nowhere.

**And the intended target is a Cloudflare tunnel.**
`mail.cloud.apexgroupcompanies.com` is a CNAME to `97d3536e-….cfargotunnel.com`
and resolves to proxied Cloudflare IPs. **Tunnels carry HTTP, not SMTP**, so even
with the name corrected, port 25 would never reach Dovecot. For mail this record
must become a plain, grey-cloud `A` pointing at a real IP.

**Send-only is a legitimate choice** — it is all Nova and Chatwoot need, and it
is the cheapest correct answer. It should be recorded as a decision rather than
left as a half-configured MX implying otherwise. Option B in Finding 3 is what
fixes inbound properly.

---

## Finding 5 — The Mailcow admin UI is on the public internet (Medium, open)

`https://cloud.apexgroupcompanies.com/` serves SOGo webmail, `/admin` responds
from outside, and `/SOGo` redirects — all behind their own login only, with **no
Cloudflare Access in front**. This is the same exposure `TUNNELS.md` flags for
Chatwoot, and the same class of reason the console at `127.0.0.1:4301` is
deliberately unpublished.

Compounding it: the superadmin password is written in
`MASTER-CREDENTIALS.md`, which is **git-tracked**.

Worth putting Cloudflare Access in front of it, and moving that credential out
of the repo.

---

## Finding 6 — SPF is absent on the sending domain, under strict DMARC (Medium, deferred)

DNS as actually published:

| Record | `apexgroupcompanies.com`                     | `cloud.apexgroupcompanies.com`  |
| ------ | -------------------------------------------- | ------------------------------- |
| MX     | `10 mail.cloud.` — **broken**                | `10 mail.cloud.` — **broken**   |
| SPF    | `v=spf1 include:_spf.cloudflare.net mx -all` | **absent**                      |
| DMARC  | `p=quarantine; pct=100; adkim=s; aspf=s`     | inherits the parent's policy    |
| DKIM   | —                                            | ✅ `default._domainkey.cloud.…` |

Mail is sent as `noreply@cloud.apexgroupcompanies.com`. **SPF is not inherited
by subdomains, but DMARC falls back to the organisational domain** — so a
`p=quarantine` policy is being enforced against a domain with no SPF to satisfy
it. Alignment is **strict** (`aspf=s`, `adkim=s`), so the parent's SPF record
does not cover the subdomain even loosely. DKIM is correct and aligned.

**Deliberately not published yet:** the record's content is entirely determined
by which option in Finding 3 is chosen, and publishing now would only need
redoing.

### The records to publish once an IP exists

Identical for Option A or B — only the address differs:

```
mail.cloud.apexgroupcompanies.com   A     <static IP>     ← DNS-only, NOT proxied
cloud.apexgroupcompanies.com        MX    10 mail.cloud.apexgroupcompanies.com
apexgroupcompanies.com              MX    10 mail.cloud.apexgroupcompanies.com
cloud.apexgroupcompanies.com        TXT   "v=spf1 ip4:<static IP> -all"
PTR (set by the IP owner)           <static IP> → mail.cloud.apexgroupcompanies.com
```

DKIM already exists and stays. The PTR and the `A` record must **forward-confirm**
— resolve to each other — or Gmail rejects on the same rule as Finding 3.

---

## What is right, and should stay that way

- **The architecture is already correct.** Nova, Chatwoot and APEX GLOBAL all
  submit to Mailcow rather than sending directly. **No application changes are
  needed for any of the options above** — only the last hop moves.
- **Mailcow bundles the whole stack**: Postfix, Dovecot, Rspamd, ClamAV, SOGo,
  nginx, across 18 containers. The gap was never missing software, so no
  additional package fixes it.
- **DKIM signing works**, and mail between the six local mailboxes works today
  with zero external dependency.
- **Mailcow reports honestly.** Every failure in this document was visible in
  `postqueue -p` and the Postfix log the whole time.

## Mailboxes

`admin@` · `noreply@` · `capture@` · `capture2@` · `chatwoot@` · `twenty@` —
all `@cloud.apexgroupcompanies.com`, all active.

---

## Corrections to earlier reporting

- **"MX + SPF + DKIM configured"** (`MASTER-CREDENTIALS.md:109`) — only DKIM was
  true. The MX pointed at a name that does not resolve, and the SPF was on the
  parent domain, not the sending one. That single line is why the mail stack
  looked healthy while delivering nothing. Corrected in place.
- **"Chatwoot is already configured to use Mailcow, so it just works"** — it was
  configured to use an address it could not reach. See Finding 2.
- **"The message leaves the queue / is handed off for delivery"** — nothing has
  ever left. `status=sent` is `0`, with mail queued since 8 August.
- **"`admin@example.com` still carries the test password `NewPassw0rd!2026`"** —
  **not reproduced.** No such mailbox exists, and that password is rejected on
  all six real mailboxes.
- **"Set `inet_protocols = ipv4` to stop dialling IPv6"** — backwards. IPv4/25
  is the blocked path; IPv6 is the only one that reaches Gmail's MX at all. It
  is still refused there, so neither value helps, but the reasoning is worth
  correcting for whoever reads the queue logs next.
