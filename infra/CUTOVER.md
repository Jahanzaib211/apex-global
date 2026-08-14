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

## If a self-hosted CI job fails on a tool that is obviously installed

Symptom: `turbo: not found`, `prettier: not found`, `vitest: not found` — on a
step whose YAML has not changed, for a commit that builds and tests clean on a
workstation. It looks like a broken workflow. It is not.

Read the install step's own output, near the end:

```
devDependencies: skipped because NODE_ENV is set to production
Packages: +121
```

121 of 768. PM2 defaults a managed process to `NODE_ENV=production`; the
runner is supervised by PM2; the runner passes its environment to every job it
executes. `turbo`, `prettier`, `vitest` and `typescript` are devDependencies,
so the entire pipeline runs against a tree that was never installed.

Two guards are in place, and both should stay:

- Every workflow installs with `--prod=false`, so a build never depends on the
  ambient `NODE_ENV` of whatever supervises its runner.
- `infra/ecosystem.config.cjs` sets `NODE_ENV=development` on the
  `github-runner` entry. It is a supervisor, not a Node application.

To check the live process:

```bash
pid=$(ps -eo pid,args | awk '/Runner\.Listener run/ && !/awk/ {print $1; exit}')
tr '\0' '\n' < /proc/$pid/environ | grep NODE_ENV     # expect: development
```

The general lesson, which cost a session: a self-hosted runner inherits the
environment of whatever starts it. When CI fails on something that cannot
possibly be wrong, compare the job's environment to a working shell before
touching the workflow.

## Do not trust a build directory you did not just produce

A related trap, same session. `apps/web/.next` ended up with prerendered HTML
from one compilation and static chunks from another, so every `/_next/static`
request 404'd, the pages shipped no client JavaScript, and the E2E suite
reported seventeen unrelated "failures" — dead forms, a missing canvas, broken
sign-in. The apps were fine.

Check consistency before believing a test run:

```bash
for a in web console group holdings outsourcing tours; do
  printf '%-12s ' "$a"
  grep -oh 'webpack-[a-f0-9]*\.js' apps/$a/.next/server/app/*.html 2>/dev/null | head -1
  ls apps/$a/.next/static/chunks/webpack-*.js 2>/dev/null | xargs -n1 basename | head -1
done
```

The two hashes must match for every app. If they do not, `rm -rf apps/*/.next`
and rebuild before drawing any conclusion from a failing test.
