"use client";

import { useMemo, useState } from "react";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { Filter, MapPin, Briefcase, ArrowRight } from "lucide-react";

type Company =
  "tech-solution" | "outsourcing" | "tours-travels" | "holdings" | "consultancy" | "group";

interface Vacancy {
  id: string;
  title: string;
  company: Company;
  companyLabel: string;
  department: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Internship";
  experience: "Entry" | "Mid" | "Senior" | "Lead" | "All Levels";
  shift: "Day" | "Night" | "Flexible";
}

const vacancies: Vacancy[] = [
  {
    id: "open-register",
    title: "Register Your Interest — Expression of Interest",
    company: "group",
    companyLabel: "Apex Group Office",
    department: "Talent Network",
    location: "Karachi · Lahore · Riyadh",
    type: "Full-time",
    experience: "All Levels",
    shift: "Flexible",
  },
];

const COMPANY_OPTIONS: { value: "all" | Company; label: string }[] = [
  { value: "all", label: "All Companies" },
  { value: "tech-solution", label: "Tech" },
  { value: "outsourcing", label: "Outsourcing" },
  { value: "tours-travels", label: "Tours" },
  { value: "holdings", label: "Holdings" },
  { value: "consultancy", label: "Consultancy" },
  { value: "group", label: "Group" },
];

const TYPE_OPTIONS = ["All", "Full-time", "Part-time", "Contract", "Internship"] as const;
const EXP_OPTIONS = ["All", "Entry", "Mid", "Senior", "Lead"] as const;
const SHIFT_OPTIONS = ["All", "Day", "Night", "Flexible"] as const;

export default function CareersFilter({ onApply }: { onApply?: (vacancy: Vacancy) => void }) {
  const [company, setCompany] = useState<"all" | Company>("all");
  const [department, setDepartment] = useState("All");
  const [location, setLocation] = useState("All");
  const [type, setType] = useState<(typeof TYPE_OPTIONS)[number]>("All");
  const [experience, setExperience] = useState<(typeof EXP_OPTIONS)[number]>("All");
  const [shift, setShift] = useState<(typeof SHIFT_OPTIONS)[number]>("All");

  const departments = useMemo(
    () => ["All", ...Array.from(new Set(vacancies.map((v) => v.department)))],
    [],
  );
  const locations = useMemo(
    () => ["All", ...Array.from(new Set(vacancies.map((v) => v.location)))],
    [],
  );

  const filtered = vacancies.filter((v) => {
    if (company !== "all" && v.company !== company) return false;
    if (department !== "All" && v.department !== department) return false;
    if (location !== "All" && v.location !== location) return false;
    if (type !== "All" && v.type !== type) return false;
    if (experience !== "All" && v.experience !== experience) return false;
    if (shift !== "All" && v.shift !== shift) return false;
    return true;
  });

  const reset = () => {
    setCompany("all");
    setDepartment("All");
    setLocation("All");
    setType("All");
    setExperience("All");
    setShift("All");
  };

  return (
    <section id="vacancies" className="bg-white py-24">
      <Container>
        <SectionHeading
          eyebrow="TALENT NETWORK"
          title="Build a career with Apex."
          subtitle="Concrete vacancies are posted at each operating company's own careers page. The form below adds you to the Apex Group talent network so the right team sees your profile when a matching role opens up."
        />

        <div className="border-navy/10 bg-cream/60 mt-12 border p-6">
          <div className="text-charcoal/70 mb-5 flex items-center gap-2 text-xs font-semibold tracking-[.18em] uppercase">
            <Filter size={14} className="text-gold" />
            Filter Vacancies
          </div>
          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
            <FilterSelect
              label="Company"
              value={company}
              onChange={(v) => setCompany(v as "all" | Company)}
            >
              {COMPANY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect label="Department" value={department} onChange={setDepartment}>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect label="Location" value={location} onChange={setLocation}>
              {locations.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect
              label="Type"
              value={type}
              onChange={(v) => setType(v as (typeof TYPE_OPTIONS)[number])}
            >
              {TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect
              label="Experience"
              value={experience}
              onChange={(v) => setExperience(v as (typeof EXP_OPTIONS)[number])}
            >
              {EXP_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect
              label="Shift"
              value={shift}
              onChange={(v) => setShift(v as (typeof SHIFT_OPTIONS)[number])}
            >
              {SHIFT_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </FilterSelect>
          </div>
          <div className="text-charcoal/55 mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <p>
              Showing <span className="text-navy font-semibold">{filtered.length}</span> role
              {filtered.length === 1 ? "" : "s"} in the Apex Group talent network
            </p>
            <button
              onClick={reset}
              className="text-navy hover:text-gold text-[10px] font-semibold tracking-[.18em] uppercase"
            >
              Reset Filters
            </button>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.length === 0 ? (
            <div className="border-navy/20 text-charcoal/55 col-span-full border border-dashed p-10 text-center text-sm">
              No vacancies match the selected filters. Try resetting to see all placeholder roles.
            </div>
          ) : (
            filtered.map((v) => (
              <div
                key={v.id}
                className="border-navy/10 hover:border-gold flex flex-col border bg-white p-7 transition"
              >
                <div className="text-gold flex items-center gap-2 text-[10px] font-semibold tracking-[.18em] uppercase">
                  <Briefcase size={12} />
                  {v.companyLabel}
                </div>
                <h3 className="font-display text-navy mt-5 text-2xl">{v.title}</h3>
                <p className="text-charcoal/45 mt-3 text-xs tracking-[.15em] uppercase">
                  Placeholder — example vacancy
                </p>
                <dl className="text-charcoal/70 mt-6 grid grid-cols-2 gap-y-2 text-xs">
                  <dt className="text-charcoal/45">Department</dt>
                  <dd className="text-right">{v.department}</dd>
                  <dt className="text-charcoal/45">Location</dt>
                  <dd className="flex items-center justify-end gap-1 text-right">
                    <MapPin size={11} className="text-gold" /> {v.location}
                  </dd>
                  <dt className="text-charcoal/45">Type</dt>
                  <dd className="text-right">{v.type}</dd>
                  <dt className="text-charcoal/45">Experience</dt>
                  <dd className="text-right">{v.experience}</dd>
                  <dt className="text-charcoal/45">Shift</dt>
                  <dd className="text-right">{v.shift}</dd>
                </dl>
                <div className="mt-7 flex items-center justify-between">
                  <button
                    onClick={() => onApply?.(v)}
                    className="bg-gold text-navy hover:bg-navy hover:text-gold inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-[.15em] uppercase transition"
                  >
                    Apply Now <ArrowRight size={12} />
                  </button>
                  <span className="text-charcoal/40 text-[10px] tracking-[.18em] uppercase">
                    Group Career
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </Container>
    </section>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-charcoal/60 mb-1.5 block text-[10px] font-semibold tracking-[.18em] uppercase">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-navy/20 text-charcoal focus:border-navy focus:ring-gold/40 w-full border bg-white px-3 py-2 text-sm outline-none focus:ring-2"
      >
        {children}
      </select>
    </label>
  );
}

export { vacancies as placeholderVacancies };
export type { Vacancy };
