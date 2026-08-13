/**
 * The technology stack the site actually operates.
 *
 * Single source of truth for the homepage tech-stack marquee and the
 * Technology page proof. Every entry is technology this platform actually
 * runs — verified against the machine (docker ps, pm2 jlist, kubectl get
 * pods) on 2026-08-07. Never aspirational: if it is not running here, it is
 * not on the list. Label third-party/open-source honestly (the credibility
 * audit enforces this).
 *
 * The homepage marquee renders these as three labelled bands, in this order:
 * Security → Technologies → Next Frontier.
 */

/** A labelled band on the marquee. `items` are the running technologies. */
export interface TechSection {
  label: string;
  blurb: string;
  items: string[];
}

export const TECH_SECTIONS: TechSection[] = [
  {
    label: "Security",
    blurb: "What we run to secure what we run",
    items: [
      "GVM / OpenVAS",
      "OWASP ZAP",
      "BloodHound",
      "Falco",
      "cert-manager",
      "Cloudflare Tunnel",
      "Zero Trust",
    ],
  },
  {
    label: "Technologies",
    blurb: "The stack our developers actually run",
    items: [
      "Docker",
      "Kubernetes",
      "Helm",
      "Flux",
      "NGINX",
      "PostgreSQL",
      "TimescaleDB",
      "Redis",
      "MinIO",
      "Meilisearch",
      "Chatwoot",
      "Next.js",
      "React",
      "Node.js",
      "TypeScript",
      "Go",
      "Rust",
      "Python",
      "BullMQ",
      "OpenTelemetry",
      "Prometheus",
      "Grafana",
      "Loki",
    ],
  },
  {
    label: "Next Frontier",
    blurb: "The agentic AI stack that runs in-house",
    items: [
      "LangGraph",
      "LangChain",
      "Ollama",
      "Qwen",
      "Open WebUI",
      "SearXNG",
      "LiteLLM",
      "pgvector",
      "Hugging Face",
    ],
  },
] as const;

/** Flat list, derived from the sections — kept for convenience/tests. */
export const TECH_STACK: { name: string; group: string }[] = TECH_SECTIONS.flatMap((s) =>
  s.items.map((name) => ({ name, group: s.label })),
);

export type TechStackItem = (typeof TECH_STACK)[number];
