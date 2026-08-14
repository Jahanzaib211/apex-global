import Link from "next/link";
import { Slot } from "@radix-ui/react-slot";

type Props = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "outline-gold";
  size?: "sm" | "md" | "lg";
  href?: string;
  asChild?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
};
export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  asChild = false,
  className = "",
  type = "button",
}: Props) {
  const styles = {
    primary: "bg-gold text-navy hover:bg-white",
    secondary: "bg-navy text-white border border-gold hover:bg-gold hover:text-navy",
    ghost:
      "bg-transparent text-navy underline decoration-gold decoration-2 underline-offset-8 hover:text-gold",
    "outline-gold": "border border-gold bg-transparent text-gold hover:bg-gold hover:text-navy",
  };
  const sizes = { sm: "px-4 py-2 text-xs", md: "px-5 py-3 text-sm", lg: "px-6 py-4 text-sm" };
  const cls = `inline-flex items-center justify-center font-semibold transition ${styles[variant]} ${sizes[size]} ${className}`;
  if (asChild) return <Slot className={cls}>{children}</Slot>;
  return href ? (
    <Link href={href} className={cls}>
      {children}
    </Link>
  ) : (
    <button type={type} className={cls}>
      {children}
    </button>
  );
}
