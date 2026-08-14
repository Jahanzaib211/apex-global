"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: "How do I get a quote for a trip or vehicle?",
    a: "Use the enquiry form on this page or WhatsApp us with your dates, route, group size, and vehicle preference. Our team will share availability and a written quote.",
  },
  {
    q: "What information should I share for a Hajj or Umrah package?",
    a: "Share your preferred travel dates, number of travelers, passport details status, desired hotel tier, and any specific requirements (rooming, meals, mobility). We will respond with package options.",
  },
  {
    q: "Do you arrange visas for Hajj and Umrah?",
    a: "We support visa processing as part of the package. Visa rules change frequently and final responsibility rests with the relevant authority — our team will guide you on the latest requirements at the time of booking.",
  },
  {
    q: "Can I book intercity travel between Makkah, Madinah, and Jeddah?",
    a: "Yes. Intercity transport between Makkah, Madinah, and Jeddah is one of our most-requested routes. Vehicles are arranged to your group size with luggage capacity in mind.",
  },
  {
    q: "How do I confirm a booking once I receive a quote?",
    a: "Once you approve the quote, our team will share payment instructions and confirmation documents. Final confirmation is issued after payment is received and acknowledged.",
  },
];

export function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-3">
      {FAQS.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} className="card overflow-hidden">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 p-5 text-left lg:p-6"
              aria-expanded={isOpen}
            >
              <span className="font-display text-navy-600 text-base font-semibold md:text-lg">
                {f.q}
              </span>
              <ChevronDown
                size={20}
                className={`text-gold-500 flex-none transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div className="text-ink-400 px-5 pb-5 text-sm leading-relaxed lg:px-6 lg:pb-6">
                {f.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
