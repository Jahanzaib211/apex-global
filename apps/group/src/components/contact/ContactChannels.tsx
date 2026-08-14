import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { Mail, Handshake, Megaphone, Briefcase, ArrowUpRight } from "lucide-react";

const channels = [
  {
    icon: Mail,
    title: "General Enquiries",
    email: "hello@apexgroup.pk",
    note: "Response within 1 business day.",
  },
  {
    icon: Handshake,
    title: "Partnership Enquiries",
    email: "partnerships@apexgroup.pk",
    note: "Response within 2 business days.",
  },
  {
    icon: Megaphone,
    title: "Media & Press",
    email: "press@apexgroup.pk",
    note: "Response within 2 business days.",
  },
  {
    icon: Briefcase,
    title: "Careers",
    email: "careers@apexgroup.pk",
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
          subtitle="For matters best handled by a specific team, write to the channel below. Each is monitored by the relevant function across the Group."
        />

        <div className="bg-navy/10 mt-14 grid gap-px sm:grid-cols-2">
          {channels.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.title} className="group hover:bg-navy bg-white p-8 transition">
                <Icon className="text-gold" size={26} />
                <h3 className="font-display text-navy mt-6 text-2xl group-hover:text-white">
                  {c.title}
                </h3>
                <a
                  href={`mailto:${c.email}`}
                  className="text-charcoal/75 group-hover:text-gold mt-5 block text-sm"
                >
                  {c.email}
                </a>
                <p className="text-charcoal/45 mt-2 text-xs tracking-[.15em] uppercase group-hover:text-white/45">
                  {c.note}
                </p>
                <a
                  href={`mailto:${c.email}`}
                  className="text-navy group-hover:text-gold mt-6 inline-flex items-center gap-2 text-xs font-semibold tracking-[.18em] uppercase"
                >
                  Write to this team <ArrowUpRight size={12} />
                </a>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
