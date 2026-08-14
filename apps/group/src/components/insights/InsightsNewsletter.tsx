"use client";

import { useState } from "react";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { Mail, Check, AlertCircle, Lock } from "lucide-react";
import { submitNewsletterSubscription } from "@/components/contact/actions";

export default function InsightsNewsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await submitNewsletterSubscription({ email });
      if (!result.ok) {
        setError("We couldn't sign you up just now. Please try again in a moment.");
        return;
      }
      setDone(true);
      setEmail("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="newsletter" className="bg-cream py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr,1.1fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="STAY INFORMED"
              title="Receive Insights From Apex."
              subtitle="A short, occasional email with new insights, Group announcements, and upcoming event information. No noise, no marketing blasts."
            />
          </div>
          <form
            onSubmit={onSubmit}
            className="border-navy/10 border bg-white p-7 md:p-9"
            noValidate
          >
            {done && (
              <div className="mb-5 flex items-start gap-3 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                <Check className="mt-0.5 shrink-0" size={16} />
                <p>Thank you — you are subscribed to Apex Insights.</p>
              </div>
            )}
            {error && (
              <div className="mb-5 flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                <AlertCircle className="mt-0.5 shrink-0" size={16} />
                <p>{error}</p>
              </div>
            )}
            <label className="text-charcoal/70 mb-2 block text-xs font-semibold tracking-[.15em] uppercase">
              Email Address
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Mail
                  size={14}
                  className="text-gold pointer-events-none absolute top-1/2 left-4 -translate-y-1/2"
                />
                <input
                  type="email"
                  aria-label="Email address for newsletter"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="border-navy/20 text-charcoal focus:border-navy focus:ring-gold/40 w-full border bg-white px-4 py-3 pl-10 text-sm outline-none focus:ring-2"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="bg-gold text-navy hover:bg-navy hover:text-gold inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold transition disabled:opacity-60"
              >
                {submitting ? "Subscribing…" : "Subscribe"}
              </button>
            </div>
            <p className="text-charcoal/55 mt-4 flex items-center gap-2 text-xs">
              <Lock size={11} className="text-gold" />
              We respect your inbox. Unsubscribe at any time.
            </p>
          </form>
        </div>
      </Container>
    </section>
  );
}
