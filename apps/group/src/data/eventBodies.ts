import type { Event } from "./events";

const bodies: Record<string, string[]> = {
  "apex-group-summit-2026": [
    "The Apex Group Annual Summit is our Group-level gathering — an opportunity to bring partners, advisors and internal leadership into the same room (or the same video window) to align on the year ahead.",
    "Across the program, we share cross-business learnings, explore new collaboration opportunities, and review the strategic priorities that will guide the Group through the next twelve months. It is also the moment when our internal leadership team presents the outlook for each business to a wider audience.",
    "Attendance is by invitation. Partners and select introducers will receive registration details by email as the program is finalized. If you would like to be considered for an invitation, the form below is the best place to flag your interest.",
  ],
  "tech-solution-product-briefing": [
    "A focused briefing session walking through our current technology offerings, delivery models, and the questions prospective clients most often ask.",
    "The session is designed to be useful whether you are early in your evaluation or already narrowing down your options. We will share case-style examples, talk through the typical engagement shape, and leave time for direct questions.",
    "If a particular topic is front of mind for you, mention it in the notes field when you register and we will do our best to address it live.",
  ],
  "umrah-program-winter": [
    "Our winter Umrah program is a two-week guided journey with the logistics, ground arrangements and on-ground coordination handled by our travel team.",
    "The itinerary is designed to balance the spiritual core of the journey with practical comfort — accommodation close to the holy sites, organized ground transport, and time structured to allow for personal reflection alongside group prayer.",
    "The program is open to families and individuals. Registration is handled on a first-come basis; deposit terms are confirmed at the time of booking.",
  ],
  "holdings-project-launch": [
    "A launch event for an upcoming real estate project, with an investor briefing, site walkthrough overview, and Q&A with the project team.",
    "The session will cover the project concept, the market context, the structure of the offering, and the practical next steps for serious inquiries. It is intended for qualified investors and introducers; please mention your background when registering.",
  ],
  "financial-planning-webinar": [
    "An educational webinar on a structured approach to financial clarity — observation, organization, and forward planning — for individuals and business owners.",
    "The session is non-promotional in tone. It is intended for anyone who is starting to think more deliberately about their financial position, regardless of whether they ever work with the consultancy practice. A short Q&A will follow the main presentation.",
  ],
  "outsourcing-industry-conference": [
    "A past industry conference where our outsourcing team joined sector peers to discuss delivery quality, talent development, and the changing shape of client expectations in the BPO space.",
    "Our team contributed to panel discussions on quality frameworks and on building delivery capability in emerging operating geographies. A summary of the key takeaways is available on request.",
  ],
};

export function getEventBody(event: Event): string[] {
  return (
    bodies[event.slug] ?? [
      event.description,
      "The Apex Group events team drafts each event page with a clear view of what the event is, who it is for, and what attendees should expect.",
      "Registration opens closer to the date. Register your interest below and we will send the agenda and any preparation notes directly.",
    ]
  );
}
