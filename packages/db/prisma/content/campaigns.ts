/**
 * Marketing campaigns.
 *
 * Each row is a named, addressable campaign. The `slug` is the value passed in
 * the `utm_campaign` query parameter on paid traffic and matched against
 * Attribution on lead submission, so the spend → lead → customer join is one
 * SQL query away.
 *
 * Seeds three campaigns that map to the services-first strategy: paid ads
 * driving traffic to the service landing pages and LP routes, with their
 * initial budgets declared.
 */

export interface CampaignSeed {
  slug: string;
  status: string;
  name: string;
  channel: "google-ads" | "meta" | "linkedin" | "email" | "organic";
  objective?: string;
  landingPath: string;
  budgetAmount?: number;
  budgetCurrency?: string;
  interestSlug?: string;
  startsAt?: string;
  endsAt?: string;
}

export const campaigns: CampaignSeed[] = [
  {
    slug: "apex-services-launch",
    status: "active",
    name: "Apex Services Launch",
    channel: "google-ads",
    objective: "leads",
    landingPath: "/services",
    budgetAmount: 5_000_00, // $5,000 in minor units
    budgetCurrency: "USD",
    interestSlug: "services",
  },
  {
    slug: "k8s-migration-q3",
    status: "active",
    name: "Kubernetes Migration Q3",
    channel: "linkedin",
    objective: "demos",
    landingPath: "/services/kubernetes-migration",
    budgetAmount: 8_000_00,
    budgetCurrency: "USD",
    interestSlug: "services",
  },
  {
    slug: "nova-demo-enterprise",
    status: "active",
    name: "Nova Agent Platform — Enterprise Demos",
    channel: "meta",
    objective: "demos",
    landingPath: "/saas/agent-platform",
    budgetAmount: 3_000_00,
    budgetCurrency: "USD",
    interestSlug: "product",
  },
];
