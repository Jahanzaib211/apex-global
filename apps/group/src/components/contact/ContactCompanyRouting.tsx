import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { ArrowRight, Cpu, Users, Plane, Building2, LineChart, Bell } from "lucide-react";

const channels = [
  {
    icon: Cpu,
    label: "Tech",
    team: "Apex Global Tech Solution team",
    note: "Solutions, delivery and technology partnerships",
  },
  {
    icon: Users,
    label: "Outsourcing",
    team: "Apex Global Outsourcing team",
    note: "Operations, BPO and managed services enquiries",
  },
  {
    icon: Plane,
    label: "Tours",
    team: "Apex Global Tours & Travels team",
    note: "Itineraries, group travel, and pilgrimage programs",
  },
  {
    icon: Building2,
    label: "Holdings",
    team: "Apex Holdings team",
    note: "Real estate, properties, and asset-related enquiries",
  },
  {
    icon: LineChart,
    label: "Consultancy",
    team: "Apex Group Financial Consultancy team",
    note: "Private and corporate financial conversations",
  },
];

export default function ContactCompanyRouting() {
  return (
    <section className="bg-white py-24">
      <Container>
        <SectionHeading
          eyebrow="COMPANY ROUTING"
          title="How Your Enquiry Is Routed."
          subtitle="Each submission is automatically directed to the most relevant team based on the company and enquiry type you select."
        />

        <div className="border-navy/10 bg-cream/60 mt-14 rounded-sm border p-6 md:p-10">
          <div className="grid gap-6 md:grid-cols-[1fr,auto,1fr]">
            {/* Source side */}
            <div>
              <p className="text-gold text-[10px] font-semibold tracking-[.2em] uppercase">
                Source
              </p>
              <h3 className="font-display text-navy mt-3 text-2xl">Your Enquiry Form</h3>
              <ul className="text-charcoal/70 mt-5 space-y-2 text-sm">
                <li>• Full name, contact details</li>
                <li>• Interested Company</li>
                <li>• Enquiry Type</li>
                <li>• Message</li>
              </ul>
            </div>

            {/* Arrow */}
            <div className="flex items-center justify-center">
              <div className="bg-navy/15 hidden h-px w-full md:block" />
              <div className="border-navy/15 text-gold flex h-12 w-12 items-center justify-center rounded-full border bg-white md:absolute md:relative">
                <ArrowRight size={18} />
              </div>
            </div>

            {/* Destination side */}
            <div>
              <p className="text-gold text-[10px] font-semibold tracking-[.2em] uppercase">
                Routed To
              </p>
              <h3 className="font-display text-navy mt-3 text-2xl">Notification Card</h3>
              <p className="text-charcoal/70 mt-3 flex items-start gap-2 text-sm">
                <Bell size={14} className="text-gold mt-1" />
                Internal notification lands in the matching company inbox within minutes of
                submission.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {channels.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.label} className="border-navy/10 border bg-white p-5 text-left">
                  <div className="flex items-center gap-3">
                    <Icon className="text-gold" size={20} />
                    <span className="text-navy text-[10px] font-semibold tracking-[.2em] uppercase">
                      {c.label}
                    </span>
                  </div>
                  <p className="text-navy mt-4 text-sm font-semibold">{c.team}</p>
                  <p className="text-charcoal/60 mt-1 text-xs">{c.note}</p>
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-charcoal/55 mt-8 max-w-3xl text-sm">
          Enquiry routing is automated based on your selected &quot;Interested Company&quot;. You
          can also contact a company directly from its page.
        </p>
      </Container>
    </section>
  );
}
