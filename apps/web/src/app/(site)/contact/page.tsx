import { Section, SectionHeading } from "@apex/ui";
import type { Metadata } from "next";
import { LeadForm } from "@/components/lead-form";
import { getGeneralFaqs, getSettings } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell us what you are trying to build, modernise or secure. We reply to every genuine enquiry.",
  alternates: { canonical: absoluteUrl("/contact") },
};

type Props = { searchParams: Promise<{ interest?: string }> };

export default async function ContactPage({ searchParams }: Props) {
  const { interest } = await searchParams;
  const [settings, faqs] = await Promise.all([getSettings(), getGeneralFaqs()]);

  const phone = settings["org.phone"];
  const email = settings["org.email"];
  const address = settings["org.address"];
  const whatsapp = settings["org.whatsapp"];

  return (
    <>
      <Section tone="inverse" grid className="py-20 md:py-24">
        <SectionHeading
          inverse
          as="h1"
          eyebrow="Contact"
          title="Let's build what's next."
          lede="Tell us the problem, not the specification. If we are not the right people for it, we will say so — and usually point you at who is."
        />
      </Section>

      <Section tone="page">
        <div className="grid gap-16 lg:grid-cols-[1.35fr_1fr] lg:gap-20">
          <div>
            <h2 className="text-2xl">Send us an enquiry</h2>
            <p className="mt-2 text-[var(--ink-secondary)]">
              Everything except your name and email is optional.
            </p>
            <div className="mt-8">
              <LeadForm
                interestType={interest ? "solution" : "general"}
                interestSlug={interest}
                submitLabel="Send enquiry"
              />
            </div>
          </div>

          <aside className="flex flex-col gap-9">
            <div>
              <h2 className="text-2xs font-semibold tracking-[0.18em] text-[var(--color-amber-700)] uppercase">
                Direct
              </h2>
              <ul className="mt-4 flex flex-col gap-3 text-[var(--ink-secondary)]">
                {phone ? (
                  <li>
                    <a
                      href={`tel:${phone.replace(/\s/g, "")}`}
                      data-conversion="phone_click"
                      className="font-medium text-[var(--ink-primary)] underline-offset-4 hover:underline"
                    >
                      {phone}
                    </a>
                  </li>
                ) : null}
                {email ? (
                  <li>
                    <a
                      href={`mailto:${email}`}
                      data-conversion="email_click"
                      className="font-medium text-[var(--ink-primary)] underline-offset-4 hover:underline"
                    >
                      {email}
                    </a>
                  </li>
                ) : null}
                {whatsapp ? (
                  <li>
                    <a
                      href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                      rel="noopener noreferrer"
                      target="_blank"
                      data-conversion="whatsapp_click"
                      className="font-medium text-[var(--ink-primary)] underline-offset-4 hover:underline"
                    >
                      WhatsApp
                    </a>
                  </li>
                ) : null}
              </ul>
            </div>

            {address ? (
              <div>
                <h2 className="text-2xs font-semibold tracking-[0.18em] text-[var(--color-amber-700)] uppercase">
                  Registered office
                </h2>
                <p className="mt-4 leading-relaxed text-[var(--ink-secondary)]">{address}</p>
                <p className="mt-3 text-sm text-[var(--ink-muted)]">
                  We work with clients internationally and deliver remotely.
                </p>
              </div>
            ) : null}

            <div>
              <h2 className="text-2xs font-semibold tracking-[0.18em] text-[var(--color-amber-700)] uppercase">
                What happens next
              </h2>
              <ol className="mt-4 flex flex-col gap-4">
                {[
                  "We read your enquiry and reply — usually within one working day.",
                  "A short call to understand the constraint and whether we are a fit.",
                  "A written proposal with scope, cost and what we would do first.",
                ].map((step, i) => (
                  <li key={step} className="flex gap-3 text-sm text-[var(--ink-secondary)]">
                    <span className="text-2xs flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--bg-sunken)] font-semibold text-[var(--ink-primary)]">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </Section>

      {faqs.length > 0 ? (
        <Section tone="sunken">
          <SectionHeading eyebrow="Before you write" title="Common questions" />
          <dl className="mt-10 max-w-3xl divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
            {faqs.map((f) => (
              <div key={f.id} className="py-6">
                <dt className="font-semibold">{f.question}</dt>
                <dd className="mt-2 text-[var(--ink-secondary)]">{f.answer}</dd>
              </div>
            ))}
          </dl>
        </Section>
      ) : null}
    </>
  );
}
