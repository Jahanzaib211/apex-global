import type { Origin, PublishStatus } from "../../generated/client/index.js";

/**
 * Modular AI Infrastructure Services.
 *
 * Eight independently purchasable modules, each with a fixed scope, fixed fee
 * and fixed timeline. Built and operated by Apex against an open-source
 * platform stack — provenance declared per the credibility rules, not implied.
 *
 * Pricing is published because it is the price. The typical-engagement range
 * for the same scope in a traditional consultancy sits at $121K–$400K for the
 * full catalogue; these flat fees are the work, not a discount on it.
 */

export interface ServiceSeed {
  slug: string;
  order: number;
  status: PublishStatus;
  name: string;
  tagline: string;
  summary: string;
  body?: string;
  icon: string;
  category: "foundation" | "platform" | "operations" | "security" | "knowledge";
  flatFeeAmount: number;
  feeCurrency: string;
  timelineDays: number;
  timelineLabel: string;
  origin: Origin;
  upstreamName?: string;
  upstreamUrl?: string;
  upstreamLicense?: string;
  deliverables: string[];
  outcomes: string[];
  technologies: string[];
  seoTitle: string;
  seoDescription: string;
}

export const services: ServiceSeed[] = [
  {
    slug: "architecture-design",
    order: 1,
    status: "LIVE",
    name: "Architecture & Design",
    tagline: "A documented target architecture before you commit to a build",
    summary:
      "A current-state audit, a target architecture with the components named, and a written migration path with the sequencing decided. The document is what gets the next two engagements signed — it scopes the work, not the hours.",
    icon: "compass",
    category: "foundation",
    flatFeeAmount: 4_000,
    feeCurrency: "USD",
    timelineDays: 5,
    timelineLabel: "5 days",
    origin: "OPERATED_BY_APEX",
    upstreamName: "CNCF landscape, Well-Architected Framework",
    upstreamLicense: "Various open-source",
    deliverables: [
      "Current-state audit (workloads, dependencies, failure modes)",
      "Target architecture with the components named and the trade-offs stated",
      "Migration pathway in phases, with the risks and the rollback points called out",
      "Reference deployment in your repository, ready for a follow-on module",
    ],
    outcomes: [
      "A document you can share with engineering, finance and the board",
      "A scope you can price a follow-on against — without a discovery phase",
      "A first production workload that ships the right way, not the fastest way",
    ],
    technologies: [
      "Kubernetes",
      "Terraform / OpenTofu",
      "CNCF landscape",
      "AWS / GCP / Azure / on-prem",
    ],
    seoTitle: "Architecture & Design — Fixed-fee infrastructure audit | Apex Global Tech Solution",
    seoDescription:
      "Five-day, fixed-fee architecture engagement. Current-state audit, target architecture, documented migration path, and a reference deployment.",
  },

  {
    slug: "kubernetes-migration",
    order: 2,
    status: "LIVE",
    name: "Kubernetes Migration",
    tagline: "Containerise, ship, and prove the cluster before handing it over",
    summary:
      "Workloads containerised, cluster provisioned, networking decided, secrets in place, first workload live in production. Three weeks from kickoff to a cluster you can extend without us.",
    icon: "boxes",
    category: "platform",
    flatFeeAmount: 18_000,
    feeCurrency: "USD",
    timelineDays: 21,
    timelineLabel: "3 weeks",
    origin: "OPERATED_BY_APEX",
    upstreamName: "Kubernetes, Helm, cert-manager",
    upstreamLicense: "Apache-2.0",
    deliverables: [
      "Containerised application with production-grade images and health checks",
      "Kubernetes cluster with networking, RBAC and a service mesh only where it pays for itself",
      "Ingress, TLS, certificate renewal, secrets management",
      "GitOps delivery: every change to a commit, every rollback a revert",
      "Workload migration with the data path tested end to end",
    ],
    outcomes: [
      "A cluster your team can extend without a Kubernetes specialist on call",
      "Deployments that are routine rather than events",
      "Cert renewals that nobody has to remember",
    ],
    technologies: [
      "Kubernetes",
      "Helm",
      "cert-manager",
      "GitOps (ArgoCD / Flux)",
      "container registries",
    ],
    seoTitle: "Kubernetes Migration — Fixed-scope migration engagement | Apex Global Tech Solution",
    seoDescription:
      "Three-week Kubernetes migration. Containerisation, cluster provisioning, networking, secrets, GitOps, and a workload live in production at handoff.",
  },

  {
    slug: "gateway-scaling",
    order: 3,
    status: "LIVE",
    name: "Gateway & Scaling",
    tagline: "Ingress, HPA, DB scaling, rate limits, and circuit breaking that earns its keep",
    summary:
      "A gateway that knows when to back off, horizontal pod autoscaling tuned to a real workload, database connection pooling, distributed caching, and the circuit breakers that decide what your system does when a dependency is sick.",
    icon: "gauge",
    category: "platform",
    flatFeeAmount: 9_000,
    feeCurrency: "USD",
    timelineDays: 14,
    timelineLabel: "2 weeks",
    origin: "OPERATED_BY_APEX",
    upstreamName: "NGINX / Envoy / Traefik, HPA, KEDA",
    upstreamLicense: "Apache-2.0",
    deliverables: [
      "Ingress and gateway configured for the workload, not a default chart",
      "Horizontal pod autoscaling tied to the right signal — not just CPU",
      "Database connection pooling and read-replica routing where it earns it",
      "Distributed cache with the invalidation path decided",
      "Circuit breakers with a documented fallback, not silent failure",
    ],
    outcomes: [
      "A platform that degrades gracefully under load, instead of falling over",
      "Cost that scales with traffic, not with idle replicas",
      "A way for dependent services to fail without taking you with them",
    ],
    technologies: [
      "NGINX / Envoy / Traefik",
      "HPA / KEDA",
      "PgBouncer / ProxySQL",
      "Redis",
      "Polly / resilience4j patterns",
    ],
    seoTitle: "Gateway & Scaling — Production traffic engineering | Apex Global Tech Solution",
    seoDescription:
      "Two-week fixed-scope engagement: ingress, autoscaling, DB pooling, distributed cache, circuit breakers with documented fallbacks.",
  },

  {
    slug: "ci-cd-gitops",
    order: 4,
    status: "LIVE",
    name: "CI/CD & GitOps",
    tagline: "A pipeline that runs the build, runs the tests, and only deploys what passed",
    summary:
      "Pipelines that test the build, fail it when the tests fail, and ship the artefact once. GitOps delivery with canary and blue/green strategies where they pay for themselves, not as default.",
    icon: "workflow",
    category: "platform",
    flatFeeAmount: 7_000,
    feeCurrency: "USD",
    timelineDays: 10,
    timelineLabel: "10 days",
    origin: "OPERATED_BY_APEX",
    upstreamName: "GitHub Actions, ArgoCD / Flux",
    upstreamLicense: "Various open-source",
    deliverables: [
      "CI pipeline: build, lint, typecheck, unit, integration, security scan — all blocking",
      "Artefact promotion across environments with the promotion rules written down",
      "GitOps delivery against the production cluster",
      "Canary and blue/green strategies where they earn the complexity",
      "Secrets management that never appears in a build log",
    ],
    outcomes: [
      "Releases that happen because the system decided they were ready, not because someone clicked",
      "Every deploy traceable to a commit and an artefact",
      "Rollbacks that take seconds, not an incident",
    ],
    technologies: [
      "GitHub Actions / GitLab CI",
      "ArgoCD / Flux",
      "Trivy / CodeQL",
      "Sigstore / cosign",
    ],
    seoTitle: "CI/CD & GitOps — Deployment pipelines that fail closed | Apex Global Tech Solution",
    seoDescription:
      "Ten-day fixed-scope engagement: a complete CI/CD and GitOps pipeline, with canary and blue/green where the complexity pays for itself.",
  },

  {
    slug: "observability-stack",
    order: 5,
    status: "LIVE",
    name: "Observability Stack",
    tagline: "Metrics, logs, traces, alerts, and dashboards that answer the question",
    summary:
      "A full observability pipeline: time-series metrics, aggregated logs, distributed tracing, dashboards, and alert routing that pages when it should and stays quiet when it shouldn't.",
    icon: "radar",
    category: "operations",
    flatFeeAmount: 6_000,
    feeCurrency: "USD",
    timelineDays: 10,
    timelineLabel: "10 days",
    origin: "OPERATED_BY_APEX",
    upstreamName: "Prometheus, Grafana, Loki, Alertmanager, OpenTelemetry",
    upstreamLicense: "Apache-2.0 / AGPL-3.0",
    deliverables: [
      "Metrics collection on every node and workload, with the cardinality decided",
      "Centralised log aggregation with retention tuned to the use case",
      "Distributed tracing across the request path",
      "Dashboards for the questions an on-call engineer actually asks at 3am",
      "Alert routing with documented runbooks attached",
    ],
    outcomes: [
      "“The site feels slow” becomes a question with an answer",
      "A degradation caught before it becomes an outage",
      "An on-call shift that is quiet most of the time and useful the rest",
    ],
    technologies: [
      "Prometheus",
      "Grafana",
      "Loki",
      "Alertmanager",
      "OpenTelemetry",
      "node-exporter / cAdvisor",
    ],
    seoTitle: "Observability Stack — Metrics, logs, traces and alerts | Apex Global Tech Solution",
    seoDescription:
      "Ten-day engagement: a complete observability stack — Prometheus, Grafana, Loki, tracing, dashboards and alert routing with runbooks.",
  },

  {
    slug: "security-hardening",
    order: 6,
    status: "LIVE",
    name: "Security Hardening",
    tagline: "Network policies, IAM, secrets rotation, and the audit trail to prove it",
    summary:
      "Network policies tightened, IAM scoped to what is actually used, secrets rotation automated, and an audit log that answers an auditor's question directly from the database. The hardening is the work; the audit log proves it was done.",
    icon: "shield",
    category: "security",
    flatFeeAmount: 8_000,
    feeCurrency: "USD",
    timelineDays: 14,
    timelineLabel: "2 weeks",
    origin: "OPERATED_BY_APEX",
    upstreamName: "Kubernetes RBAC, OPA / Kyverno, Trivy, OWASP ZAP",
    upstreamLicense: "Apache-2.0 / various open-source",
    deliverables: [
      "Network policies that follow least privilege rather than allowing-everything-by-default",
      "IAM scoped to what workloads actually call, not what the docs suggest",
      "Secrets rotation automated, with the rotation interval decided per secret class",
      "Container image scanning on every build and on a schedule",
      "Audit logging with append-only records of every privileged action",
    ],
    outcomes: [
      "An audit that an auditor can read in a sitting, not an archaeology project",
      "A breach surface that is the application, not the network",
      "Credentials that rotate without waking anyone up",
    ],
    technologies: [
      "Kubernetes RBAC / NetworkPolicy",
      "OPA / Kyverno",
      "Trivy",
      "OWASP ZAP",
      "HashiCorp Vault / External Secrets",
    ],
    seoTitle: "Security Hardening — Network, IAM, secrets and audit | Apex Global Tech Solution",
    seoDescription:
      "Two-week fixed-scope engagement: network policies, scoped IAM, secrets rotation, image scanning, and an append-only audit log.",
  },

  {
    slug: "helm-automation",
    order: 7,
    status: "LIVE",
    name: "Helm Charts & Automation",
    tagline: "Charts that version cleanly, deploy predictably, and roll back without drama",
    summary:
      "Helm charts written for reuse, not for one application. Versioned, tested, with documented values, and a deployment automation that fails closed rather than ships what was not asked for.",
    icon: "package",
    category: "platform",
    flatFeeAmount: 3_000,
    feeCurrency: "USD",
    timelineDays: 5,
    timelineLabel: "5 days",
    origin: "OPERATED_BY_APEX",
    upstreamName: "Helm, helm-unittest, chart-testing",
    upstreamLicense: "Apache-2.0",
    deliverables: [
      "Charts for the applications in scope, with the values documented",
      "Chart tests that assert behaviour, not just template rendering",
      "Versioning and changelog discipline",
      "Deployment automation with a documented rollback path",
    ],
    outcomes: [
      "Charts another team can adopt without a Slack thread",
      "A rollback that takes seconds rather than an incident bridge",
      "Deployments that fail closed on a missing value",
    ],
    technologies: ["Helm", "helm-unittest", "chart-testing", "ArgoCD / Flux"],
    seoTitle:
      "Helm Charts & Automation — Versioned, tested, deployable | Apex Global Tech Solution",
    seoDescription:
      "Five-day engagement: Helm charts with tests, versioning, changelog discipline, and deployment automation with documented rollbacks.",
  },

  {
    slug: "documentation-runbooks",
    order: 8,
    status: "LIVE",
    name: "Documentation & Runbooks",
    tagline: "The handover that lets the next engineer run the system without us",
    summary:
      "Architecture Decision Records, runbooks for the incidents you have already had, operations guides written for whoever inherits the system at 3am. Documentation is part of the deliverable, not a follow-up.",
    icon: "book",
    category: "knowledge",
    flatFeeAmount: 4_000,
    feeCurrency: "USD",
    timelineDays: 7,
    timelineLabel: "7 days",
    origin: "OPERATED_BY_APEX",
    deliverables: [
      "Architecture Decision Records for the decisions made in the engagement",
      "Incident runbooks for the failures you have actually had, plus the ones you should expect",
      "Operations guide written for the person who joins in six months",
      "Performance test results as a baseline, with the workload profile documented",
    ],
    outcomes: [
      "Knowledge that lives in the repository rather than in someone's head",
      "An incident response that does not depend on who is on shift",
      "A baseline you can compare against, not a feeling",
    ],
    technologies: ["Markdown / MkDocs", "ADRs (MADR / Nygard)", "k6 / Gatling / Locust"],
    seoTitle: "Documentation & Runbooks — The handover that survives | Apex Global Tech Solution",
    seoDescription:
      "Seven-day engagement: ADRs, incident runbooks, operations guides and a performance baseline — documentation as a deliverable.",
  },
];

export interface ServiceBundleSeed {
  slug: string;
  order: number;
  status: PublishStatus;
  name: string;
  tagline: string;
  summary: string;
  body?: string;
  serviceSlugs: string[];
  bundlePriceAmount: number;
  sumPriceAmount: number;
  feeCurrency: string;
  bestFor: string;
  outcomes: string[];
  seoTitle: string;
  seoDescription: string;
}

export const serviceBundles: ServiceBundleSeed[] = [
  {
    slug: "starter",
    order: 1,
    status: "LIVE",
    name: "Starter",
    tagline: "The first production workload, shipped the right way",
    summary:
      "Architecture, CI/CD, Helm charts and runbooks. Enough to put one production workload on Kubernetes and know what happens when it breaks.",
    serviceSlugs: [
      "architecture-design",
      "ci-cd-gitops",
      "helm-automation",
      "documentation-runbooks",
    ],
    bundlePriceAmount: 17_000,
    sumPriceAmount: 18_000,
    feeCurrency: "USD",
    bestFor:
      "Pre-production teams shipping their first Kubernetes workload. You want a documented foundation and a deployment pipeline before the second one goes out.",
    outcomes: [
      "One production workload live, with monitoring, CI/CD and documentation",
      "A pattern the next workloads can copy",
      "A team that has run it once under the supervision of someone who has",
    ],
    seoTitle: "Starter Bundle — $17K fixed-scope engagement | Apex Global Tech Solution",
    seoDescription:
      "Architecture, CI/CD, Helm charts and runbooks. The minimum viable foundation for production Kubernetes.",
  },
  {
    slug: "growth",
    order: 2,
    status: "LIVE",
    name: "Growth",
    tagline: "Migration plus observability, on top of the Starter foundation",
    summary:
      "Adds the Kubernetes Migration and Observability Stack to the Starter foundation. First production workload, fully monitored, with automated deployment and rollback.",
    serviceSlugs: [
      "architecture-design",
      "kubernetes-migration",
      "ci-cd-gitops",
      "observability-stack",
      "helm-automation",
    ],
    bundlePriceAmount: 38_000,
    sumPriceAmount: 44_000,
    feeCurrency: "USD",
    bestFor:
      "Teams taking their first workload to production on Kubernetes. You want it observable from day one.",
    outcomes: [
      "Migration complete, with the production workload monitored end to end",
      "An on-call shift that is quiet most of the time and useful the rest",
      "A platform that can carry the next two workloads without a re-engagement",
    ],
    seoTitle: "Growth Bundle — $38K fixed-scope engagement | Apex Global Tech Solution",
    seoDescription:
      "Architecture, K8s migration, CI/CD, observability and Helm charts. First production workload, fully monitored.",
  },
  {
    slug: "scale",
    order: 3,
    status: "LIVE",
    name: "Scale",
    tagline: "The full catalogue, in a coordinated sequence",
    summary:
      "Complete platform engineering programme: architecture, migration, gateway and scaling, CI/CD, observability, security, automation and runbooks. Equivalent in scope to a $1.1M enterprise engagement.",
    serviceSlugs: [
      "architecture-design",
      "kubernetes-migration",
      "gateway-scaling",
      "ci-cd-gitops",
      "observability-stack",
      "security-hardening",
      "helm-automation",
      "documentation-runbooks",
    ],
    bundlePriceAmount: 48_000,
    sumPriceAmount: 59_000,
    feeCurrency: "USD",
    bestFor:
      "Teams replacing their entire platform engineering stack. You want everything done, end to end, with a single point of accountability.",
    outcomes: [
      "The platform engineering function, delivered — not just the pieces",
      "A security posture that can be shown to an auditor rather than described",
      "An operations practice that survives the next on-call rotation",
    ],
    seoTitle: "Scale Bundle — $48K fixed-scope engagement | Apex Global Tech Solution",
    seoDescription:
      "All eight modules in a coordinated sequence. Complete platform engineering programme, one engagement, one point of accountability.",
  },
];
