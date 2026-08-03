# Modules

Every business capability is a module in [`modules/`](../modules/). Each owns its schema, its server
logic, its console routes and its own `README.md` spec. The console builds its navigation and
permission catalogue from the registry, so adding a module never requires touching the core.

## Registry

| Module | Status | Purpose |
|---|---|---|
| [`core`](../modules/core/README.md) | active | Users, roles, permissions, sessions, audit log, settings, integrations vault, feature flags, media |
| [`cms`](../modules/cms/README.md) | active | All public content: pages, solutions, industries, case studies, insights, testimonials, jobs, FAQs, landing pages, technology-proof entries, SEO |
| [`crm`](../modules/crm/README.md) | active | Leads, companies, contacts, opportunities, activities, attribution, pipeline |
| [`saas`](../modules/saas/README.md) | active | SaaS product catalogue: products, features, screenshots, pricing plans, integrations, docs, demo requests |
| [`ai-assist`](../modules/ai-assist/README.md) | active | Provider configuration, prompt registry, lead summarisation/scoring, content drafting |
| [`billing`](../modules/billing/README.md) | planned | Quotes, invoices, payments, subscriptions, dunning |
| [`support`](../modules/support/README.md) | planned | Tickets, SLAs, queues, knowledge base |
| [`projects`](../modules/projects/README.md) | planned | Delivery projects, tasks, timesheets, client approvals |
| [`hr`](../modules/hr/README.md) | planned | Employees, shifts, attendance, leave, payroll export |
| [`marketing`](../modules/marketing/README.md) | planned | Content calendar, campaigns, ad-spend sync, attribution reporting |

`active` modules are built and contribute console navigation. `planned` modules ship their spec and
schema stub only — they are documented so the design holds, and switching one on is a status change
plus an implementation, not a redesign.

## The contract

```ts
import { defineModule } from "@apex/module-kit";

export default defineModule({
  id: "crm",
  name: "CRM",
  status: "active",
  description: "Leads, pipeline and attribution.",
  nav: [
    { label: "Leads", href: "/crm/leads", permission: "crm:read", icon: "inbox" },
    { label: "Pipeline", href: "/crm/pipeline", permission: "crm:read", icon: "columns" },
  ],
  permissions: [
    { key: "crm:read", label: "View leads and pipeline" },
    { key: "crm:write", label: "Edit leads, change status, add notes" },
    { key: "crm:admin", label: "Configure pipeline stages and assignment rules" },
  ],
  widgets: [/* console dashboard cards */],
  jobs: [/* BullMQ job definitions */],
});
```

## Writing a module README

Each spec answers the same questions in the same order, so any of them can be read quickly:

1. **Purpose** — what it does, in one paragraph, in business terms
2. **Status** — active or planned, and what "done" means
3. **Data model** — entities and their relationships
4. **Permissions** — every key and who should hold it
5. **Routes** — console routes and any public endpoints
6. **Jobs** — background work, triggers and schedules
7. **Dependencies** — other modules it needs
8. **Open questions** — what is unresolved
