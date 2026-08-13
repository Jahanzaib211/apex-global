import { Section } from "@apex/ui";
import type { Metadata } from "next";
import { ContactBlock, LegalDoc } from "@/components/legal/legal-doc";
import { getSettings } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Accessibility",
  description: "How Apex Global Tech Solution makes its website usable by everyone.",
  alternates: { canonical: absoluteUrl("/legal/accessibility") },
};

export default async function AccessibilityPage() {
  const s = await getSettings();
  const email = s["org.email"];

  return (
    <Section tone="page" className="py-16 md:py-20">
      <div className="mx-auto max-w-[var(--container-prose)]">
        <LegalDoc
          title="Accessibility"
          lead="We aim for the site and its products to be usable by everyone, including people who rely on assistive technology."
          updated="3 August 2026"
          notice="An accessibility statement is work in progress; this commits us to the targets and how to feedback."
          sections={[
            {
              id: "standard",
              heading: "The standard we target",
              body: (
                <p>
                  We target conformance with Web Content Accessibility Guidelines (WCAG) 2.2 level
                  AA. This covers keyboard operability, colour contrast, assistive-text labels and
                  predictable navigation.
                </p>
              ),
            },
            {
              id: "what-we-do",
              heading: "What we build in",
              body: (
                <ul className="mt-3 flex flex-col gap-2">
                  <li>Keyboard-visible focus states and no-interaction traps.</li>
                  <li>Semantic headings and labelled landmarks for screen readers.</li>
                  <li>Decorative graphics hidden from assistive technology.</li>
                  <li>
                    Reduced-motion support for animation, including the marquee and hero effects.
                  </li>
                  <li>Contrast ratios that meet AA on the palette we use.</li>
                </ul>
              ),
            },
            {
              id: "report",
              heading: "Report a barrier",
              body: (
                <p>
                  If something is hard to use, tell us. We treat accessibility reports as defects
                  and fix them in the normal cycle. Include the page, what you were trying to do,
                  and the technology you use.
                </p>
              ),
            },
            {
              id: "contact",
              heading: "Contact",
              body: <ContactBlock email={email} />,
            },
          ]}
        />
      </div>
    </Section>
  );
}
