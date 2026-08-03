import type { Origin, PublishStatus } from "../../generated/client/index.js";

/**
 * The Technology & Engineering page.
 *
 * This is the page a technical buyer reads before recommending us, so every
 * entry declares its provenance and every number carries a source. Figures were
 * measured on the running systems on 2026-08-03; when they are refreshed, the
 * `measuredAt` date moves with them.
 */

const MEASURED = new Date("2026-08-03T00:00:00Z");

export interface TechProofSeed {
  slug: string;
  order: number;
  status: PublishStatus;
  title: string;
  category: "platform" | "infrastructure" | "security" | "engineering";
  summary: string;
  detail: string;
  origin: Origin;
  upstreamName?: string;
  upstreamUrl?: string;
  upstreamLicense?: string;
  isPubliclyReachable: boolean;
  technologies: string[];
  evidence: Array<{ label: string; value: string; source: string }>;
}

export const techProof: TechProofSeed[] = [
  {
    slug: "container-orchestration",
    order: 1,
    status: "LIVE",
    title: "Kubernetes platform with GitOps delivery",
    category: "infrastructure",
    summary:
      "A production Kubernetes cluster where the desired state lives in version control and a controller reconciles the running system towards it. Certificates renew themselves.",
    detail: `Workloads run on a Kubernetes cluster whose configuration is declared in Git. A GitOps controller continuously reconciles what is running against what is committed, which makes two things true at once: a change that is not in version control does not survive, and a rollback is a revert rather than a rescue operation.

Certificate issuance and renewal are automated, so TLS expiry — one of the most common causes of avoidable outages — is not a task anyone has to remember.

We describe this because we run it. The same practice is what we implement for clients under Cloud Solutions and DevOps.`,
    origin: "OPERATED_BY_APEX",
    isPubliclyReachable: false,
    technologies: ["Kubernetes (k3s)", "Flux", "cert-manager", "Docker", "containerd"],
    evidence: [
      {
        label: "Reconciliation controllers running",
        value: "Source, notification and webhook controllers active",
        source: "Cluster service inventory, 3 August 2026",
      },
      {
        label: "Certificate automation",
        value: "cert-manager deployed cluster-wide",
        source: "Cluster service inventory, 3 August 2026",
      },
    ],
  },
  {
    slug: "observability",
    order: 2,
    status: "LIVE",
    title: "Metrics, logs and alerting",
    category: "infrastructure",
    summary:
      "A full observability pipeline — time-series metrics, aggregated logs, dashboards and alert routing — so a failure is noticed by a system rather than by a customer.",
    detail: `Metrics are collected from every node and workload, logs are aggregated centrally, dashboards make both queryable, and an alert manager routes anything that breaches a threshold.

The value is in what it changes operationally: "the site feels slow" becomes a question with an answer, and a degradation is caught before it becomes an outage.

These are open-source projects. We deploy, configure, tune and operate them — the tuning and the alert design are the work, and they are ours. The tools are not.`,
    origin: "THIRD_PARTY_OSS",
    upstreamName: "Prometheus, Grafana, Loki, Alertmanager",
    upstreamLicense: "Apache-2.0 / AGPL-3.0",
    isPubliclyReachable: false,
    technologies: ["Prometheus", "Grafana", "Loki", "Alertmanager", "node-exporter"],
    evidence: [
      {
        label: "Pipeline components in operation",
        value: "Metrics, log aggregation, dashboards, alert routing and node metrics",
        source: "Cluster service inventory, 3 August 2026",
      },
    ],
  },
  {
    slug: "ai-agent-platform",
    order: 3,
    status: "LIVE",
    title: "AI agent platform in production",
    category: "platform",
    summary:
      "A full-stack agent runtime with live execution visibility, sub-agent orchestration, per-thread sandboxes and a self-verification loop that tests its own output.",
    detail: `Built on an open-source agent harness and substantially extended: the live workspace view, the verification loop, sub-agent orchestration and the sandbox model are ours.

It runs in production behind a gateway, with a model-routing layer in front of the providers. The scale of the work is measurable rather than asserted — the figures below come from the repository and the running deployment.

The upstream project's licence and copyright notices are preserved, and it is credited on every page where the platform appears.`,
    origin: "BUILT_BY_APEX",
    upstreamName: "DeerFlow",
    upstreamUrl: "https://github.com/bytedance/deer-flow",
    upstreamLicense: "MIT",
    // The deployment is publicly reachable, but not yet at an Apex-owned
    // address. Until it is, we do not advertise a link a buyer cannot follow —
    // flip this once the platform is published on an Apex domain.
    isPubliclyReachable: false,
    technologies: ["Python", "TypeScript", "Next.js", "Docker", "headless Chromium"],
    evidence: [
      {
        label: "Original work over upstream",
        value: "+35,738 lines across 338 files",
        source: "git diff against the upstream release tag, stated in the project README",
      },
      {
        label: "Codebase size",
        value: "899 Python files, 471 TypeScript files",
        source: "Repository file count, 3 August 2026",
      },
      {
        label: "Development history",
        value: "193 commits on the main branch",
        source: "Repository commit count, 3 August 2026",
      },
      {
        label: "Availability check",
        value: "HTTP 200 in 1.31s",
        source: "Direct request to the production endpoint, 3 August 2026",
      },
    ],
  },
  {
    slug: "secure-operator-console",
    order: 4,
    status: "LIVE",
    title: "Secure administration with full audit trail",
    category: "platform",
    summary:
      "An operator console kept deliberately separate from the product it administers: signed sessions, a server-side proxy so privileged tokens never reach a browser, and an audit entry for every action.",
    detail: `Administration surfaces are where breaches become serious, so this one is built as its own application with its own deployment and its own credentials rather than as an admin route inside the product.

Every call to the privileged API is made server-side. The service token exists only on the server; the browser holds a signed session cookie and nothing else. Cross-site request forgery protection is paired to the session, and every privileged action writes an append-only audit row.

This is the pattern we implement in client systems, and it is the pattern the Apex console in this repository follows.`,
    origin: "BUILT_BY_APEX",
    isPubliclyReachable: false,
    technologies: ["Next.js", "React", "JOSE signed sessions", "server-side BFF proxy"],
    evidence: [
      {
        label: "Privileged token exposure",
        value: "Never sent to the browser — all admin calls proxied server-side",
        source: "Architecture review of the deployed application, 3 August 2026",
      },
      {
        label: "Audit coverage",
        value: "Every privileged action recorded",
        source: "Application design documentation",
      },
    ],
  },
  {
    slug: "multi-service-platform",
    order: 5,
    status: "LIVE",
    title: "Multi-service platform architecture",
    category: "platform",
    summary:
      "A platform running as six coordinated services — application, API, database, cache, object storage and search — built as a typed monorepo with a shared schema.",
    detail: `Demonstrates the architecture we use for systems that outgrow a single application: a separate API tier, a relational database as the system of record, a cache and queue layer, S3-compatible object storage for documents, and a dedicated search service.

The monorepo keeps the database schema, generated types and shared packages in one place, so a schema change surfaces as a compile error in every consumer rather than as a runtime failure in one of them.

**This system is not publicly exposed.** We demonstrate it privately, and we describe it that way rather than implying anyone can go and look at it.`,
    origin: "BUILT_BY_APEX",
    isPubliclyReachable: false,
    technologies: [
      "Next.js",
      "NestJS",
      "Prisma",
      "PostgreSQL",
      "Redis",
      "MinIO",
      "Meilisearch",
      "Turborepo",
    ],
    evidence: [
      {
        label: "Services in operation",
        value: "6 coordinated services",
        source: "Container inventory of the running deployment, 3 August 2026",
      },
    ],
  },
  {
    slug: "security-operations",
    order: 6,
    status: "LIVE",
    title: "Security operations environment",
    category: "security",
    summary:
      "An operational security toolchain — vulnerability scanning, SIEM, code analysis, application scanning and forensics — deployed, hardened and documented.",
    detail: `We operate a working security environment rather than a slide about one: network and infrastructure vulnerability scanning, security event monitoring, static code analysis, web application scanning and forensic tooling, with documented procedures for each.

Our own hardening is part of it — for example, the reconnaissance platform runs behind TLS with authentication in front of it rather than on an open port, which is not how it ships.

**To be unambiguous: these are open-source and third-party tools written by other people.** Apex deploys, configures, hardens, integrates and operates them. We did not write them and we do not claim to. What is ours is the deployment, the hardening, the tuning and the triage process built around them.`,
    origin: "THIRD_PARTY_OSS",
    upstreamName: "OpenVAS/GVM, Wazuh, SonarQube, OWASP ZAP, SpiderFoot, Velociraptor and others",
    upstreamLicense: "Various open-source licences",
    isPubliclyReachable: false,
    technologies: [
      "OpenVAS / GVM",
      "Wazuh",
      "SonarQube",
      "OWASP ZAP",
      "SpiderFoot",
      "Velociraptor",
      "Trivy",
    ],
    evidence: [
      {
        label: "Documented tooling",
        value: "60+ tools across 16 written operational guides",
        source: "Internal security toolkit documentation, 3 August 2026",
      },
      {
        label: "Hardening applied",
        value: "Reconnaissance platform fronted by TLS and authentication",
        source: "Deployment configuration review, 3 August 2026",
      },
    ],
  },
  {
    slug: "backup-and-recovery",
    order: 7,
    status: "LIVE",
    title: "Backups, and restoring them",
    category: "infrastructure",
    summary:
      "Nightly encrypted backups with offsite copies — and periodic restore drills, because a backup that has never been restored is not a backup.",
    detail: `Databases and object storage are backed up nightly, encrypted before leaving the host, and copied offsite.

The part that matters is the drill. Restores are performed into a scratch environment and checked against expected row counts and the most recent records. An untested backup is an assumption, and assumptions fail on the day you need them.

Recovery procedures are written as runbooks rather than held in someone's head, so the person recovering the system at 3am does not need to be the person who built it.`,
    origin: "OPERATED_BY_APEX",
    isPubliclyReachable: false,
    technologies: ["pg_dump", "object storage sync", "encryption at rest", "scheduled jobs"],
    evidence: [
      {
        label: "Backup frequency",
        value: "Nightly, encrypted, copied offsite",
        source: "Backup job configuration, 3 August 2026",
      },
      {
        label: "Recovery documentation",
        value: "Written runbooks per system",
        source: "Operations runbook set, 3 August 2026",
      },
    ],
  },
  {
    slug: "network-access",
    order: 8,
    status: "LIVE",
    title: "Zero open inbound ports",
    category: "security",
    summary:
      "Public services are published through outbound-only tunnels, and internal services are reachable only over a private mesh network. Nothing listens on the public internet directly.",
    detail: `Rather than opening ports and defending them, published services are reached through authenticated outbound tunnels terminating at an edge network. There is no inbound listener to scan, and no origin address to attack directly.

Internal services — dashboards, storage, administration — are not published at all. They are reachable only across a private mesh network with device-level identity.

The practical result is that the attack surface is the application, not the network.`,
    origin: "OPERATED_BY_APEX",
    isPubliclyReachable: false,
    technologies: ["Outbound tunnels", "edge WAF", "private mesh networking", "loopback binding"],
    evidence: [
      {
        label: "Public services",
        value: "Published via outbound tunnels — no inbound ports open",
        source: "Network configuration review, 3 August 2026",
      },
      {
        label: "Service binding",
        value: "Datastores bound to loopback only",
        source: "Container port configuration, 3 August 2026",
      },
    ],
  },
  {
    slug: "engineering-practice",
    order: 9,
    status: "LIVE",
    title: "How we work",
    category: "engineering",
    summary:
      "Typed codebases, tests that assert behaviour, quality gates in CI, and staging that resembles production because it is built from the same source.",
    detail: `Every project is TypeScript in strict mode or a comparably typed language. Tests assert behaviour rather than implementation. Continuous integration runs linting, type checking, unit tests, a build and a security scan on every change, and a failure blocks the merge.

Changes reach staging automatically and production only from a tagged release, after a health check passes. Database migrations run forward-only, with the rollback path tested on staging first.

This repository is built to the same standard, including the two gates that protect what we publish: a credibility audit and a positioning audit, both of which can fail a build.`,
    origin: "BUILT_BY_APEX",
    isPubliclyReachable: false,
    technologies: ["TypeScript", "Vitest", "Playwright", "GitHub Actions", "CodeQL", "Lighthouse CI"],
    evidence: [
      {
        label: "Merge gate",
        value: "Lint, typecheck, unit tests, build and security scan on every change",
        source: "CI workflow definitions in this repository",
      },
      {
        label: "Performance budget",
        value: "Mobile LCP ≤ 2.0s and ≤ 180KB of JavaScript, enforced in CI",
        source: "Lighthouse CI assertion configuration in this repository",
      },
    ],
  },
];

export const measuredAt = MEASURED;
