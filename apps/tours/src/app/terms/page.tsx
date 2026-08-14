import { FileText, ShieldCheck, AlertCircle } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { EnquireButton } from "@/components/enquire-button";

export const metadata = {
  title: "Terms of Use — Apex Global Tours & Travels",
  description:
    "Terms of Use for the Apex Global Tours & Travels website and services. The final verified text will be published by Apex.",
};

const SECTIONS = [
  {
    title: "Booking conditions",
    description:
      "Bookings are confirmed only after written confirmation from Apex and receipt of the requested deposit or full payment, as applicable.",
  },
  {
    title: "Payment",
    description:
      "Payment methods, schedules, and accepted currencies are communicated at the time of booking. Final pricing is shared in writing.",
  },
  {
    title: "Cancellation & refunds",
    description:
      "Cancellation timelines and refund eligibility depend on the service booked (car rental, Hajj package, Umrah package, group travel) and the supplier terms in effect at the time of cancellation.",
  },
  {
    title: "Liability",
    description:
      "Apex is not liable for circumstances outside its reasonable control, including but not limited to flight delays, road closures, weather events, visa refusals, and changes to government or religious regulations.",
  },
  {
    title: "Governing law",
    description:
      "These Terms are governed by the laws applicable in the jurisdiction where Apex Global Tours & Travels (Pvt) Ltd is registered. Disputes are subject to the competent courts of that jurisdiction.",
  },
  {
    title: "Contact",
    description:
      "Questions about these Terms can be sent via the enquiry form on our Contact page or by emailing the Apex team using the address published there.",
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of Use"
        subtitle="The terms that govern your use of this website and any services arranged through Apex Global Tours & Travels."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Terms of Use" }]}
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
                  These Terms of Use are templates. Apex Global Tours &amp; Travels (Pvt) Ltd will
                  publish the final verified text. Last updated: to be confirmed by Apex.
                </p>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="card mb-10 p-7 lg:p-9">
            <div className="mb-6 flex items-center gap-3">
              <div className="bg-navy-50 text-navy-600 flex h-12 w-12 items-center justify-center rounded-xl">
                <FileText size={22} />
              </div>
              <div>
                <h2 className="font-display text-navy-600 text-2xl font-semibold">
                  Terms sections
                </h2>
                <p className="text-ink-400 mt-1 text-sm">
                  The sections below outline what the published Terms will cover.
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
              Have questions about our terms? Reach out to the Apex team.
            </p>
            <EnquireButton mode="general" label="Contact our team" />
          </div>
        </div>
      </section>
    </>
  );
}
