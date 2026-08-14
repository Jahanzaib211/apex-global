export type EventCategory =
  | "Group Event"
  | "Corporate"
  | "Product Launch"
  | "Pilgrimage"
  | "Real Estate"
  | "Webinar"
  | "Conference";

export interface Event {
  slug: string;
  name: string;
  date: string;
  endDate?: string;
  location: string;
  company: "tech-solution" | "outsourcing" | "tours-travels" | "holdings" | "consultancy" | "group";
  category: EventCategory;
  description: string;
  featured?: boolean;
}

export const events: Event[] = [
  {
    slug: "apex-group-summit-2026",
    name: "[Placeholder] Apex Group Annual Summit 2026",
    date: "2026-03-12",
    endDate: "2026-03-13",
    location: "Karachi, Pakistan",
    company: "group",
    category: "Group Event",
    description:
      "A placeholder Group-level gathering for partners, advisors and internal leadership to align on the year ahead, share cross-business learnings, and explore new collaboration opportunities.",
    featured: true,
  },
  {
    slug: "tech-solution-product-briefing",
    name: "[Placeholder] Tech Solution Product Briefing",
    date: "2026-02-20",
    location: "Online Webinar",
    company: "tech-solution",
    category: "Product Launch",
    description:
      "A placeholder briefing session walking through current technology offerings, delivery models, and the questions prospective clients most often ask.",
  },
  {
    slug: "umrah-program-winter",
    name: "[Placeholder] Winter Umrah Program",
    date: "2026-01-25",
    endDate: "2026-02-08",
    location: "Makkah & Madinah, Saudi Arabia",
    company: "tours-travels",
    category: "Pilgrimage",
    description:
      "A placeholder two-week guided Umrah program with group logistics, accommodation, transport, and on-ground coordination handled by our travel team.",
  },
  {
    slug: "holdings-project-launch",
    name: "[Placeholder] Holdings Project Launch & Briefing",
    date: "2026-04-04",
    location: "Lahore, Pakistan",
    company: "holdings",
    category: "Real Estate",
    description:
      "A placeholder launch event for an upcoming real estate project, with an investor briefing, site walkthrough overview, and Q&A with the project team.",
  },
  {
    slug: "financial-planning-webinar",
    name: "[Placeholder] Financial Planning Webinar",
    date: "2025-11-14",
    location: "Online Webinar",
    company: "consultancy",
    category: "Webinar",
    description:
      "A placeholder educational webinar covering a structured approach to financial clarity — observation, organization, and forward planning — for individuals and business owners.",
  },
  {
    slug: "outsourcing-industry-conference",
    name: "[Placeholder] Outsourcing Industry Conference",
    date: "2025-10-09",
    endDate: "2025-10-10",
    location: "Riyadh, Saudi Arabia",
    company: "outsourcing",
    category: "Conference",
    description:
      "A placeholder industry conference where our outsourcing team joins sector peers to discuss delivery quality, talent, and the changing shape of client expectations.",
  },
];

export function getEventBySlug(slug: string): Event | undefined {
  return events.find((e) => e.slug === slug);
}

export function getRelatedEvents(slug: string, limit = 2): Event[] {
  return events.filter((e) => e.slug !== slug).slice(0, limit);
}
