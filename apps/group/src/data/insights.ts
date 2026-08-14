export type InsightCategory =
  | "Group News"
  | "Technology"
  | "Outsourcing"
  | "Tours & Travels"
  | "Real Estate"
  | "Financial Insights"
  | "Corporate Updates"
  | "Events";

export interface Insight {
  slug: string;
  title: string;
  excerpt: string;
  category: InsightCategory;
  author: string;
  date: string;
  readTime: string;
  featured?: boolean;
  relatedCompany?:
    "tech-solution" | "outsourcing" | "tours-travels" | "holdings" | "consultancy" | "group";
}

export const insights: Insight[] = [
  {
    slug: "apex-group-2026-outlook",
    title: "Apex Group 2026 Outlook: A Note From the Group Office",
    excerpt:
      "A look at the year ahead for the Group — cross-business coordination, sector priorities, and the themes that will shape our work across technology, outsourcing, travel, real estate and financial consultancy.",
    category: "Group News",
    author: "Apex Group Office",
    date: "2026-01-15",
    readTime: "5 min read",
    featured: true,
    relatedCompany: "group",
  },
  {
    slug: "cross-business-collaboration",
    title: "How Cross-Business Collaboration Shapes Our Day-to-Day",
    excerpt:
      "A note on how teams across our Group companies share context, infrastructure and customer relationships — and why that is a quiet advantage for the clients we serve.",
    category: "Group News",
    author: "Apex Group Office",
    date: "2025-12-04",
    readTime: "4 min read",
    relatedCompany: "group",
  },
  {
    slug: "technology-delivery-models",
    title: "Choosing the Right Technology Delivery Model",
    excerpt:
      "An exploration of how organizations think about delivery partners, in-house teams and managed models — and the questions worth asking before committing to one.",
    category: "Technology",
    author: "Apex Global Tech Solution",
    date: "2025-11-20",
    readTime: "6 min read",
    relatedCompany: "tech-solution",
  },
  {
    slug: "outsourcing-quality-frameworks",
    title: "Building Quality Frameworks in Outsourced Operations",
    excerpt:
      "A look at the operating disciplines that distinguish mature outsourcing engagements from transactional ones — clear ownership, defined review cadences, and outcome measurement.",
    category: "Outsourcing",
    author: "Apex Global Outsourcing",
    date: "2025-11-08",
    readTime: "5 min read",
    relatedCompany: "outsourcing",
  },
  {
    slug: "tours-tailored-itineraries",
    title: "The Case for Tailored Itineraries Over Template Travel",
    excerpt:
      "A perspective on why meaningful travel rarely comes off the shelf — and how a properly designed itinerary balances structure with personal rhythm.",
    category: "Tours & Travels",
    author: "Apex Global Tours & Travels",
    date: "2025-10-22",
    readTime: "5 min read",
    relatedCompany: "tours-travels",
  },
  {
    slug: "real-estate-local-knowledge",
    title: "Why Local Knowledge Matters in Cross-Border Real Estate",
    excerpt:
      "A look at the role of on-the-ground context when evaluating property decisions in unfamiliar markets, and what investors tend to overlook.",
    category: "Real Estate",
    author: "Apex Holdings",
    date: "2025-10-05",
    readTime: "6 min read",
    relatedCompany: "holdings",
  },
  {
    slug: "financial-clarity",
    title: "Clarity Before Strategy: A First Step in Financial Consultancy",
    excerpt:
      "A note on why the most useful first move in any financial conversation is rarely a product recommendation — it is a clear, organized view of where things stand.",
    category: "Financial Insights",
    author: "Apex Group Financial Consultancy",
    date: "2025-09-18",
    readTime: "4 min read",
    relatedCompany: "consultancy",
  },
  {
    slug: "corporate-update-q3",
    title: "Quarterly Corporate Update: Q3 Highlights From Across the Group",
    excerpt:
      "A quarterly update summarizing activity across our Group businesses — projects in motion, partnerships explored, and operating lessons from the quarter.",
    category: "Corporate Updates",
    author: "Apex Group Office",
    date: "2025-09-02",
    readTime: "4 min read",
    relatedCompany: "group",
  },
  {
    slug: "upcoming-events-2026",
    title: "Looking Ahead: Events and Engagements for 2026",
    excerpt:
      "A preview of planned Group events, product conversations, pilgrimage programs and webinars for the coming year — and how to stay informed as dates firm up.",
    category: "Events",
    author: "Apex Group Office",
    date: "2025-08-21",
    readTime: "3 min read",
    relatedCompany: "group",
  },
];

export function getInsightBySlug(slug: string): Insight | undefined {
  return insights.find((i) => i.slug === slug);
}

export function getRelatedInsights(slug: string, category: InsightCategory, limit = 2): Insight[] {
  return insights.filter((i) => i.slug !== slug && i.category === category).slice(0, limit);
}
