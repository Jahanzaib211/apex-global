"use client";

import { useMemo, useState } from "react";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { Check, ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { submitConsultancyRequest } from "./actions";

const STEPS = [
  { id: 1, title: "Personal Information" },
  { id: 2, title: "Client Profile" },
  { id: 3, title: "Consultancy Requirement" },
  { id: 4, title: "Business Profile" },
  { id: 5, title: "Asset & Objectives" },
  { id: 6, title: "Additional & Consent" },
] as const;

const source = "Apex Group Financial Consultancy";

const initialForm = {
  personal: {
    fullName: "",
    preferredName: "",
    email: "",
    mobile: "",
    whatsapp: "",
    country: "",
    city: "",
    contactMethod: "Email",
    preferredTime: "Morning",
  },
  profile: { clientType: "" },
  requirement: { topics: [] as string[] },
  business: {
    businessName: "",
    industry: "",
    country: "",
    yearsOperating: "",
    employees: "",
    revenueRange: "",
    ownership: "",
    numBusinesses: "",
    expansion: "",
    funding: "",
    challenges: "",
  },
  objectives: {
    realEstateValue: "",
    realEstateProps: "",
    realEstateCountries: "",
    businessValue: "",
    businessCount: "",
    financialValue: "",
    financialCategory: "",
    otherValue: "",
    otherDesc: "",
    liabilityTotal: "",
    liabilityBusiness: "",
    liabilityProperty: "",
    liabilityOther: "",
    debtServicing: "",
    primaryObjectives: [] as string[],
    experience: "",
    risk: "",
    horizon: "",
    liquidity: "",
  },
  final: {
    additional: "",
    consent: false,
  },
};

const clientTypes = [
  "HNW Individual",
  "Business Owner",
  "Entrepreneur",
  "Investor",
  "Professional",
  "Family Representative",
  "Corporate Representative",
  "Other",
];

const requirementTopics = [
  "Personal Financial Planning",
  "Business Financial Consultancy",
  "Asset Review",
  "Wealth Structuring",
  "Real Estate Consultancy",
  "Business Expansion",
  "Capital Planning",
  "Investment Planning",
  "Strategic Financial Planning",
  "Succession Planning",
  "Risk Management",
  "Other",
];

const employeeRanges = ["1-10", "11-50", "51-200", "201+"];
const revenueRanges = ["Under PKR 50M", "PKR 50M-250M", "PKR 250M-1B", "PKR 1B-5B", "Above PKR 5B"];
const valueRanges = ["Under PKR 50M", "PKR 50M-250M", "PKR 250M-1B", "PKR 1B-5B", "Above PKR 5B"];
const liabilityRanges = ["None", "Under PKR 50M", "PKR 50M-250M", "PKR 250M-1B", "Above PKR 1B"];
const primaryObjectives = [
  "Wealth Preservation",
  "Capital Growth",
  "Asset Diversification",
  "Business Expansion",
  "Real Estate",
  "Retirement Planning",
  "Family Wealth Planning",
  "Succession",
  "Liquidity Planning",
  "Risk Management",
  "International Expansion",
  "Other",
];
const experiences = ["None", "Limited", "Moderate", "Extensive"];
const risks = ["Conservative", "Moderate", "Aggressive"];
const horizons = ["Short", "Medium", "Long"];

export default function ConsultancyForm() {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const needsBusinessStep = useMemo(
    () =>
      form.profile.clientType === "Business Owner" || form.profile.clientType === "Entrepreneur",
    [form.profile.clientType],
  );

  const setPersonal = (k: keyof typeof form.personal, v: string) =>
    setForm((p) => ({ ...p, personal: { ...p.personal, [k]: v } }));

  const setBusiness = (k: keyof typeof form.business, v: string) =>
    setForm((p) => ({ ...p, business: { ...p.business, [k]: v } }));

  const setObjectives = (k: keyof typeof form.objectives, v: string | string[]) =>
    setForm((p) => ({ ...p, objectives: { ...p.objectives, [k]: v as never } }));

  const toggleRequirement = (topic: string) => {
    setForm((p) => {
      const has = p.requirement.topics.includes(topic);
      return {
        ...p,
        requirement: {
          topics: has
            ? p.requirement.topics.filter((t) => t !== topic)
            : [...p.requirement.topics, topic],
        },
      };
    });
  };

  const toggleObjective = (topic: string) => {
    setForm((p) => {
      const has = p.objectives.primaryObjectives.includes(topic);
      return {
        ...p,
        objectives: {
          ...p.objectives,
          primaryObjectives: has
            ? p.objectives.primaryObjectives.filter((t) => t !== topic)
            : [...p.objectives.primaryObjectives, topic],
        },
      };
    });
  };

  const validateStep = (): string | null => {
    if (step === 1) {
      if (!form.personal.fullName || !form.personal.email || !form.personal.mobile) {
        return "Please complete Full Name, Email and Mobile.";
      }
    }
    if (step === 2) {
      if (!form.profile.clientType) return "Please select the option that best describes you.";
    }
    if (step === 3) {
      if (form.requirement.topics.length === 0)
        return "Please select at least one consultancy topic.";
    }
    if (step === 4 && needsBusinessStep) {
      if (!form.business.businessName) return "Please provide a Business Name.";
    }
    if (step === 6) {
      if (!form.final.consent) return "Please confirm the privacy consent before submitting.";
    }
    return null;
  };

  const next = () => {
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    if (step === 3 && !needsBusinessStep) {
      setStep(5);
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length));
  };

  const prev = () => {
    setError(null);
    if (step === 5 && !needsBusinessStep) {
      setStep(3);
      return;
    }
    setStep((s) => Math.max(s - 1, 1));
  };

  const submit = async () => {
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }
    setSubmitting(true);
    try {
      await submitConsultancyRequest({ ...form, source });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section id="consultancy-form" className="bg-cream py-28">
        <Container>
          <div className="border-gold mx-auto max-w-2xl border bg-white p-12 text-center">
            <div className="border-gold text-gold mx-auto inline-flex h-14 w-14 items-center justify-center border">
              <Lock size={20} />
            </div>
            <p className="text-gold mt-6 text-xs font-semibold tracking-[.3em] uppercase">
              Private &amp; Confidential
            </p>
            <h3 className="font-display text-navy mt-3 text-3xl">Thank you.</h3>
            <p className="text-charcoal/70 mt-5 text-base leading-7">
              A senior consultant will contact you privately within 1 business day. Your enquiry has
              been received within our role-based access environment.
            </p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section id="consultancy-form" className="bg-cream py-28">
      <Container>
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <p className="text-gold text-xs font-semibold tracking-[.25em] uppercase">
              REQUEST A PRIVATE CONSULTATION
            </p>
            <h2 className="font-display text-navy mt-3 text-4xl leading-tight md:text-5xl">
              Let&apos;s Begin a Private Conversation.
            </h2>
            <p className="text-charcoal/60 mt-4 text-sm">
              Complete the six steps below. Your information is handled within a strictly role-based
              access environment.
            </p>
          </div>

          {/* Stepper */}
          <ol className="mb-10 grid gap-2 md:grid-cols-6">
            {STEPS.map((s) => {
              const isDone = step > s.id;
              const isCurrent = step === s.id;
              return (
                <li
                  key={s.id}
                  className={`flex items-center gap-3 border px-3 py-2 text-left ${
                    isCurrent
                      ? "border-gold bg-white"
                      : isDone
                        ? "border-navy/15 bg-white/70"
                        : "border-navy/10 bg-white/40"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center text-[11px] font-bold ${
                      isCurrent
                        ? "bg-gold text-navy"
                        : isDone
                          ? "bg-navy text-white"
                          : "bg-navy/10 text-charcoal/50"
                    }`}
                  >
                    {isDone ? <Check size={12} /> : s.id}
                  </span>
                  <span
                    className={`text-[11px] font-semibold tracking-[.15em] uppercase ${
                      isCurrent ? "text-navy" : "text-charcoal/55"
                    }`}
                  >
                    {s.title}
                  </span>
                </li>
              );
            })}
          </ol>

          {/* Card body */}
          <div className="bg-white p-8 md:p-10">
            {step === 1 && <Step1 personal={form.personal} setPersonal={setPersonal} />}
            {step === 2 && (
              <Step2
                clientType={form.profile.clientType}
                setClientType={(v) => setForm((p) => ({ ...p, profile: { clientType: v } }))}
              />
            )}
            {step === 3 && <Step3 selected={form.requirement.topics} toggle={toggleRequirement} />}
            {step === 4 && needsBusinessStep && (
              <Step4 business={form.business} setBusiness={setBusiness} />
            )}
            {step === 4 && !needsBusinessStep && (
              <div className="text-charcoal/60 text-sm">
                Business Profile is not required for the selected profile. Continue to the next
                step.
              </div>
            )}
            {step === 5 && (
              <Step5
                objectives={form.objectives}
                setObjectives={setObjectives}
                toggleObjective={toggleObjective}
              />
            )}
            {step === 6 && (
              <Step6
                final={form.final}
                setFinal={(k, v) =>
                  setForm((p) => ({ ...p, final: { ...p.final, [k]: v as never } }))
                }
              />
            )}

            {error && (
              <p className="mt-4 border-l-2 border-red-500 bg-red-50 px-3 py-2 text-xs text-red-700">
                {error}
              </p>
            )}

            <div className="mt-8 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={prev}
                disabled={step === 1}
                className="border-navy/20 text-navy hover:border-gold inline-flex items-center gap-2 border px-4 py-2 text-xs font-semibold tracking-[.18em] uppercase transition disabled:opacity-40"
              >
                <ChevronLeft size={14} /> Previous
              </button>
              {step < STEPS.length ? (
                <button
                  type="button"
                  onClick={next}
                  className="bg-gold text-navy hover:bg-navy hover:text-gold inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold tracking-[.18em] uppercase transition"
                >
                  Next <ChevronRight size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={submit}
                  disabled={submitting}
                  className="bg-gold text-navy hover:bg-navy hover:text-gold inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold tracking-[.18em] uppercase transition disabled:opacity-60"
                >
                  {submitting ? "Submitting…" : "Submit Private Consultation Request"}
                </button>
              )}
            </div>
          </div>

          <p className="text-charcoal/55 mt-6 text-center text-[11px] leading-5">
            Apex Group&apos;s financial consultancy services are provided within the scope of
            services the Group is legally authorized to provide. Regulated financial, investment,
            securities, tax or legal services are provided only where appropriately authorized or
            through qualified/licensed professionals or partners.
          </p>
        </div>
      </Container>
    </section>
  );
}

/* ------------------------ Step Components ------------------------ */

function inputClass() {
  return "w-full border border-navy/20 bg-white px-3 py-2.5 text-sm text-charcoal focus:border-gold focus:outline-none";
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-charcoal/70 mb-2 block text-[11px] font-semibold tracking-[.18em] uppercase">
        {label}
        {required && <span className="text-gold ml-1">*</span>}
      </span>
      {children}
    </label>
  );
}

function Step1({
  personal,
  setPersonal,
}: {
  personal: typeof initialForm.personal;
  setPersonal: (k: keyof typeof initialForm.personal, v: string) => void;
}) {
  return (
    <div>
      <SectionHeading eyebrow="STEP 01" title="Personal Information" light={false} />
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Field label="Full Name" required>
          <input
            value={personal.fullName}
            onChange={(e) => setPersonal("fullName", e.target.value)}
            className={inputClass()}
          />
        </Field>
        <Field label="Preferred Name">
          <input
            value={personal.preferredName}
            onChange={(e) => setPersonal("preferredName", e.target.value)}
            className={inputClass()}
          />
        </Field>
        <Field label="Email" required>
          <input
            type="email"
            value={personal.email}
            onChange={(e) => setPersonal("email", e.target.value)}
            className={inputClass()}
          />
        </Field>
        <Field label="Mobile" required>
          <input
            value={personal.mobile}
            onChange={(e) => setPersonal("mobile", e.target.value)}
            className={inputClass()}
          />
        </Field>
        <Field label="WhatsApp">
          <input
            value={personal.whatsapp}
            onChange={(e) => setPersonal("whatsapp", e.target.value)}
            className={inputClass()}
          />
        </Field>
        <Field label="Country of Residence">
          <input
            value={personal.country}
            onChange={(e) => setPersonal("country", e.target.value)}
            className={inputClass()}
          />
        </Field>
        <Field label="City">
          <input
            value={personal.city}
            onChange={(e) => setPersonal("city", e.target.value)}
            className={inputClass()}
          />
        </Field>
        <Field label="Preferred Contact Method">
          <select
            value={personal.contactMethod}
            onChange={(e) => setPersonal("contactMethod", e.target.value)}
            className={inputClass()}
          >
            <option>Email</option>
            <option>Phone</option>
            <option>WhatsApp</option>
          </select>
        </Field>
        <Field label="Preferred Consultation Time">
          <select
            value={personal.preferredTime}
            onChange={(e) => setPersonal("preferredTime", e.target.value)}
            className={inputClass()}
          >
            <option>Morning</option>
            <option>Afternoon</option>
            <option>Evening</option>
          </select>
        </Field>
      </div>
    </div>
  );
}

function Step2({
  clientType,
  setClientType,
}: {
  clientType: string;
  setClientType: (v: string) => void;
}) {
  return (
    <div>
      <SectionHeading eyebrow="STEP 02" title="Client Profile" />
      <p className="text-charcoal/65 mt-2 text-sm">Which describes you best?</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {clientTypes.map((t) => {
          const active = clientType === t;
          return (
            <button
              type="button"
              key={t}
              onClick={() => setClientType(t)}
              className={`border px-4 py-3 text-left text-sm transition ${
                active
                  ? "border-gold bg-cream text-navy"
                  : "border-navy/15 text-charcoal/75 hover:border-gold bg-white"
              }`}
            >
              <span className="inline-flex items-center gap-3">
                <span
                  className={`inline-flex h-4 w-4 items-center justify-center border ${
                    active ? "border-gold bg-gold" : "border-navy/30"
                  }`}
                >
                  {active && <Check size={10} className="text-navy" />}
                </span>
                {t}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Step3({ selected, toggle }: { selected: string[]; toggle: (s: string) => void }) {
  return (
    <div>
      <SectionHeading eyebrow="STEP 03" title="Consultancy Requirement" />
      <p className="text-charcoal/65 mt-2 text-sm">Select the topics relevant to your situation.</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {requirementTopics.map((t) => {
          const active = selected.includes(t);
          return (
            <button
              type="button"
              key={t}
              onClick={() => toggle(t)}
              className={`border px-3 py-2 text-xs font-semibold tracking-[.15em] uppercase transition ${
                active
                  ? "border-gold bg-gold text-navy"
                  : "border-navy/15 text-charcoal/70 hover:border-gold bg-white"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Step4({
  business,
  setBusiness,
}: {
  business: typeof initialForm.business;
  setBusiness: (k: keyof typeof initialForm.business, v: string) => void;
}) {
  return (
    <div>
      <SectionHeading eyebrow="STEP 04" title="Business Profile" />
      <p className="text-charcoal/65 mt-2 text-sm">A short overview of the business.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Field label="Business Name" required>
          <input
            value={business.businessName}
            onChange={(e) => setBusiness("businessName", e.target.value)}
            className={inputClass()}
          />
        </Field>
        <Field label="Industry">
          <input
            value={business.industry}
            onChange={(e) => setBusiness("industry", e.target.value)}
            className={inputClass()}
          />
        </Field>
        <Field label="Country">
          <input
            value={business.country}
            onChange={(e) => setBusiness("country", e.target.value)}
            className={inputClass()}
          />
        </Field>
        <Field label="Years Operating">
          <input
            value={business.yearsOperating}
            onChange={(e) => setBusiness("yearsOperating", e.target.value)}
            className={inputClass()}
          />
        </Field>
        <Field label="Employee Range">
          <select
            value={business.employees}
            onChange={(e) => setBusiness("employees", e.target.value)}
            className={inputClass()}
          >
            <option value="">Select…</option>
            {employeeRanges.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </Field>
        <Field label="Annual Revenue Range">
          <select
            value={business.revenueRange}
            onChange={(e) => setBusiness("revenueRange", e.target.value)}
            className={inputClass()}
          >
            <option value="">Select…</option>
            {revenueRanges.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </Field>
        <Field label="Ownership %">
          <input
            value={business.ownership}
            onChange={(e) => setBusiness("ownership", e.target.value)}
            className={inputClass()}
          />
        </Field>
        <Field label="Number of Businesses">
          <input
            value={business.numBusinesses}
            onChange={(e) => setBusiness("numBusinesses", e.target.value)}
            className={inputClass()}
          />
        </Field>
        <Field label="Expansion Plans">
          <textarea
            rows={3}
            value={business.expansion}
            onChange={(e) => setBusiness("expansion", e.target.value)}
            className={inputClass()}
          />
        </Field>
        <Field label="Funding Requirements">
          <textarea
            rows={3}
            value={business.funding}
            onChange={(e) => setBusiness("funding", e.target.value)}
            className={inputClass()}
          />
        </Field>
        <Field label="Major Business Challenges">
          <textarea
            rows={3}
            value={business.challenges}
            onChange={(e) => setBusiness("challenges", e.target.value)}
            className={inputClass()}
          />
        </Field>
      </div>
    </div>
  );
}

function Step5({
  objectives,
  setObjectives,
  toggleObjective,
}: {
  objectives: typeof initialForm.objectives;
  setObjectives: (k: keyof typeof initialForm.objectives, v: string | string[]) => void;
  toggleObjective: (s: string) => void;
}) {
  return (
    <div>
      <SectionHeading eyebrow="STEP 05" title="Asset & Objectives" />
      <p className="text-charcoal/65 mt-2 text-sm">Optional — provide ranges where possible.</p>

      <div className="mt-6 space-y-8">
        <Group title="Real Estate (optional)">
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Value Range">
              <select
                value={objectives.realEstateValue}
                onChange={(e) => setObjectives("realEstateValue", e.target.value)}
                className={inputClass()}
              >
                <option value="">Select…</option>
                {valueRanges.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </Field>
            <Field label="Number of Properties">
              <input
                value={objectives.realEstateProps}
                onChange={(e) => setObjectives("realEstateProps", e.target.value)}
                className={inputClass()}
              />
            </Field>
            <Field label="Countries">
              <input
                value={objectives.realEstateCountries}
                onChange={(e) => setObjectives("realEstateCountries", e.target.value)}
                className={inputClass()}
              />
            </Field>
          </div>
        </Group>

        <Group title="Business Interests (optional)">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Value Range">
              <select
                value={objectives.businessValue}
                onChange={(e) => setObjectives("businessValue", e.target.value)}
                className={inputClass()}
              >
                <option value="">Select…</option>
                {valueRanges.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </Field>
            <Field label="Number of Businesses">
              <input
                value={objectives.businessCount}
                onChange={(e) => setObjectives("businessCount", e.target.value)}
                className={inputClass()}
              />
            </Field>
          </div>
        </Group>

        <Group title="Financial Assets (optional)">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Value Range">
              <select
                value={objectives.financialValue}
                onChange={(e) => setObjectives("financialValue", e.target.value)}
                className={inputClass()}
              >
                <option value="">Select…</option>
                {valueRanges.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </Field>
            <Field label="Category">
              <input
                value={objectives.financialCategory}
                onChange={(e) => setObjectives("financialCategory", e.target.value)}
                className={inputClass()}
              />
            </Field>
          </div>
        </Group>

        <Group title="Other Assets (optional)">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Value Range">
              <select
                value={objectives.otherValue}
                onChange={(e) => setObjectives("otherValue", e.target.value)}
                className={inputClass()}
              >
                <option value="">Select…</option>
                {valueRanges.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </Field>
            <Field label="Description">
              <input
                value={objectives.otherDesc}
                onChange={(e) => setObjectives("otherDesc", e.target.value)}
                className={inputClass()}
              />
            </Field>
          </div>
        </Group>

        <Group title="Liabilities (optional)">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Field label="Total Liability Range">
              <select
                value={objectives.liabilityTotal}
                onChange={(e) => setObjectives("liabilityTotal", e.target.value)}
                className={inputClass()}
              >
                <option value="">Select…</option>
                {liabilityRanges.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </Field>
            <Field label="Business Debt">
              <input
                value={objectives.liabilityBusiness}
                onChange={(e) => setObjectives("liabilityBusiness", e.target.value)}
                className={inputClass()}
              />
            </Field>
            <Field label="Property Financing">
              <input
                value={objectives.liabilityProperty}
                onChange={(e) => setObjectives("liabilityProperty", e.target.value)}
                className={inputClass()}
              />
            </Field>
            <Field label="Other Obligations">
              <input
                value={objectives.liabilityOther}
                onChange={(e) => setObjectives("liabilityOther", e.target.value)}
                className={inputClass()}
              />
            </Field>
            <Field label="Debt Servicing Range">
              <input
                value={objectives.debtServicing}
                onChange={(e) => setObjectives("debtServicing", e.target.value)}
                className={inputClass()}
              />
            </Field>
          </div>
        </Group>

        <Group title="Primary Objectives">
          <p className="text-charcoal/55 mb-3 text-xs">Select all that apply.</p>
          <div className="flex flex-wrap gap-2">
            {primaryObjectives.map((t) => {
              const active = objectives.primaryObjectives.includes(t);
              return (
                <button
                  type="button"
                  key={t}
                  onClick={() => toggleObjective(t)}
                  className={`border px-3 py-2 text-xs font-semibold tracking-[.15em] uppercase transition ${
                    active
                      ? "border-gold bg-gold text-navy"
                      : "border-navy/15 text-charcoal/70 hover:border-gold bg-white"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </Group>

        <Group title="Risk & Experience">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Field label="Investment Experience">
              <select
                value={objectives.experience}
                onChange={(e) => setObjectives("experience", e.target.value)}
                className={inputClass()}
              >
                <option value="">Select…</option>
                {experiences.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </Field>
            <Field label="Risk Tolerance">
              <select
                value={objectives.risk}
                onChange={(e) => setObjectives("risk", e.target.value)}
                className={inputClass()}
              >
                <option value="">Select…</option>
                {risks.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </Field>
            <Field label="Investment Horizon">
              <select
                value={objectives.horizon}
                onChange={(e) => setObjectives("horizon", e.target.value)}
                className={inputClass()}
              >
                <option value="">Select…</option>
                {horizons.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </Field>
            <Field label="Liquidity Requirements">
              <input
                value={objectives.liquidity}
                onChange={(e) => setObjectives("liquidity", e.target.value)}
                className={inputClass()}
              />
            </Field>
          </div>
          <p className="text-charcoal/55 mt-3 text-[11px] italic">
            This information supports our understanding. It does not constitute authorization for
            regulated investment advice.
          </p>
        </Group>
      </div>
    </div>
  );
}

function Step6({
  final,
  setFinal,
}: {
  final: typeof initialForm.final;
  setFinal: (k: keyof typeof initialForm.final, v: string | boolean) => void;
}) {
  return (
    <div>
      <SectionHeading eyebrow="STEP 06" title="Additional Information & Consent" />
      <div className="mt-6 space-y-6">
        <Field label="Tell us anything else we should understand.">
          <textarea
            rows={6}
            value={final.additional}
            onChange={(e) => setFinal("additional", e.target.value)}
            placeholder="objectives · concerns · business challenges · upcoming decisions · family considerations"
            className={inputClass()}
          />
        </Field>

        <div className="border-navy/20 bg-cream/40 border border-dashed p-5">
          <p className="text-charcoal/70 text-[11px] font-semibold tracking-[.18em] uppercase">
            Document Upload
          </p>
          <p className="text-charcoal/55 mt-1 text-xs">
            Document upload available in your secure client portal after consultation is confirmed.
          </p>
          <input
            type="file"
            disabled
            className="border-navy/20 text-charcoal/45 mt-3 block w-full cursor-not-allowed border border-dashed bg-white px-3 py-3 text-xs"
          />
        </div>

        <label className="border-navy/15 bg-cream/40 flex items-start gap-3 border p-5">
          <input
            type="checkbox"
            checked={final.consent}
            onChange={(e) => setFinal("consent", e.target.checked)}
            className="accent-gold mt-1 h-4 w-4"
          />
          <span className="text-charcoal/75 text-xs leading-6">
            I understand that the information I provide will be used by Apex Group of Companies to
            evaluate and respond to my consultancy request and to contact me regarding the enquiry.
            I have read and accept the{" "}
            <a href="/privacy" className="text-gold underline">
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href="/terms" className="text-gold underline">
              Terms
            </a>
            .
          </span>
        </label>
      </div>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-display text-navy mb-4 text-xl">{title}</h3>
      {children}
    </div>
  );
}
