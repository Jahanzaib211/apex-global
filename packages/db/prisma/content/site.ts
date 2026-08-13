/** Settings, roles, case studies, insights, FAQs and ad landing pages. */

export const settings = [
  {
    key: "org.name",
    group: "organisation",
    label: "Company name",
    value: "Apex Global Tech Solution",
  },
  {
    key: "org.tagline",
    group: "organisation",
    label: "Tagline",
    value: "Global Technology. Intelligent Solutions. Built to Scale.",
  },
  {
    key: "org.description",
    group: "organisation",
    label: "Description",
    value:
      "Apex Global Tech Solution builds SaaS products and delivers intelligent technology solutions across software, AI, cloud, cybersecurity and IT infrastructure — helping businesses operate smarter and scale faster.",
  },
  { key: "org.phone", group: "contact", label: "Phone", value: "+92 42 3229 4384" },
  { key: "org.email", group: "contact", label: "Email", value: "" },
  { key: "org.whatsapp", group: "contact", label: "WhatsApp number", value: "923066422442" },
  {
    key: "org.address",
    group: "contact",
    label: "Registered office",
    value: "31-20, Sector C-D Main Blvd, Sector M7 Lake City, Lahore, Pakistan",
  },
  { key: "org.linkedin", group: "social", label: "LinkedIn", value: "" },

  // Legal identity, used by the /legal suite. Deliberately seeded empty: a
  // made-up registration number or jurisdiction is exactly the detail that
  // unravels in a first client review. Fill these from the console before the
  // legal pages ship to a jurisdiction that requires them.
  { key: "org.legalName", group: "legal", label: "Registered legal name", value: "" },
  {
    key: "org.registrationNumber",
    group: "legal",
    label: "Company registration number",
    value: "",
  },
  { key: "org.vatId", group: "legal", label: "VAT / tax registration ID", value: "" },
  {
    key: "org.jurisdiction",
    group: "legal",
    label: "Governing law / jurisdiction",
    value: "Pakistan",
  },
  { key: "org.disputeEmail", group: "legal", label: "DPO / legal contact email", value: "" },

  // ── Live chat (self-hosted Chatwoot, "talk to a real human") ────────────
  // The launcher renders only when both a base URL and a widget token exist,
  // so the site ships in a graceful "no chat configured" state by default.
  { key: "chatwoot.base_url", group: "contact", label: "Chatwoot URL", value: "" },
  { key: "chatwoot.token", group: "contact", label: "Chatwoot widget token", value: "" },
  { key: "chatwoot.enabled", group: "contact", label: "Enable live chat", value: false },
  {
    key: "chatwoot.launcher_label",
    group: "contact",
    label: "Chat launcher label",
    value: "Talk to a real person",
  },

  // Leadership. Deliberately seeded empty rather than with invented copy: a
  // fabricated biography is exactly the kind of detail that unravels in a
  // first conversation. The About page shows an explicit placeholder until
  // these are filled in from the console.
  { key: "leadership.ceo.name", group: "leadership", label: "CEO name", value: "Shaikh Ahmed" },
  {
    key: "leadership.ceo.title",
    group: "leadership",
    label: "CEO title",
    value: "Chief Executive Officer — Apex Group of Companies",
  },
  { key: "leadership.ceo.bio", group: "leadership", label: "CEO biography", value: "" },
  { key: "leadership.ceo.photo", group: "leadership", label: "CEO photograph URL", value: "" },
  { key: "leadership.ceo.linkedin", group: "leadership", label: "CEO LinkedIn", value: "" },
  {
    key: "seo.defaultTitle",
    group: "seo",
    label: "Default page title",
    value: "Apex Global Tech Solution — Global SaaS & Technology Company",
  },
  {
    key: "seo.defaultDescription",
    group: "seo",
    label: "Default meta description",
    value:
      "We build and operate SaaS products and deliver software, AI, cloud, cybersecurity and managed IT solutions for businesses worldwide.",
  },
  // Deliberately blank: this is what gets pasted in at deploy time, and a
  // placeholder domain shipping to production is a real failure mode.
  { key: "seo.siteUrl", group: "seo", label: "Canonical site URL", value: "" },

  // ── Technology partner (ALI Technologies) ────────────────────────────────
  // Apex is the public face of the business. ALI Technologies is the engineering
  // and operations partner that builds and runs the platforms behind it. Both
  // names appear on the site; neither one absorbs the other, and the
  // relationship is declared rather than implied.
  {
    key: "partner.name",
    group: "partner",
    label: "Technology partner name",
    value: "ALI Technologies",
  },
  {
    key: "partner.tagline",
    group: "partner",
    label: "Partner tagline",
    value: "Engineering, operations and platform delivery behind Apex Global Tech Solution.",
  },
  {
    key: "partner.url",
    group: "partner",
    label: "Partner URL",
    value: "https://alilabsx.com/",
  },
  {
    key: "partner.relationship",
    group: "partner",
    label: "Relationship statement",
    value:
      "ALI Technologies is the engineering partner of Apex Global Tech Solution. Apex owns the customer relationship, the commercial contract and the brand. ALI Technologies — at alilabsx.com — designs, builds and operates the platforms and infrastructure.",
  },

  // ── Operations toggles (read by the public site + the /dev panel) ──
  { key: "ops.maintenance_mode", group: "operations", label: "Maintenance mode", value: false },
  {
    key: "ops.maintenance_message",
    group: "operations",
    label: "Maintenance message",
    value:
      "We're performing scheduled maintenance. The portal will be back shortly. Existing clients can still reach support by phone.",
  },
  { key: "ops.public_status", group: "operations", label: "Public status", value: "operational" },
  { key: "ops.readonly_mode", group: "operations", label: "Read-only mode", value: false },
  { key: "ops.status_banner", group: "operations", label: "Status banner text", value: "" },
] as const;

export const roles = [
  {
    key: "admin",
    name: "Administrator",
    description: "Full access, including user management and the integrations vault.",
    isSystem: true,
  },
  {
    key: "editor",
    name: "Content editor",
    description: "Creates and publishes website content. No access to leads or settings.",
    isSystem: true,
  },
  {
    key: "sales",
    name: "Sales",
    description: "Works leads and the pipeline. Read-only on content.",
    isSystem: true,
  },
  {
    key: "viewer",
    name: "Viewer",
    description: "Read-only across the console. Used for reporting access.",
    isSystem: true,
  },
] as const;

/**
 * Case studies.
 *
 * No client is named. Consent has not been recorded for anyone, so every study
 * renders under its anonymous label — that is the schema enforcing the rule
 * rather than a person remembering it. When written permission exists, set
 * `clientName`, `clientConsent`, `consentRecordedAt` and `consentReference`.
 */
export const caseStudies = [
  {
    slug: "agent-platform-build",
    title: "Building an AI agent platform that verifies its own work",
    anonymousLabel: "An internal Apex product team",
    summary:
      "Agents that report success on unfinished work are worse than agents that fail loudly. We rebuilt the execution model around visible work and self-verification.",
    challenge:
      "An open-source agent harness gave us a capable planning loop and a chat interface. What it did not give us was any way to see what the agent had actually done. Runs that reported success had produced blank pages, edited the wrong files, or looped on an assumption that was wrong three steps earlier. Reviewing a run meant reading thousands of tokens of transcript and inferring the state of a filesystem we could not see.",
    strategy:
      "Two decisions. First, make the work visible rather than described: stream the agent's terminal, file diffs and browser preview as it works, so a human can see divergence within seconds instead of at the end. Second, close the loop — have the agent check its own output before claiming to be finished, and give it a way to actually see the result rather than assume it.",
    technology:
      "Python and TypeScript across a streaming gateway and a Next.js front end. Per-thread sandboxes for isolation. Headless Chromium for verification. A model-routing layer so provider choice stays an operational decision. Sub-agent orchestration to keep long tasks coherent past a single context window.",
    implementation:
      "Built as a substantial extension of the upstream project, with its MIT licence and copyright notices preserved. The verification loop triggers on dev-server-ready and on shipped HTML: it checks for console errors and blank renders, captures a screenshot, and passes it back through a vision model so the agent sees what it produced. Deployed behind a gateway with monitoring.",
    result:
      "Failed builds are now caught by the agent rather than by a person reviewing output. Diagnosing a bad run is a matter of scrubbing the activity timeline to the point of divergence rather than reading a transcript end to end.",
    lessons:
      "The verification loop mattered more than any model upgrade we made during the same period. Giving a model the ability to observe its own output changes its failure mode from confident-and-wrong to corrective.",
    technologies: ["Python", "TypeScript", "Next.js", "Docker", "headless Chromium"],
    solutionSlugs: ["ai-automation", "saas-development"],
    metrics: [
      {
        label: "Original work over upstream",
        value: "+35,738 lines / 338 files",
        source: "git diff against the upstream release tag",
      },
      {
        label: "Live workspace views",
        value: "6 synchronised panels",
        source: "Shipped application",
      },
    ],
  },
  {
    slug: "zero-inbound-infrastructure",
    title: "Publishing production services with no open inbound ports",
    anonymousLabel: "Apex production infrastructure",
    summary:
      "Rather than opening ports and defending them, we removed the inbound listener entirely and published through authenticated outbound tunnels.",
    challenge:
      "Multiple production services needed public reachability. The conventional approach — open ports, put a reverse proxy in front, keep patching it — leaves a permanently scannable attack surface and a public origin address that can be hit directly regardless of what sits in front of it.",
    strategy:
      "Invert the direction of the connection. If the origin dials out to the edge and the edge terminates public traffic, there is no inbound listener to find, and no origin address exposed to reach around the edge. Internal services do not get published at all; they move onto a private mesh with device identity.",
    technology:
      "Outbound authenticated tunnels to an edge network with WAF, a private mesh network for internal access, Kubernetes with GitOps reconciliation, automated certificate issuance, and datastores bound to loopback only.",
    implementation:
      "Each public service was moved behind its own tunnel with independent credentials, so compromise of one does not imply the others. Administrative interfaces — dashboards, object storage, database access — were removed from public reachability entirely and placed on the mesh. Certificate renewal was automated to remove expiry as a failure mode.",
    result:
      "No inbound ports are open on the origin. Datastores are unreachable from outside the host. Public endpoints answered in 1.3–1.5 seconds when measured on 3 August 2026. The remaining attack surface is the application layer, which is where security effort is actually productive.",
    lessons:
      "Most infrastructure hardening is about deleting things rather than adding them. The most defensible port is the one that is not open.",
    technologies: ["Kubernetes", "GitOps", "outbound tunnels", "private mesh", "cert-manager"],
    solutionSlugs: ["cloud-solutions", "cybersecurity", "devops-infrastructure"],
    metrics: [
      {
        label: "Open inbound ports on origin",
        value: "0",
        source: "Network configuration review, 3 August 2026",
      },
      {
        label: "Public endpoint response",
        value: "1.31–1.50s",
        source: "Direct HTTP requests to production endpoints, 3 August 2026",
      },
    ],
  },
] as const;

export const insights = [
  {
    slug: "why-your-backup-is-not-a-backup",
    title: "Your backup is not a backup until you have restored it",
    category: "Infrastructure",
    excerpt:
      "Every organisation that has lost data had backups. The failure is almost never the backup job — it is the assumption that nobody tested.",
    readingMinutes: 6,
    body: `Ask any technology team whether they have backups and the answer is yes. Ask when a restore was last performed and the room goes quiet.

That gap is where data loss lives. The backup job runs, it reports success, and the file appears. What nobody checks is whether the file can be read, whether it contains what you think, whether the restore procedure works on a machine that is not the one that made it, and how long the whole thing takes when the system is down and people are waiting.

Common ways a backup that "works" fails when you need it:

**The dump is incomplete.** A backup taken while writes are in flight, without a consistent snapshot, can restore into a database that loads cleanly and is subtly wrong.

**Nobody has the key.** Encrypted backups are correct practice. Encrypted backups whose key lives only on the machine that was lost are not backups.

**The restore takes longer than the business can wait.** A 400GB restore over a slow link is a valid recovery plan only if six hours of downtime is acceptable. Frequently it is not, and nobody found out until the day.

**The procedure assumes knowledge that left.** If recovery depends on someone remembering the order of operations, the plan has a single point of failure who takes holidays.

The fix is unglamorous. Restore into a scratch environment on a schedule. Check row counts and the most recent records. Time it. Write down what you did, and have someone who did not write it follow the instructions the next time.

We run this drill on our own infrastructure and record the date. A backup that has never been restored is an assumption, and assumptions fail precisely when they are load-bearing.`,
    authorName: "Apex Engineering",
    authorRole: "Infrastructure",
  },
  {
    slug: "ai-features-that-survive-production",
    title: "What separates an AI demo from an AI feature",
    category: "AI & Automation",
    excerpt:
      "The model is the easy part. What decides whether an AI feature survives is the engineering around it — evaluation, fallbacks, cost control and a human decision point.",
    readingMinutes: 7,
    body: `An AI demo needs one good run. An AI feature needs the ten thousandth run to be acceptable, on a Monday, when the provider is degraded and the input is nothing like what you tested.

The distance between those is engineering, and it is mostly unrelated to prompting.

**Evaluation before opinion.** If you cannot measure output quality against a set of real cases, you are not improving the feature, you are changing it. Build the evaluation set from actual inputs before you tune anything.

**The provider is an implementation detail.** Model quality, pricing and availability all move. An application wired directly to one vendor's SDK inherits every one of those movements. Put an interface in front of it and the choice becomes an operational decision rather than a rewrite.

**Failure has to be designed.** Models time out, rate-limit and return malformed output. Every call needs a timeout, a retry with backoff, a validation step on the response shape, and a defined behaviour when all of that fails. A feature that degrades to "unavailable" is fine; one that hangs a request for ninety seconds is not.

**Cost is a product decision.** Measure spend per operation, not per month. A feature that costs more per use than it returns is a bug with good reviews.

**Put a human where consequence is.** Draft, summarise, classify, rank, prioritise — all excellent. Send, delete, charge, reject — not without a person. This is not caution for its own sake: it is what makes the output usable in a process that has to be defensible to someone else later.

None of this is exotic. It is the same discipline any other unreliable dependency gets. What is unusual about AI features is how often that discipline gets skipped because the demo was impressive.`,
    authorName: "Apex Engineering",
    authorRole: "AI & Automation",
  },
  {
    slug: "reading-a-technology-supplier",
    title: "How to tell whether a technology supplier can actually build",
    category: "Technology Strategy",
    excerpt:
      "Portfolios are easy to inflate and hard to verify. A handful of specific questions separate teams who ship from teams who present.",
    readingMinutes: 5,
    body: `Selecting a technology supplier is difficult because the signals that are easy to produce — a polished deck, a client logo wall, a list of technologies — are almost uncorrelated with the ability to deliver.

Some questions that are harder to fake:

**"Can I see something running?"** Not a screenshot. A URL, or a screen share of a live system. Ask what happens when it breaks and who gets paged.

**"What did you build, and what did you deploy?"** Every technology company stands on open source. The honest ones distinguish clearly between software they wrote and software they operate. A supplier who lets you believe they invented a well-known open-source tool has told you what their other claims are worth.

**"Show me a rollback."** Anyone can deploy. Ask what happens when a release is bad — whether it is a revert, how long it takes, and when they last did it.

**"When did you last restore a backup?"** A date, or an admission. Both are informative.

**"What would you not do?"** A supplier who wants every piece of work you have is optimising for revenue. One who tells you a project is unnecessary, or that a cheaper approach exists, is optimising for being right — which is what you are actually buying.

Ask for the number behind any statistic on their website. If it cannot be traced to something checkable, treat every other number the same way.

We hold ourselves to this: our Technology page states, for each system, whether we built it, operate it, or deploy it as third-party open source, and every figure carries its source.`,
    authorName: "Apex Engineering",
    authorRole: "Technology Consulting",
  },
] as const;

export const faqs = [
  {
    question: "Where does Apex work?",
    answer:
      "We work with clients internationally and deliver remotely. Our registered office is in Lahore, Pakistan.",
  },
  {
    question: "Do you work with existing systems, or only new builds?",
    answer:
      "Both. A significant part of our work is taking on systems built by someone else — assessing them, stabilising them and modernising them incrementally.",
  },
  {
    question: "How do engagements usually start?",
    answer:
      "With a scoped piece of work that produces something specific: an architecture review, a costed options paper, or a first deliverable that stands on its own. We do not ask for a long commitment before you have seen us work.",
  },
  {
    question: "Do you use open-source software?",
    answer:
      "Extensively, and we say which. Every system described on our Technology page is labelled as built by Apex, operated by Apex, or third-party open source that we deploy and run.",
  },
  {
    question: "Can systems be hosted in our own infrastructure?",
    answer:
      "Yes. We build for both managed hosting and self-hosted deployment, including fully air-gapped environments where required.",
  },
] as const;

/**
 * Ad landing pages. noindex and excluded from the sitemap by design — they
 * duplicate solution content and exist purely to convert paid traffic.
 */
export const landingPages = [
  {
    slug: "cloud-migration",
    headline: "Move to the cloud without a bad weekend",
    subheadline:
      "Dependency mapping, a rehearsed cutover, a tested rollback, and monitoring in place before you switch. We plan migrations backwards from the day after.",
    ctaLabel: "Request a migration assessment",
    bullets: [
      "Dependencies mapped before anything moves",
      "Cutover rehearsed, with a rollback that has been tested",
      "Monitoring and backups live on day one, not week six",
      "A cost model you can explain line by line",
    ],
    campaignName: "cloud-migration-q3",
    solutionSlug: "cloud-solutions",
  },
  {
    slug: "ai-automation",
    headline: "AI features that survive contact with production",
    subheadline:
      "Evaluated against your real data, provider-agnostic so you are never locked in, and designed so a person still approves anything that carries consequence.",
    ctaLabel: "Discuss an AI project",
    bullets: [
      "Output quality measured, not assumed",
      "Switch model provider without rewriting the application",
      "Cost measured per operation and bounded",
      "Human approval wherever a decision has consequence",
    ],
    campaignName: "ai-automation-q3",
    solutionSlug: "ai-automation",
  },
  {
    slug: "software-development",
    headline: "Software your team can still change in three years",
    subheadline:
      "Typed codebases, tests that assert behaviour, deployment automation from week one, and documentation written for whoever inherits it.",
    ctaLabel: "Start a project",
    bullets: [
      "Strict typing and meaningful test coverage",
      "CI/CD from the first week, not the last",
      "A runbook delivered with every system",
      "No dependency on us to keep it running",
    ],
    campaignName: "software-dev-q3",
    solutionSlug: "software-development",
  },
  {
    slug: "modular-services",
    headline: "Fixed scope. Fixed fee. Fixed timeline.",
    subheadline:
      "Eight productised cloud and platform engineering engagements — Kubernetes migration, observability, security hardening, CI/CD and more. Buy one module, or assemble a bundle. Built and operated by ALI Technologies against an open-source platform stack.",
    ctaLabel: "Discuss a modular engagement",
    bullets: [
      "USD 4K–18K flat fees per module, USD 17K–48K for bundles",
      "5 days to 3 weeks, end to end — not a discovery phase",
      "Open-source platform stack, declared upstream",
      "Outcomes listed up-front in the scope, not negotiated at the end",
    ],
    campaignName: "apex-services-launch",
    solutionSlug: "services",
  },
  {
    slug: "k8s-migration",
    headline: "A Kubernetes migration with a tested rollback",
    subheadline:
      "Containerise, ship to a real cluster, prove the rollback before the cutover, and hand over a system your team can extend. Three weeks, USD 18K fixed.",
    ctaLabel: "Discuss a Kubernetes migration",
    bullets: [
      "Workloads containerised with production-grade images",
      "Cluster with networking, RBAC and GitOps delivery",
      "Rollback rehearsed before anything cuts over",
      "A cluster your team can run without us",
    ],
    campaignName: "k8s-migration-q3",
    solutionSlug: "services",
  },
  {
    slug: "nova-enterprise-demo",
    headline: "See Nova running, not a slide about it",
    subheadline:
      "A 30-minute walk-through of the live AI agent platform: sub-agents, sandboxes, IM integrations, the verify loop, the code review engine. Real auth, real workloads, real timing.",
    ctaLabel: "Request a demo",
    bullets: [
      "Multi-agent orchestration with per-thread sandboxes",
      "Six IM channel integrations — Telegram, Slack, Feishu, WeChat, WeCom, DingTalk",
      "Self-verification loop with headless Chromium",
      "35,738 lines of original work on top of the open-source DeerFlow harness",
    ],
    campaignName: "nova-demo-enterprise",
    solutionSlug: "product",
  },
] as const;
