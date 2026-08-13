import { Card, Section, SectionHeading } from "@apex/ui";
import type { Metadata } from "next";
import { LeadForm } from "@/components/lead-form";
import { getJobs } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Engineering roles at Apex Global Tech Solution. We build and operate production systems, and we hire people who want to do both.",
  alternates: { canonical: absoluteUrl("/careers") },
};

export default async function CareersPage() {
  const jobs = await getJobs();

  const jsonLd = jobs.map((j) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: j.title,
    description: j.summary,
    datePosted: j.publishedAt?.toISOString(),
    validThrough: j.closesAt?.toISOString(),
    employmentType: j.employment,
    hiringOrganization: { "@type": "Organization", name: "Apex Global Tech Solution" },
    jobLocation: { "@type": "Place", address: j.location },
  }));

  return (
    <>
      {jsonLd.length > 0 ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}

      <Section tone="inverse" grid className="py-20 md:py-24">
        <SectionHeading
          inverse
          as="h1"
          eyebrow="Careers"
          title="Build systems that have to stay up"
          lede="We are a small engineering team that ships and then runs what it ships. If you want to see the consequences of your own design decisions, that is the job."
        />
      </Section>

      <Section tone="page">
        <div className="grid gap-14 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
          <div>
            <h2 className="text-2xl">Open roles</h2>

            {jobs.length > 0 ? (
              <ul className="mt-8 flex flex-col gap-5">
                {jobs.map((j) => (
                  <li key={j.slug}>
                    <Card as="article" className="flex flex-col gap-3 p-7">
                      <div className="text-2xs flex flex-wrap items-center gap-x-3 gap-y-1 tracking-[0.16em] text-[var(--ink-muted)] uppercase">
                        <span>{j.team}</span>
                        <span aria-hidden>·</span>
                        <span>{j.location}</span>
                        <span aria-hidden>·</span>
                        <span>{j.workMode}</span>
                      </div>
                      <h3 className="text-xl">{j.title}</h3>
                      <p className="text-[var(--ink-secondary)]">{j.summary}</p>
                    </Card>
                  </li>
                ))}
              </ul>
            ) : (
              /* No fake vacancies. An empty careers page that invites
                 speculative applications is more useful than three invented
                 roles nobody is hiring for. */
              <div className="mt-8 rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] p-8">
                <h3 className="text-lg font-semibold">No advertised vacancies right now</h3>
                <p className="mt-3 text-[var(--ink-secondary)]">
                  We hire when we find the right person rather than only when a role is open, and we
                  read every speculative application properly. If you build things and operate them,
                  tell us what you have built — a repository is worth more to us than a CV.
                </p>
              </div>
            )}

            <div className="mt-12">
              <h2 className="text-2xl">What it is like here</h2>
              <ul className="mt-6 flex flex-col gap-4">
                {[
                  "You own systems end to end — design, build, deploy, and the pager.",
                  "Code review is real, and so is the expectation that tests assert behaviour.",
                  "Remote-friendly, with a written culture: decisions get documented, not remembered.",
                  "We say when something is not worth building, including to ourselves.",
                ].map((point) => (
                  <li key={point} className="flex gap-3 text-[var(--ink-secondary)]">
                    <span
                      aria-hidden
                      className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]"
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside>
            <Card className="p-8">
              <h2 className="text-xl">Apply</h2>
              <p className="mt-2 text-sm text-[var(--ink-secondary)]">
                Speculative applications welcome. Tell us what you have built and link to it.
              </p>
              <div className="mt-7">
                <LeadForm compact interestType="career" submitLabel="Send application" />
              </div>
            </Card>
          </aside>
        </div>
      </Section>
    </>
  );
}
