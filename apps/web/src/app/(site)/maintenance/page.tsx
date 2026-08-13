import { Section } from "@apex/ui";
import type { Metadata } from "next";
import { getStringSetting } from "@/lib/content";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "We'll be back shortly",
  description: "Apex Global Tech Solution is performing scheduled maintenance.",
  robots: { index: false, follow: false },
};

/**
 * Maintenance holding page.
 *
 * Served by middleware when `ops.maintenance_mode = true`. We also render
 * this page directly for anyone who hits `/maintenance` while maintenance
 * is off — a soft-404 that lets the URL stay valid.
 */
export default async function MaintenancePage() {
  const message = await getStringSetting(
    "ops.maintenance_message",
    "We're performing scheduled maintenance. The portal will be back shortly.",
  );

  return (
    <Section tone="inverse" className="min-h-dvh py-24 md:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-2xs font-semibold tracking-[0.16em] text-[var(--color-amber-400)] uppercase">
          Scheduled maintenance
        </p>
        <h1 className="mt-4 text-4xl md:text-5xl">We&apos;ll be back shortly.</h1>
        <p className="mt-6 text-lg leading-relaxed text-[var(--color-navy-200)]">{message}</p>
        <p className="mt-10 text-sm text-[var(--color-navy-300)]">
          Existing clients can still reach support at{" "}
          <a
            href="mailto:support@apexgroupcompanies.com"
            className="text-[var(--color-canvas-100)] underline-offset-4 hover:underline"
          >
            support@apexgroupcompanies.com
          </a>
          .
        </p>
      </div>
    </Section>
  );
}
