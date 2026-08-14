import { legalDocuments, type LegalContext } from "@apex/site-kit/legal";
import { SITE_URL } from "@/lib/site-url";

/** What the shared legal text needs to know about this site. */
export const LEGAL_CONTEXT: LegalContext = {
  company: "Apex Holdings",
  siteUrl: SITE_URL,
  contactPath: "/contact",
  jurisdiction: "Pakistan",
  businessSpecificUse: [
    "Where you enquire about a project or book a site visit, we use your details to arrange the visit, to share project information, and to follow up on your interest.",
  ],
  extraSections: [
    {
      title: "Property Information",
      body: [
        "Project descriptions, plans, imagery and pricing on this site are indicative and subject to change. Availability, dimensions, payment plans and completion timelines are confirmed only in the written documentation issued for a specific unit.",
        "Computer-generated imagery is an artist's impression and is not a representation of the finished property.",
      ],
    },
    {
      title: "No Investment Advice",
      body: [
        "Nothing on this site is an offer of an investment or a recommendation to buy any property. Property values can fall as well as rise. Take independent advice before committing funds.",
      ],
    },
  ],
};

export const DOCUMENTS = legalDocuments(LEGAL_CONTEXT);

export const documentBySlug = (slug: string) => DOCUMENTS.find((d) => d.slug === slug);
