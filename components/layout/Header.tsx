"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import CartButton from "@/components/cart/CartButton";

const nav = [
  {
    label: "Homme",
    href: "/parfums-homme",
    sub: [
      { label: "Tous les parfums homme", href: "/parfums-homme" },
      { label: "Dior Homme", href: "/parfums-homme/dior" },
      { label: "Chanel Homme", href: "/parfums-homme/chanel" },
      { label: "Paco Rabanne Homme", href: "/parfums-homme/paco-rabanne" },
      { label: "Versace Homme", href: "/parfums-homme/versace" },
      { label: "Armani Homme", href: "/parfums-homme/armani" },
      { label: "Hugo Boss Homme", href: "/parfums-homme/hugo-boss" },
      { label: "Lattafa Homme", href: "/parfums-homme/lattafa" },
    ],
  },
  {
    label: "Femme",
    href: "/parfums-femme",
    sub: [
      { label: "Tous les parfums femme", href: "/parfums-femme" },
      { label: "Chanel Femme", href: "/parfums-femme/chanel" },
      { label: "Dior Femme", href: "/parfums-femme/dior" },
      { label: "YSL Femme", href: "/parfums-femme/ysl" },
      { label: "Lancôme Femme", href: "/parfums-femme/lancome" },
      { label: "Narciso Rodriguez", href: "/parfums-femme/narciso-rodriguez" },
      { label: "Carolina Herrera", href: "/parfums-femme/carolina-herrera" },
      { label: "Valentino Femme", href: "/parfums-femme/valentino" },
    ],
  },
  {
    label: "Orientaux",
    href: "/parfums-orientaux",
    sub: [
      { label: "Tous les orientaux", href: "/parfums-orientaux" },
      { label: "Lattafa", href: "/parfums-orientaux/lattafa" },
      { label: "Al Haramain", href: "/parfums-orientaux/al-haramain" },
      { label: "Rasasi", href: "/parfums-orientaux/rasasi" },
      { label: "Ajmal", href: "/parfums-orientaux/ajmal" },
      { label: "Afnan", href: "/parfums-orientaux/afnan" },
    ],
  },
  { label: "Marques", href: "/marques", sub: [] },
  { label: "Blog", href: "/blog", sub: [] },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      {/* Top announcement bar — MFK style */}
      <div className="bg-[#53545C] text-white text-center py-2.5">
        <p className="text-xs font-medium tracking-wide">
          Livraison Yalidine 58 wilayas &nbsp;·&nbsp; Paiement à la réception (COD) &nbsp;·&nbsp; 100% Original
        </p>
      </div>

      <header className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? "shadow-[0_1px_0_0_#e5e5e5]" : ""}`}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-[72px] lg:h-[88px]">

            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Maison Numidia — Parfums originaux en Algérie"
                width={120}
                height={48}
                className="object-contain brightness-0"
                priority
              />
            </Link>

            {/* Desktop nav — centered, MFK style */}
            <nav className="hidden lg:flex items-center gap-1">
              {nav.map((item) => (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => item.sub.length > 0 && setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className="nav-link-mfk flex items-center gap-1 px-4 py-2"
                  >
                    {item.label}
                    {item.sub.length > 0 && (
                      <ChevronDown size={11} className="opacity-40" />
                    )}
                  </Link>

                  {item.sub.length > 0 && (
                    <div className={`absolute top-full left-0 pt-2 w-56 z-50 transition-all duration-200 ${openDropdown === item.label ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
                      <div className="bg-white border border-[#e5e5e5] shadow-lg overflow-hidden">
                        {item.sub.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className="flex items-center px-5 py-3 text-[13px] text-[#535359] hover:text-[#AC9270] hover:bg-[#faf8f5] transition-colors"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right side — MFK style */}
            <div className="hidden lg:flex items-center gap-5">
              <a
                href="tel:0699418569"
                className="flex items-center gap-1.5 text-xs tracking-wide text-[#535359] hover:opacity-60 transition-opacity"
              >
                <Phone size={13} />
                06 99 41 85 69
              </a>
              <CartButton />
              <Link
                href="/commander"
                className="text-xs font-medium tracking-wider uppercase text-[#535359] border border-[#535359] px-6 py-2.5 hover:bg-[#535359] hover:text-white transition-colors duration-300"
              >
                Commander
              </Link>
            </div>

            {/* Mobile: cart + hamburger */}
            <div className="lg:hidden flex items-center gap-2">
              <CartButton />
              <button
                className="p-2 text-[#535359]"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu — CSS visibility (NEVER use {open && ...} — Google mobile-first won't see the links) */}
        <div className={`lg:hidden border-t border-[#e5e5e5] bg-white overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-[500px] opacity-100 visible" : "max-h-0 opacity-0 invisible"}`}>
          <div className="max-w-[1440px] mx-auto px-6 py-6 space-y-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-3 text-xs font-medium uppercase tracking-wider text-[#535359] border-b border-[#f0f0f0] hover:text-[#AC9270] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-6 flex flex-col gap-3">
              <a
                href="tel:0699418569"
                className="flex items-center justify-center gap-2 w-full py-3 border border-[#535359] text-[#535359] text-xs font-medium uppercase tracking-wider"
              >
                <Phone size={13} />
                06 99 41 85 69
              </a>
              <Link
                href="/commander"
                className="block text-center w-full py-3 bg-[#535359] text-white text-xs font-medium uppercase tracking-wider"
                onClick={() => setMobileOpen(false)}
              >
                Commander
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
