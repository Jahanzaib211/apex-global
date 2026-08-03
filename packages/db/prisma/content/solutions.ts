/**
 * The nine solution pages.
 *
 * Voice per docs/BRAND.md and the brand brief: capability, stated precisely.
 * "We design, build and operate scalable software platforms" — not "we offer
 * software development services". No superlatives, no unqualified claims, no
 * geography.
 */

export interface SolutionSeed {
  slug: string;
  order: number;
  name: string;
  tagline: string;
  summary: string;
  body: string;
  icon: string;
  capabilities: string[];
  outcomes: string[];
  seoTitle: string;
  seoDescription: string;
}

export const solutions: SolutionSeed[] = [
  {
    slug: "saas-development",
    order: 1,
    name: "SaaS Development & Products",
    tagline: "Multi-tenant platforms designed to be operated, not just shipped",
    summary:
      "We design, build and run SaaS platforms end to end — tenancy, billing, entitlements, admin, observability and the operational discipline that keeps them up once customers depend on them.",
    body: `Most SaaS projects fail somewhere between the demo and the second hundred customers. The application works; the platform underneath it does not. Tenancy leaks, billing drifts out of step with entitlements, support has no way to see what a customer sees, and nobody can deploy on a Friday.

We build the platform, not just the product. That means tenant isolation decided at the schema level rather than patched in later, subscription state that is the single source of truth for what a customer can do, an admin surface with real role-based access and an audit trail, and instrumentation that answers "is it slow for everyone or just this account?".

We run our own SaaS products on the same foundations. The hosting and billing platform in our product catalogue is one of them — client portal, subscription billing and self-issued licensing, in production.`,
    icon: "layers",
    capabilities: [
      "Multi-tenant architecture with isolation enforced at the data layer",
      "Subscription billing, entitlements and usage metering",
      "Customer onboarding, admin consoles and support tooling",
      "Public APIs, webhooks and integration surfaces",
      "Observability: metrics, structured logs, tracing and alerting",
      "Migration from single-tenant or on-premise deployments",
    ],
    outcomes: [
      "A platform your team can operate without the original developers",
      "Billing and entitlements that cannot disagree with each other",
      "Support able to diagnose a customer issue without a database client",
    ],
    seoTitle: "SaaS Development & Product Engineering | Apex Global Tech Solution",
    seoDescription:
      "We design, build and operate multi-tenant SaaS platforms — tenancy, billing, entitlements, admin and observability. Built to be run in production, not just demonstrated.",
  },
  {
    slug: "software-development",
    order: 2,
    name: "Software Development",
    tagline: "Web, mobile and enterprise systems built to be maintained",
    summary:
      "Custom applications, internal platforms, APIs and integrations — engineered with the tests, documentation and deployment automation that decide what a system costs to own three years from now.",
    body: `The cost of software is not what it takes to build. It is what it takes to change safely, eighteen months later, with a different team.

We work in typed languages with tests that mean something, deployment automation from the first week rather than the last, and documentation written for whoever inherits the system. Every project ships with a runbook.

We are equally comfortable replacing a system that has outgrown itself and building a first version where nothing exists yet. What we will not do is deliver a codebase nobody but us can operate.`,
    icon: "code",
    capabilities: [
      "Web applications, internal platforms and customer portals",
      "Mobile applications and the APIs behind them",
      "Enterprise systems, workflow engines and back-office tooling",
      "API design, third-party integration and system-to-system messaging",
      "Automated testing, CI/CD and deployment pipelines",
      "Rescue and modernisation of systems that have outgrown their design",
    ],
    outcomes: [
      "A codebase your own team can extend without archaeology",
      "Deployments that are routine rather than events",
      "Documented systems, so knowledge does not leave with a person",
    ],
    seoTitle: "Custom Software Development | Apex Global Tech Solution",
    seoDescription:
      "Custom web, mobile and enterprise software engineered for maintainability — typed codebases, meaningful tests, deployment automation and documentation from day one.",
  },
  {
    slug: "ai-automation",
    order: 3,
    name: "AI & Automation",
    tagline: "AI systems with a human decision point where it matters",
    summary:
      "Agents, retrieval systems, document processing and workflow automation — built provider-agnostic, evaluated against real data, and designed so a model is never the last word on a consequential decision.",
    body: `We build AI into systems that already have to work. That changes the engineering: outputs are evaluated rather than assumed, prompts are versioned like code, costs are measured per operation, and the provider is an implementation detail behind an interface rather than a dependency you cannot escape.

We also build the boring parts that decide whether an AI feature survives contact with production — retries, timeouts, fallbacks, caching, rate limits, and a queue so a slow model never blocks a user request.

Where a decision carries consequence, a person makes it. AI drafts, summarises, classifies and ranks; a human approves. That is a design position, not a limitation — it is what makes the output usable in a business process that has to be defensible.

We built and operate an AI agent platform in production: sub-agents, per-thread sandboxes, streaming execution visibility and a self-verification loop.`,
    icon: "sparkles",
    capabilities: [
      "AI agents and multi-step autonomous workflows",
      "Retrieval-augmented generation over your own documents and data",
      "Document extraction, classification and enrichment pipelines",
      "Provider-agnostic model routing with cost and latency controls",
      "Evaluation harnesses so quality is measured, not assumed",
      "Business process automation and system-to-system orchestration",
    ],
    outcomes: [
      "Measured output quality instead of anecdotes",
      "Freedom to change model provider without rewriting the application",
      "Automation your team trusts, because a person still approves what matters",
    ],
    seoTitle: "AI & Automation Engineering | Apex Global Tech Solution",
    seoDescription:
      "AI agents, retrieval systems and workflow automation — provider-agnostic, evaluated against real data, with human approval on consequential decisions.",
  },
  {
    slug: "cloud-solutions",
    order: 4,
    name: "Cloud Solutions",
    tagline: "Architecture, migration and the operations that follow",
    summary:
      "Cloud architecture, migration, container orchestration and cost control — including the part most projects skip, which is running the result reliably after the migration finishes.",
    body: `A migration is not finished when the workload boots in its new home. It is finished when your team can deploy to it, observe it, restore it and afford it.

We plan migrations backwards from that end state. Dependencies get mapped before anything moves, schema and data compatibility are validated against a copy, cutover has a rehearsed rollback, and the destination arrives with monitoring and backups already in place.

We run this stack ourselves: a Kubernetes cluster with GitOps deployment, certificate automation, a full metrics and logging pipeline, and nightly backups. Our Technology page shows the topology.`,
    icon: "cloud",
    capabilities: [
      "Cloud and hybrid architecture design",
      "Workload, application and database migration with rehearsed cutover",
      "Kubernetes, containerisation and orchestration",
      "Infrastructure as code and GitOps delivery",
      "Cost analysis and optimisation",
      "High availability, backup and disaster recovery design",
    ],
    outcomes: [
      "Migrations with a rollback that has actually been tested",
      "Infrastructure defined in version control, not in someone's memory",
      "A monthly cloud bill you can explain line by line",
    ],
    seoTitle: "Cloud Architecture & Migration | Apex Global Tech Solution",
    seoDescription:
      "Cloud architecture, migration and operations — Kubernetes, infrastructure as code, GitOps delivery, monitoring and tested disaster recovery.",
  },
  {
    slug: "cybersecurity",
    order: 5,
    name: "Cybersecurity",
    tagline: "Assessment, hardening and monitoring, described honestly",
    summary:
      "Security assessment, vulnerability management, infrastructure and application hardening, and continuous monitoring — delivered with findings you can act on rather than a scanner export.",
    body: `Security work is easy to sell and hard to verify, which is why so much of it is theatre. We are specific about what we do.

We assess infrastructure and applications, we prioritise findings by exploitability in your actual environment rather than by raw CVSS, and we tell you which ones we would fix first and why. We harden systems and document what changed. We stand up monitoring and tune it, because an alerting system nobody trusts is worse than none.

We are also explicit about tooling. The industry-standard scanners, SIEM platforms and analysis tools we operate are open-source projects written by other people. We deploy, configure, harden and run them; we did not write them, and we say so. What we build is the pipeline, the tuning, the triage process and the reporting around them.

We will not tell you a system cannot be breached. Nobody can honestly say that, and a supplier who does is telling you something about themselves.`,
    icon: "shield",
    capabilities: [
      "Infrastructure and application security assessment",
      "Vulnerability scanning, triage and remediation planning",
      "System and network hardening with documented change sets",
      "Security monitoring, SIEM deployment and alert tuning",
      "Access control, secrets management and audit logging design",
      "Incident response preparation and recovery testing",
    ],
    outcomes: [
      "A prioritised, exploitability-ranked remediation plan",
      "Monitoring that alerts on real signals rather than noise",
      "Evidence you can hand to a client's security questionnaire",
    ],
    seoTitle: "Cybersecurity Services | Apex Global Tech Solution",
    seoDescription:
      "Security assessment, vulnerability management, hardening and monitoring — prioritised by real exploitability, with clear separation between what we build and the open-source tools we operate.",
  },
  {
    slug: "managed-it",
    order: 6,
    name: "Managed IT",
    tagline: "Someone accountable for the systems you depend on",
    summary:
      "Ongoing infrastructure management, monitoring, patching, backup verification and support — with defined response targets and a monthly report showing what actually happened.",
    body: `Most infrastructure fails in predictable ways: an expired certificate, a full disk, a backup that has never been restored, a patch nobody applied. None of it is difficult. All of it needs someone whose job it is.

We take that role. Systems are monitored, patches are applied on a schedule, backups are verified by restoring them, and you get a report each month that says what broke, what was changed and what we recommend next.

Response targets are written down, and the report tells you whether we hit them.`,
    icon: "activity",
    capabilities: [
      "24/7 infrastructure and application monitoring",
      "Patch management and scheduled maintenance",
      "Backup operation with periodic restore verification",
      "Incident response against defined targets",
      "Capacity planning and performance tuning",
      "Documented runbooks and knowledge transfer",
    ],
    outcomes: [
      "Backups proven by restoring them, not assumed",
      "Fewer incidents, and shorter ones",
      "A monthly report you can actually act on",
    ],
    seoTitle: "Managed IT Services | Apex Global Tech Solution",
    seoDescription:
      "Managed infrastructure: monitoring, patching, verified backups and incident response against defined targets, with monthly reporting.",
  },
  {
    slug: "devops-infrastructure",
    order: 7,
    name: "DevOps & Infrastructure",
    tagline: "Deployment as routine rather than an event",
    summary:
      "CI/CD pipelines, infrastructure as code, container orchestration and observability — so releasing is boring and rolling back is a decision rather than a scramble.",
    body: `Teams that deploy rarely deploy badly. The fear is rational: each release carries months of change, so each release is dangerous. The fix is not more process, it is smaller and more frequent releases, which requires automation nobody has had time to build.

We build it. Pipelines that run tests, quality gates and security scans on every change. Environments defined in code so staging genuinely resembles production. Deployments that health-check before they take traffic and roll back on their own when they do not.

We add observability at the same time, because a deployment you cannot observe is a deployment you cannot safely undo.`,
    icon: "git-branch",
    capabilities: [
      "CI/CD pipeline design and implementation",
      "Infrastructure as code and environment parity",
      "Container build, registry and orchestration",
      "Progressive delivery, health-gated deploys and automated rollback",
      "Metrics, logging, tracing and alerting",
      "Release process and on-call design",
    ],
    outcomes: [
      "Deploy on a Tuesday afternoon without assembling a team",
      "Staging that behaves like production because it is built from the same code",
      "Rollback as a routine option instead of a last resort",
    ],
    seoTitle: "DevOps & Infrastructure Engineering | Apex Global Tech Solution",
    seoDescription:
      "CI/CD, infrastructure as code, container orchestration and observability — making deployment routine and rollback a normal option.",
  },
  {
    slug: "digital-transformation",
    order: 8,
    name: "Digital Transformation",
    tagline: "Modernising systems without stopping the business",
    summary:
      "Legacy modernisation, workflow digitisation and system consolidation — delivered incrementally, so value arrives before the programme ends and a stall never leaves you worse off.",
    body: `Big-bang replacements fail for a structural reason: they deliver nothing until they deliver everything, so there is no point at which anyone can judge whether they are working.

We modernise incrementally. The highest-pain workflow goes first and goes live on its own. The legacy system keeps running beside it until it has nothing left to do. Each step is independently useful, which means the programme can be paused, reprioritised or stopped without wasting what came before.

Slower on paper. Substantially more likely to finish.`,
    icon: "refresh",
    capabilities: [
      "Legacy system assessment and modernisation roadmaps",
      "Incremental replacement with parallel running",
      "Manual and paper workflow digitisation",
      "Data migration, cleansing and reconciliation",
      "System consolidation and integration",
      "Change management and user training",
    ],
    outcomes: [
      "Working software in production early, not at the end",
      "A programme that can be re-prioritised without write-offs",
      "Users brought along rather than presented with a fait accompli",
    ],
    seoTitle: "Digital Transformation & Legacy Modernisation | Apex Global Tech Solution",
    seoDescription:
      "Incremental legacy modernisation and workflow digitisation — each step independently useful, so value arrives before the programme ends.",
  },
  {
    slug: "technology-consulting",
    order: 9,
    name: "Technology Consulting",
    tagline: "Architecture and technical due diligence from people who build",
    summary:
      "Architecture review, technology selection, technical due diligence and delivery assessment — advice from a team that ships systems, not a deck from people who do not.",
    body: `We consult on the questions we have had to answer ourselves: is this architecture going to hold, is this build estimate real, is this vendor selling something they can support, is this team going to deliver.

Engagements are short and produce something specific — a written architecture review, a costed options paper, a due diligence report, a remediation plan. Not a retainer that quietly becomes permanent.

If the honest answer is that you do not need the work, we will say so.`,
    icon: "compass",
    capabilities: [
      "Architecture review and system design",
      "Technology and vendor selection",
      "Technical due diligence for investment or acquisition",
      "Delivery and codebase assessment",
      "Security and compliance readiness review",
      "Technology strategy and roadmap planning",
    ],
    outcomes: [
      "A written, specific recommendation you can act on",
      "Risk identified before it is expensive",
      "An independent read on whether a plan is realistic",
    ],
    seoTitle: "Technology Consulting & Architecture Review | Apex Global Tech Solution",
    seoDescription:
      "Architecture review, technology selection and technical due diligence from an engineering team that builds and operates production systems.",
  },
];
