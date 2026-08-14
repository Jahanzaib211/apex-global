"use client";

import { useState } from "react";
import { EnquiryModal } from "./enquiry-modal";
import { ArrowRight } from "lucide-react";

interface Props {
  mode?: "car" | "pilgrimage" | "group" | "general";
  presetService?: string;
  presetCountry?: "Pakistan" | "Saudi Arabia";
  label?: string;
  variant?: "primary" | "secondary" | "whatsapp";
  className?: string;
  fullWidth?: boolean;
  /**
   * Open the enquiry modal on mount, with the supplied presets. Used by pages
   * that need to surface the modal without forcing the visitor to find and
   * click a button — the docx-mandated `Saudia Car Rental` behaviour.
   */
  openOnMount?: boolean;
}

export function EnquireButton({
  mode = "general",
  presetService,
  presetCountry,
  label = "Enquire Now",
  variant = "primary",
  className = "",
  fullWidth,
  openOnMount = false,
}: Props) {
  const [open, setOpen] = useState(openOnMount);
  const cls =
    variant === "primary" ? "btn-primary" : variant === "whatsapp" ? "btn-whatsapp" : "btn-ghost";
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`${cls} ${fullWidth ? "w-full" : ""} ${className}`}
      >
        {label}
        <ArrowRight size={16} />
      </button>
      <EnquiryModal
        open={open}
        onClose={() => setOpen(false)}
        mode={mode}
        presetService={presetService}
        presetCountry={presetCountry}
      />
    </>
  );
}
