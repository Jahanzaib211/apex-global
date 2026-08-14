import Link from "next/link";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { Mail, Handshake, Megaphone, Briefcase, ArrowUpRight } from "lucide-react";

/**
 * Each card used to be a `mailto:` to a per-team address — support@,
 * partnerships@, press@ and careers@ — none of which exists as a mailbox, on a
 * mail stack whose outbound delivery has never successfully sent (see
 * infra/MAIL.md). Every "write to this team" click went nowhere.
 *
 * They now deep-link to the contact form with the matching enquiry type
 * preselected. `type` must match an entry in ContactForm's `ENQUIRY_TYPES`;
 * the form ignores anything it does not recognise.
 */
const channels = [
  {
    icon: Mail,
    title: "General Enquiries",
    type: "General Corporate",
    note: "Response within 1 business day.",
  },
  {
    icon: Handshake,
    title: "Partnership Enquiries",
    type: "Partnership",
    note: "Response within 2 business days.",
  },
  {
    icon: Megaphone,
    title: "Media & Press",
    type: "Media",
    note: "Response within 2 business days.",
  },
  {
    icon: Briefcase,
    title: "Careers",
    type: "Careers",
    note: "Response within 3 business days.",
  },
];

export default function ContactChannels() {
  return (
    <section className="bg-cream py-24">
      <Container>
        <SectionHeading
          eyebrow="OTHER WAYS TO REACH US"
          title="Direct Channels."
          subtitle="For matters best handled by a specific team, use the channel below. Each routes to the relevant function across the Group."
        />

        <div className="bg-navy/10 mt-14 grid gap-px sm:grid-cols-2">
          {channels.map((c) => {
            const Icon = c.icon;
            const href = `/contact?type=${encodeURIComponent(c.type)}#contact-form`;
            return (
              <div key={c.title} className="group hover:bg-navy bg-white p-8 transition">
                <Icon className="text-gold" size={26} />
                <h3 className="font-display text-navy mt-6 text-2xl group-hover:text-white">
                  {c.title}
                </h3>
                <p className="text-charcoal/45 mt-5 text-xs tracking-[.15em] uppercase group-hover:text-white/45">
                  {c.note}
                </p>
                <Link
                  href={href}
                  className="text-navy group-hover:text-gold mt-6 inline-flex items-center gap-2 text-xs font-semibold tracking-[.18em] uppercase"
                >
                  Contact this team <ArrowUpRight size={12} />
                </Link>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
