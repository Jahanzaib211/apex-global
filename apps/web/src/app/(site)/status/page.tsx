import { Section, SectionHeading } from "@apex/ui";
import type { Metadata } from "next";
import { getSettings } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "System status",
  description: "Current operational status of the Apex platform and services.",
  alternates: { canonical: absoluteUrl("/status") },
};

type Status = "operational" | "degraded" | "incident";
type Tone = { label: string; dot: string; bg: string; text: string };
const TONES: Record<Status, Tone> = {
  operational: {
    label: "All systems operational",
    dot: "bg-[var(--color-success-500)]",
    bg: "bg-[var(--color-success-100)]",
    text: "text-[var(--color-success-500)]",
  },
  degraded: {
    label: "Degraded performance",
    dot: "bg-[var(--color-amber-500)]",
    bg: "bg-[var(--color-amber-100)]",
    text: "text-[var(--color-amber-700)]",
  },
  incident: {
    label: "Active incident",
    dot: "bg-[var(--color-danger-500)]",
    bg: "bg-[var(--color-danger-100)]",
    text: "text-[var(--color-danger-500)]",
  },
};

export default async function StatusPage() {
  const settings = await getSettings();
  const raw = settings["ops.public_status"];
  const status: Status = raw === "degraded" || raw === "incident" ? raw : "operational";
  const banner = settings["ops.status_banner"] ?? "";
  const tone: Tone = TONES[status];

  return (
    <>
      <Section tone="inverse" grid className="py-16 md:py-20">
        <SectionHeading
          inverse
          as="h1"
          eyebrow="System status"
          title={tone.label}
          lede="Live state of the platform — refreshed every minute. The portal at /portal always reflects the same status."
        />
      </Section>

      <Section tone="page">
        <div className="flex items-center gap-3">
          <span className={`h-3 w-3 rounded-full ${tone.dot}`} aria-hidden />
          <span className={`text-sm font-medium ${tone.text}`}>{tone.label}</span>
        </div>

        {banner ? (
          <p className="mt-6 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-raised)] p-5 text-sm text-[var(--ink-secondary)]">
            {banner}
          </p>
        ) : null}

        <div className="mt-12">
          <h2 className="text-lg font-semibold">What we monitor</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              "Public website and lead forms",
              "Client portal sign-in and session",
              "Hyperswitch payment routing",
              "Twenty CRM sync pipeline",
              "Postgres, Redis, MinIO, Meilisearch",
              "Chatwoot live chat & helpdesk (127.0.0.1:4800)",
              "Cloudflare tunnel and edge cache",
            ].map((c) => (
              <li
                key={c}
                className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-raised)] px-4 py-3 text-sm"
              >
                {c}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-2xs mt-10 text-[var(--ink-muted)]">
          Operated by Apex Global Tech Solution ·{" "}
          <a
            href="mailto:status@apexgroupcompanies.com"
            className="underline-offset-4 hover:underline"
          >
            status@apexgroupcompanies.com
          </a>
        </p>
      </Section>
    </>
  );
}
