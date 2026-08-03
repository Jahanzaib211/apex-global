/** Industry pages: challenge → technology → business outcome. */

export interface IndustrySeed {
  slug: string;
  order: number;
  name: string;
  tagline: string;
  challenge: string;
  approach: string;
  outcome: string;
  solutionSlugs: string[];
  seoTitle: string;
  seoDescription: string;
}

export const industries: IndustrySeed[] = [
  {
    slug: "financial-services",
    order: 1,
    name: "Financial Services",
    tagline: "Systems that have to be right, and have to prove it",
    challenge:
      "Financial systems carry two burdens at once: correctness that is not negotiable, and an auditor who will ask, months later, who changed what and on whose authority. Most internal tooling answers the first and improvises the second.",
    approach:
      "We build the audit trail as a first-class part of the data model rather than a logging afterthought — append-only records of every privileged action, immutable transaction history, and role-based access enforced on the server for every mutation. Money values are integers in minor units; floating point does not appear anywhere near a balance.",
    outcome:
      "A system that answers an auditor's question directly from the database, and a permissions model that can be shown to a compliance reviewer rather than described to them.",
    solutionSlugs: ["software-development", "cybersecurity", "cloud-solutions"],
    seoTitle: "Technology for Financial Services | Apex Global Tech Solution",
    seoDescription:
      "Financial systems built for correctness and auditability: immutable transaction history, append-only audit trails and server-enforced access control.",
  },
  {
    slug: "healthcare",
    order: 2,
    name: "Healthcare",
    tagline: "Patient data handled with the care it requires",
    challenge:
      "Healthcare software carries sensitive data across systems that were never designed to interoperate, under regulatory obligations where a mistake is not merely commercial.",
    approach:
      "Encryption at rest and in transit as a baseline, access control scoped to clinical role, audit logging of every record access, and integration built on healthcare interchange standards rather than bespoke exports. Data retention and deletion are designed in, not bolted on when someone asks.",
    outcome:
      "Systems that clinicians will actually use, with the access records and retention controls a regulator expects to see.",
    solutionSlugs: ["software-development", "cybersecurity", "digital-transformation"],
    seoTitle: "Healthcare Technology Solutions | Apex Global Tech Solution",
    seoDescription:
      "Healthcare systems with encryption, role-scoped access, full access auditing and standards-based interoperability.",
  },
  {
    slug: "logistics",
    order: 3,
    name: "Logistics & Supply Chain",
    tagline: "Operational visibility while the operation is running",
    challenge:
      "Supply chain operations generate a continuous stream of state changes across parties who each hold part of the picture. Reconciliation happens at month end, which is far too late for anyone to act on it.",
    approach:
      "Event-driven architecture with a durable event log, so state is reconstructed rather than guessed. Real-time dashboards for operations, integration with partner systems, and exception alerting that surfaces the movement that is going wrong today instead of the summary that explains it in four weeks.",
    outcome:
      "Problems visible while they can still be fixed, and a reconciliation that is a report rather than an investigation.",
    solutionSlugs: ["software-development", "cloud-solutions", "digital-transformation"],
    seoTitle: "Logistics & Supply Chain Technology | Apex Global Tech Solution",
    seoDescription:
      "Event-driven logistics platforms with real-time operational visibility, partner integration and exception alerting.",
  },
  {
    slug: "ecommerce",
    order: 4,
    name: "E-commerce & Retail",
    tagline: "Platforms that hold up on the day that matters",
    challenge:
      "Retail traffic is not uniform. A platform that is comfortable all year can fail in the four hours that generate a disproportionate share of annual revenue, and it usually fails at checkout.",
    approach:
      "Load testing against realistic peak profiles rather than averages, caching designed around the read patterns that actually occur, checkout paths built to degrade gracefully when a dependency slows, and autoscaling that has been rehearsed rather than configured and hoped for.",
    outcome:
      "Peak days that pass without incident, and a checkout that stays available when a payment provider does not.",
    solutionSlugs: ["software-development", "cloud-solutions", "devops-infrastructure"],
    seoTitle: "E-commerce Technology & Platform Engineering | Apex Global Tech Solution",
    seoDescription:
      "E-commerce platforms engineered for peak load: realistic load testing, graceful degradation at checkout and rehearsed autoscaling.",
  },
  {
    slug: "professional-services",
    order: 5,
    name: "Professional Services",
    tagline: "Billable time reclaimed from administration",
    challenge:
      "Professional firms lose margin to administration: time recorded twice, invoices assembled by hand, client documents scattered across email, and a partner's judgement needed for work a system could route.",
    approach:
      "Consolidate on one system of record. Time capture at the point of work, invoicing generated from it, a client portal for documents and approvals, and workflow automation for the routing decisions that follow rules rather than judgement.",
    outcome:
      "Higher recorded utilisation without anyone working longer, and invoices that go out in days rather than weeks.",
    solutionSlugs: ["software-development", "digital-transformation", "ai-automation"],
    seoTitle: "Technology for Professional Services Firms | Apex Global Tech Solution",
    seoDescription:
      "Consolidated systems for professional firms: time capture, automated invoicing, client portals and workflow automation.",
  },
  {
    slug: "technology-startups",
    order: 6,
    name: "Technology & Startups",
    tagline: "Building for the scale after the one you are at",
    challenge:
      "Early-stage teams face a genuine dilemma. Build for scale you do not have and you run out of money; build only for today and you rewrite everything at the worst possible moment.",
    approach:
      "We are explicit about which decisions are expensive to reverse and which are not. Data model, tenancy and authentication are worth getting right early because changing them later is surgery. Almost everything else can be simple until it needs not to be.",
    outcome:
      "A system that survives the next order of magnitude without a rewrite, built at a cost proportionate to the stage you are actually at.",
    solutionSlugs: ["saas-development", "software-development", "technology-consulting"],
    seoTitle: "Technology Partner for Startups & Scale-ups | Apex Global Tech Solution",
    seoDescription:
      "Engineering for early-stage teams: getting the expensive-to-reverse decisions right without over-building the rest.",
  },
];
