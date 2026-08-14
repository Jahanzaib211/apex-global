import Link from "next/link";

export function SiteLogo({
  variant = "dark",
  className = "",
}: {
  variant?: "dark" | "light";
  className?: string;
}) {
  // Light-on-dark or dark-on-light variants
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-3 ${className}`}
      aria-label="Apex Holdings Home"
    >
      <span className="relative h-9 w-9 overflow-hidden sm:h-10 sm:w-10">
        <span
          className={`absolute inset-0 ${variant === "dark" ? "bg-white" : "bg-ink"}`}
          aria-hidden
        />
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 m-auto h-9 w-9 sm:h-10 sm:w-10"
          aria-hidden
        >
          {/* Stylised A mark — Apex Holdings */}
          <polygon points="50,8 90,90 67,90 58,72 42,72 33,90 10,90" fill="#E8B02A" />
          <polygon points="55,55 70,90 80,90 60,40" fill="#0B1431" />
          <circle cx="78" cy="50" r="3" fill="#6B7480" />
        </svg>
      </span>
      <span className="leading-none">
        <span
          className={`font-display tracking-wide-2 block text-[17px] font-bold sm:text-[19px] ${
            variant === "dark" ? "text-ink" : "text-white"
          }`}
        >
          APEX HOLDINGS
        </span>
        <span
          className={`tracking-wide-3 mt-0.5 block text-[9px] uppercase sm:text-[10px] ${
            variant === "dark" ? "text-slate-500" : "text-white/60"
          }`}
        >
          Marketing & Developments
        </span>
      </span>
    </Link>
  );
}
