"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Clock,
  Send,
  Check,
  ChevronDown,
  Building2,
  Sparkles,
} from "lucide-react";
import { PageBanner } from "@/components/PageBanner";
import { CTASection } from "@/components/CTASection";
import { faqs } from "@/data/content";
import { site } from "@/data/site";

interface FormState {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const initialForm: FormState = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

const inputBase =
  "w-full bg-white border border-slate-300 px-4 py-3 text-[14px] text-ink placeholder:text-slate-400 focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink transition-colors";
const labelBase = "text-[11px] tracking-wide-2 uppercase font-semibold text-slate-600 block mb-2";

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const update = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`submit_failed_${res.status}`);
      setSubmitted(true);
    } catch {
      setSubmitError("We could not send your message right now. Please email us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageBanner
        eyebrow="CONTACT"
        title="Talk to our team. Project, partnership or career — we're listening."
        description="Whether you have a question about a project, want to explore a partnership, or are interested in joining the team — we are one message away."
        breadcrumbs={[{ label: "Contact" }]}
        bg="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80"
      />

      {/* 3-column layout */}
      <section className="section border-b border-slate-200 bg-white">
        <div className="container-x">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Left col — contact info */}
            <div className="lg:col-span-4">
              <span className="eyebrow mb-4 block">Get in touch</span>
              <h2 className="font-display text-ink mb-7 text-3xl leading-tight font-bold">
                Reach the right desk.
              </h2>

              <ul className="space-y-6">
                <ContactItem
                  icon={Phone}
                  label="Phone"
                  value={site.phone}
                  href={`tel:${site.phone.replace(/\s/g, "")}`}
                />
                <ContactItem
                  icon={Mail}
                  label="Email"
                  value={site.email}
                  href={`mailto:${site.email}`}
                />
                <ContactItem
                  icon={MessageCircle}
                  label="WhatsApp"
                  value={`+${site.whatsapp}`}
                  href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(site.whatsappMessage)}`}
                />
                <ContactItem icon={MapPin} label="Address" value={site.address} />
                <ContactItem icon={Clock} label="Hours" value={site.hours} />
              </ul>

              <div className="border-gold-400 mt-10 border-l-2 bg-slate-50 p-6">
                <Sparkles className="text-gold-500 mb-2 h-5 w-5" />
                <p className="text-[13px] leading-relaxed text-slate-600">
                  For partnership and developer enquiries, please use the Partner With Us form for a
                  faster response from the right team.
                </p>
                <Link
                  href="/partner"
                  className="tracking-wide-1 text-gold-500 hover:text-ink mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase transition-colors"
                >
                  Partner with us
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Middle col — enquiry form */}
            <div className="lg:col-span-5">
              <div className="bg-slate-50 p-8 lg:p-10">
                <span className="eyebrow mb-3 block">Enquiry Form</span>
                <h3 className="font-display text-ink mb-2 text-2xl leading-snug font-bold">
                  Send us a message.
                </h3>
                <p className="mb-7 text-[14px] leading-relaxed text-slate-600">
                  Tell us a little about what you are looking for and we will route your enquiry to
                  the right person.
                </p>

                {submitted ? (
                  <SuccessCard
                    onReset={() => {
                      setForm(initialForm);
                      setSubmitted(false);
                    }}
                  />
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="c-name" className={labelBase}>
                        Name <span className="text-gold-500">*</span>
                      </label>
                      <input
                        id="c-name"
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        className={inputBase}
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="c-email" className={labelBase}>
                          Email <span className="text-gold-500">*</span>
                        </label>
                        <input
                          id="c-email"
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => update("email", e.target.value)}
                          className={inputBase}
                          placeholder="you@example.com"
                        />
                      </div>
                      <div>
                        <label htmlFor="c-phone" className={labelBase}>
                          Phone
                        </label>
                        <input
                          id="c-phone"
                          type="tel"
                          value={form.phone}
                          onChange={(e) => update("phone", e.target.value)}
                          className={inputBase}
                          placeholder="+92 300 000 0000"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="c-subject" className={labelBase}>
                        Subject
                      </label>
                      <input
                        id="c-subject"
                        type="text"
                        value={form.subject}
                        onChange={(e) => update("subject", e.target.value)}
                        className={inputBase}
                        placeholder="e.g. Project enquiry, Partnership, Career"
                      />
                    </div>
                    <div>
                      <label htmlFor="c-message" className={labelBase}>
                        Message <span className="text-gold-500">*</span>
                      </label>
                      <textarea
                        id="c-message"
                        rows={5}
                        required
                        value={form.message}
                        onChange={(e) => update("message", e.target.value)}
                        className={inputBase + " resize-y"}
                        placeholder="How can we help?"
                      />
                    </div>
                    {submitError && (
                      <p className="text-[12px] text-red-600" role="alert">
                        {submitError}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary w-full text-[12px] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                      {submitting ? "Sending…" : "Send Message"}
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Right col — Office card with map placeholder */}
            <div className="lg:col-span-3">
              <div className="bg-ink flex h-full flex-col text-white">
                <div className="p-7">
                  <div className="bg-gold-400 text-ink mb-5 inline-flex h-10 w-10 items-center justify-center">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <span className="eyebrow !text-gold-400 mb-2 block">Office</span>
                  <h3 className="font-display text-xl leading-snug font-bold text-white">
                    Lahore HQ
                  </h3>
                  <p className="mt-3 text-[13px] leading-relaxed text-slate-300">{site.address}</p>
                </div>

                {/* Map placeholder — styled block */}
                <div className="relative min-h-[200px] flex-1 overflow-hidden border-t border-white/10">
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, rgba(232,176,42,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(232,176,42,0.15) 1px, transparent 1px)",
                      backgroundSize: "24px 24px",
                    }}
                    aria-hidden
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="bg-gold-400 text-ink mb-3 inline-flex h-12 w-12 items-center justify-center">
                        <MapPin className="h-6 w-6" />
                      </div>
                      <p className="tracking-wide-2 text-[11px] font-semibold text-slate-400 uppercase">
                        Map Placeholder
                      </p>
                      <p className="mt-1 px-4 text-[12px] text-slate-300">Main Boulevard, Lahore</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 p-7">
                  <p className="tracking-wide-2 mb-2 text-[11px] font-semibold text-slate-400 uppercase">
                    Hours
                  </p>
                  <p className="text-[14px] font-semibold text-white">{site.hours}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ teaser */}
      <section className="section border-b border-slate-200 bg-slate-50">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <span className="eyebrow mb-4 block">Frequently Asked</span>
              <h2 className="font-display text-ink text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
                Quick questions, quick answers.
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-slate-600">
                A few of the things people ask us most. For anything else, our team is one message
                away.
              </p>
              <div className="mt-8">
                <Link href="/partner" className="btn-primary text-[12px]">
                  Partner With Us
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-8">
              <ul className="divide-y divide-slate-200 border-y border-slate-200">
                {faqs.slice(0, 4).map((f, idx) => {
                  const open = openFaq === idx;
                  return (
                    <li key={f.q}>
                      <button
                        type="button"
                        onClick={() => setOpenFaq(open ? null : idx)}
                        className="group flex w-full items-start justify-between gap-6 py-6 text-left"
                        aria-expanded={open}
                      >
                        <span
                          className={`font-display text-lg font-semibold transition-colors lg:text-xl ${
                            open ? "text-gold-500" : "text-ink group-hover:text-gold-500"
                          }`}
                        >
                          {f.q}
                        </span>
                        <ChevronDown
                          className={`text-gold-500 mt-1 h-5 w-5 shrink-0 transition-transform duration-300 ${
                            open ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <div
                        className="grid transition-all duration-300 ease-out"
                        style={{
                          gridTemplateRows: open ? "1fr" : "0fr",
                          opacity: open ? 1 : 0,
                        }}
                      >
                        <div className="overflow-hidden">
                          <p className="pr-12 pb-6 text-[15px] leading-relaxed text-slate-600">
                            {f.a}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        variant="dark"
        eyebrow="Partner With Us"
        title="Are you a developer, investor or strategic partner?"
        description="If you are working on a project that needs structured marketing and sales support — or a partnership that goes deeper — we would like to hear from you."
        primary={{ label: "Partner With Us", href: "/partner" }}
        secondary={{ label: "See Our Projects", href: "/projects" }}
      />
    </>
  );
}

function ContactItem({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <>
      <div className="bg-gold-50 border-gold-400/40 text-gold-500 inline-flex h-11 w-11 shrink-0 items-center justify-center border">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="tracking-wide-2 mb-1 text-[11px] font-semibold text-slate-500 uppercase">
          {label}
        </p>
        <p className="text-ink text-[14px] leading-snug font-semibold">{value}</p>
      </div>
    </>
  );

  if (href) {
    return (
      <li>
        <Link
          href={href}
          className="hover:text-gold-500 group flex items-start gap-4 transition-colors"
        >
          {inner}
        </Link>
      </li>
    );
  }
  return <li className="flex items-start gap-4">{inner}</li>;
}

function SuccessCard({ onReset }: { onReset: () => void }) {
  return (
    <div className="py-6 text-center">
      <div className="bg-gold-400 text-ink mb-4 inline-flex h-14 w-14 items-center justify-center">
        <Check className="h-7 w-7" />
      </div>
      <h3 className="font-display text-ink text-2xl leading-tight font-bold">Message received.</h3>
      <p className="mx-auto mt-3 max-w-sm text-[14px] leading-relaxed text-slate-600">
        We have logged your enquiry. A member of the Apex team will respond within one working day.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="tracking-wide-1 text-gold-500 hover:text-ink mt-6 text-[12px] font-semibold uppercase transition-colors"
      >
        Send another message
      </button>
    </div>
  );
}
