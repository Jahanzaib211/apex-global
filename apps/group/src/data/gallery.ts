export type GalleryCategory =
  | "Group Events"
  | "Corporate Events"
  | "Leadership"
  | "Technology"
  | "Outsourcing"
  | "Tours & Travels"
  | "Real Estate"
  | "Project Launches"
  | "Meetings"
  | "Conferences"
  | "Team Activities";
export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  date: string;
  caption: string;
  featured?: boolean;
  company?:
    "tech-solution" | "outsourcing" | "tours-travels" | "holdings" | "consultancy" | "group";
}
export const galleryItems: GalleryItem[] = [
  {
    id: "group-vision",
    title: "A Shared Vision in Motion",
    category: "Group Events",
    date: "2025-01-18",
    caption:
      "From a Group gathering bringing Apex companies together around the year ahead.",
    featured: true,
    company: "group",
  },
  {
    id: "tech-launch",
    title: "Technology, Ready for What Comes Next",
    category: "Project Launches",
    date: "2024-11-08",
    caption: "From a technology solution launch.",
    company: "tech-solution",
  },
  {
    id: "leadership-table",
    title: "Leadership Roundtable",
    category: "Leadership",
    date: "2024-10-21",
    caption: "From a leadership discussion.",
    company: "group",
  },
  {
    id: "outsourcing-team",
    title: "A Team Built Around Service",
    category: "Outsourcing",
    date: "2024-09-12",
    caption: "From an outsourcing team activity.",
    company: "outsourcing",
  },
  {
    id: "journey-saudi",
    title: "Journeys With Purpose",
    category: "Tours & Travels",
    date: "2024-08-05",
    caption: "From a travel operations moment.",
    company: "tours-travels",
  },
  {
    id: "holdings-site",
    title: "A New Property Perspective",
    category: "Real Estate",
    date: "2024-07-17",
    caption: "From a holdings project visit.",
    company: "holdings",
  },
  {
    id: "conference-stage",
    title: "Ideas Across Industries",
    category: "Conferences",
    date: "2024-06-29",
    caption: "From a conference appearance.",
    company: "group",
  },
  {
    id: "corporate-milestone",
    title: "Marking a Corporate Milestone",
    category: "Corporate Events",
    date: "2024-05-15",
    caption: "From an Apex corporate event.",
    company: "group",
  },
  {
    id: "planning-room",
    title: "From Conversation to Direction",
    category: "Meetings",
    date: "2024-04-11",
    caption: "From a cross-company planning meeting.",
    company: "consultancy",
  },
  {
    id: "team-day",
    title: "The People Behind the Work",
    category: "Team Activities",
    date: "2024-03-23",
    caption: "From an Apex team activity.",
    company: "group",
  },
  {
    id: "digital-lab",
    title: "Building Better Digital Tools",
    category: "Technology",
    date: "2024-02-14",
    caption: "From the technology team.",
    company: "tech-solution",
  },
  {
    id: "service-workshop",
    title: "Sharper Service, Stronger Teams",
    category: "Outsourcing",
    date: "2024-01-26",
    caption: "From a service workshop.",
    company: "outsourcing",
  },
];
export default galleryItems;
