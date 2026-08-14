# Cutover — moving the four marketing sites onto the monorepo build

The four public marketing sites are still served by the pre-migration apps in
`~/Desktop/*`, running under PM2 as `sibling-group`, `sibling-holdings`,
`sibling-outsourcing` and `sibling-tours` (Next 14). The fixed builds live in
this repository and are declared in `infra/ecosystem.config.cjs` as
`apex-group`, `apex-holdings`, `apex-outsourcing` and `apex-tours` (Next 15).

Everything below has been verified locally against the new builds on dedicated
test ports (4900-4903). What remains is swapping which process owns each
production port. The Cloudflare tunnels never move.

| Site        | Tunnel host                          | Port | Sibling process       | New process        |
| ----------- | ------------------------------------ | ---- | --------------------- | ------------------ |
| Outsourcing | `outsourcing.apexgroupcompanies.com` | 3100 | `sibling-outsourcing` | `apex-outsourcing` |
| Tours       | `tours.apexgroupcompanies.com`       | 3001 | `sibling-tours`       | `apex-tours`       |
| Holdings    | `holdings.apexgroupcompanies.com`    | 3102 | `sibling-holdings`    | `apex-holdings`    |
| Group       | `apex.apexgroupcompanies.com`        | 3103 | `sibling-group`       | `apex-group`       |

## Before starting

```bash
cd ~/Desktop/APEX\ GLOBAL
git pull --ff-only origin main
pnpm install --frozen-lockfile
pnpm build                       # all six apps
```

## One site at a time

Do these in the order listed above — Outsourcing first, because it is the
smallest surface, and Group last, because it links to the other three. Soak
each one before starting the next.

```bash
SITE=outsourcing                 # then tours, holdings, group
PROC=apex-$SITE

# 1. Stop the old process. Stopped, NOT deleted: this is the rollback.
pm2 stop sibling-$SITE

# 2. Start the new one. The port is pinned in the ecosystem file.
pm2 start infra/ecosystem.config.cjs --only $PROC

# 3. Loopback first, before trusting the tunnel.
sleep 10
PORT=$(node -e "console.log(require('./infra/ecosystem.config.cjs').apps.find(a=>a.name==='$PROC').env.PORT)")
curl -sf -o /dev/null -w 'loopback %{http_code}\n' "http://127.0.0.1:$PORT/"

# 4. Then the public hostname, through the tunnel.
curl -sf -o /dev/null -w 'public %{http_code}\n' "https://$SITE.apexgroupcompanies.com/"
```

### Confirm the fixes actually landed

Each of these returns the _broken_ result on the old build, so they double as
proof the cutover took effect.

```bash
# Legal pages that used to 404 (Outsourcing)
curl -s -o /dev/null -w '/privacy %{http_code}\n'  https://outsourcing.apexgroupcompanies.com/privacy
curl -s -o /dev/null -w '/terms %{http_code}\n'    https://outsourcing.apexgroupcompanies.com/terms
curl -s -o /dev/null -w '/security %{http_code}\n' https://outsourcing.apexgroupcompanies.com/security
curl -s -o /dev/null -w '/cookies %{http_code}\n'  https://outsourcing.apexgroupcompanies.com/cookies

# Legal pages that used to 404 (Holdings)
for p in privacy terms cookies disclaimer; do
  curl -s -o /dev/null -w "/legal/$p %{http_code}\n" "https://holdings.apexgroupcompanies.com/legal/$p"
done

# Canonical must name the site itself, never tech.apexgroupcompanies.com
for h in apex tours holdings outsourcing; do
  printf '%-12s ' "$h"
  curl -s "https://$h.apexgroupcompanies.com/" | grep -o 'rel="canonical" href="[^"]*"' | head -1
done

# The placeholder domain must be gone from Group entirely
curl -s https://apex.apexgroupcompanies.com/sitemap.xml | grep -c apexgroup.example   # expect 0

# Sites that had no sitemap or robots at all
curl -s -o /dev/null -w 'tours sitemap %{http_code}\n'    https://tours.apexgroupcompanies.com/sitemap.xml
curl -s -o /dev/null -w 'holdings sitemap %{http_code}\n' https://holdings.apexgroupcompanies.com/sitemap.xml
```

Then run the suite against the live hosts rather than loopback:

```bash
pnpm exec playwright test tests/e2e/surfaces/reachability.spec.ts
```

### Persist, once all four are green

```bash
pm2 save
```

## Rollback

Per site, and immediate — the old process is stopped, not deleted, so its build
is still on disk:

```bash
pm2 stop apex-$SITE
pm2 start sibling-$SITE
```

Keep the `sibling-*` processes and the `~/Desktop` directories for at least
seven days. Archive rather than delete after that.

## Two things that still need a person

Neither blocks the cutover; both are values only Apex can supply.

1. **`org.whatsapp` in the console Settings page.** The number
   `923066422442` is compiled into `@apex/site-kit/brand` and is live on the
   sites, but the database row is empty, so the Tech site and the four
   marketing sites currently disagree. Set it to match.

2. **Contact email.** Published addresses were removed rather than corrected:
   per `infra/MAIL.md` the only mailboxes that exist are
   `@cloud.apexgroupcompanies.com`, and outbound delivery has never succeeded.
   Every site now routes to its contact form, which reaches the CRM. If Apex
   wants a published address, create the mailbox first and confirm it both
   receives and sends before putting it on a page.
