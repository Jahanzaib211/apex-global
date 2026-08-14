import type { Insight } from "./insights";

const bodies: Record<string, string[]> = {
  "apex-group-2026-outlook": [
    "Each year, the Apex Group Office takes a deliberate look across our five businesses and asks the same question: what does the next twelve months require of us, and where should we concentrate effort? The 2026 outlook is built around three ideas — coordination, depth, and patient scale.",
    "Coordination means more than reporting lines. It means the technology team understands the operating realities of the outsourcing team, the tours team can speak fluently about real estate context, and the consultancy practice is plugged into the conversations happening inside the Holdings business. That cross-sector awareness is a quiet, hard-to-copy advantage.",
    "Depth means investing in the work that does not always photograph well: quality frameworks, internal documentation, mentoring, supplier relationships, and the kind of process work that only pays off over time. We expect 2026 to be a year of fewer announcements and steadier compounding.",
    "Patient scale is the discipline of growing at a pace that the organization can absorb. We will continue to add capability where it is needed, but we will not chase growth that compromises the quality of the work our existing clients and partners rely on. The outlook is a long letter, not a short one.",
  ],
  "cross-business-collaboration": [
    "It is easy to describe the Group as a portfolio of independent companies. In practice, the most useful work happens at the seams between them — when the technology team helps the tours business design a better booking experience, or when the consultancy practice and the holdings team evaluate a property decision together.",
    "Cross-business collaboration is not a project; it is a working culture. We make space for it by ensuring that teams know who their counterparts are in adjacent businesses, and by treating shared context as a deliverable rather than a luxury.",
    "The payoff is rarely visible from the outside. It shows up in shorter onboarding cycles, in proposals that consider more than one angle, and in clients who feel that the organization they are working with is actually listening across functions rather than handing them off between silos.",
    "The 2025 and 2026 work plans include specific time allocations for cross-business learning — paired shadowing, shared reviews, and joint retrospectives. None of it is dramatic; all of it is intended to be useful.",
  ],
  "technology-delivery-models": [
    "Choosing how technology work gets delivered is one of the higher-leverage decisions a leadership team can make. Build in-house, engage a partner for delivery, or adopt a managed model — each carries different cost profiles, control tradeoffs, and skill requirements.",
    'The most useful first question is not "which model is best?" but "what outcome are we actually trying to produce, and over what horizon?" A short-horizon, well-scoped project often looks very different from a multi-year capability build — even when the surface description sounds the same.',
    "In our experience, the model that fits best is the one that aligns incentives cleanly. Misaligned incentives produce work that looks fine on paper and behaves badly in operation: missed handoffs, unclear ownership, and the slow erosion of trust on both sides.",
    "Whichever model you choose, the discipline that matters most is defining success in observable terms before the work begins. Without that, delivery quality becomes a matter of opinion — and opinions are usually what cause the model itself to be blamed.",
  ],
  "outsourcing-quality-frameworks": [
    "The outsourcing engagements that work best over time are not the ones that cost the least. They are the ones with the clearest quality frameworks — defined ownership, observable outcomes, and review cadences that both sides take seriously.",
    "Mature operations share a few habits: they keep documentation close to the work, they treat issues as information rather than blame, and they put real effort into transition periods that most teams would rather rush through.",
    "A quality framework does not need to be elaborate. It needs to be specific enough that a person joining the engagement six months from now can read it and understand what good looks like, what the standards are, and how deviations are handled.",
    "We build these frameworks with our clients, not for them. The result is a shared operating language that survives team changes on either side — and that is usually the difference between an outsourcing relationship that compounds value and one that quietly erodes it.",
  ],
  "tours-tailored-itineraries": [
    "Template travel has its place: when the goal is speed, low cost, or a familiar experience, an off-the-shelf package is often the right answer. But for meaningful travel — family milestones, pilgrimage, multi-generational trips, or work that crosses several cities — a tailored itinerary usually serves people better.",
    "A well-designed itinerary is not a longer list. It is a sequence with rhythm: enough activity to feel purposeful, enough breathing room to actually enjoy the days, and intentional transitions between places rather than back-to-back logistics that exhaust the traveller.",
    "The work behind a good itinerary is unglamorous: confirming ground arrangements, checking seasonal considerations, building realistic buffers for transit, and paying attention to small details that disproportionately shape the experience.",
    "When done well, the result feels effortless. The traveller does not see the planning; they experience a trip that respects their time, their energy, and the reason they decided to go in the first place. That is the standard we work toward on every program we design.",
  ],
  "real-estate-local-knowledge": [
    "Real estate decisions are made on local context — zoning, micro-market behavior, supply pipelines, regulatory shifts, and the lived experience of operating in a specific place. A spreadsheet can describe a property; only local knowledge can tell you whether it is the right one.",
    "Cross-border investors often underestimate how much of a property decision is judgement, not data. The numbers matter, but the interpretation of those numbers depends on who is reading them, and on the ground, that means people who actually operate in the market.",
    "Local knowledge also extends to relationships — brokers, counsel, contractors, and counterparties who can move quickly when the moment is right. These relationships are not interchangeable across borders, and they are not easy to assemble remotely.",
    "Our approach is to combine rigorous analysis with on-the-ground context. We do not pretend that a desk review is enough, and we do not pretend that local presence alone is enough either. The two together are what produce real estate decisions we can stand behind.",
  ],
  "financial-clarity": [
    "Most financial conversations we are asked to join start in the same place: a sense that the picture has become harder to see clearly. Assets are spread across vehicles, businesses have grown beyond the spreadsheet that originally tracked them, and the connection between today's position and tomorrow's objectives is harder to read.",
    "The first move is rarely a product recommendation. It is a careful, organized view of what exists — what is owned, what is owed, what the businesses look like, what the cash flows actually are. Without that view, recommendations tend to be guesses dressed up as strategy.",
    "Once the picture is clear, the questions change. They become about tradeoffs: what to consolidate, what to simplify, what to build, what to protect. Those are the conversations worth having, and they are the ones that move a financial life forward.",
    "The work of building clarity is patient. It is also the work that, in our experience, people most often wish they had started earlier. The good news is that it is rarely as complicated as it seems once you have a structured way to look at it.",
  ],
  "corporate-update-q3": [
    "The third quarter of 2025 was a period of steady execution across the Group — fewer launches, more depth, and a deliberate focus on the operating work that compounds over time rather than the announcements that fade quickly.",
    "In the technology business, the team closed out a multi-quarter delivery cycle for a long-term client and began scoping the next phase of engagement. The outsourcing team onboarded a new operations lead and continued to invest in the quality frameworks that underpin mature delivery.",
    "The tours and travels business ran a busy pilgrimage season with high satisfaction across programs, and laid the groundwork for new itineraries in the coming year. The holdings team progressed work on two projects that are expected to come to market in the next several quarters.",
    "The consultancy practice continued to build out its client roster, with a focus on long-term relationships rather than transactional engagements. None of this is dramatic on its own; together, it is the kind of progress that matters most over time.",
  ],
  "upcoming-events-2026": [
    "Our 2026 calendar is taking shape. We will share confirmed dates, venues and registration details as they firm up across the year. The list below is a placeholder preview of the kinds of engagements and programs we are planning.",
    "Group-level events will continue to be a focus — bringing partners, advisors and internal leadership together around shared themes. We expect a mix of in-person and online formats, with the in-person events concentrated in our core operating cities.",
    "On the business side, look for technology briefings, pilgrimage program dates, real estate launch windows, and the occasional webinar where a topic deserves a longer conversation than a short article allows. The consultancy practice will also be hosting small-group sessions for clients and select introducers.",
    "The best way to stay current is the newsletter at the bottom of this page, or the events section of the site. We will not flood inboxes — only the dates that are actually worth knowing about.",
  ],
};

export function getInsightBody(insight: Insight): string[] {
  return (
    bodies[insight.slug] ?? [
      `${insight.title} — placeholder article body. Replace this content with the full editorial piece before publication.`,
      "The Apex Group editorial team drafts each piece with the reader in mind: clear context, useful framing, and a point of view that reflects the way we actually work.",
      "When the final article is published, this placeholder will be replaced with the full body, properly formatted with section headings, subheads, and any necessary callouts.",
      "For now, this text exists to demonstrate the article layout, typography, and the related-insights pattern at the bottom of the page.",
    ]
  );
}
