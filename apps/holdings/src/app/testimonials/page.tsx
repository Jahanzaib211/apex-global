import type { Metadata } from "next";
import { Quote } from "lucide-react";
import { PageBanner } from "@/components/PageBanner";
import { CTASection } from "@/components/CTASection";
import { testimonials } from "@/data/content";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "Words from the buyers, investors and partners who work with Apex Holdings on projects across Pakistan.",
};

export default function TestimonialsPage() {
  return (
    <>
      <PageBanner
        eyebrow="TESTIMONIALS"
        title="Words from the buyers, investors and partners who work with us."
        description="A selection of testimonials, published only where permission has been granted."
        breadcrumbs={[{ label: "Testimonials" }]}
      />
      <div className="section bg-slate-50">
        <div className="container-x">
          <div className="mb-10 max-w-2xl">
            <span className="eyebrow mb-3 block">TRUST, IN THEIR WORDS</span>
            <h2 className="font-display text-ink text-3xl font-bold md:text-4xl">
              Good work is remembered in the details.
            </h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.name}
                className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-200/70 md:p-9"
              >
                <Quote className="fill-gold-400 text-gold-400 h-10 w-10" />
                <blockquote className="font-display text-ink mt-6 text-2xl leading-relaxed font-semibold">
                  “{testimonial.quote}”
                </blockquote>
                <div className="my-7 h-px bg-slate-200" />
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-ink font-bold">{testimonial.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                  {testimonial.project && <span className="pill-gold">{testimonial.project}</span>}
                </div>
                {testimonial.context && (
                  <p className="mt-5 text-xs leading-relaxed text-slate-400 italic">
                    {testimonial.context}
                  </p>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
      <CTASection
        variant="dark"
        eyebrow="ADD YOUR PERSPECTIVE"
        title="Submit yours"
        description="Have an Apex story to share? We would be glad to hear it."
        primary={{ label: "Contact our team", href: "/contact" }}
      />
    </>
  );
}
