# What we fixed, in plain English

_A story version of the August 2026 audit. No jargon. If you want the technical
version, read [AUDIT-REMEDIATION.md](AUDIT-REMEDIATION.md)._

---

## The story

You have five websites. Think of them as five shops on the same street.

**Every shop had a sign in the window that said "we are closed, go next door."**

Not really — but that is what Google was reading. Every single page on four of
the five sites carried a hidden instruction that said *"the real page is the
homepage."* The Umrah packages page said it. The Makkah car rental page said
it. All 31 pages on the Holdings site said it.

Google believes those signs. So it filed away one page per site and quietly
ignored the other ~190. That is why nobody could find you.

**How the sign got there.** Somebody noticed the sites had no such sign at all,
which is also wrong, and added one line to the shared template. Sensible fix.
But in this framework, whatever you put in the shared template gets copied onto
every page underneath it — and the line said "the real page is `/`", which
means the homepage, on every page. One line, ninety pages, four sites.

**The second problem was worse, and stranger.**

Since 16 August, none of your deploys had actually gone live.

Four leftover programs had been sitting on the doors the real servers needed to
come through. Every time the deploy system tried to start a fresh copy of your
site, it found the door blocked, gave up, and tried again — about **1,480
times**. Meanwhile the leftover programs kept serving four-day-old code to
visitors.

So every fix anyone shipped for four days went nowhere. Silently. This is also
why the SEO reports kept saying nothing had improved — they were looking at the
old version.

We cleared the doors, the real servers came up, and everything landed at once.

---

## What is fixed and live right now

Fifteen batches of work. All verified by actually loading the live sites
afterwards, not by trusting that the code was right.

| What was wrong | What it is now |
| --- | --- |
| Every page said "I'm the homepage" | Every page says its own address |
| Holdings had **one** title across all 31 pages | 32 different titles, 32 different descriptions |
| Google couldn't see any Group articles or events | All of them are in the sitemap now |
| Tours had no "rich result" information at all | 28 blocks of it — packages, cities, prices |
| Sharing a link showed a bare grey box | Every site has a proper share picture |
| No security policy on the sites handling money and logins | Full policy on both |
| Two sites paused to download fonts from Google | All fonts now come from your own server |
| Keyboard-only users had to tab through the whole menu on every page | "Skip to content" on every site |
| A 1367-pixel logo was sent to phones for a 44-pixel space | Correctly sized images everywhere |
| Speed and quality checks ran on 1 site out of 7 | They run on all of them, and will fail the build |
| Search Console: not verified | Verified for the whole domain and every subdomain |

Two things we deliberately did **not** publish, because publishing them would
have been worse than leaving them out:

- **Holdings' phone number.** It is `+92 300 0000000` — a placeholder. Feeding
  that to Google puts a fake number in the box that appears next to your name in
  search results.
- **Project prices.** They are ranges like "PKR 2.5 Cr onwards", which the
  price format Google expects cannot honestly represent.

---

## Your list

Six things. Only you can do these — they need your Google account, your
judgement, or real information we do not have.

### 1. Tell Google to come and look — 10 minutes, do this first

Everything above is live, but Google does not know yet. It re-checks on its own
schedule, which can take weeks. You can ask it to come now.

In Search Console → **Sitemaps**, add these five:

```
https://tech.apexgroupcompanies.com/sitemap.xml          55 pages
https://holdings.apexgroupcompanies.com/sitemap.xml      55 pages
https://apex.apexgroupcompanies.com/sitemap.xml          36 pages
https://tours.apexgroupcompanies.com/sitemap.xml         25 pages
https://outsourcing.apexgroupcompanies.com/sitemap.xml   20 pages
```

Then → **URL Inspection** → paste a page → **Request Indexing**.

There is a daily limit of about ten, so spend them well:

- **Day 1:** the five homepages. Each one pulls its own pages along behind it.
- **Day 2:** `tours/umrah-packages`, `tours/hajj-packages`,
  `tours/saudi-car-rental/makkah`, `holdings/projects`, `tech/services`.

Those are the pages the broken sign hurt most, so they have the most to regain.

This step cannot be automated. Google has no button for it outside the website —
we checked. Anyone claiming otherwise is either misusing a private door or
selling you something.

### 2. The "Sample" testimonials — live on your site right now

Holdings' testimonials page credits quotes to **"Developer Partner · Sample"**
and **"Investor · Sample"**. Anyone can read that today.

Made-up reviews are one of the few things Google will penalise a site by hand
for. Either get real quotes with permission to publish the person's name, or
take the section down until you have them. We cannot invent these.

### 3. A real phone number for Holdings

`+92 300 0000000` is on the live site. Give us a real one and we will publish it
properly, including into the box Google shows beside your business name.

### 4. "Map to be added by Apex"

That sentence is visible on the Tours homepage and contact page. Either give us
the map, or say the word and we will hide the block until you have one.

### 5. "Rate on request" is costing you traffic

Every Tours vehicle and transfer page says it. Three things happen because of
that: nobody searching "Umrah package price" finds you, Google has no price to
show, and the pages read as thin to a search engine.

Even "from 45,000 PKR" would fix all three. We need the numbers from you.

### 6. Where should your business documents live?

There are **14 files** in the project folder that are not code — sales decks,
pricing frameworks, financial planning and **client invoices**.

They should not live in a code repository, where anyone who gets a copy of the
project also gets your invoices. Tell us where to move them — a Drive folder, a
Documents folder, anywhere — and we will move them and check the copy arrived
before deleting anything. We will not delete an invoice on a guess.

---

## Our list

Still ours to do. Nothing here is blocking your search results.

| What | Why it matters |
| --- | --- |
| Rich-result info on the Tech site's main pages | Detail pages have it; `/services`, `/about`, `/insights` do not |
| Change the test payment keys, clean them out of history | They are test keys, so it is tidying, not an emergency |
| Delete four old password backup files | Already locked down so only you can read them |
| The 2-factor login page | Right now, switching on 2FA locks you out of the portal — the page it sends you to was never built |
| A proper queue for background jobs | If the server hiccups at the wrong moment, a new-lead email can vanish with nothing to retry it |
| Merge four drifted copies of the lead-capture code | Four versions of the code that sends you enquiries are running; they should be one |
| Switch the CRM connection on | Not a single lead has ever reached Twenty — the setting was never filled in |
| Free up ~365 MB of throwaway files | Logs and build caches that rebuild themselves |

---

## What to expect

Watch the **Coverage** report in Search Console over the next one to two weeks.

Indexed pages should climb from around 5 — one per site — toward roughly 190.

If it stalls, the report will now tell you why. Before this week it could not,
because every page was claiming to be a copy of its homepage, and that one
message drowned out everything else.

Two phrases should disappear: *"Duplicate, Google chose different canonical"*
and *"Alternate page with proper canonical tag"*. If they are still there in two
weeks, something is wrong and we should look together.

---

## One correction, written down on purpose

The original plan for this work said the fix for the sign problem was to
**delete** the offending line.

That was wrong. Deleting it produces no sign at all — which is exactly where
these sites started, and why somebody added the line in the first place. The
real fix was to change what kind of value the line holds, so the framework fills
in each page's own address.

It is recorded here so nobody deletes the line in six months thinking they are
tidying up.
