import { ButtonLink, Section } from "@apex/ui";
import Link from "next/link";

export default function NotFound() {
  return (
    <Section tone="page" className="py-28 md:py-36">
      <div className="mx-auto max-w-xl text-center">
        <p className="font-display text-6xl font-semibold text-[var(--color-amber-500)]">404</p>
        <h1 className="mt-6 text-3xl">This page does not exist</h1>
        <p className="mt-4 text-[var(--ink-secondary)]">
          The link may be out of date, or the page may have moved. Everything we publish is reachable
          from the navigation.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href="/">Back to home</ButtonLink>
          <Link
            href="/contact"
            className="px-2 py-2 text-sm font-medium underline-offset-4 hover:underline"
          >
            Contact us instead →
          </Link>
        </div>
      </div>
    </Section>
  );
}
