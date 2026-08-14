// Apex Holdings — sample project data (placeholder portfolio)
// All projects are clearly marked as sample/placeholder until verified.
// Per content principles: do not fabricate status, locations, or financial claims.

export type ProjectStatus = "Upcoming" | "Pre-Launch" | "Ongoing" | "Completed";
export type ProjectCategory = "Residential" | "Commercial" | "Mixed-Use" | "Plots & Apartments";
export type ProjectRole = "Marketed by Apex" | "Developed by Apex" | "Co-Marketed";

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  city: string;
  area: string;
  developer: string;
  category: ProjectCategory;
  status: ProjectStatus;
  role: ProjectRole;
  price: string;
  priceNote: string;
  summary: string;
  description: string[];
  features: string[];
  amenities: string[];
  highlights: { label: string; value: string }[];
  paymentPlan: { milestone: string; percent: string }[];
  units: string;
  size: string;
  launchYear: string;
  cover: string;
  gallery: string[];
  nearby: { name: string; kind: string }[];
  featured?: boolean;
  brochure?: string;
}

export const projects: Project[] = [
  {
    slug: "avenue-residences",
    name: "Avenue Residences",
    tagline: "Serene family living in the heart of the city",
    city: "Lahore",
    area: "Bahria Town",
    developer: "Independent Developer · Sample",
    category: "Residential",
    status: "Ongoing",
    role: "Marketed by Apex",
    price: "PKR 2.1 Cr – 4.8 Cr",
    priceNote: "Sample indicative range · final pricing on request",
    summary:
      "A contemporary residential project offering thoughtfully designed 3 & 4 bedroom apartments within a secure, master-planned community.",
    description: [
      "Avenue Residences is presented as part of our current marketing portfolio — a contemporary residential project offering thoughtfully designed 3 and 4 bedroom apartments within a secure, master-planned community.",
      "The project is marketed by Apex Holdings with the objective of connecting discerning buyers with a high-quality opportunity in a prime Lahore location.",
      "Detailed specifications, payment plans and brochures are made available on request once a qualified enquiry is established.",
    ],
    features: [
      "3 & 4 Bedroom Apartments",
      "Premium fixtures & fittings",
      "Energy-efficient design",
      "Smart-home ready infrastructure",
      "High-speed elevators",
      "Secure gated access",
    ],
    amenities: [
      "Swimming Pool",
      "Fully Equipped Gym",
      "Children’s Play Area",
      "Community Lounge",
      "Landscaped Gardens",
      "24/7 Security & CCTV",
    ],
    highlights: [
      { label: "Project Type", value: "Residential Apartments" },
      { label: "Configuration", value: "3 & 4 Bed" },
      { label: "Possession", value: "Sample timeline · on request" },
    ],
    paymentPlan: [
      { milestone: "On Booking", percent: "10%" },
      { milestone: "During Construction", percent: "70%" },
      { milestone: "On Possession", percent: "20%" },
    ],
    units: "3 & 4 Bedroom Apartments",
    size: "Sample · indicative",
    launchYear: "Sample",
    cover:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    ],
    nearby: [
      { name: "Main Boulevard", kind: "Road" },
      { name: "Commercial Area", kind: "Shopping" },
      { name: "School Network", kind: "Education" },
      { name: "Hospital Network", kind: "Healthcare" },
    ],
    featured: true,
  },
  {
    slug: "skyline-heights",
    name: "Skyline Heights",
    tagline: "Modern high-rise living with skyline panoramas",
    city: "Karachi",
    area: "Clifton",
    developer: "Independent Developer · Sample",
    category: "Residential",
    status: "Pre-Launch",
    role: "Marketed by Apex",
    price: "PKR 3.5 Cr – 9.2 Cr",
    priceNote: "Sample pre-launch range · subject to formal launch",
    summary:
      "A landmark pre-launch residential tower offering panoramic city & sea-view apartments with hotel-grade amenities.",
    description: [
      "Skyline Heights represents a premium pre-launch opportunity marketed by Apex Holdings in one of Karachi’s most prestigious addresses.",
      "The development features a refined mix of 2, 3 and 4 bedroom apartments, paired with elevated lifestyle amenities and curated services.",
      "Bookings are opened only through authorised Apex Holdings representatives to ensure a transparent buyer experience.",
    ],
    features: [
      "High-Rise Residential Tower",
      "Panoramic City & Sea Views",
      "Concierge Services",
      "Private Balconies",
      "Designer Lobby",
      "EV Charging",
    ],
    amenities: [
      "Infinity Pool",
      "Sky Lounge",
      "Spa & Wellness",
      "Co-working Space",
      "Indoor Games Room",
      "Multi-level Car Parking",
    ],
    highlights: [
      { label: "Project Type", value: "High-Rise Residential" },
      { label: "Configuration", value: "2, 3 & 4 Bed" },
      { label: "Launch Status", value: "Pre-Launch · Sample" },
    ],
    paymentPlan: [
      { milestone: "On Booking", percent: "15%" },
      { milestone: "Construction Linked", percent: "65%" },
      { milestone: "On Possession", percent: "20%" },
    ],
    units: "2, 3 & 4 Bedroom Apartments",
    size: "Sample · indicative",
    launchYear: "Sample",
    cover:
      "https://images.unsplash.com/photo-1496564203457-11bb12075d90?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80",
    ],
    nearby: [
      { name: "Seafront", kind: "Landmark" },
      { name: "Five-Star Hotels", kind: "Hospitality" },
      { name: "Embassy District", kind: "Diplomatic" },
      { name: "Fine Dining", kind: "Lifestyle" },
    ],
    featured: true,
  },
  {
    slug: "meridian-business-bay",
    name: "Meridian Business Bay",
    tagline: "Grade-A commercial offices in a prime business district",
    city: "Islamabad",
    area: "Blue Area",
    developer: "Independent Developer · Sample",
    category: "Commercial",
    status: "Ongoing",
    role: "Marketed by Apex",
    price: "PKR 18,500 / sqft (sample)",
    priceNote: "Sample per-sqft rate · on request",
    summary:
      "A premium commercial development offering Grade-A office space tailored for corporate headquarters and growing enterprises.",
    description: [
      "Meridian Business Bay is a flagship commercial opportunity marketed by Apex Holdings in one of Islamabad’s most prestigious business corridors.",
      "The development offers bespoke office plate sizes, world-class facilities and direct connectivity to the city’s key institutional and diplomatic zones.",
      "Interested corporate occupiers and investors can engage our commercial team for a tailored proposal.",
    ],
    features: [
      "Grade-A Office Specifications",
      "Triple-height Lobby",
      "Raised Access Flooring",
      "Central HVAC",
      "Backup Power",
      "Smart Building Systems",
    ],
    amenities: [
      "Valet & Visitor Parking",
      "Executive Café",
      "Conference Centre",
      "24/7 Security Operations",
      "Building Management Systems",
      "Multi-Tenant Access Controls",
    ],
    highlights: [
      { label: "Project Type", value: "Commercial · Grade-A Offices" },
      { label: "Sizes", value: "Customisable plates" },
      { label: "Tenure", value: "On request" },
    ],
    paymentPlan: [
      { milestone: "On Allocation", percent: "20%" },
      { milestone: "Construction Linked", percent: "60%" },
      { milestone: "On Possession", percent: "20%" },
    ],
    units: "Office Plates",
    size: "From ~2,000 sqft (sample)",
    launchYear: "Sample",
    cover:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1497366754035-f2009683516a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&w=1200&q=80",
    ],
    nearby: [
      { name: "Diplomatic Enclave", kind: "Government" },
      { name: "Five-Star Hotels", kind: "Hospitality" },
      { name: "Metro Access", kind: "Transport" },
      { name: "Banking District", kind: "Finance" },
    ],
    featured: true,
  },
  {
    slug: "gardens-residency",
    name: "Gardens Residency",
    tagline: "A community of elegant 5 & 10 marla residences",
    city: "Lahore",
    area: "DHA",
    developer: "Independent Developer · Sample",
    category: "Plots & Apartments",
    status: "Ongoing",
    role: "Marketed by Apex",
    price: "PKR 1.4 Cr – 3.6 Cr",
    priceNote: "Sample indicative range · on request",
    summary:
      "A premium housing residency offering a refined collection of 5 & 10 marla villas and built-form homes in a gated community setting.",
    description: [
      "Gardens Residency presents a curated selection of premium homes marketed by Apex Holdings within one of Lahore’s most established residential sectors.",
      "Each home is designed with a focus on natural light, generous layouts and timeless finishes — ideal for end-users and long-term investors alike.",
      "Walkthroughs and detailed brochures can be arranged on request.",
    ],
    features: [
      "5 & 10 Marla Villas",
      "Modern Façade",
      "Double-glazed Windows",
      "Imported Sanitaryware",
      "Smart-home Pre-wiring",
      "Solar-ready Roofs",
    ],
    amenities: [
      "Parks & Walking Trails",
      "Community Mosque",
      "Sports Facilities",
      "Retail Plaza",
      "School & Clinic",
      "Gated Entry",
    ],
    highlights: [
      { label: "Project Type", value: "Villas & Homes" },
      { label: "Plot Sizes", value: "5 & 10 Marla" },
      { label: "Status", value: "Sample · On Request" },
    ],
    paymentPlan: [
      { milestone: "On Booking", percent: "10%" },
      { milestone: "Construction Linked", percent: "70%" },
      { milestone: "On Possession", percent: "20%" },
    ],
    units: "5 & 10 Marla Villas",
    size: "Sample · indicative",
    launchYear: "Sample",
    cover:
      "https://images.unsplash.com/photo-1613553474179-e1eda3ea5734?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1416331108676-a22ccb276e35?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1576944929064-7624184d546f?auto=format&fit=crop&w=1200&q=80",
    ],
    nearby: [
      { name: "Golf Club", kind: "Recreation" },
      { name: "Sector Schools", kind: "Education" },
      { name: "Hospitals", kind: "Healthcare" },
      { name: "Shopping District", kind: "Retail" },
    ],
  },
  {
    slug: "harbour-mixed-use",
    name: "Harbour Mixed-Use",
    tagline: "A vertical community blending retail, residences & offices",
    city: "Karachi",
    area: "DHA Phase VI",
    developer: "Independent Developer · Sample",
    category: "Mixed-Use",
    status: "Upcoming",
    role: "Marketed by Apex",
    price: "Sample · on request",
    priceNote: "Sample indicative · release on formal launch",
    summary:
      "A signature mixed-use district concept combining retail, residences, hospitality and Grade-A offices in a single vertical masterplan.",
    description: [
      "Harbour Mixed-Use is presented as an upcoming mixed-use opportunity marketed by Apex Holdings in a prominent Karachi district.",
      "The vertical masterplan integrates a retail galleria, serviced residences, Grade-A offices and a hospitality component — all interconnected via a central plaza.",
      "Interested parties may register interest for early-stage briefings.",
    ],
    features: [
      "Vertical Mixed-Use Masterplan",
      "Curated Retail Galleria",
      "Hospitality Component",
      "Serviced Residences",
      "Grade-A Office Plates",
      "Central Plaza",
    ],
    amenities: [
      "Sky Gardens",
      "Food Court",
      "Co-working Lounges",
      "Cinema",
      "Kids Zone",
      "Multi-storey Parking",
    ],
    highlights: [
      { label: "Project Type", value: "Mixed-Use District" },
      { label: "Components", value: "Retail · Residences · Offices" },
      { label: "Status", value: "Upcoming · Sample" },
    ],
    paymentPlan: [
      { milestone: "On Registration", percent: "15%" },
      { milestone: "Construction Linked", percent: "65%" },
      { milestone: "On Handover", percent: "20%" },
    ],
    units: "Mix · Apartments · Retail · Offices",
    size: "Sample · indicative",
    launchYear: "Sample",
    cover:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1577920480472-d33ed2aaf35b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542838132-92a5339574f6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&w=1200&q=80",
    ],
    nearby: [
      { name: "Seafront", kind: "Landmark" },
      { name: "Major Arteries", kind: "Transport" },
      { name: "Embassy District", kind: "Diplomatic" },
      { name: "Retail Corners", kind: "Lifestyle" },
    ],
  },
  {
    slug: "parkview-apartments",
    name: "Parkview Apartments",
    tagline: "Family-sized apartments with park-side vistas",
    city: "Islamabad",
    area: "F-11",
    developer: "Independent Developer · Sample",
    category: "Plots & Apartments",
    status: "Completed",
    role: "Marketed by Apex",
    price: "PKR 1.9 Cr – 3.4 Cr",
    priceNote: "Sample resale range · on request",
    summary:
      "A boutique, ready-possession apartment project in a central Islamabad sector — marketed for end-user and investor buyers.",
    description: [
      "Parkview Apartments is a completed boutique residential project marketed by Apex Holdings to connect buyers with ready-possession inventory.",
      "The project offers family-sized layouts, generous natural light and panoramic park views — a rarity in Islamabad’s central sectors.",
      "Resale units and final inventory can be facilitated through our sales team.",
    ],
    features: [
      "Ready Possession",
      "Park-facing Apartments",
      "Spacious Layouts",
      "Solid Construction Quality",
      "Designer Kitchens",
      "Covered Car Parking",
    ],
    amenities: [
      "Communal Garden",
      "Children’s Play Area",
      "Backup Power",
      "Lift Access",
      "On-site Maintenance",
      "Secure Entry",
    ],
    highlights: [
      { label: "Project Type", value: "Apartments · Ready" },
      { label: "Configuration", value: "2 & 3 Bed" },
      { label: "Status", value: "Completed · Sample" },
    ],
    paymentPlan: [{ milestone: "On Booking", percent: "100%" }],
    units: "2 & 3 Bedroom Apartments",
    size: "Sample · indicative",
    launchYear: "Sample",
    cover:
      "https://images.unsplash.com/photo-1460317442991-2ecdbb9c3d77?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1484154218962-a31c47b301d7?auto=format&fit=crop&w=1200&q=80",
    ],
    nearby: [
      { name: "Sector Park", kind: "Recreation" },
      { name: "Schools", kind: "Education" },
      { name: "Hospitals", kind: "Healthcare" },
      { name: "Markets", kind: "Retail" },
    ],
  },
];

export const categoryMap: Record<ProjectCategory, string> = {
  Residential: "residential",
  Commercial: "commercial",
  "Mixed-Use": "mixed-use",
  "Plots & Apartments": "plots-apartments",
};

export const reverseCategoryMap: Record<string, ProjectCategory> = {
  residential: "Residential",
  commercial: "Commercial",
  "mixed-use": "Mixed-Use",
  "plots-apartments": "Plots & Apartments",
};

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);
