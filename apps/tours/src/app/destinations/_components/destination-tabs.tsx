"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

interface City {
  name: string;
  services: string[];
  href?: string;
  highlight?: string;
}

const PAKISTAN_CITIES: City[] = [
  {
    name: "Lahore",
    services: ["With driver", "Self-drive", "Airport transfer", "Intercity"],
  },
  {
    name: "Karachi",
    services: ["With driver", "Self-drive", "Airport transfer", "Intercity"],
  },
  {
    name: "Islamabad",
    services: ["With driver", "Self-drive", "Airport transfer", "Intercity"],
  },
  {
    name: "Rawalpindi",
    services: ["With driver", "Self-drive", "Airport transfer", "Intercity"],
  },
  {
    name: "Peshawar",
    services: ["With driver", "Self-drive", "Airport transfer", "Intercity"],
  },
  {
    name: "Multan",
    services: ["With driver", "Self-drive", "Airport transfer", "Intercity"],
  },
];

const SAUDI_CITIES: City[] = [
  {
    name: "Makkah",
    services: ["With driver", "Airport transfer", "Intercity", "Ziyarat"],
    href: "/saudi-car-rental/makkah",
  },
  {
    name: "Madinah",
    services: ["With driver", "Airport transfer", "Intercity", "Ziyarat"],
    href: "/saudi-car-rental/madinah",
  },
  {
    name: "Jeddah",
    services: ["With driver", "Airport transfer", "Intercity"],
    href: "/saudi-car-rental/jeddah",
  },
  {
    name: "Riyadh",
    services: ["With driver", "Airport transfer", "Intercity"],
    href: "/saudi-car-rental/riyadh",
  },
];

function CityCard({ city }: { city: City }) {
  const inner = (
    <div className="card flex h-full flex-col p-6 lg:p-7">
      <div className="mb-4 flex items-center gap-3">
        <div className="bg-navy-50 text-navy-600 flex h-10 w-10 items-center justify-center rounded-xl">
          <MapPin size={18} />
        </div>
        <h3 className="font-display text-navy-600 text-xl font-semibold">{city.name}</h3>
      </div>
      <div className="text-ink-300 mb-2 text-xs font-semibold tracking-wider uppercase">
        Available services
      </div>
      <ul className="flex-1 space-y-1.5">
        {city.services.map((s) => (
          <li key={s} className="text-ink-500 flex items-start gap-2 text-sm">
            <span className="text-gold-500 mt-1.5 flex-none">•</span>
            <span>{s}</span>
          </li>
        ))}
      </ul>
      {city.href && (
        <div className="text-gold-500 mt-5 inline-flex items-center gap-1.5 text-sm font-semibold transition-all group-hover:gap-2">
          View city page <ArrowRight size={14} />
        </div>
      )}
    </div>
  );

  if (city.href) {
    return (
      <Link href={city.href} className="group h-full">
        {inner}
      </Link>
    );
  }
  return inner;
}

export function DestinationTabs() {
  const [tab, setTab] = useState<"pakistan" | "saudi">("pakistan");
  const cities = tab === "pakistan" ? PAKISTAN_CITIES : SAUDI_CITIES;

  return (
    <>
      {/* Tab switcher */}
      <div className="mb-10 flex justify-center">
        <div className="border-sand-200 shadow-soft inline-flex rounded-full border bg-white p-1.5">
          <button
            type="button"
            onClick={() => setTab("pakistan")}
            className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all ${
              tab === "pakistan"
                ? "bg-navy-grad shadow-navy text-white"
                : "text-ink-400 hover:text-navy-600"
            }`}
          >
            Pakistan
          </button>
          <button
            type="button"
            onClick={() => setTab("saudi")}
            className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all ${
              tab === "saudi"
                ? "bg-navy-grad shadow-navy text-white"
                : "text-ink-400 hover:text-navy-600"
            }`}
          >
            Saudi Arabia
          </button>
        </div>
      </div>

      {/* City grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cities.map((c) => (
          <CityCard key={c.name} city={c} />
        ))}
      </div>
    </>
  );
}
