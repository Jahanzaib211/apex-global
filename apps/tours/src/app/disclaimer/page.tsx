import { AlertCircle, BookOpen, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { EnquireButton } from "@/components/enquire-button";

export const metadata = {
  title: "Disclaimer — Apex Global Tours & Travels",
  description:
    "Disclaimer for the Apex Global Tours & Travels website. The final verified text will be published by Apex.",
};

const SECTIONS = [
  {
    title: "Website information",
    description:
      "Content on this website is provided for general information. While we strive for accuracy, we do not warrant that all information is current, complete, or error-free.",
  },
  {
    title: "Travel, visa, and religious information",
    description:
      "Government, visa, and religious information changes frequently. Always verify with the relevant authority (embassy, consulate, ministry, or local religious authority) before relying on it.",
  },
  {
    title: "No professional advice",
    description:
      "Content on this site does not constitute legal, medical, financial, or religious advice. For specific situations, consult a qualified professional.",
  },
  {
    title: "Third-party links",
    description:
      "Where this site links to third-party websites, Apex is not responsible for the content, accuracy, or practices of those websites.",
  },
  {
    title: "Service availability",
    description:
      "Vehicle availability, hotel categories, pricing, and routes are confirmed only after direct communication with the Apex team at enquiry.",
  },
  {
    title: "Liability",
    description:
      "Apex is not liable for losses arising from reliance on website content, delays outside its reasonable control, or changes to government or religious regulations.",
  },
];

export default function DisclaimerPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Disclaimer"
        subtitle="Important information about the use of this website and the content published by Apex Global Tours & Travels."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Disclaimer" }]}
      />

      <section className="section bg-sand-grad">
        <div className="container-narrow">
          {/* Disclaimer banner */}
          <div className="border-gold-200 bg-gold-50 mb-10 rounded-2xl border-2 p-6 md:p-7">
            <div className="flex items-start gap-4">
              <div className="bg-gold-100 text-gold-700 flex h-12 w-12 flex-none items-center justify-center rounded-xl">
                <AlertCircle size={22} />
              </div>
              <div>
                <h3 className="font-display text-navy-600 mb-2 text-lg font-semibold">
                  Template — final text to be published by Apex
                </h3>
                <p className="text-ink-500 text-sm leading-relaxed">
                  This Disclaimer is a template. Apex Global Tours &amp; Travels (Pvt) Ltd will
                  publish the final verified text. Last updated: to be confirmed by Apex.
                </p>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="card mb-10 p-7 lg:p-9">
            <div className="mb-6 flex items-center gap-3">
              <div className="bg-navy-50 text-navy-600 flex h-12 w-12 items-center justify-center rounded-xl">
                <BookOpen size={22} />
              </div>
              <div>
                <h2 className="font-display text-navy-600 text-2xl font-semibold">
                  Disclaimer sections
                </h2>
                <p className="text-ink-400 mt-1 text-sm">
                  The sections below outline what the published Disclaimer will cover.
                </p>
              </div>
            </div>

            <ul className="space-y-5">
              {SECTIONS.map((s) => (
                <li key={s.title} className="flex items-start gap-4">
                  <div className="bg-gold-100 text-gold-700 flex h-9 w-9 flex-none items-center justify-center rounded-lg">
                    <ShieldCheck size={16} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-navy-600 mb-1 text-lg font-semibold">
                      {s.title}
                    </h3>
                    <p className="text-ink-400 text-sm leading-relaxed">{s.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="text-ink-400 mb-5 text-sm">
              Need clarification on any of the above? Reach out to the Apex team.
            </p>
            <EnquireButton mode="general" label="Contact our team" />
          </div>
        </div>
      </section>
    </>
  );
}
