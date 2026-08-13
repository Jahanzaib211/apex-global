import type { ReactNode } from "react";

export interface LegalSection {
  id: string;
  heading: string;
  body: ReactNode;
}

export interface LegalDocProps {
  title: string;
  /** One-line framing beneath the title. */
  lead: string;
  /** Displayed "Last updated" date. */
  updated: string;
  /** Free text such as "Policy summary — not legal advice." */
  notice?: string;
  sections: LegalSection[];
}

/**
 * Shared renderer for legal documents.
 *
 * Gives every policy under /legal the same anatomy: a sticky in-page
 * contents list (desktop), anchored sections that pair with it, and a dated
 * "Last updated" line so each document is reviewable rather than frozen. The
 * contact block is passed in by the page so it can pull live settings
 * (org.email / org.address) without this component touching the database.
 */
export function LegalDoc({ title, lead, updated, notice, sections }: LegalDocProps) {
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,13rem)_minmax(0,1fr)]">
      <nav aria-label={`Contents of ${title}`} className="hidden lg:block">
        <div className="sticky top-24 flex flex-col gap-1 border-l border-[var(--border-subtle)] pl-4">
          <p className="text-2xs mb-1 font-semibold tracking-[0.16em] text-[var(--ink-muted)] uppercase">
            On this page
          </p>
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="text-sm text-[var(--ink-secondary)] transition-colors hover:text-[var(--ink-primary)]"
            >
              {s.heading}
            </a>
          ))}
        </div>
      </nav>

      <article className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="text-3xl md:text-4xl">{title}</h1>
          <p className="text-sm text-[var(--ink-muted)]">Last updated {updated}</p>
        </div>
        <p className="mt-3 text-[var(--ink-secondary)]">{lead}</p>
        {notice ? (
          <p className="mt-3 inline-block rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--bg-sunken)] px-3 py-1.5 text-xs text-[var(--ink-muted)]">
            {notice}
          </p>
        ) : null}

        <div className="mt-8 flex flex-col gap-8">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <h2 className="text-xl">{s.heading}</h2>
              <div className="mt-2 text-[var(--ink-secondary)]">{s.body}</div>
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}

/** Small helper for pages to render an inline email link from settings. */
export function ContactBlock({ email, address }: { email?: string; address?: string }) {
  return (
    <div>
      <p>
        {email ? (
          <a href={`mailto:${email}`} className="underline underline-offset-4">
            {email}
          </a>
        ) : (
          "Use the contact page."
        )}
        {address ? <span className="mt-2 block">{address}</span> : null}
      </p>
    </div>
  );
}
