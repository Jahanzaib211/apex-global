import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowUpRight, Building2 } from "lucide-react";
import type { Project } from "@/data/projects";

export function ProjectCard({
  project,
  size = "md",
}: {
  project: Project;
  size?: "sm" | "md" | "lg";
}) {
  const sizes: Record<string, string> = {
    sm: "aspect-[4/3]",
    md: "aspect-[5/4]",
    lg: "aspect-[16/10]",
  };

  return (
    <Link href={`/projects/${project.slug}`} className="group card-base block overflow-hidden">
      <div className={`relative ${sizes[size]} overflow-hidden`}>
        <Image
          src={project.cover}
          alt={project.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          unoptimized
        />
        <div
          className="from-ink/70 via-ink/10 absolute inset-0 bg-gradient-to-t to-transparent"
          aria-hidden
        />
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="pill-gold">{project.status}</span>
          <span className="pill !text-ink !border-white/30 !bg-white/90">{project.category}</span>
        </div>
        <div className="text-ink absolute top-4 right-4 inline-flex h-9 w-9 translate-y-1 items-center justify-center rounded-full bg-white/95 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>
      <div className="p-6 lg:p-7">
        <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
          <MapPin className="text-gold-500 h-3.5 w-3.5" />
          {project.city} · {project.area}
        </div>
        <h3 className="font-display text-ink group-hover:text-gold-600 text-xl font-semibold transition-colors lg:text-2xl">
          {project.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-slate-600">{project.tagline}</p>
        <div className="mt-5 flex items-end justify-between gap-3 border-t border-slate-100 pt-5">
          <div>
            <div className="tracking-wide-2 mb-1 text-[11px] text-slate-500 uppercase">
              {project.role}
            </div>
            <div className="text-ink text-sm font-medium">{project.price}</div>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs text-slate-500">
            <Building2 className="h-3.5 w-3.5" /> {project.units}
          </div>
        </div>
      </div>
    </Link>
  );
}
