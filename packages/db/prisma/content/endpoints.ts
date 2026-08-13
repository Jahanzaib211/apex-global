import type { Origin, PublishStatus } from "../../generated/client/index.js";

/**
 * Live endpoints we operate, surfaced as proof on the Technology page.
 *
 * Two kinds of endpoint:
 *
 *   - tunnel: a Cloudflare-published hostname backed by a loopback service.
 *     These carry a `publicUrl` and are safe to link from the public site.
 *
 *   - loopback-service: an internal service reachable only over the private
 *     mesh network. These are not linked from the public site, but they
 *     appear on the Technology page as evidence of what runs behind the
 *     edge.
 *
 * WHMCS (admin.alilabsx.com) is intentionally absent. It is an operator-only
 * surface and the partner relationship is the only reason it exists.
 */

export interface LiveEndpointSeed {
  slug: string;
  order: number;
  status: PublishStatus;
  name: string;
  kind: "tunnel" | "loopback-service" | "internal-app";
  publicUrl?: string;
  originLoopback?: string;
  summary: string;
  role: string;
  origin: Origin;
  upstreamName?: string;
  upstreamUrl?: string;
  upstreamLicense?: string;
  isPubliclyLinkable: boolean;
}

export const liveEndpoints: LiveEndpointSeed[] = [
  // ── Published tunnel endpoints (safe to link) ───────────────────────────
  {
    slug: "tunnel-tech-apex",
    order: 1,
    status: "LIVE",
    name: "tech.apexgroupcompanies.com",
    kind: "tunnel",
    publicUrl: "https://tech.apexgroupcompanies.com",
    originLoopback: "127.0.0.1:4300",
    summary: "The Apex Global Tech Solution public website",
    role: "The corporate site you are reading this on. The Next.js application behind the marketing surface, served via a Cloudflare tunnel that terminates at the loopback origin.",
    origin: "BUILT_BY_APEX",
    isPubliclyLinkable: true,
  },
  {
    slug: "tunnel-nova",
    order: 2,
    status: "LIVE",
    name: "nova.alilabsx.com",
    kind: "tunnel",
    publicUrl: "https://nova.alilabsx.com",
    originLoopback: "127.0.0.1:2026",
    summary: "Apex Agent Platform — production AI agent runtime",
    role: "A live multi-agent AI platform with 32 tools, sub-agent orchestration, per-thread Docker sandboxes, six IM channel integrations and a self-verification loop. The codebase is +35,738 lines of original work on top of the open-source DeerFlow harness (MIT).",
    origin: "BUILT_BY_APEX",
    upstreamName: "DeerFlow",
    upstreamUrl: "https://github.com/bytedance/deer-flow",
    upstreamLicense: "MIT",
    isPubliclyLinkable: true,
  },
  {
    slug: "tunnel-fox-hosting",
    order: 3,
    status: "LIVE",
    name: "client.alilabsx.com",
    kind: "tunnel",
    publicUrl: "https://client.alilabsx.com",
    originLoopback: "127.0.0.1:4200",
    summary: "Fox Hosting — live client portal for an operating hosting business",
    role: "A live hosting platform serving real customers. Client portal, operator console, entitlement service — the same platform we build and operate for other providers. A platform demonstrated by being in production.",
    origin: "BUILT_BY_APEX",
    isPubliclyLinkable: true,
  },
  {
    slug: "tunnel-apex-group",
    order: 4,
    status: "LIVE",
    name: "apex.apexgroupcompanies.com",
    kind: "tunnel",
    publicUrl: "https://apex.apexgroupcompanies.com",
    originLoopback: "127.0.0.1:3103",
    summary: "Apex Group corporate surface",
    role: "The Apex Group corporate surface, served from the same edge and tunnel infrastructure as the technology site. The proof that the platform engineering runs more than one front consistently.",
    origin: "BUILT_BY_APEX",
    isPubliclyLinkable: true,
  },
  {
    slug: "tunnel-apex-tours",
    order: 5,
    status: "LIVE",
    name: "tours.apexgroupcompanies.com",
    kind: "tunnel",
    publicUrl: "https://tours.apexgroupcompanies.com",
    originLoopback: "127.0.0.1:3001",
    summary: "Apex Travel & Tour — operational front",
    role: "Operational front on the same engineering platform. Different business, same edge, same deployment pipeline.",
    origin: "BUILT_BY_APEX",
    isPubliclyLinkable: true,
  },
  {
    slug: "tunnel-apex-outsourcing",
    order: 6,
    status: "LIVE",
    name: "outsourcing.apexgroupcompanies.com",
    kind: "tunnel",
    publicUrl: "https://outsourcing.apexgroupcompanies.com",
    originLoopback: "127.0.0.1:3100",
    summary: "Apex Outsourcing — operational front",
    role: "Operational front on the same engineering platform. Different business, same edge, same deployment pipeline.",
    origin: "BUILT_BY_APEX",
    isPubliclyLinkable: true,
  },
  {
    slug: "tunnel-apex-holdings",
    order: 7,
    status: "LIVE",
    name: "holdings.apexgroupcompanies.com",
    kind: "tunnel",
    publicUrl: "https://holdings.apexgroupcompanies.com",
    originLoopback: "127.0.0.1:3102",
    summary: "Apex Holdings — operational front",
    role: "Operational front on the same engineering platform. Different business, same edge, same deployment pipeline.",
    origin: "BUILT_BY_APEX",
    isPubliclyLinkable: true,
  },

  // ── Loopback services (not linked from public site) ──────────────────────
  {
    slug: "loopback-postgres",
    order: 8,
    status: "LIVE",
    name: "PostgreSQL primary",
    kind: "loopback-service",
    originLoopback: "127.0.0.1:5437",
    summary: "Relational system of record, bound to loopback",
    role: "PostgreSQL 16 holding every record the platform reads or writes: content, leads, audit log, settings, integrations vault, AI provider metadata. Bound to 127.0.0.1:5437 — no public listener, never reachable except from applications on the same host.",
    origin: "OPERATED_BY_APEX",
    upstreamName: "PostgreSQL",
    upstreamLicense: "PostgreSQL License (open-source)",
    isPubliclyLinkable: false,
  },
  {
    slug: "loopback-redis",
    order: 9,
    status: "LIVE",
    name: "Redis",
    kind: "loopback-service",
    originLoopback: "127.0.0.1:6381",
    summary: "Cache, queues and rate-limit counters",
    role: "Redis 7 with AOF persistence for queues, caching, and rate-limit counters. Bound to loopback. The BullMQ worker tier runs against this instance.",
    origin: "OPERATED_BY_APEX",
    upstreamName: "Redis",
    upstreamLicense: "BSD-3-Clause (open-source)",
    isPubliclyLinkable: false,
  },
  {
    slug: "loopback-minio",
    order: 10,
    status: "LIVE",
    name: "MinIO object storage",
    kind: "loopback-service",
    originLoopback: "127.0.0.1:9020",
    summary: "S3-compatible object storage on loopback",
    role: "S3-compatible storage for media assets, KYC documents, generated artefacts. Bucket `apex-media`. Operator console on a separate port.",
    origin: "OPERATED_BY_APEX",
    upstreamName: "MinIO",
    upstreamLicense: "AGPL-3.0 (open-source)",
    isPubliclyLinkable: false,
  },
  {
    slug: "loopback-meilisearch",
    order: 11,
    status: "LIVE",
    name: "Meilisearch",
    kind: "loopback-service",
    originLoopback: "127.0.0.1:7701",
    summary: "Search index for product and insight content",
    role: "Meilisearch 1.11 indexing product features, insights, and case studies for the in-product search surfaces. Master-key authenticated.",
    origin: "OPERATED_BY_APEX",
    upstreamName: "Meilisearch",
    upstreamLicense: "MIT",
    isPubliclyLinkable: false,
  },
  {
    slug: "loopback-console",
    order: 12,
    status: "LIVE",
    name: "Apex operator console",
    kind: "internal-app",
    originLoopback: "127.0.0.1:4301",
    summary: "The internal administration application",
    role: "The Next.js console for content, leads, settings and audit. Deliberately not behind the tunnel — reachable only on loopback or over the private mesh network. Holds the encrypted credentials vault and the audit log.",
    origin: "BUILT_BY_APEX",
    isPubliclyLinkable: false,
  },
  {
    slug: "loopback-chatwoot",
    order: 13,
    status: "LIVE",
    name: "Chatwoot live chat & helpdesk",
    kind: "loopback-service",
    originLoopback: "127.0.0.1:4800",
    summary: 'Self-hosted live-chat and helpdesk inbox (the widget behind "talk to a real person")',
    role: "The chat launcher on the public site mounts Chatwoot's widget. Chatwoot runs self-hosted as a Rails web tier plus Sidekiq worker, fronted by its own PostgreSQL/Redis, on loopback — the same edge-in-front, loopback-origin pattern as every other published service. The public widget is configured per-seller; the inbox itself stays on this machine and is never directly exposed.",
    origin: "THIRD_PARTY_OSS",
    upstreamName: "Chatwoot",
    upstreamUrl: "https://www.chatwoot.com",
    upstreamLicense: "MIT",
    isPubliclyLinkable: false,
  },
];
