import type { Origin, PublishStatus } from "../../generated/client/index.js";

/**
 * The SaaS product catalogue.
 *
 * Only systems Apex can demonstrate AND support appear here, and each declares
 * its provenance. Anything with an unresolved legal or licensing question ships
 * as DRAFT: visible in the console, never rendered publicly. See the note on
 * the hosting platform below.
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
    // Running and reachable, but not yet on an Apex-owned domain. We offer a
    // demo rather than a link, because a link nobody can follow is worse than
    // no link. Flip this when the platform is published under Apex.
    isPubliclyReachable: false,
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
        description: "Every conversation gets an isolated execution environment with its own filesystem.",
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
    slug: "hosting-operations-platform",
    order: 2,
    // ── DRAFT, deliberately. Do not publish without a decision. ─────────────
    // The running system pairs a custom Next.js client portal and a licensing
    // service with WHMCS, a commercial product. Its README documents local
    // licence validation that removes the need for a WHMCS.com licence.
    //
    // Publishing that as an Apex product would be advertising circumvention of
    // another company's licensing — a legal exposure, and precisely the kind of
    // claim a technical buyer checks. The portal itself is genuinely ours and
    // is good work; the licensing arrangement is the problem.
    //
    // Options: (a) publish the client portal alone, on a properly licensed
    // WHMCS or an open-source billing core; (b) rebuild the billing layer;
    // (c) leave it out. Owner decision required — see PARTNER-BRIEF.md.
    status: "DRAFT",
    name: "Apex Hosting Operations",
    tagline: "Client portal and billing for hosting providers",
    category: "Platform",
    problem: `Hosting providers run their operations across a billing system, a control panel and a support desk that were never designed to talk to each other. Customers get three logins and three different answers.`,
    solution: `A single client portal over the billing system of record: services, invoices, payments and support in one place, with the provider's own branding and an operator view behind it.`,
    summary:
      "A hosting client portal and operator console over a billing system of record — services, invoices, payments and support behind one login.",
    origin: "BUILT_BY_APEX",
    isPubliclyReachable: false,
    demoAvailable: false,
    trialAvailable: false,
    internalNote:
      "Blocked pending a licensing decision on the third-party billing core. Do not move to LIVE until resolved.",
    features: [
      {
        title: "Unified client portal",
        description: "Services, invoices, payments and tickets behind a single login.",
        isShipped: true,
      },
      {
        title: "Direct billing integration",
        description: "Reads the billing system of record directly rather than through a fragile API layer.",
        isShipped: true,
      },
      {
        title: "Operator console",
        description: "Account, service and billing administration with an audit trail.",
        isShipped: true,
      },
    ],
    plans: [],
    faqs: [],
    seoTitle: "Apex Hosting Operations — client portal and billing",
    seoDescription:
      "A hosting client portal and operator console: services, invoices, payments and support behind one login.",
  },
];
