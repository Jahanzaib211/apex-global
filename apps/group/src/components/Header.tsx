"use client";

import { Menu, X, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const companies = [
  ["Apex Global Tech Solution", "/companies/tech-solution"],
  ["Apex Outsourcing", "/companies/outsourcing"],
  ["Apex Tours & Travels", "/companies/tours-travels"],
  ["Apex Holdings", "/companies/holdings"],
] as const;
const links = [
  ["About", "/about"],
  ["Financial Consultancy", "/consultancy"],
  ["Leadership", "/leadership"],
  ["News & Insights", "/insights"],
  ["Careers", "/careers"],
  ["Contact", "/contact"],
  ["Partnerships", "/partnerships"],
] as const;

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openCompanies, setOpenCompanies] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all ${
        scrolled || open ? "bg-navy shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="Apex Group of Companies home">
          <Image
            src="/logo.png"
            alt="Apex Group of Companies"
            width={132}
            height={52}
            className="h-12 w-auto object-contain"
          />
        </Link>
        <nav className="hidden items-center gap-5 lg:flex">
          <Link href="/" className="hover:text-gold text-sm text-white">
            Home
          </Link>
          <div
            className="group relative"
            onMouseEnter={() => setOpenCompanies(true)}
            onMouseLeave={() => setOpenCompanies(false)}
          >
            <Link
              href="/companies"
              className="hover:text-gold inline-flex items-center gap-1 text-sm text-white"
              aria-haspopup="true"
              aria-expanded={openCompanies}
            >
              Our Companies <ChevronDown size={14} />
            </Link>
            <div
              className={`bg-navy invisible absolute top-full left-0 mt-4 w-72 rounded-sm border border-white/10 p-3 opacity-0 shadow-xl transition ${
                openCompanies ? "visible opacity-100" : ""
              }`}
              role="menu"
            >
              {companies.map(([name, href]) => (
                <Link
                  key={name}
                  href={href}
                  className="hover:text-gold block px-3 py-2 text-sm text-white/80 hover:bg-white/5"
                  role="menuitem"
                >
                  {name}
                </Link>
              ))}
            </div>
          </div>
          {links.map(([label, href]) => (
            <Link key={label} href={href} className="hover:text-gold text-sm text-white">
              {label}
            </Link>
          ))}
        </nav>
        <Link
          href="/contact"
          className="bg-gold text-navy hidden rounded-sm px-4 py-2.5 text-sm font-semibold transition hover:bg-white md:block"
        >
          Talk to Apex
        </Link>
        <button
          className="text-white lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="bg-navy h-[calc(100vh-5rem)] overflow-y-auto px-6 pt-6 pb-10 lg:hidden">
          <div className="flex flex-col gap-1">
            {([["Home", "/"], ...links, ["Our Companies", "/companies"]] as const).map(
              ([label, href]) => (
                <Link
                  onClick={() => setOpen(false)}
                  key={label}
                  href={href}
                  className="font-editorial border-b border-white/10 py-4 text-2xl text-white"
                >
                  {label}
                </Link>
              ),
            )}
            <Link
              onClick={() => setOpen(false)}
              href="/contact"
              className="bg-gold text-navy mt-6 px-5 py-3 text-center font-semibold"
            >
              Talk to Apex
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
