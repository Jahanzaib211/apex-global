import Link from "next/link";
import Container from "@/components/Container";
import Button from "@/components/Button";
export default function NotFound() {
  return (
    <main className="bg-navy relative flex min-h-[70vh] items-center overflow-hidden py-32 text-white">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <Container className="relative">
        <p className="font-display text-gold text-[clamp(8rem,25vw,20rem)] leading-none">404</p>
        <h1 className="font-display mt-3 text-4xl md:text-6xl">This page has moved.</h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-white/65">
          The page you're looking for has moved or no longer exists.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Button href="/">Back to Home</Button>
          <Button href="/contact" variant="outline-gold">
            Contact Apex
          </Button>
        </div>
        <Link
          href="/"
          className="hover:text-gold mt-12 inline-block text-xs tracking-[.2em] text-white/40 uppercase"
        >
          Apex Group of Companies
        </Link>
      </Container>
    </main>
  );
}
