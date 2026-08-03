import { ButtonLink, Section } from "@apex/ui";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Thank you",
  // The conversion page must never be indexed: it would rank for the brand and
  // send organic visitors to a dead end that reads as if they had converted.
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <Section tone="page" className="py-28 md:py-36">
      <div className="mx-auto max-w-xl text-center">
        <div
          aria-hidden
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--bg-accent-subtle)]"
        >
          <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
            <path
              d="M2 9l7 7L22 2"
              stroke="var(--color-amber-700)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="mt-7 text-3xl md:text-4xl">Enquiry received</h1>
        <p className="mt-4 text-lg text-[var(--ink-secondary)]">
          Thank you. A member of our technology team will read this and reply, usually within one
          working day.
        </p>
        <p className="mt-3 text-[var(--ink-secondary)]">
          If it is urgent, call or message us directly — the details are on the contact page.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href="/technology">See how we work</ButtonLink>
          <Link
            href="/insights"
            className="px-2 py-2 text-sm font-medium underline-offset-4 hover:underline"
          >
            Read our insights →
          </Link>
        </div>
      </div>
    </Section>
  );
}
