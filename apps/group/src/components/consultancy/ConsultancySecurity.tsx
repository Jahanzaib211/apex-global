import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { ShieldCheck, Lock, EyeOff, FileLock2 } from "lucide-react";

const pillars = [
  {
    icon: ShieldCheck,
    title: "Strict Role-Based Access",
    desc: "Only consultants assigned to your matter can view your details.",
  },
  {
    icon: Lock,
    title: "Encrypted in Transit",
    desc: "All form submissions are encrypted over HTTPS with modern ciphers.",
  },
  {
    icon: EyeOff,
    title: "Never Used for Advertising",
    desc: "Your information is never shared with advertising or analytics platforms.",
  },
  {
    icon: FileLock2,
    title: "Audit Logging",
    desc: "Access to consultancy submissions is logged and reviewed internally.",
  },
];

export default function ConsultancySecurity() {
  return (
    <section className="bg-white py-28">
      <Container>
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <SectionHeading eyebrow="PRIVACY & SECURITY" title="How Your Information Is Handled." />
            <p className="text-charcoal/70 mt-6 text-sm leading-7">
              Sensitive information is never sent to advertising or analytics platforms. Only
              authorized consultants assigned to your matter can view your details.
            </p>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-navy/10 grid gap-px sm:grid-cols-2">
              {pillars.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-white p-7">
                  <div className="border-gold text-gold inline-flex h-12 w-12 items-center justify-center border">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-display text-navy mt-5 text-xl">{title}</h3>
                  <p className="text-charcoal/65 mt-2 text-sm leading-6">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
