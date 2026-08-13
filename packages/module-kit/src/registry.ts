import { assertDependencies, defineModule, type ApexModule } from "./index";

/**
 * The module registry.
 *
 * `active` modules are built and contribute navigation. `planned` modules ship
 * their spec (modules/<id>/README.md) and schema stub only — documented so the
 * design holds, and switching one on is a status change plus an
 * implementation, not a redesign.
 */

export const core = defineModule({
  id: "core",
  name: "Core",
  description: "Identity, roles, permissions, audit log, settings and the encrypted secrets vault.",
  status: "active",
  nav: [
    { label: "Overview", href: "/", permission: "core:read", icon: "home" },
    { label: "Settings", href: "/settings", permission: "core:admin", icon: "settings" },
    { label: "Audit log", href: "/audit", permission: "core:admin", icon: "list" },
  ],
  permissions: [
    { key: "core:read", label: "View the console" },
    { key: "core:admin", label: "Manage users, roles, settings and integrations" },
  ],
});

export const cms = defineModule({
  id: "cms",
  name: "Content",
  description: "Everything the public site renders, with draft/publish control.",
  status: "active",
  dependsOn: ["core"],
  nav: [{ label: "Content", href: "/content", permission: "cms:read", icon: "file" }],
  permissions: [
    { key: "cms:read", label: "View content" },
    { key: "cms:write", label: "Create and edit content" },
    { key: "cms:publish", label: "Publish content to the live site" },
  ],
});

export const crm = defineModule({
  id: "crm",
  name: "CRM",
  description: "Leads, pipeline and campaign attribution.",
  status: "active",
  dependsOn: ["core"],
  nav: [{ label: "Leads", href: "/leads", permission: "crm:read", icon: "inbox" }],
  permissions: [
    { key: "crm:read", label: "View leads and pipeline" },
    { key: "crm:write", label: "Edit leads, change stage, add notes" },
    { key: "crm:admin", label: "Configure pipeline stages and assignment" },
  ],
  jobs: [
    { name: "lead.notify", description: "Email/WhatsApp notification on a new lead" },
    {
      name: "lead.conversion",
      description: "Server-side conversion delivery to Meta and Google Ads",
    },
  ],
});

export const saas = defineModule({
  id: "saas",
  name: "SaaS products",
  description: "Product catalogue: features, pricing, docs and demo requests.",
  status: "active",
  dependsOn: ["core", "cms"],
  // Products are edited under Content alongside every other publishable
  // record; a separate nav entry would point at a page that does not exist.
  permissions: [
    { key: "saas:read", label: "View products" },
    { key: "saas:write", label: "Edit products, pricing and docs" },
  ],
});

export const aiAssist = defineModule({
  id: "ai-assist",
  name: "AI assist",
  description: "Provider configuration and AI enrichment. Output is advisory and lands as a draft.",
  status: "active",
  dependsOn: ["core", "crm"],
  permissions: [
    { key: "ai:read", label: "View AI configuration and output" },
    { key: "ai:admin", label: "Configure providers and credentials" },
  ],
  jobs: [{ name: "lead.enrich", description: "Summarise and score an inbound lead" }],
});

export const billing = defineModule({
  id: "billing",
  name: "Billing",
  description: "Quotes, invoices, payments, subscriptions and dunning.",
  status: "active",
  dependsOn: ["core", "crm"],
  nav: [
    { label: "Quotes", href: "/billing/quotes", permission: "billing:read", icon: "file" },
    { label: "Invoices", href: "/billing/invoices", permission: "billing:read", icon: "receipt" },
  ],
  permissions: [
    { key: "billing:read", label: "View invoices and payments" },
    { key: "billing:write", label: "Create and send invoices" },
    { key: "billing:admin", label: "Configure tax, currency and payment providers" },
  ],
});

export const support = defineModule({
  id: "support",
  name: "Support",
  description: "Tickets, response targets, queues and knowledge base.",
  status: "active",
  dependsOn: ["core", "crm"],
  nav: [
    { label: "Tickets", href: "/support/inbox", permission: "support:read", icon: "inbox" },
    { label: "Knowledge base", href: "/support/kb", permission: "support:read", icon: "book" },
  ],
  permissions: [
    { key: "support:read", label: "View tickets" },
    { key: "support:write", label: "Respond to and resolve tickets" },
    { key: "support:admin", label: "Configure queues and response targets" },
  ],
});

export const projects = defineModule({
  id: "projects",
  name: "Projects",
  description: "Delivery projects, tasks, timesheets and client approvals.",
  status: "active",
  dependsOn: ["core", "crm"],
  nav: [{ label: "Projects", href: "/projects", permission: "projects:read", icon: "kanban" }],
  permissions: [
    { key: "projects:read", label: "View projects and tasks" },
    { key: "projects:write", label: "Manage projects, tasks and timesheets" },
    { key: "projects:admin", label: "Configure project templates and rates" },
  ],
});

export const hr = defineModule({
  id: "hr",
  name: "People",
  description: "Employees, shifts, attendance, leave and payroll export.",
  status: "planned",
  dependsOn: ["core"],
  permissions: [
    { key: "hr:read", label: "View staff records" },
    { key: "hr:write", label: "Manage attendance and leave" },
    { key: "hr:admin", label: "Manage employment records and payroll export" },
  ],
});

export const marketing = defineModule({
  id: "marketing",
  name: "Marketing",
  description: "Campaigns, ad spend and attribution reporting — the spend-to-revenue join.",
  status: "active",
  dependsOn: ["core", "crm", "cms"],
  nav: [
    {
      label: "Campaigns",
      href: "/marketing/campaigns",
      permission: "marketing:read",
      icon: "megaphone",
    },
    {
      label: "Attribution",
      href: "/marketing/attribution",
      permission: "marketing:read",
      icon: "chart",
    },
  ],
  permissions: [
    { key: "marketing:read", label: "View campaigns and attribution reporting" },
    { key: "marketing:write", label: "Manage campaigns and the ad spend log" },
  ],
  jobs: [
    { name: "adspend.sync", description: "Sync ad spend from connected platforms" },
    { name: "attribution.rebuild", description: "Recompute attribution roll-ups for campaigns" },
  ],
});

export const clientPortal = defineModule({
  id: "client-portal",
  name: "Client portal",
  description:
    "Customer accounts: tickets, invoices, documents and project status. Path-based at /portal/*.",
  status: "active",
  dependsOn: ["core", "billing", "support", "projects"],
  nav: [{ label: "Accounts", href: "/accounts", permission: "portal:read", icon: "users" }],
  permissions: [
    { key: "portal:read", label: "View portal accounts" },
    { key: "portal:admin", label: "Manage portal access and entitlements" },
  ],
});

export const partner = defineModule({
  id: "partner",
  name: "Engineering partner",
  description:
    "Settings and integrations that describe the relationship between Apex and the engineering partner.",
  status: "active",
  dependsOn: ["core"],
  permissions: [
    { key: "partner:read", label: "View partner settings and integrations" },
    { key: "partner:write", label: "Manage partner settings and integrations" },
  ],
});

export const modules: ApexModule[] = [
  core,
  cms,
  crm,
  saas,
  aiAssist,
  partner,
  billing,
  support,
  projects,
  hr,
  marketing,
  clientPortal,
];

assertDependencies(modules);
