import { ShieldCheck, AlertCircle, Lock } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { EnquireButton } from "@/components/enquire-button";

export const metadata = {
  title: "Privacy Policy — Apex Global Tours & Travels",
  description:
    "Privacy Policy for Apex Global Tours & Travels. The final verified text will be published by Apex.",
};

const SECTIONS = [
  {
    title: "Information we collect",
    description:
      "Contact details (name, email, phone), travel preferences, passport details required for bookings, and any information you voluntarily share via enquiry forms or email.",
  },
  {
    title: "How we use your information",
    description:
      "To respond to enquiries, prepare quotes, confirm bookings, arrange visas where applicable, and provide customer support during and after your journey.",
  },
  {
    title: "Sharing of information",
    description:
      "We share information only with the suppliers needed to deliver your service (hotels, transport operators, visa processors). We do not sell your data.",
  },
  {
    title: "Data retention",
    description:
      "We retain personal information for as long as needed to deliver the service and meet legal, tax, and accounting obligations, after which it is securely deleted.",
  },
  {
    title: "Your rights",
    description:
      "You may request access to, correction of, or deletion of your personal information by contacting us via the channels listed on our Contact page.",
  },
  {
    title: "Contact",
    description:
      "For privacy-related questions, use the enquiry form on our Contact page or email the Apex team using the address published there.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        subtitle="How Apex Global Tours & Travels collects, uses, and protects your personal information."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
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
                  This Privacy Policy is a template. Apex Global Tours &amp; Travels (Pvt) Ltd will
                  publish the final verified text. Last updated: to be confirmed by Apex.
                </p>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="card mb-10 p-7 lg:p-9">
            <div className="mb-6 flex items-center gap-3">
              <div className="bg-navy-50 text-navy-600 flex h-12 w-12 items-center justify-center rounded-xl">
                <Lock size={22} />
              </div>
              <div>
                <h2 className="font-display text-navy-600 text-2xl font-semibold">
                  Privacy sections
                </h2>
                <p className="text-ink-400 mt-1 text-sm">
                  The sections below outline what the published Privacy Policy will cover.
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
              Questions about how we handle your data? Get in touch.
            </p>
            <EnquireButton mode="general" label="Contact our team" />
          </div>
        </div>
      </section>
    </>
  );
}
