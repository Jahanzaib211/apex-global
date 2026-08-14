import {
  cookiePolicy,
  disclaimer,
  privacyPolicy,
  securityStatement,
  termsOfUse,
  type LegalContext,
  type LegalDocument,
} from "@apex/site-kit/legal";
import { BRAND } from "@/lib/brand";

/** What the shared legal text needs to know about this site. */
export const LEGAL_CONTEXT: LegalContext = {
  company: BRAND.name,
  siteUrl: BRAND.siteUrl,
  contactPath: "/contact",
  jurisdiction: "Pakistan",
  businessSpecificUse: [
    "Where we deliver outsourced services, we process personal data belonging to our clients strictly on their documented instructions and only for the duration of the engagement.",
  ],
};

const DOCS: Record<string, LegalDocument> = {
  privacy: privacyPolicy({
    ...LEGAL_CONTEXT,
    extraSections: [
      {
        title: "Acting as a Processor",
        body: [
          "When we operate a client's process — a support queue, a sales desk, a back-office workflow — the client is the controller of the personal data involved and we are the processor.",
          "In that role we act only on the client's written instructions, we apply the security measures agreed in the engagement, and we return or delete the data when the engagement ends. Sub-processors are disclosed to the client and engaged under equivalent obligations.",
        ],
      },
    ],
  }),
  terms: termsOfUse(LEGAL_CONTEXT),
  cookies: cookiePolicy(LEGAL_CONTEXT),
  security: securityStatement(LEGAL_CONTEXT),
  disclaimer: disclaimer(LEGAL_CONTEXT),
};

export const documentBySlug = (slug: string): LegalDocument | undefined => DOCS[slug];
