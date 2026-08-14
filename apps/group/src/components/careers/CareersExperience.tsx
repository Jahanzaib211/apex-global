"use client";

import { useState } from "react";
import CareersFilter, { type Vacancy } from "./CareersFilter";
import CareersApplication from "./CareersApplication";

export default function CareersExperience() {
  const [selected, setSelected] = useState<Vacancy | null>(null);
  return (
    <>
      <CareersFilter
        onApply={(v) => {
          setSelected(v);
          setTimeout(() => {
            const el = document.getElementById("careers-application");
            el?.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 50);
        }}
      />
      <CareersApplication selectedVacancy={selected} clearSelected={() => setSelected(null)} />
    </>
  );
}
