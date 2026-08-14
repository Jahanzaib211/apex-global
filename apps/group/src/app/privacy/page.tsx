import {
  LegalCTA,
  LegalContent,
  LegalHero,
  WebPageSchema,
  type LegalSection,
} from "@/components/LegalPage";

const sections: LegalSection[] = [
  {
    title: "Information We Collect",
    children: (
      <>
        <h3>Personal information you provide</h3>
        <p>
          We collect information you choose to submit when you contact us, request a consultation,
          apply for a role, enquire about a group company, register for an event, or communicate
          with our team. This may include your name, email address, telephone number, company, job
          title, location, enquiry details, and any documents or preferences you provide.
        </p>
        <h3>Information collected automatically</h3>
        <p>
          When you browse our website, we may receive technical information such as your IP address,
          browser and device type, operating system, approximate location, pages viewed, referring
          pages, and interaction timestamps. We use this information to operate, secure, and improve
          the website rather than to infer sensitive personal characteristics.
        </p>
        <h3>Information from third parties</h3>
        <p>
          We may receive information from business partners, professional advisers, recruitment
          platforms, event organisers, or publicly available sources. We only use such information
          where there is a lawful basis and where the source is permitted to share it.
        </p>
      </>
    ),
  },
  {
    title: "How We Use Your Information",
    content: (
      <>
        <p>
          We use personal information to respond to enquiries, assess and deliver requested
          services, communicate about active engagements, administer recruitment and partnerships,
          manage events, maintain business records, improve website content and usability, prevent
          fraud and abuse, protect our people and systems, and comply with legal, regulatory,
          accounting, and reporting obligations.
        </p>
        <p>
          Where you have asked for information, we may send service-related communications. We do
          not use an enquiry as permission for unrelated promotional messages. Any optional
          marketing communication will include a clear unsubscribe mechanism.
        </p>
      </>
    ),
  },
  {
    title: "Legal Basis for Processing",
    content: (
      <p>
        Where applicable, we process information because it is necessary to perform a contract or
        take steps at your request, because we have a legitimate interest in operating and securing
        our business, because you have consented, or because processing is required by law. We
        balance legitimate interests against your rights and expectations, and you may contact us to
        ask which basis applies to a particular use.
      </p>
    ),
  },
  {
    title: "How We Share Your Information",
    content: (
      <>
        <p>
          We may share information with trusted service providers that host systems, support
          communications, process forms, provide security, or assist with professional, legal,
          accounting, and compliance work. These providers may only use information to provide
          contracted services and must apply appropriate confidentiality and security controls.
        </p>
        <p>
          Information may also be shared with relevant Apex Group companies where needed to answer
          your enquiry or deliver a requested service. We may disclose information where required by
          law, court order, regulator, or to protect rights, safety, and property. We never sell
          personal information.
        </p>
      </>
    ),
  },
  {
    title: "Financial Consultancy Data — Special Protections",
    callout: true,
    content: (
      <>
        <p>
          Financial consultancy enquiries can contain unusually sensitive commercial and personal
          details. We treat these details as restricted business information and separate them from
          ordinary marketing and website analytics workflows.
        </p>
        <ul>
          <li>
            Financial details are isolated in access-controlled systems and are available only to
            authorised personnel with a business need.
          </li>
          <li>
            They are not sent to advertising networks, marketing platforms, or analytics tools.
          </li>
          <li>
            Role-based permissions, audit logging, and session controls help us monitor access and
            investigate unusual activity.
          </li>
          <li>
            We do not intentionally expose financial enquiry content to search engines, public
            pages, or indexing services.
          </li>
          <li>
            Documents are handled through secure upload and review processes and are retained only
            for as long as the engagement or legal requirement requires.
          </li>
        </ul>
        <p>
          These safeguards reduce risk but do not remove it entirely. Please do not send account
          passwords, payment credentials, or unnecessary identity documents through an open web
          form.
        </p>
      </>
    ),
  },
  {
    title: "International Data Transfers",
    content: (
      <p>
        Apex Group and its providers may operate across borders. If information is transferred to
        another country, we seek appropriate contractual, organisational, or other safeguards
        required by applicable law. You may contact us for more information about the safeguards
        relevant to your information.
      </p>
    ),
  },
  {
    title: "Cookies and Similar Technologies",
    content: (
      <p>
        We use essential technologies to support navigation, security, and basic site functionality.
        Optional analytics or marketing technologies, where used, are subject to consent and
        page-level restrictions. Our financial consultancy pages do not use advertising cookies or
        marketing pixels. Read our Cookie Policy for details.
      </p>
    ),
  },
  {
    title: "Data Retention",
    content: (
      <p>
        We retain information for the period needed to fulfil the purpose for which it was
        collected, maintain an accountable business record, resolve disputes, enforce agreements,
        and meet tax, regulatory, or legal obligations. Retention periods vary by record type and
        are reviewed periodically. When information is no longer needed, we securely delete it or
        anonymise it.
      </p>
    ),
  },
  {
    title: "Your Rights",
    content: (
      <>
        <p>
          Subject to local law and applicable exceptions, you may ask us to access, correct, delete,
          restrict, or provide a portable copy of your information. You may object to certain
          processing, withdraw consent where processing relies on consent, and opt out of marketing
          communications. We may need to verify your identity before responding and will explain if
          a request cannot be fulfilled.
        </p>
        <p>
          To exercise a right, use the contact details below. You may also complain to the relevant
          data protection authority in your jurisdiction.
        </p>
      </>
    ),
  },
  {
    title: "Security Measures",
    content: (
      <p>
        We use measures appropriate to the nature of information we handle, including HTTPS,
        encryption where appropriate, role-based access, audit logs, secure file uploads,
        multi-factor authentication for relevant systems, tested backups, and session controls. No
        online service is completely risk-free, so we encourage you to use secure devices and avoid
        sending secrets through ordinary email.
      </p>
    ),
  },
  {
    title: "Children's Privacy",
    content: (
      <p>
        Our website and services are intended for business and adult audiences. We do not knowingly
        collect personal information from children. If you believe a child has provided information
        to us, please contact us so we can review and remove it where appropriate.
      </p>
    ),
  },
  {
    title: "Third-Party Links",
    content: (
      <p>
        Our website may link to external websites, platforms, or social channels. Their privacy
        practices are controlled by their own policies, not this one. Review those policies before
        submitting information.
      </p>
    ),
  },
  {
    title: "Changes to This Policy",
    content: (
      <p>
        We may update this policy as our services, systems, or legal obligations change. The revised
        version will be published on this page with an updated date. Where appropriate, we will
        provide additional notice for material changes.
      </p>
    ),
  },
  {
    title: "Contact Us",
    content: (
      <p>
        For privacy questions, rights requests, or concerns, contact [privacy email] or write to
        31-20, Sector CCD Main Blvd, Sector M7 Lake City, Lahore, Pakistan. Please identify the nature of your request and the Apex
        Group company involved. The data controller is Apex Group of Companies (Pvt) Ltd, subject to
        the specific arrangement and jurisdiction applicable to your enquiry.
      </p>
    ),
  },
];
export default function PrivacyPage() {
  return (
    <main>
      <LegalHero title="Privacy Policy." />
      <LegalContent
        intro="Apex Group of Companies respects the trust placed in it when people share information with us. This policy explains what we collect, why we use it, how we protect it, and the choices available to you across our group website and business interactions."
        sections={sections}
      />
      <LegalCTA />
      <WebPageSchema
        name="Privacy Policy"
        description="Privacy practices for Apex Group of Companies."
        path="/privacy"
      />
    </main>
  );
}
