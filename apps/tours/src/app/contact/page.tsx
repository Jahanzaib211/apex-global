import { Mail, Phone, MessageCircle, MapPin, Clock, FileText, MapPinned } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { PageHero } from "@/components/page-hero";
import { EnquireButton } from "@/components/enquire-button";
import { FaqAccordion } from "./_components/faq-accordion";

export const metadata = {
  title: "Contact Us — Apex Global Tours & Travels",
  description:
    "Get in touch with Apex Global Tours & Travels for car rental, Hajj, Umrah, and group travel enquiries. WhatsApp is the fastest way to reach us.",
};

const CONTACT_METHODS = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: BRAND.whatsappDisplay,
    note: "Fastest way to reach us",
    href: `https://wa.me/${BRAND.whatsapp}`,
  },
  {
    icon: Phone,
    label: "Phone",
    value: BRAND.phone,
    note: "Available during office hours",
    href: `tel:${BRAND.phone.replace(/\s+/g, "")}`,
  },
  {
    icon: Mail,
    label: "Email",
    value: BRAND.email,
    note: "We respond within 1 working day",
    href: `mailto:${BRAND.email}`,
  },
  {
    icon: MapPin,
    label: "HQ Cities",
    value: BRAND.hqCity,
    note: "Office presence in Karachi, Lahore, and Riyadh — see the contact page for each office address.",
    href: null,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to a travel expert"
        subtitle="We're available by WhatsApp, phone and email. Tell us where, when and how many — our team will respond with options."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      {/* Contact + CTA split */}
      <section className="section bg-sand-grad">
        <div className="container-page">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Left: contact details */}
            <div>
              <div className="eyebrow mb-3">Get in touch</div>
              <h2 className="heading-lg mb-3">Reach our team directly</h2>
              <p className="prose-body mb-8">
                Use any of the channels below to start a conversation. For the fastest response,
                WhatsApp is recommended.
              </p>

              <div className="space-y-4">
                {CONTACT_METHODS.map((m) => {
                  const Icon = m.icon;
                  const inner = (
                    <div className="card flex h-full items-start gap-4 p-5 lg:p-6">
                      <div className="bg-gold-100 text-gold-600 flex h-12 w-12 flex-none items-center justify-center rounded-xl">
                        <Icon size={22} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-ink-300 text-xs font-semibold tracking-wider uppercase">
                          {m.label}
                        </div>
                        <div className="font-display text-navy-600 mt-0.5 text-lg font-semibold break-words">
                          {m.value}
                        </div>
                        <div className="text-ink-400 mt-1 text-xs">{m.note}</div>
                      </div>
                    </div>
                  );
                  return m.href ? (
                    <a
                      key={m.label}
                      href={m.href}
                      target={m.href.startsWith("http") ? "_blank" : undefined}
                      rel={m.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="block hover:no-underline"
                    >
                      {inner}
                    </a>
                  ) : (
                    <div key={m.label}>{inner}</div>
                  );
                })}
              </div>

              <div className="border-sand-200 mt-6 flex items-start gap-4 rounded-2xl border bg-white p-5">
                <div className="bg-navy-50 text-navy-600 flex h-10 w-10 flex-none items-center justify-center rounded-xl">
                  <Clock size={18} />
                </div>
                <div>
                  <div className="text-navy-600 text-sm font-semibold">Office hours</div>
                  <p className="text-ink-400 mt-1 text-sm leading-relaxed">
                    Available 7 days a week. WhatsApp is the fastest way to reach us.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: enquiry CTA */}
            <div className="flex flex-col">
              <div className="card flex flex-1 flex-col p-7 lg:p-9">
                <div className="eyebrow mb-3">Send an enquiry</div>
                <h2 className="heading-md mb-3">Tell us about your trip</h2>
                <p className="prose-body mb-6">
                  Share your dates, route, group size, and any preferences. Our team will respond
                  with availability and a written quote.
                </p>
                <ul className="text-ink-500 mb-7 space-y-2 text-sm">
                  <li className="flex gap-2">
                    <span className="text-gold-500 mt-0.5">•</span>
                    <span>Vehicle rentals and airport transfers</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold-500 mt-0.5">•</span>
                    <span>Hajj and Umrah packages</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold-500 mt-0.5">•</span>
                    <span>Group and custom journeys</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold-500 mt-0.5">•</span>
                    <span>Intercity routes in Pakistan and Saudi Arabia</span>
                  </li>
                </ul>
                <div className="mt-auto">
                  <EnquireButton mode="general" label="Open enquiry form" fullWidth />
                  <p className="text-ink-300 mt-3 text-center text-xs">
                    Form opens in a modal — your details stay with Apex only.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="section-tight bg-white">
        <div className="container-page">
          <div className="bg-navy-grad grain shadow-navy relative overflow-hidden rounded-2xl">
            <div className="flex aspect-[21/9] items-center justify-center px-6 text-center md:aspect-[21/7]">
              <div>
                <div className="bg-gold-grad shadow-gold mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl">
                  <MapPinned size={28} className="text-navy-700" />
                </div>
                <div className="font-display mb-2 text-xl font-semibold text-white md:text-2xl">
                  Map embed to be added by Apex
                </div>
                <p className="mx-auto max-w-md text-sm text-white/70">
                  A live map showing our office location and service areas will be embedded here
                  once the Apex team confirms the final address.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-sand-grad">
        <div className="container-narrow">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <div className="eyebrow mb-3">FAQ</div>
            <h2 className="heading-lg">Common questions</h2>
          </div>
          <FaqAccordion />

          <div className="mt-10 text-center">
            <p className="text-ink-400 mb-4 inline-flex items-center gap-2 text-sm">
              <FileText size={14} className="text-gold-500" />
              Looking for booking terms? See our Terms, Privacy and Disclaimer pages.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
