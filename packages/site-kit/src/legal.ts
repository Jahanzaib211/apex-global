/**
 * The legal documents every Apex site must publish, as structured data.
 *
 * Three of the five sites linked to legal pages that did not exist: Holdings'
 * footer pointed at `/legal/privacy`, `/legal/terms` and `/legal/disclaimer`,
 * and Outsourcing's at `/privacy`, `/terms`, `/cookies` and `/security` — seven
 * 404s in two footers. Only the Group site had real documents, written inline
 * in its own page components where no other site could reach them.
 *
 * The text lives here as data rather than JSX so each site renders it with its
 * own components and typography while the wording stays identical — a privacy
 * policy that says different things on different Apex properties is worse than
 * one that is merely plain.
 *
 * These are operational documents, not legal advice. `org.legalName`,
 * `org.registrationNumber`, `org.vatId` and `org.disputeEmail` are deliberately
 * empty in the settings table; fill them in the console before publishing into
 * a jurisdiction that requires them.
 */

export interface LegalSection {
  readonly title: string;
  /** Paragraphs, in order. Rendered as <p>. */
  readonly body: readonly string[];
  /** Optional bullet list rendered after `body`. */
  readonly bullets?: readonly string[];
}

export interface LegalDocument {
  readonly slug: "privacy" | "terms" | "cookies" | "disclaimer" | "security";
  readonly title: string;
  /** One-line summary used for the page description and og:description. */
  readonly summary: string;
  readonly intro: string;
  readonly sections: readonly LegalSection[];
}

/** What the document needs to know about the site publishing it. */
export interface LegalContext {
  /** Full operating name, e.g. "Apex Holdings". */
  readonly company: string;
  /** Public host with scheme, e.g. "https://holdings.apexgroupcompanies.com". */
  readonly siteUrl: string;
  /** Path to the site's contact form. Every "contact us" clause points here. */
  readonly contactPath: string;
  /** Governing law. Matches `org.jurisdiction` in the settings table. */
  readonly jurisdiction?: string;
  /**
   * Sentences describing what this specific business does with personal data,
   * appended to the "How We Use Your Information" section. A property
   * developer and a BPO answer this differently.
   */
  readonly businessSpecificUse?: readonly string[];
  /** Extra whole sections this site needs — e.g. a BPO's sub-processor clause. */
  readonly extraSections?: readonly LegalSection[];
}

const DEFAULT_JURISDICTION = "Pakistan";

export function privacyPolicy(ctx: LegalContext): LegalDocument {
  const jurisdiction = ctx.jurisdiction ?? DEFAULT_JURISDICTION;
  return {
    slug: "privacy",
    title: "Privacy Policy",
    summary: `How ${ctx.company} collects, uses, shares and protects personal information.`,
    intro: `This policy explains what personal information ${ctx.company} collects, why we collect it, who we share it with, and the choices you have. It applies to ${ctx.siteUrl} and to enquiries you send us through it.`,
    sections: [
      {
        title: "Information We Collect",
        body: [
          "We collect information you choose to give us when you contact us, request a consultation or quote, apply for a role, or otherwise communicate with our team.",
          "We also collect limited technical information automatically when you visit the site, so that we can keep it working and understand which pages are useful.",
        ],
        bullets: [
          "Information you submit: name, email address, telephone number, company, job title, country, and the content of your enquiry.",
          "Application information: the role you applied for, your stated experience, and any link to a CV you choose to share.",
          "Technical information: IP address, browser and device type, pages viewed, and the referring page or campaign.",
          "Marketing attribution: UTM parameters and click identifiers present in the link you arrived on.",
        ],
      },
      {
        title: "How We Use Your Information",
        body: [
          "We use the information to respond to you, to deliver the service or role you enquired about, to keep records of our dealings with you, and to improve the site.",
          ...(ctx.businessSpecificUse ?? []),
        ],
        bullets: [
          "Responding to enquiries and preparing quotes or proposals.",
          "Assessing job applications and contacting candidates.",
          "Maintaining our customer relationship records.",
          "Understanding which campaigns and pages bring genuine enquiries.",
          "Detecting and preventing spam and abuse of our forms.",
        ],
      },
      {
        title: "Legal Basis for Processing",
        body: [
          "Where the law requires a legal basis, we rely on your consent when you submit a form, on our legitimate interest in operating and improving our business, and on the necessity of processing to take steps at your request before entering a contract.",
          "You can withdraw consent at any time. Withdrawal does not affect processing carried out before you withdrew.",
        ],
      },
      {
        title: "How We Share Your Information",
        body: [
          "We do not sell personal information. We share it only where it is necessary to answer you or to run our systems.",
        ],
        bullets: [
          "Within the Apex group of companies, where your enquiry concerns another group business.",
          "With service providers who host our systems, deliver our email, and provide our customer relationship and live-chat tooling, under contract and only for those purposes.",
          "Where we are required to by law, regulation, or a valid legal request.",
          "With your explicit direction, where you ask us to introduce you to a third party.",
        ],
      },
      {
        title: "International Data Transfers",
        body: [
          `We operate in ${jurisdiction} and may work with providers located elsewhere. Where information moves across a border, we take reasonable steps to ensure it remains protected to the standard described in this policy.`,
        ],
      },
      {
        title: "Cookies and Similar Technologies",
        body: [
          "We use a small number of cookies and similar technologies to keep the site working, remember your preferences, and understand how the site is used. Our cookie policy describes them and how to control them.",
        ],
      },
      {
        title: "Data Retention",
        body: [
          "We keep enquiry and application records for as long as needed to deal with the matter and to meet our record-keeping obligations, then delete or anonymise them.",
          "If you ask us to delete your information and we have no overriding obligation to keep it, we will.",
        ],
      },
      {
        title: "Your Rights",
        body: [
          "Subject to local law, you may ask us to confirm what information we hold about you, correct it if it is wrong, delete it, restrict how we use it, or provide it in a portable form. You may also object to processing based on legitimate interest.",
          `To make a request, contact us through ${ctx.siteUrl}${ctx.contactPath}. We may need to verify your identity before acting.`,
        ],
      },
      {
        title: "Security Measures",
        body: [
          "We apply technical and organisational measures appropriate to the information we hold: encrypted transport, access controls, credential encryption at rest, and audit logging of administrative actions.",
          "No system is perfectly secure. If a breach affects your information and the law requires us to tell you, we will.",
        ],
      },
      {
        title: "Children's Privacy",
        body: [
          "This site is intended for business and adult use. We do not knowingly collect information from children. If you believe a child has given us information, contact us and we will delete it.",
        ],
      },
      {
        title: "Third-Party Links",
        body: [
          "Our pages link to other Apex companies and to external sites. We are not responsible for their content or their privacy practices; read their policies before giving them information.",
        ],
      },
      {
        title: "Changes to This Policy",
        body: [
          "We may update this policy as our services or the law change. The current version is always the one published on this page.",
        ],
      },
      ...(ctx.extraSections ?? []),
      {
        title: "Contact Us",
        body: [
          `For any question about this policy or about your information, contact ${ctx.company} through ${ctx.siteUrl}${ctx.contactPath}.`,
        ],
      },
    ],
  };
}

export function termsOfUse(ctx: LegalContext): LegalDocument {
  const jurisdiction = ctx.jurisdiction ?? DEFAULT_JURISDICTION;
  return {
    slug: "terms",
    title: "Terms of Use",
    summary: `The terms on which ${ctx.company} makes this website available.`,
    intro: `These terms govern your use of ${ctx.siteUrl}. By using the site you accept them. If you do not accept them, please do not use the site.`,
    sections: [
      {
        title: "Acceptance of Terms",
        body: [
          "Using this site means you accept these terms and our privacy policy. We may update them; the version published here is the one that applies.",
        ],
      },
      {
        title: "Use of the Website",
        body: [
          "You may use the site for lawful purposes connected with evaluating or engaging our services. You may not use it in a way that damages it, interferes with anyone else's use of it, or breaks the law.",
        ],
        bullets: [
          "Do not attempt to gain unauthorised access to any part of the site or its systems.",
          "Do not scrape, harvest, or bulk-download content without our written permission.",
          "Do not submit false information, malware, or content you have no right to send.",
          "Do not use our forms to send unsolicited commercial messages.",
        ],
      },
      {
        title: "Intellectual Property Rights",
        body: [
          `The content, design, brand names and logos on this site belong to ${ctx.company} or to the Apex group, or are used under licence. You may view and print pages for your own reference; any other use needs our written permission.`,
        ],
      },
      {
        title: "Information Is Not an Offer",
        body: [
          "Descriptions of our services, capabilities and pricing on this site are for information. They are not an offer capable of acceptance and do not form a contract. Any engagement is governed by a separate signed agreement.",
        ],
      },
      {
        title: "Accuracy of Content",
        body: [
          "We take care to keep the site accurate and current, but we do not warrant that it is free of error or that it is complete. Content may change without notice.",
        ],
      },
      {
        title: "Third-Party Links and Services",
        body: [
          "The site links to other Apex companies and to third-party sites and tools. We do not control them and are not responsible for their content, availability, or practices.",
        ],
      },
      {
        title: "Limitation of Liability",
        body: [
          "To the fullest extent the law allows, we are not liable for indirect or consequential loss, loss of profit, loss of business, or loss of data arising from your use of, or inability to use, this site.",
          "Nothing in these terms excludes liability that cannot lawfully be excluded.",
        ],
      },
      {
        title: "Indemnification",
        body: [
          "You agree to indemnify us against claims, losses and reasonable costs arising from your breach of these terms or your misuse of the site.",
        ],
      },
      {
        title: "Governing Law",
        body: [
          `These terms are governed by the laws of ${jurisdiction}, and the courts of ${jurisdiction} have jurisdiction over any dispute.`,
        ],
      },
      {
        title: "Severability",
        body: [
          "If any provision of these terms is found unenforceable, the rest remain in force.",
        ],
      },
      ...(ctx.extraSections ?? []),
      {
        title: "Contact",
        body: [
          `Questions about these terms can be sent to ${ctx.company} through ${ctx.siteUrl}${ctx.contactPath}.`,
        ],
      },
    ],
  };
}

export function cookiePolicy(ctx: LegalContext): LegalDocument {
  return {
    slug: "cookies",
    title: "Cookie Policy",
    summary: `The cookies ${ctx.company} uses, what they do, and how to control them.`,
    intro: `This policy explains the cookies and similar technologies used on ${ctx.siteUrl}.`,
    sections: [
      {
        title: "What Are Cookies",
        body: [
          "Cookies are small text files a site stores on your device. They let a site remember your actions and preferences between pages and visits.",
        ],
      },
      {
        title: "How We Use Cookies",
        body: ["We keep our use deliberately small."],
        bullets: [
          "Strictly necessary: keeping the site secure and working, and remembering your cookie choices.",
          "Attribution: remembering which campaign or referring page brought you here, so we can tell which marketing genuinely works.",
          "Support: our live-chat widget sets its own cookies so a conversation survives a page change.",
        ],
      },
      {
        title: "Third-Party Cookies",
        body: [
          "Our live-chat provider sets cookies when the widget loads. Embedded third-party content may set its own. We do not control those cookies; see the relevant provider's policy.",
        ],
      },
      {
        title: "Managing Cookies",
        body: [
          "You can accept or reject non-essential cookies through the banner shown on your first visit, and change your mind later through your browser settings.",
          "Every browser lets you view, delete and block cookies. Blocking strictly necessary cookies may stop parts of the site working.",
        ],
      },
      {
        title: "Changes",
        body: [
          "We update this policy when the cookies we use change. The version on this page is the current one.",
        ],
      },
      ...(ctx.extraSections ?? []),
      {
        title: "Contact",
        body: [
          `Questions about cookies can be sent to ${ctx.company} through ${ctx.siteUrl}${ctx.contactPath}.`,
        ],
      },
    ],
  };
}

export function disclaimer(ctx: LegalContext): LegalDocument {
  const jurisdiction = ctx.jurisdiction ?? DEFAULT_JURISDICTION;
  return {
    slug: "disclaimer",
    title: "Disclaimer",
    summary: `The limits of the information ${ctx.company} publishes on this website.`,
    intro: `This disclaimer applies to all content published on ${ctx.siteUrl}.`,
    sections: [
      {
        title: "General Disclaimer",
        body: [
          "The content on this site is provided for general information. It is not advice, and you should not act on it without taking advice appropriate to your own circumstances.",
        ],
      },
      {
        title: "No Professional Advice",
        body: [
          "Nothing here constitutes legal, financial, tax, investment or other professional advice. Engage a qualified adviser before making a decision that depends on it.",
        ],
      },
      {
        title: "Forward-Looking Statements",
        body: [
          "Descriptions of plans, pipelines and intentions describe what we currently expect. They are not promises, and they may change.",
        ],
      },
      {
        title: "External Links",
        body: [
          "We link to third-party sites for convenience. We do not endorse them and are not responsible for their content or accuracy.",
        ],
      },
      ...(ctx.extraSections ?? []),
      {
        title: "Limitation of Liability",
        body: [
          `To the extent permitted by the laws of ${jurisdiction}, ${ctx.company} accepts no liability for loss arising from reliance on the content of this site.`,
        ],
      },
    ],
  };
}

/** Every document a site publishes, in footer order. */
export function legalDocuments(ctx: LegalContext): readonly LegalDocument[] {
  return [privacyPolicy(ctx), termsOfUse(ctx), cookiePolicy(ctx), disclaimer(ctx)];
}

/**
 * Security statement.
 *
 * Separate from the privacy policy because buyers ask a different question:
 * privacy is "what do you do with my data", security is "how do you protect
 * it". Outsourcing's footer linked to /security with no such page, and the
 * Tech site publishes one at /legal/security.
 *
 * Every control listed here must be one Apex actually operates. Do not add
 * an aspirational item — a security page is the first thing a client's
 * procurement team checks against reality.
 */
export function securityStatement(ctx: LegalContext): LegalDocument {
  return {
    slug: "security",
    title: "Security",
    summary: `How ${ctx.company} protects the systems and data entrusted to it.`,
    intro: `This page describes the security practices ${ctx.company} operates. It is a summary, not a substitute for the security schedule in a signed agreement.`,
    sections: [
      {
        title: "Transport and Storage",
        body: [
          "All traffic to our public services is served over TLS. Administrative interfaces are not published to the public internet; they are reachable only over the private network.",
          "Third-party credentials held on our behalf are encrypted at rest with AES-256-GCM, and plaintext is never returned through an API response.",
        ],
      },
      {
        title: "Access Control",
        body: [
          "Access to internal systems is authenticated per user and granted by role, on a least-privilege basis. Administrative actions are recorded in an audit log that records who did what and when.",
          "Access is reviewed when a person changes role and revoked when they leave.",
        ],
      },
      {
        title: "Application Security",
        body: [
          "Our public sites send a strict Content-Security-Policy along with HSTS, X-Frame-Options, X-Content-Type-Options and a restrictive Permissions-Policy.",
          "Forms are rate-limited and protected against automated abuse. Dependencies are scanned, and code changes are reviewed before release.",
        ],
      },
      {
        title: "Network Exposure",
        body: [
          "Our origin servers do not accept inbound connections from the public internet. Public traffic terminates at the edge and reaches the origin over an outbound-initiated tunnel, so there is no inbound listener to discover and no origin address to reach around the edge.",
        ],
      },
      {
        title: "Reporting a Vulnerability",
        body: [
          `If you believe you have found a security issue, tell us through ${ctx.siteUrl}${ctx.contactPath} before disclosing it publicly. We will acknowledge your report and keep you informed while we investigate.`,
          "Please do not run automated scanning against our production systems, and do not access or modify data that is not yours.",
        ],
      },
      ...(ctx.extraSections ?? []),
    ],
  };
}
