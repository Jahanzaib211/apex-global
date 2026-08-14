// Sample gallery, events, insights/news, careers, testimonials
// All clearly placeholder until verified by Apex Holdings.

export const galleryCategories = [
  "All",
  "Projects",
  "Events",
  "Site Visits",
  "Corporate",
  "Launches",
  "Team",
  "Achievements",
];

export interface GalleryItem {
  id: string;
  category: string;
  title: string;
  date: string;
  location: string;
  image: string;
}

export const gallery: GalleryItem[] = [
  // Projects
  {
    id: "g1",
    category: "Projects",
    title: "Avenue Residences — Main Boulevard View",
    date: "2026-04-12",
    location: "Lahore",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "g2",
    category: "Projects",
    title: "Skyline Heights — Tower Render",
    date: "2026-05-03",
    location: "Karachi",
    image:
      "https://images.unsplash.com/photo-1496564203457-11bb12075d90?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "g3",
    category: "Projects",
    title: "Meridian Business Bay — Lobby",
    date: "2026-03-22",
    location: "Islamabad",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "g4",
    category: "Projects",
    title: "Gardens Residency — Exterior Walkthrough",
    date: "2026-02-18",
    location: "Lahore",
    image:
      "https://images.unsplash.com/photo-1613553474179-e1eda3ea5734?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "g5",
    category: "Projects",
    title: "Harbour Mixed-Use — Plaza Concept",
    date: "2026-06-09",
    location: "Karachi",
    image:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "g6",
    category: "Projects",
    title: "Parkview Apartments — Park Side",
    date: "2026-01-30",
    location: "Islamabad",
    image:
      "https://images.unsplash.com/photo-1460317442991-2ecdbb9c3d77?auto=format&fit=crop&w=900&q=80",
  },

  // Events
  {
    id: "g7",
    category: "Events",
    title: "Apex Annual Partner Dinner",
    date: "2026-04-02",
    location: "Lahore",
    image:
      "https://images.unsplash.com/photo-1511795406734-c05d27da37ca?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "g8",
    category: "Events",
    title: "Real Estate Investor Meet",
    date: "2026-03-10",
    location: "Karachi",
    image:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "g9",
    category: "Events",
    title: "Industry Networking Session",
    date: "2026-05-21",
    location: "Islamabad",
    image:
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=900&q=80",
  },

  // Site Visits
  {
    id: "g10",
    category: "Site Visits",
    title: "Avenue Residences — Construction Update",
    date: "2026-04-15",
    location: "Lahore",
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef7e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "g11",
    category: "Site Visits",
    title: "Skyline Heights — Inspection Tour",
    date: "2026-05-30",
    location: "Karachi",
    image:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=900&q=80",
  },

  // Corporate
  {
    id: "g12",
    category: "Corporate",
    title: "Apex HQ — Working Floor",
    date: "2026-02-04",
    location: "Lahore",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "g13",
    category: "Corporate",
    title: "Quarterly Strategy Offsite",
    date: "2026-03-28",
    location: "Murree",
    image:
      "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=900&q=80",
  },

  // Launches
  {
    id: "g14",
    category: "Launches",
    title: "Skyline Heights — Pre-Launch Briefing",
    date: "2026-03-05",
    location: "Karachi",
    image:
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=900&q=80",
  },

  // Team
  {
    id: "g15",
    category: "Team",
    title: "Apex Commercial Team",
    date: "2026-01-22",
    location: "Lahore",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
  },

  // Achievements
  {
    id: "g16",
    category: "Achievements",
    title: "Marketed Our 12th Project",
    date: "2026-02-14",
    location: "Pakistan",
    image:
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=900&q=80",
  },
];

export interface EventItem {
  slug: string;
  title: string;
  date: string;
  location: string;
  project?: string;
  category: string;
  description: string;
  cover: string;
}

export const events: EventItem[] = [
  {
    slug: "pre-launch-skyline-heights",
    title: "Skyline Heights — Pre-Launch Briefing",
    date: "2026-03-05",
    location: "Karachi",
    project: "Skyline Heights",
    category: "Launch",
    description:
      "An exclusive pre-launch briefing session introducing Skyline Heights to a curated list of invited partners and prospective buyers.",
    cover:
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1400&q=80",
  },
  {
    slug: "apex-annual-partner-dinner",
    title: "Apex Annual Partner Dinner",
    date: "2026-04-02",
    location: "Lahore",
    category: "Corporate",
    description:
      "Our annual gathering of project partners, developers and strategic allies — celebrating the year gone by and shaping the next.",
    cover:
      "https://images.unsplash.com/photo-1511795406734-c05d27da37ca?auto=format&fit=crop&w=1400&q=80",
  },
  {
    slug: "real-estate-investor-meet",
    title: "Real Estate Investor Meet",
    date: "2026-03-10",
    location: "Karachi",
    category: "Investor",
    description:
      "A focused investor meet-up presenting curated opportunities across Pakistan’s primary real estate corridors.",
    cover:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1400&q=80",
  },
  {
    slug: "industry-networking-session",
    title: "Industry Networking Session",
    date: "2026-05-21",
    location: "Islamabad",
    category: "Corporate",
    description:
      "An evening session bringing together industry voices to discuss Pakistan’s evolving real-estate landscape.",
    cover:
      "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1400&q=80",
  },
];

export interface InsightItem {
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  author: string;
  cover: string;
  body: string[];
}

export const insights: InsightItem[] = [
  {
    slug: "why-marketing-matters-in-pakistan-real-estate",
    title: "Why Marketing Matters in Pakistan Real Estate",
    category: "Marketing",
    date: "2026-04-22",
    excerpt:
      "A look at how professional project marketing shapes perception, accelerates sales velocity and protects developer yields.",
    author: "Apex Editorial",
    cover:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1400&q=80",
    body: [
      "In a maturing real estate market, the difference between an average-performing project and a standout one rarely comes down to the product alone — it comes down to how the product is positioned and brought to market.",
      "A disciplined marketing partner helps developers structure their offering, frame the buyer journey and elevate the narrative around a project. The result: stronger leads, higher conversion rates and a brand that compounds across releases.",
    ],
  },
  {
    slug: "from-marketing-to-development",
    title: "From Marketing Projects to Building Our Own",
    category: "Vision",
    date: "2026-05-08",
    excerpt:
      "Apex Holdings has spent years in the marketing seat. Here is why we are now preparing for our own developments.",
    author: "Apex Editorial",
    cover:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1400&q=80",
    body: [
      "Our trajectory has always been deliberate: first understand the buyer, the developer and the market — and then earn the right to participate on the development side.",
      "This is the next chapter: a measured move into Apex-owned developments where we can control the full vision from land to handover.",
    ],
  },
  {
    slug: "lead-generation-modern-stack",
    title: "A Modern Lead Generation Stack for Real Estate",
    category: "Digital",
    date: "2026-06-14",
    excerpt:
      "Paid acquisition, organic content, CRM handoff, and WhatsApp follow-up — a connected funnel that actually books visits.",
    author: "Apex Editorial",
    cover:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1400&q=80",
    body: [
      "Modern real estate lead generation is less about one magic channel and more about connecting the channels that work — paid social, organic content, search and on-ground follow-up — into a single funnel.",
      "When attribution is in place, every rupee is accountable, and every lead has a clear next step.",
    ],
  },
  {
    slug: "why-transparency-builds-long-term-value",
    title: "Why Transparency Builds Long-Term Value",
    category: "Brand",
    date: "2026-03-29",
    excerpt:
      "The shortest path to building a real estate brand that outlasts market cycles is also the simplest: tell the truth.",
    author: "Apex Editorial",
    cover:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80",
    body: [
      "In real estate, trust compounds slowly and erodes quickly. Every project description, every brochure image and every sales conversation either adds to the trust account or subtracts from it.",
      "At Apex Holdings we choose the long path: honest project statuses, verified information and clear communication at every step.",
    ],
  },
];

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
}

export const leadership: TeamMember[] = [
  {
    name: "Shaikh Ahmed",
    role: "Chief Executive Officer",
    bio: "Founder and CEO of Apex Holdings. Entrepreneur with multi-sector operating experience spanning real estate, services and technology.",
  },
  {
    name: "Director — Real Estate",
    role: "Director, Real Estate",
    bio: "Oversees Apex Holdings’ project portfolio and partner relationships across Pakistan’s primary real-estate corridors.",
  },
  {
    name: "Director — Marketing",
    role: "Director, Marketing",
    bio: "Leads Apex Holdings’ project marketing, digital presence and partner enablement teams.",
  },
  {
    name: "Head of Sales",
    role: "Head of Sales",
    bio: "Drives sales operations, lead conversion and customer experience across marketed projects.",
  },
];

export interface Career {
  slug: string;
  title: string;
  department: string;
  location: string;
  type: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
}

export const careers: Career[] = [
  {
    slug: "property-consultant",
    title: "Property Consultant",
    department: "Sales",
    location: "Lahore · Karachi · Islamabad",
    type: "Full-time",
    summary:
      "Engage with prospective buyers, present curated opportunities and own the journey from first contact through to booking.",
    responsibilities: [
      "Manage qualified leads end-to-end",
      "Conduct project presentations and site visits",
      "Maintain CRM hygiene and follow-up cadence",
      "Achieve monthly and quarterly sales targets",
    ],
    requirements: [
      "2+ years in real estate sales preferred",
      "Excellent communication in English & Urdu",
      "Strong grasp of the local real estate landscape",
      "Comfortable with CRM tools",
    ],
  },
  {
    slug: "sales-executive",
    title: "Sales Executive",
    department: "Sales",
    location: "Lahore · Karachi",
    type: "Full-time",
    summary:
      "Support the sales team with lead qualification, walk-in handling and pipeline hygiene.",
    responsibilities: [
      "Qualify inbound leads and route to senior consultants",
      "Maintain the walk-in experience at our offices",
      "Update CRM with relevant lead activity",
      "Coordinate on-site visit logistics",
    ],
    requirements: [
      "1+ year experience in sales / customer-facing roles",
      "Polished, professional communication",
      "Comfortable with structured processes",
    ],
  },
  {
    slug: "marketing-executive",
    title: "Marketing Executive",
    department: "Marketing",
    location: "Lahore",
    type: "Full-time",
    summary:
      "Coordinate day-to-day marketing operations across project campaigns, content and partner enablement.",
    responsibilities: [
      "Coordinate campaign timelines and assets",
      "Work with designers, agencies and content teams",
      "Track campaign performance and report weekly",
    ],
    requirements: [
      "2+ years in marketing coordination",
      "Familiarity with project marketing or property marketing is a plus",
      "Strong organisational skills",
    ],
  },
  {
    slug: "digital-marketing-specialist",
    title: "Digital Marketing Specialist",
    department: "Marketing",
    location: "Lahore",
    type: "Full-time",
    summary: "Run paid acquisition, organic content and lead flow for our marketed projects.",
    responsibilities: [
      "Plan & run paid campaigns (Meta, Google)",
      "Optimise landing pages and lead forms",
      "Set up tracking pixels, events and attribution",
    ],
    requirements: [
      "3+ years hands-on with Meta & Google Ads",
      "Strong copywriting instincts",
      "Solid understanding of analytics & attribution",
    ],
  },
  {
    slug: "sales-manager",
    title: "Sales Manager",
    department: "Sales",
    location: "Karachi",
    type: "Full-time",
    summary: "Lead a high-performing sales pod focused on a single flagship project.",
    responsibilities: [
      "Hire, train and coach property consultants",
      "Own conversion targets and pipeline review",
      "Liaise with the developer partner daily",
    ],
    requirements: [
      "5+ years in real estate sales, 2+ as a manager",
      "Strong leadership and forecasting skills",
    ],
  },
  {
    slug: "project-coordinator",
    title: "Project Coordinator",
    department: "Operations",
    location: "Lahore",
    type: "Full-time",
    summary: "Be the operational glue between marketing, sales and partner developer teams.",
    responsibilities: [
      "Coordinate project timelines",
      "Maintain project documentation",
      "Support on-ground launches and events",
    ],
    requirements: ["2+ years in operations / coordination", "Excellent stakeholder management"],
  },
  {
    slug: "customer-relationship-executive",
    title: "Customer Relationship Executive",
    department: "Sales",
    location: "Lahore",
    type: "Full-time",
    summary: "Provide post-enquiry support and ensure a smooth handover experience for buyers.",
    responsibilities: [
      "Own post-booking customer communication",
      "Coordinate documentation handovers",
      "Collect and report on customer feedback",
    ],
    requirements: ["1+ year customer-facing experience", "Empathy, patience and follow-through"],
  },
  {
    slug: "finance-executive",
    title: "Finance Executive",
    department: "Finance",
    location: "Lahore",
    type: "Full-time",
    summary: "Support bookkeeping, project-level financial tracking and reconciliations.",
    responsibilities: [
      "Maintain project-level financial records",
      "Prepare reconciliations and reports",
      "Liaise with auditors and bankers",
    ],
    requirements: [
      "2+ years in finance / accounts",
      "Comfortable with Excel & accounting software",
    ],
  },
  {
    slug: "operations-manager",
    title: "Operations Manager",
    department: "Operations",
    location: "Lahore",
    type: "Full-time",
    summary:
      "Own cross-functional operations and ensure the business runs with discipline and predictability.",
    responsibilities: [
      "Streamline internal processes",
      "Own operational dashboards",
      "Lead cross-department initiatives",
    ],
    requirements: ["5+ years in operations", "Strong process design instincts"],
  },
  {
    slug: "administration-officer",
    title: "Administration Officer",
    department: "Administration",
    location: "Lahore",
    type: "Full-time",
    summary: "Manage office administration, vendor coordination and executive scheduling.",
    responsibilities: [
      "Manage office operations",
      "Coordinate vendors and suppliers",
      "Support executive scheduling",
    ],
    requirements: ["2+ years in administration", "Discrete, well-organised, dependable"],
  },
];

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  context?: string;
  project?: string;
}

export const testimonials: Testimonial[] = [
  {
    name: "Verified Buyer · Lahore",
    role: "End-user buyer",
    quote:
      "The team at Apex Holdings made the entire project-buying journey feel calm and transparent. Walkthroughs, paperwork, follow-ups — every step was communicated clearly.",
    context: "Sample testimonial · pending permission to publish verified name.",
    project: "Avenue Residences",
  },
  {
    name: "Developer Partner · Sample",
    role: "Project Sales Lead, Developer Partner",
    quote:
      "Apex runs the kind of marketing discipline developers wish more partners ran. Lead quality improved meaningfully within a quarter of engagement.",
    context: "Sample partner testimonial.",
    project: "Skyline Heights",
  },
  {
    name: "Investor · Sample",
    role: "Real Estate Investor",
    quote:
      "I trust Apex because they will tell me when an opportunity is not a fit. That level of honesty is rare and it is exactly why I keep coming back.",
    context: "Sample investor testimonial.",
  },
];

export interface Service {
  slug: string;
  title: string;
  intro: string;
  capabilities: string[];
  outcomes: string[];
}

export const services: Service[] = [
  {
    slug: "real-estate-marketing",
    title: "Real Estate Marketing",
    intro:
      "Structured, full-funnel marketing for real estate projects across Pakistan — positioning that earns attention and converts it into qualified buyer interest.",
    capabilities: [
      "Project positioning & narrative",
      "Brand & launch strategy",
      "Digital presence & landing pages",
      "Print collateral & brochures",
      "Performance marketing across paid channels",
      "On-ground activations & events",
    ],
    outcomes: [
      "Higher quality leads",
      "Improved sales velocity",
      "Stronger project brand",
      "Measurable, attributable marketing",
    ],
  },
  {
    slug: "project-marketing",
    title: "Project Marketing",
    intro:
      "From pre-launch to handover — Apex delivers the marketing playbook that lets developers focus on building.",
    capabilities: [
      "Pre-launch teaser & invite management",
      "Launch campaign orchestration",
      "CRM setup & lead routing",
      "Project microsite / landing experience",
      "Sales enablement & collaterals",
    ],
    outcomes: [
      "Predictable launch & handover cadence",
      "Better-aligned sales & marketing teams",
      "Clear buyer journey",
    ],
  },
  {
    slug: "sales-lead-generation",
    title: "Sales & Lead Generation",
    intro:
      "A complete sales engine — lead generation, qualification, site visits and conversion into bookings.",
    capabilities: [
      "Multi-channel lead generation",
      "Lead qualification & scoring",
      "Site visit coordination",
      "CRM-driven follow-up cadence",
      "Sales reporting & forecasting",
    ],
    outcomes: [
      "Higher conversion from lead to visit",
      "More efficient sales team time",
      "Transparent sales metrics",
    ],
  },
  {
    slug: "digital-marketing",
    title: "Digital Marketing",
    intro:
      "Modern digital marketing for real estate — performance, content and conversion infrastructure built for property buyers.",
    capabilities: [
      "Paid social & search (Meta, Google, LinkedIn)",
      "Organic content & SEO",
      "Landing pages & conversion design",
      "Email & WhatsApp lifecycle",
      "Analytics & attribution setup",
    ],
    outcomes: ["Lower cost per qualified lead", "Full-funnel visibility", "Always-on pipeline"],
  },
];

export const stats = [
  { label: "Projects Marketed", value: "12+" },
  { label: "Cities Active", value: "4" },
  { label: "Partner Network", value: "Growing" },
  { label: "Years Operating", value: "Established" },
];

export const faqs: { q: string; a: string }[] = [
  {
    q: "What does Apex Holdings actually do?",
    a: "Apex Holdings is primarily a real estate marketing company. We also plan to evolve into development and ownership of our own projects over time. Marketing is what we do today; development is where we are headed.",
  },
  {
    q: "Are the projects on the website developed by Apex Holdings?",
    a: "Most projects listed are marketed by Apex Holdings but developed by independent developer partners. Where Apex Holdings is the developer, the project will be clearly labeled “Developed by Apex”.",
  },
  {
    q: "Can I visit a project site?",
    a: "Yes. Submit an enquiry from any project page or use the Schedule a Visit flow and our team will coordinate a convenient date and time.",
  },
  {
    q: "Does Apex Holdings offer guaranteed returns?",
    a: "No. Apex Holdings does not promise guaranteed returns on any property investment. The site presents opportunities on their actual merits.",
  },
  {
    q: "How can I partner with Apex Holdings?",
    a: "We welcome partnership enquiries from developers and investor groups. Please use the Partner With Us form and our partnerships team will respond.",
  },
];
