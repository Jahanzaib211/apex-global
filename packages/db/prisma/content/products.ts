import type { Origin, PublishStatus } from "../../generated/client/index.js";

/**
 * The SaaS product catalogue.
 *
 * Only systems Apex can demonstrate AND support appear here, and each declares
 * its provenance. Anything with an unresolved legal or licensing question ships
 * as DRAFT: visible in the console, never rendered publicly.
 *
 * Note on third-party dependencies: we do not enumerate the commercial systems
 * a platform integrates with, the same way no product page lists its database
 * vendor. That is different from provenance — where work derives from an
 * open-source project, `upstreamName` and `upstreamLicense` are mandatory and
 * render on the page.
 */

export interface ProductSeed {
  slug: string;
  order: number;
  status: PublishStatus;
  name: string;
  tagline: string;
  category: string;
  problem: string;
  solution: string;
  summary: string;
  origin: Origin;
  upstreamName?: string;
  upstreamUrl?: string;
  upstreamLicense?: string;
  isPubliclyReachable: boolean;
  publicUrl?: string;
  loginUrl?: string;
  demoAvailable: boolean;
  trialAvailable: boolean;
  securityNotes?: string;
  internalNote?: string;
  features: Array<{ title: string; description: string; benefit?: string; isShipped: boolean }>;
  plans: Array<{
    name: string;
    description: string;
    priceAmount: number | null;
    pricePeriod: string | null;
    isCustom: boolean;
    isFeatured: boolean;
    features: string[];
  }>;
  faqs: Array<{ question: string; answer: string }>;
  seoTitle: string;
  seoDescription: string;
}

export const products: ProductSeed[] = [
  {
    slug: "agent-platform",
    order: 1,
    status: "LIVE",
    name: "Apex Agent Platform",
    tagline: "An AI agent that shows its work",
    category: "AI & Automation",
    problem: `AI agents fail quietly. They report success on work they did not finish, edit the wrong file, or loop on a broken assumption — and by the time anyone notices, the transcript is thousands of tokens long and nobody can tell where it went wrong.

The usual interface makes this worse. A chat window shows you the conversation, not the work: not what was executed, what changed on disk, or whether the thing it built actually renders.`,
    solution: `The platform streams the agent's own workspace while it works — terminal output, a file editor with live diffs, a browser preview of what it built, and a timeline of every action taken.

It also verifies itself. When the agent ships a build, it runs a headless browser against the result, checks for console errors and blank renders, captures a screenshot, and feeds that back to the model so it can see what it actually produced rather than what it intended.

Work runs in per-thread sandboxes, so an agent editing one project cannot reach another.`,
    summary:
      "A full-stack AI agent platform with live visibility into what the agent is doing — terminal, editor diffs, browser preview and activity timeline — plus a self-verification loop that tests its own output before reporting success.",
    origin: "BUILT_BY_APEX",
    upstreamName: "DeerFlow",
    upstreamUrl: "https://github.com/bytedance/deer-flow",
    upstreamLicense: "MIT",
    isPubliclyReachable: true,
    publicUrl: "https://nova.alilabsx.com",
    demoAvailable: true,
    trialAvailable: false,
    securityNotes:
      "Each conversation executes in an isolated sandbox. Model provider credentials are held server-side and never reach the browser. All agent actions are recorded on the activity timeline.",
    features: [
      {
        title: "Live agent workspace",
        description:
          "Six synchronised views — terminal, editor with red/green diffs, browser preview, activity timeline, file tree and review — streaming as the agent works.",
        benefit: "You see the work, not a summary of it.",
        isShipped: true,
      },
      {
        title: "Self-verification loop",
        description:
          "On a shipped build or a dev-server-ready signal, the agent runs headless-browser checks for console errors and blank renders, captures a screenshot, and reviews it through a vision model.",
        benefit: "Broken output is caught by the agent, not by you.",
        isShipped: true,
      },
      {
        title: "Sub-agent orchestration",
        description:
          "Work is decomposed across specialised sub-agents with their own context, coordinated by a planner.",
        benefit: "Long tasks stay coherent past the point a single context window would fail.",
        isShipped: true,
      },
      {
        title: "Per-thread sandboxes",
        description:
          "Every conversation gets an isolated execution environment with its own filesystem.",
        benefit: "One task cannot damage another, or the host.",
        isShipped: true,
      },
      {
        title: "Extensible skills",
        description: "Capabilities are added as skills without modifying the core runtime.",
        benefit: "Extend it for your domain without forking it.",
        isShipped: true,
      },
      {
        title: "Model routing and budgets",
        description:
          "Requests are routed across providers with per-workspace budget tracking and failover.",
        benefit: "Cost is bounded and a provider outage is not an outage for you.",
        isShipped: true,
      },
    ],
    plans: [
      {
        name: "Managed",
        description: "We host and operate the platform for your team.",
        priceAmount: null,
        pricePeriod: null,
        isCustom: true,
        isFeatured: true,
        features: [
          "Hosted and operated by Apex",
          "Your choice of model provider",
          "Isolated per-tenant sandboxes",
          "Monitoring, backups and updates included",
        ],
      },
      {
        name: "Self-hosted",
        description: "Deployed into your own infrastructure, with support.",
        priceAmount: null,
        pricePeriod: null,
        isCustom: true,
        isFeatured: false,
        features: [
          "Runs in your environment",
          "Your data never leaves your infrastructure",
          "Deployment, hardening and handover",
          "Support and update path",
        ],
      },
    ],
    faqs: [
      {
        question: "Which AI models does it work with?",
        answer:
          "Model access goes through a routing layer, so hosted providers and self-hosted open-weight models can be used together and switched without application changes.",
      },
      {
        question: "Is this your own software or a fork?",
        answer:
          "It is built on DeerFlow, an open-source agent harness released under the MIT licence. Apex added the live workspace, the verification loop, sub-agent orchestration and the sandbox model — 35,738 lines across 338 files, measured against the upstream release tag. The upstream licence and copyright notices are preserved.",
      },
      {
        question: "Can it run entirely inside our network?",
        answer:
          "Yes. Self-hosted deployment with local model inference is supported, so no request leaves your infrastructure.",
      },
    ],
    seoTitle: "Apex Agent Platform — AI agents with visible execution",
    seoDescription:
      "An AI agent platform with live terminal, editor diff and browser preview, plus a self-verification loop that tests its own output. Managed or self-hosted.",
  },

  {
    slug: "fox-hosting",
    order: 2,
    status: "LIVE",
    name: "Fox Hosting",
    tagline: "A hosting business, and the platform that runs it",
    category: "Hosting & Platform",
    problem: `Hosting customers are usually handed three systems that were never designed to speak to each other: one for billing, one for controlling the service, and one for support. Three logins, three sets of state, and three different answers to "what am I actually paying for?"

For the provider it is worse. Provisioning, invoicing and support each hold part of the truth, so reconciling them is manual, and the manual work scales with the customer count.`,
    solution: `One portal. A customer signs in once and sees their services, invoices, payments and support history in the same place, in the provider's own branding.

Behind it sits an operator console with role-based access and an audit trail, and a licensing service that issues and validates entitlements without depending on an external check at runtime.

Apex builds and operates the whole stack — the portal, the operator surface, the licensing service and the infrastructure underneath it.`,
    summary:
      "A live hosting platform: unified client portal, operator console with audit trail, and an entitlement service — built and operated end to end.",
    origin: "BUILT_BY_APEX",
    isPubliclyReachable: true,
    publicUrl: "https://client.alilabsx.com",
    demoAvailable: true,
    trialAvailable: false,
    securityNotes:
      "Customer sessions are separated from operator sessions, with role-based access enforced server-side on every action and an append-only audit record of privileged changes. The service is published through an outbound tunnel behind an edge WAF; the origin has no open inbound ports.",
    features: [
      {
        title: "Unified client portal",
        description:
          "Services, invoices, payments and support history behind a single sign-in, presented in the provider's own branding.",
        benefit: "One login and one version of the truth, instead of three.",
        isShipped: true,
      },
      {
        title: "Operator console",
        description:
          "Account, service and billing administration with role-based access and an append-only audit trail.",
        benefit: "Support can resolve an issue without a database client.",
        isShipped: true,
      },
      {
        title: "Entitlement and licensing service",
        description:
          "Issues and validates what each account is entitled to, without a runtime dependency on an external check.",
        benefit: "A third-party outage cannot lock your customers out of their own services.",
        isShipped: true,
      },
      {
        title: "Direct integration with the system of record",
        description:
          "Reads billing state directly rather than through an intermediate API layer, so the portal and the invoice can never disagree.",
        benefit: "Billing and entitlements stay consistent by construction.",
        isShipped: true,
      },
      {
        title: "Operated infrastructure",
        description:
          "Containerised services with health checks, monitoring and nightly backups, published through an outbound tunnel behind an edge WAF.",
        benefit: "The platform is run, not just delivered.",
        isShipped: true,
      },
    ],
    plans: [
      {
        name: "Platform build",
        description: "We build the portal and operator surface on your billing system of record.",
        priceAmount: null,
        pricePeriod: null,
        isCustom: true,
        isFeatured: true,
        features: [
          "Client portal in your branding",
          "Operator console with RBAC and audit trail",
          "Entitlement service",
          "Deployment, monitoring and handover",
        ],
      },
      {
        name: "Build and operate",
        description: "As above, and we run it — monitoring, patching, backups and support.",
        priceAmount: null,
        pricePeriod: null,
        isCustom: true,
        isFeatured: false,
        features: [
          "Everything in Platform build",
          "Monitoring and incident response",
          "Patching and scheduled maintenance",
          "Backups with periodic restore verification",
        ],
      },
    ],
    faqs: [
      {
        question: "Is this a product I can buy, or a platform you build for me?",
        answer:
          "Both. Fox Hosting is a hosting business we run on this platform, which is also how we prove it works. For other providers we build the same stack against their own billing system of record and either hand it over or operate it.",
      },
      {
        question: "Can we see it running?",
        answer:
          "Yes. The public portal is live and the customer dashboard sits behind sign-in — we will walk you through the authenticated views, including the operator console, on a call.",
      },
      {
        question: "Does it work with our existing billing system?",
        answer:
          "That is the normal case. The portal reads your system of record directly rather than replacing it, so migration risk stays low and your finance process does not change.",
      },
    ],
    seoTitle: "Fox Hosting — hosting client portal and operator platform",
    seoDescription:
      "A live hosting platform built and operated by Apex: unified client portal, operator console with audit trail, and an entitlement service.",
  },
];
