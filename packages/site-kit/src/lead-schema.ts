import { z } from "zod";

/**
 * The lead contract. Used by the client form and re-validated on the server —
 * client-side validation is a convenience for humans, never a security control.
 */

export const COMPANY_SIZES = [
  { value: "1-10", label: "1–10 employees" },
  { value: "11-50", label: "11–50 employees" },
  { value: "51-200", label: "51–200 employees" },
  { value: "201-1000", label: "201–1,000 employees" },
  { value: "1000+", label: "More than 1,000 employees" },
] as const;

export const BUDGET_BANDS = [
  { value: "under-10k", label: "Under $10,000" },
  { value: "10k-50k", label: "$10,000 – $50,000" },
  { value: "50k-150k", label: "$50,000 – $150,000" },
  { value: "150k-plus", label: "$150,000+" },
  { value: "not-sure", label: "Not sure yet" },
] as const;

export const TIMELINES = [
  { value: "immediate", label: "Immediately" },
  { value: "1-3-months", label: "In 1–3 months" },
  { value: "3-6-months", label: "In 3–6 months" },
  { value: "exploring", label: "Exploring options" },
] as const;

/**
 * Optional free-text field.
 *
 * `.nullish()` rather than `.optional()` is load-bearing: `FormData.get()`
 * returns **null** for an input the form did not render, and the compact form
 * on campaign pages omits several. With `.optional()` those nulls failed
 * validation and every ad-page conversion was rejected with a generic error
 * and no highlighted field. Empty strings and nulls both normalise to
 * undefined so the column stays null rather than storing "".
 */
const optionalString = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .nullish()
    .transform((v) => (v === "" || v === null ? undefined : v));

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid email address").max(200),
  phone: optionalString(40),
  companyName: optionalString(160),
  jobTitle: optionalString(120),
  country: optionalString(80),
  companySize: optionalString(40),
  interestType: optionalString(40),
  interestSlug: optionalString(120),
  budgetBand: optionalString(40),
  timeline: optionalString(40),
  requirements: optionalString(4000),
  message: optionalString(4000),

  // Consent to be contacted. Explicit, unticked by default, and stored — this
  // is what we point at if anyone ever asks why we emailed them.
  consentContact: z.literal(true, {
    errorMap: () => ({ message: "Please confirm we may contact you about your enquiry" }),
  }),

  // Bot trap. Accepted by the schema on purpose: rejecting it here would
  // return a validation error naming the field, which tells a bot exactly
  // which input to leave alone next time. The handler checks it after
  // validation and returns a normal success response without writing anything.
  company_website: optionalString(500),

  turnstileToken: optionalString(4000),

  attribution: z
    .object({
      utmSource: optionalString(120),
      utmMedium: optionalString(120),
      utmCampaign: optionalString(160),
      utmTerm: optionalString(160),
      utmContent: optionalString(160),
      gclid: optionalString(200),
      fbclid: optionalString(200),
      msclkid: optionalString(200),
      referrer: optionalString(500),
      landingPath: optionalString(300),
      currentPath: optionalString(300),
      consentAnalytics: z.boolean().optional(),
      consentMarketing: z.boolean().optional(),
    })
    .optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
