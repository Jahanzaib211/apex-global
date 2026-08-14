import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";
import { BRAND } from "@/lib/brand";

export default function NotFound() {
  return (
    <section className="bg-navy-grad grain relative overflow-hidden text-white">
      <div className="container-narrow section text-center">
        <Compass size={56} className="text-gold-300 mx-auto mb-6" />
        <div className="eyebrow !text-gold-300 mb-3">Error 404</div>
        <h1 className="heading-xl mb-4 !text-white">This route isn&apos;t on our map.</h1>
        <p className="mx-auto max-w-xl text-lg text-white/75">
          The page you&apos;re looking for might have moved or doesn&apos;t exist. Let us help you
          get back on track.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary">
            <ArrowLeft size={16} /> Back to home
          </Link>
          <Link href="/contact" className="btn-secondary">
            Contact {BRAND.short}
          </Link>
        </div>
      </div>
    </section>
  );
}
