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
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-[#111111] text-white text-xs text-center py-2 tracking-wide">
        Livraison Yalidine dans les 58 wilayas &nbsp;·&nbsp; Paiement à la livraison (COD)
      </div>

      <header className={`sticky top-0 z-50 bg-white transition-shadow duration-200 ${scrolled ? "shadow-sm" : ""}`}>
        <div className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16">

              {/* Logo */}
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="Maison Numidia — Parfums originaux en Algérie"
                  width={130}
                  height={52}
                  className="object-contain brightness-0"
                  priority
                />
              </Link>

              {/* Desktop nav — centered */}
              <nav className="hidden lg:flex items-center gap-0">
                {nav.map((item) => (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => item.sub.length > 0 && setOpenDropdown(item.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center gap-1 px-5 py-2 text-sm font-medium text-gray-700 hover:text-[#111111] transition-colors"
                    >
                      {item.label}
                      {item.sub.length > 0 && (
                        <ChevronDown size={13} className="text-gray-400" />
                      )}
                    </Link>

                    {item.sub.length > 0 && (
                      <div className={`absolute top-full left-0 pt-2 w-52 z-50 transition-all duration-150 ${openDropdown === item.label ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
                        <div className="bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden">
                          {item.sub.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:text-[#C9A84C] hover:bg-[#fdf9f0] transition-colors"
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

              {/* Right side */}
              <div className="hidden lg:flex items-center gap-3">
                <a
                  href="tel:0699418569"
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#C9A84C] transition-colors"
                >
                  <Phone size={14} />
                  06 99 41 85 69
                </a>
                <CartButton />
                <Link
                  href="/commander"
                  className="bg-[#111111] hover:bg-[#333] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                >
                  Commander
                </Link>
              </div>

              {/* Mobile: cart + hamburger */}
              <div className="lg:hidden flex items-center gap-1">
                <CartButton />
                <button
                  className="p-2 text-gray-700"
                  onClick={() => setMobileOpen(!mobileOpen)}
                  aria-label="Menu"
                >
                  {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-b border-gray-100 bg-white">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block py-3 text-sm font-medium text-gray-700 border-b border-gray-50 hover:text-[#C9A84C] transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 flex flex-col gap-2">
                <a
                  href="tel:0699418569"
                  className="flex items-center justify-center gap-2 w-full py-3 border border-[#C9A84C] text-[#C9A84C] rounded-lg text-sm font-medium"
                >
                  <Phone size={14} />
                  06 99 41 85 69
                </a>
                <Link
                  href="/commander"
                  className="block text-center w-full py-3 bg-[#111111] text-white rounded-lg text-sm font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  Commander
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
