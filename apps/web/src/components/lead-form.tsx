"use client";

import { Button, HoneypotField, SelectField, TextAreaField, TextField } from "@apex/ui";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ATTRIBUTION_STORAGE_KEY,
  readAttributionFromUrl,
  type AttributionPayload,
} from "@/lib/attribution";
import { BUDGET_BANDS, COMPANY_SIZES, TIMELINES } from "@/lib/lead-schema";

type FieldErrors = Record<string, string[] | undefined>;

interface Props {
  /** "solution" | "product" | "general" — sets what the enquiry is about. */
  interestType?: string;
  interestSlug?: string;
  compact?: boolean;
  submitLabel?: string;
  /** Override the submission endpoint — used by product pages to hit the
   *  dedicated demo-request pipeline. */
  endpoint?: string;
  productSlug?: string;
}

export function LeadForm({
  interestType = "general",
  interestSlug,
  compact = false,
  submitLabel = "Send enquiry",
  endpoint = "/api/leads",
  productSlug,
}: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  /**
   * Capture attribution on first load and keep it for the session. A visitor
   * who lands on an ad page, reads three articles and then converts must still
   * be attributed to the ad — otherwise every considered purchase looks organic
   * and the campaign gets switched off for being unprofitable.
   */
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);
      if (stored) return;

      const payload = readAttributionFromUrl(new URL(window.location.href), document.referrer);
      sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Private browsing can block sessionStorage. The lead still submits;
      // it just arrives without campaign data.
    }
  }, []);

  function storedAttribution(): AttributionPayload {
    try {
      const raw = sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as AttributionPayload) : {};
      return { ...parsed, currentPath: window.location.pathname };
    } catch {
      return { currentPath: window.location.pathname };
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setErrors({});
    setFormError(null);

    const data = new FormData(event.currentTarget);
    const payload = {
      name: data.get("name"),
      email: data.get("email"),
      phone: data.get("phone"),
      companyName: data.get("companyName"),
      jobTitle: data.get("jobTitle"),
      country: data.get("country"),
      companySize: data.get("companySize"),
      budgetBand: data.get("budgetBand"),
      timeline: data.get("timeline"),
      requirements: data.get("requirements"),
      message: data.get("message"),
      consentContact: data.get("consentContact") === "on",
      company_website: data.get("company_website") ?? "",
      interestType,
      interestSlug,
      productSlug: productSlug ?? interestSlug,
      attribution: storedAttribution(),
    };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        formRef.current?.reset();
        router.push("/thank-you");
        return;
      }

      const body = (await res.json()) as { error?: string; fields?: FieldErrors };
      setErrors(body.fields ?? {});
      setFormError(body.error ?? "Something went wrong. Please try again.");
    } catch {
      setFormError(
        "We could not reach the server. Please check your connection, or email us directly.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const first = (key: string) => errors[key]?.[0];

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="relative flex flex-col gap-5">
      <HoneypotField />

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Full name"
          name="name"
          autoComplete="name"
          required
          error={first("name")}
        />
        <TextField
          label="Work email"
          name="email"
          type="email"
          autoComplete="email"
          required
          error={first("email")}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Company" name="companyName" autoComplete="organization" />
        <TextField label="Phone or WhatsApp" name="phone" type="tel" autoComplete="tel" />
      </div>

      {!compact ? (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField label="Country" name="country" autoComplete="country-name" />
            <SelectField
              label="Company size"
              name="companySize"
              placeholder="Select company size"
              options={[...COMPANY_SIZES]}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField
              label="Indicative budget"
              name="budgetBand"
              placeholder="Select a range"
              hint="Helps us propose something realistic."
              options={[...BUDGET_BANDS]}
            />
            <SelectField
              label="Timeline"
              name="timeline"
              placeholder="Select a timeline"
              options={[...TIMELINES]}
            />
          </div>
        </>
      ) : null}

      <TextAreaField
        label="What are you trying to build, modernise or secure?"
        name="message"
        rows={compact ? 3 : 5}
        hint="A few sentences is plenty. We will ask the detailed questions on the call."
      />

      <label className="flex items-start gap-3 text-sm text-[var(--ink-secondary)]">
        <input
          type="checkbox"
          name="consentContact"
          required
          className="mt-1 h-4 w-4 shrink-0 accent-[var(--accent)]"
        />
        <span>
          I agree that Apex may contact me about this enquiry.
          {first("consentContact") ? (
            <span className="mt-1 block text-[var(--color-danger-500)]">
              {first("consentContact")}
            </span>
          ) : null}
        </span>
      </label>

      {formError ? (
        <p
          role="alert"
          className="rounded-[var(--radius-md)] bg-[var(--color-danger-100)] px-4 py-3 text-sm text-[var(--color-danger-500)]"
        >
          {formError}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? "Sending…" : submitLabel}
        </Button>
        <p className="text-xs text-[var(--ink-muted)]">
          We reply to every genuine enquiry. No mailing list, no follow-up sequence.
        </p>
      </div>
    </form>
  );
}
