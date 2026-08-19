import type { Metadata } from "next";
import {
  LegalCTA,
  LegalContent,
  LegalHero,
  WebPageSchema,
  type LegalSection,
} from "@/components/LegalPage";
const sections: LegalSection[] = [
  {
    title: "What Are Cookies",
    content: (
      <p>
        Cookies are small text files or similar storage technologies placed on your device by a
        website. They help a site remember settings, maintain security, measure performance, and
        understand how visitors use pages. Some are stored only for a session; others remain until
        they expire or you remove them.
      </p>
    ),
  },
  {
    title: "How We Use Cookies",
    children: (
      <>
        <h3>Essential cookies</h3>
        <p>
          These support core functions such as security, navigation, consent preferences, and
          reliable page delivery. The site may not work correctly without them.
        </p>
        <h3>Functional cookies</h3>
        <p>
          These remember choices such as display preferences or form context. They are used only
          where they improve an experience you have requested.
        </p>
        <h3>Analytics cookies</h3>
        <p>
          Where enabled with consent, analytics helps us understand aggregate page usage, technical
          performance, and navigation patterns so we can improve the website.
        </p>
        <h3>Marketing cookies</h3>
        <p>
          Marketing technologies may measure campaigns or support relevant communications only where
          permitted and consented to. They are not used on sensitive consultancy workflows.
        </p>
        <div className="border-gold/60 border bg-white/70 p-6">
          <p className="text-navy font-semibold">Important note</p>
          <p className="mt-2">
            Apex Group&apos;s financial consultancy pages do not use advertising cookies or
            marketing pixels. Sensitive financial enquiry data is never transmitted to advertising
            platforms.
          </p>
        </div>
      </>
    ),
  },
  {
    title: "Third-Party Cookies",
    content: (
      <p>
        Some services may set their own cookies when embedded or linked. Potential examples include
        Google Analytics for non-sensitive aggregate measurement and Meta Pixel on non-sensitive
        pages if separately enabled and legally permitted. We will configure providers to respect
        consent and will not place these tools on financial consultancy pages.
      </p>
    ),
  },
  {
    title: "Managing Cookies",
    content: (
      <p>
        Our consent banner lets you accept all optional cookies, use essential cookies only, or
        manage preferences. You can also change browser settings to block or delete cookies.
        Blocking essential cookies may affect security or site functionality. Your browser provider
        explains how to manage storage controls for your device.
      </p>
    ),
  },
  {
    title: "Changes",
    content: (
      <p>
        We may update this policy as our website, providers, or legal obligations change. The latest
        version and update date will appear here.
      </p>
    ),
  },
  {
    title: "Contact",
    content: (
      <p>
        Questions about cookies can be sent to the contact form at
        apex.apexgroupcompanies.com/contact, or by post to 31-20, Sector CCD Main Blvd, Sector M7
        Lake City, Lahore, Pakistan. Apex Group of Companies (Pvt) Ltd is the relevant contact
        entity unless stated otherwise.
      </p>
    ),
  },
];
export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "The cookies Apex Group of Companies uses, what each one does, and how to control them in your browser.",
};

export default function CookiesPage() {
  return (
    <main>
      <LegalHero title="Cookie Policy." subtitle="Last updated: [Month Day, Year]" />
      <LegalContent
        intro="We use a restrained approach to cookies: essential technologies support a reliable website, while optional measurement is considered carefully and subject to consent. Sensitive financial enquiry information stays outside advertising and analytics workflows."
        sections={sections}
        disclaimer={false}
      />
      <LegalCTA
        title="Want to understand your choices?"
        primary="Contact Apex"
        secondary="Read Privacy Policy"
        secondaryHref="/privacy"
      />
      <WebPageSchema
        name="Cookie Policy"
        description="How Apex Group of Companies uses cookies and similar technologies."
        path="/cookies"
      />
    </main>
  );
}
