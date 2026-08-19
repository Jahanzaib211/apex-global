"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  MapPin,
  ArrowRight,
  Building2,
  Check,
  X,
  ChevronDown,
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  FileText,
  Download,
  Trees,
  Dumbbell,
  ShieldCheck,
  Baby,
  ShoppingBag,
  Car,
  Wifi,
  Utensils,
  Sparkles,
  Compass,
  Eye,
} from "lucide-react";
import { projectBySlug, projects } from "@/data/projects";
import { CTASection } from "@/components/CTASection";
import { site } from "@/data/site";

const amenityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  pool: Sparkles,
  gym: Dumbbell,
  security: ShieldCheck,
  kids: Baby,
  garden: Trees,
  retail: ShoppingBag,
  parking: Car,
  wifi: Wifi,
  food: Utensils,
  spa: Sparkles,
  lounge: Compass,
  cinema: Eye,
};

const titleToIcon = (t: string): React.ComponentType<{ className?: string }> => {
  const lower = t.toLowerCase();
  if (lower.includes("pool")) return amenityIcons.pool!;
  if (lower.includes("gym")) return amenityIcons.gym!;
  if (lower.includes("security") || lower.includes("cctv")) return amenityIcons.security!;
  if (lower.includes("kids") || lower.includes("children")) return amenityIcons.kids!;
  if (lower.includes("garden") || lower.includes("park")) return amenityIcons.garden!;
  if (lower.includes("retail") || lower.includes("shopping")) return amenityIcons.retail!;
  if (lower.includes("parking")) return amenityIcons.parking!;
  if (lower.includes("wifi")) return amenityIcons.wifi!;
  if (lower.includes("food") || lower.includes("café") || lower.includes("cafe"))
    return amenityIcons.food!;
  if (lower.includes("spa")) return amenityIcons.spa!;
  if (lower.includes("lounge")) return amenityIcons.lounge!;
  if (lower.includes("cinema")) return amenityIcons.cinema!;
  return Sparkles;
};

const projectFaqs = [
  {
    q: "How do I request the brochure and full specifications?",
    a: 'Use the "Request Project Details" form on this page — our team will respond with the brochure, payment plan and full specifications within one working day.',
  },
  {
    q: "Can I schedule a site visit?",
    a: 'Yes. Use the "Schedule a Visit" CTA — pick a date and time and our property consultant will coordinate the logistics.',
  },
  {
    q: "Is the pricing on this page final?",
    a: "Pricing shown is indicative. Final pricing depends on unit, view, floor and current availability — confirm with our sales team.",
  },
  {
    q: "Does Apex Holdings guarantee the project status?",
    a: "Project statuses on this page are as published by the developer and curated by Apex Holdings. Final status confirmation is with the developer of record.",
  },
  {
    q: "What is the relationship between Apex Holdings and the developer?",
    a: "In most cases Apex Holdings is the marketing partner. The project is clearly labelled with its developer of record and Apex’s role on every detail page.",
  },
];

export default function ProjectDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIdx(null);
      if (e.key === "ArrowRight" && project)
        setLightboxIdx((i) => (i === null ? null : (i + 1) % project.gallery.length));
      if (e.key === "ArrowLeft" && project)
        setLightboxIdx((i) =>
          i === null ? null : (i - 1 + project.gallery.length) % project.gallery.length,
        );
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!slug) {
    return (
      <div className="container-x py-32 text-center">
        <p className="text-slate-500">Loading project…</p>
      </div>
    );
  }

  const project = projectBySlug(slug);

  if (!project) {
    return (
      <>
        <section className="section">
          <div className="container-x mx-auto max-w-xl text-center">
            <span className="eyebrow mb-3 block">404 · PROJECT NOT FOUND</span>
            <h1 className="font-display text-ink mb-4 text-4xl">
              This project isn’t in our portfolio.
            </h1>
            <p className="mb-6 text-slate-600">
              The project you’re looking for may have been renamed, paused or removed from our
              marketed portfolio.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link href="/projects" className="btn-primary">
                All Projects
              </Link>
              <Link href="/contact" className="btn-ghost">
                Talk to Us
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  const related = projects.filter((p) => p.slug !== project.slug).slice(0, 3);
  const lightboxImg = lightboxIdx !== null ? project.gallery[lightboxIdx] : null;

  return (
    <>
      {/* Hero */}
      <section className="bg-ink relative overflow-hidden text-white">
        <div className="relative h-[60vh] max-h-[720px] min-h-[460px]">
          <Image
            src={project.cover}
            alt={project.name}
            fill
            className="object-cover"
            unoptimized
            priority
          />
          <div
            className="from-ink via-ink/40 to-ink/30 absolute inset-0 bg-gradient-to-t"
            aria-hidden
          />
          <div className="absolute inset-0 flex items-end">
            <div className="container-x pb-12">
              <nav className="tracking-wide-2 mb-5 flex items-center gap-1.5 text-xs text-slate-300 uppercase">
                <Link href="/" className="hover:text-gold-400">
                  Home
                </Link>
                <ChevronDown className="h-3 w-3 -rotate-90 opacity-50" />
                <Link href="/projects" className="hover:text-gold-400">
                  Projects
                </Link>
                <ChevronDown className="h-3 w-3 -rotate-90 opacity-50" />
                <span className="text-gold-400">{project.name}</span>
              </nav>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="pill-gold">{project.role}</span>
                <span className="pill !border-white/20 !bg-white/10 !text-white">
                  {project.status}
                </span>
                <span className="pill !border-white/20 !bg-white/10 !text-white">
                  {project.category}
                </span>
              </div>
              <h1 className="font-display max-w-3xl text-4xl leading-tight font-bold text-white sm:text-5xl lg:text-6xl">
                {project.name}
              </h1>
              <p className="mt-3 max-w-2xl text-base text-slate-200 sm:text-lg">
                {project.tagline}
              </p>
              <div className="mt-5 flex items-center gap-2 text-sm text-slate-300">
                <MapPin className="text-gold-400 h-4 w-4" />
                {project.city} · {project.area}
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href={`/contact?project=${project.slug}`} className="btn-accent">
                  Request Project Details <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href={`/site-visit?project=${project.slug}`} className="btn-ghost-light">
                  <Calendar className="h-4 w-4" /> Schedule a Visit
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mini info strip */}
        <div className="bg-ink/95 relative border-t border-white/10">
          <div className="container-x grid grid-cols-2 gap-6 py-6 text-sm md:grid-cols-5">
            <Info label="Developer" value={project.developer} />
            <Info label="Units" value={project.units} />
            <Info label="Size" value={project.size} />
            <Info label="Status" value={project.status} />
            <Info label="Price" value={project.price} />
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="section bg-white">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <span className="eyebrow mb-3 block">PROJECT OVERVIEW</span>
            <h2 className="font-display text-ink mb-6 text-3xl leading-tight lg:text-4xl">
              What this project is
            </h2>
            <div className="space-y-5 leading-relaxed text-slate-700">
              {project.description.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <h3 className="font-display text-ink mt-12 mb-5 text-2xl">Key Features</h3>
            <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {project.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-slate-700">
                  <Check className="text-gold-500 mt-0.5 h-5 w-5 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="lg:col-span-4">
            <div className="border border-slate-200 bg-slate-50 p-7">
              <span className="eyebrow mb-3 block">REQUEST DETAILS</span>
              <h3 className="font-display text-ink mb-4 text-xl">
                Get the brochure & payment plan.
              </h3>
              <p className="mb-6 text-sm text-slate-600">
                Fill in a short form and our team will share the full project pack within one
                working day.
              </p>
              <Link href={`/contact?project=${project.slug}`} className="btn-primary mb-3 w-full">
                Request Project Details
              </Link>
              <Link href={`/site-visit?project=${project.slug}`} className="btn-ghost mb-5 w-full">
                <Calendar className="h-4 w-4" /> Schedule a Visit
              </Link>

              <div className="space-y-3 border-t border-slate-200 pt-5 text-sm">
                <SidebarRow label="Developer" value={project.developer} />
                <SidebarRow label="Category" value={project.category} />
                <SidebarRow label="Status" value={project.status} />
                <SidebarRow label="Role" value={project.role} />
                <SidebarRow label="Units" value={project.units} />
                <SidebarRow label="Launch" value={project.launchYear} />
                <SidebarRow label="Price" value={project.price} />
              </div>

              <div className="mt-5 space-y-2 border-t border-slate-200 pt-5 text-sm">
                <a
                  href={`tel:${site.phone.replace(/\s+/g, "")}`}
                  className="hover:text-ink flex items-center gap-2 text-slate-700"
                >
                  <Phone className="text-gold-500 h-4 w-4" /> {site.phone}
                </a>
                <a
                  href={`mailto:${site.email}`}
                  className="hover:text-ink flex items-center gap-2 text-slate-700"
                >
                  <Mail className="text-gold-500 h-4 w-4" /> {site.email}
                </a>
                <a
                  href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(`Hi, I'm interested in ${project.name}.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-ink flex items-center gap-2 text-slate-700"
                >
                  <MessageCircle className="text-gold-500 h-4 w-4" /> WhatsApp a Consultant
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Why this project */}
      <section className="section-tight border-y border-slate-200 bg-slate-50/60">
        <div className="container-x">
          <div className="mb-10 max-w-2xl">
            <span className="eyebrow mb-3 block">WHY THIS PROJECT</span>
            <h2 className="font-display text-ink text-3xl leading-tight lg:text-4xl">
              Highlights at a glance
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {project.highlights.map((h, i) => (
              <div key={i} className="border border-slate-200 bg-white p-7">
                <div className="tracking-wide-3 mb-2 text-[11px] text-slate-500 uppercase">
                  {h.label}
                </div>
                <div className="font-display text-ink text-lg leading-snug">{h.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="section bg-white">
        <div className="container-x">
          <div className="mb-10 max-w-2xl">
            <span className="eyebrow mb-3 block">AMENITIES</span>
            <h2 className="font-display text-ink text-3xl leading-tight lg:text-4xl">
              Lifestyle and facilities within the project
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {project.amenities.map((a, i) => {
              const Icon = titleToIcon(a);
              return (
                <div
                  key={i}
                  className="hover:border-ink flex items-start gap-4 border border-slate-200 bg-white p-6 transition-colors"
                >
                  <span className="bg-gold-50 text-gold-500 inline-flex h-10 w-10 shrink-0 items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-ink text-sm leading-snug font-medium">{a}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="section border-y border-slate-200 bg-slate-50/60">
        <div className="container-x">
          <div className="mb-10 max-w-2xl">
            <span className="eyebrow mb-3 block">PROJECT GALLERY</span>
            <h2 className="font-display text-ink text-3xl leading-tight lg:text-4xl">
              Exterior, interior and lifestyle imagery
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Click any image to open the lightbox · use arrow keys to navigate
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {project.gallery.map((img, i) => (
              <button
                key={i}
                onClick={() => setLightboxIdx(i)}
                className={`group relative overflow-hidden ${
                  i === 0
                    ? "col-span-2 row-span-2 aspect-square md:aspect-auto md:h-[420px]"
                    : "aspect-square"
                }`}
              >
                <Image
                  src={img}
                  alt={`${project.name} image ${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(min-width:768px) 25vw, 50vw"
                  unoptimized
                />
                <div
                  className="bg-ink/0 group-hover:bg-ink/30 absolute inset-0 transition-colors"
                  aria-hidden
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="section bg-white">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <span className="eyebrow mb-3 block">LOCATION</span>
            <h2 className="font-display text-ink mb-5 text-3xl leading-tight lg:text-4xl">
              Where it sits
            </h2>
            <div className="mb-6 flex items-start gap-3">
              <MapPin className="text-gold-500 mt-1 h-5 w-5" />
              <div>
                <div className="font-display text-ink text-lg">
                  {project.area}, {project.city}
                </div>
                <div className="text-sm text-slate-600">{project.summary}</div>
              </div>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${project.area}, ${project.city}, Pakistan`)}`}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost"
            >
              <MapPin className="h-4 w-4" /> Open in Google Maps
            </a>
          </div>
          <div className="lg:col-span-5">
            <div className="border border-slate-200 bg-slate-50 p-7">
              <span className="eyebrow mb-3 block">NEARBY</span>
              <h3 className="font-display text-ink mb-5 text-xl">What's around it</h3>
              <ul className="space-y-3">
                {project.nearby.map((n, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between gap-3 border-b border-slate-200 py-2 last:border-0"
                  >
                    <span className="text-ink text-sm">{n.name}</span>
                    <span className="pill !py-0.5">{n.kind}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Status banner */}
      <section className="section-tight border-y border-slate-200 bg-slate-50">
        <div className="container-x">
          <div className="border border-slate-200 bg-white p-7 lg:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
              <div className="shrink-0">
                <div className="pill-gold !px-4 !py-1.5 !text-base">{project.status}</div>
              </div>
              <div>
                <div className="tracking-wide-3 mb-1 text-[11px] text-slate-500 uppercase">
                  Development Status
                </div>
                <p className="max-w-3xl text-sm leading-relaxed text-slate-700">
                  Project status shown above is as published by the developer and curated by Apex
                  Holdings. For final status confirmation, please refer to the developer of record.
                  Pricing on this page is indicative and may vary by unit, view and availability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment plan */}
      <section className="section bg-white">
        <div className="container-x">
          <div className="mb-10 max-w-2xl">
            <span className="eyebrow mb-3 block">PAYMENT PLAN</span>
            <h2 className="font-display text-ink text-3xl leading-tight lg:text-4xl">
              A clear, structured payment schedule
            </h2>
            <p className="mt-3 text-sm text-slate-600">{project.priceNote}</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {project.paymentPlan.map((p, i) => (
              <div key={i} className="border border-slate-200 bg-slate-50 p-6">
                <div className="tracking-wide-3 mb-2 text-[11px] text-slate-500 uppercase">
                  Milestone {String(i + 1).padStart(2, "0")}
                </div>
                <div className="font-display text-ink mb-1 text-xl">{p.milestone}</div>
                <div className="font-display text-gold-500 text-3xl">{p.percent}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section-tight border-y border-slate-200 bg-slate-50/60">
        <div className="container-x">
          <div className="mx-auto max-w-3xl">
            <span className="eyebrow mb-3 block text-center">FAQs</span>
            <h2 className="font-display text-ink mb-10 text-center text-3xl leading-tight lg:text-4xl">
              Questions buyers most often ask
            </h2>
            <div className="space-y-3">
              {projectFaqs.map((f, i) => (
                <div key={i} className="border border-slate-200 bg-white transition-colors">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between p-5 text-left"
                  >
                    <span className="text-ink font-medium">{f.q}</span>
                    <ChevronDown
                      className={`text-gold-500 h-5 w-5 transition-transform ${
                        openFaq === i ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openFaq === i && (
                    <div className="border-t border-slate-100 px-5 pt-4 pb-5 text-sm leading-relaxed text-slate-600">
                      {f.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Downloads */}
      <section className="section bg-white">
        <div className="container-x">
          <div className="mb-10 max-w-2xl">
            <span className="eyebrow mb-3 block">DOWNLOADS</span>
            <h2 className="font-display text-ink text-3xl leading-tight lg:text-4xl">
              Project documentation
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            <DownloadCard
              label="Project Brochure"
              desc="Full colour PDF with unit plans and specifications."
              icon={FileText}
            />
            <DownloadCard
              label="Floor Plans"
              desc="Available unit configurations and built-up areas."
              icon={Building2}
            />
            <DownloadCard
              label="Payment Plan"
              desc="Milestone-based payment schedule and terms."
              icon={Download}
            />
          </div>
          <p className="mt-5 text-xs text-slate-500">
            Documents are shared only with qualified enquiries. Please use the form below or contact
            us on WhatsApp.
          </p>
        </div>
      </section>

      {/* Related */}
      <section className="section-tight border-t border-slate-200 bg-slate-50">
        <div className="container-x">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow mb-2 block">EXPLORE FURTHER</span>
              <h2 className="font-display text-ink text-2xl lg:text-3xl">
                More projects you may consider
              </h2>
            </div>
            <Link href="/projects" className="btn-ghost">
              All Projects
            </Link>
          </div>
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                className="group hover:border-ink block overflow-hidden border border-slate-200 bg-white transition-colors"
              >
                <div className="relative aspect-[5/4] overflow-hidden">
                  <Image
                    src={p.cover}
                    alt={p.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                </div>
                <div className="p-6">
                  <div className="mb-1 text-xs text-slate-500">
                    {p.city} · {p.area}
                  </div>
                  <h3 className="font-display text-ink group-hover:text-gold-600 text-xl transition-colors">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">{p.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        variant="dark"
        eyebrow={`INTERESTED IN ${project.name.toUpperCase()}?`}
        title="Request project details or schedule a visit today."
        description="Our team will respond within one working day with the brochure, payment plan, and full specifications."
        primary={{ label: "Request Project Details", href: `/contact?project=${project.slug}` }}
        secondary={{ label: "Schedule a Visit", href: `/site-visit?project=${project.slug}` }}
      />

      {/* Lightbox */}
      {lightboxImg && (
        <div
          className="bg-ink/95 fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxIdx(null)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIdx((i) =>
                i === null ? null : (i - 1 + project.gallery.length) % project.gallery.length,
              );
            }}
            className="absolute top-1/2 left-4 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center bg-white/10 text-white hover:bg-white/20"
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIdx(null);
            }}
            className="absolute top-4 right-4 inline-flex h-12 w-12 items-center justify-center bg-white/10 text-white hover:bg-white/20"
            aria-label="Close lightbox"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIdx((i) => (i === null ? null : (i + 1) % project.gallery.length));
            }}
            className="absolute top-1/2 right-4 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center bg-white/10 text-white hover:bg-white/20"
            aria-label="Next image"
          >
            ›
          </button>
          <div
            className="relative h-full max-h-[85vh] w-full max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightboxImg}
              alt="Gallery preview"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        </div>
      )}
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="tracking-wide-3 mb-1 text-[10px] text-slate-400 uppercase">{label}</div>
      <div className="truncate text-sm font-medium text-white">{value}</div>
    </div>
  );
}

function SidebarRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="tracking-wide-2 w-24 shrink-0 pt-0.5 text-[11px] text-slate-500 uppercase">
        {label}
      </span>
      <span className="text-ink flex-1 text-sm">{value}</span>
    </div>
  );
}

function DownloadCard({
  label,
  desc,
  icon: Icon,
}: {
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="border border-slate-200 bg-slate-50 p-6">
      <Icon className="text-gold-500 mb-4 h-6 w-6" />
      <h3 className="font-display text-ink mb-2 text-lg">{label}</h3>
      <p className="mb-4 text-sm text-slate-600">{desc}</p>
      <Link
        href="/contact"
        className="tracking-wide-2 text-ink hover:text-gold-600 inline-flex items-center gap-1 text-xs uppercase"
      >
        Request via Contact <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
