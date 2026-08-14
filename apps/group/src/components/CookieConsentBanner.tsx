"use client";

import { useEffect, useState } from "react";

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(localStorage.getItem("apex-cookie-consent") !== "true");
  }, []);
  const choose = (value: string) => {
    localStorage.setItem("apex-cookie-consent", value);
    setVisible(false);
  };
  if (!visible) return null;
  return (
    <aside
      className="bg-navy fixed inset-x-4 bottom-4 z-[70] mx-auto max-w-3xl border border-white/15 p-5 text-white shadow-2xl md:inset-x-auto md:flex md:items-center md:gap-6"
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="flex-1">
        <p className="text-gold text-sm font-semibold">Your privacy matters</p>
        <p className="mt-1 text-xs leading-5 text-white/70">
          We use essential cookies to keep this site reliable. With your permission, we may use
          optional analytics to understand site usage.
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 md:mt-0">
        <button
          onClick={() => choose("all")}
          className="bg-gold text-navy px-3 py-2 text-xs font-semibold hover:bg-white"
        >
          Accept All
        </button>
        <button
          onClick={() => choose("essential")}
          className="hover:border-gold hover:text-gold border border-white/25 px-3 py-2 text-xs text-white/80"
        >
          Essential Only
        </button>
        <button
          onClick={() => choose("preferences")}
          className="px-3 py-2 text-xs text-white/60 underline underline-offset-4 hover:text-white"
        >
          Manage Preferences
        </button>
      </div>
    </aside>
  );
}
