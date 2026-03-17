import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[560px] sm:min-h-[620px]">

          {/* Left — text */}
          <div className="flex flex-col justify-center py-16 lg:py-24 lg:pr-16">

            <div className="flex items-center gap-2 mb-6">
              <div className="h-px w-8 bg-[#C9A84C]" />
              <span className="text-xs tracking-[0.25em] text-[#C9A84C] font-medium uppercase">
                Parfums authentiques — Algérie
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-bold text-[#111111] leading-[1.1] mb-6">
              Parfum en Algérie
              <br />
              <span className="relative inline-block">
                Original, livré dans
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#C9A84C]" />
              </span>
              <br />
              les 58 wilayas
            </h1>

            <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-lg">
              Dior, Chanel, Lattafa, Al Haramain. Parfums 100% originaux, prix en dinar algérien,
              paiement à la réception partout en Algérie.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/parfums-homme"
                className="inline-flex items-center gap-2 bg-[#111111] hover:bg-[#333] text-white font-medium px-7 py-3.5 rounded-lg transition-colors group text-sm"
              >
                Parfums Homme
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/parfums-femme"
                className="inline-flex items-center gap-2 border border-gray-200 hover:border-[#C9A84C] text-gray-700 hover:text-[#C9A84C] font-medium px-7 py-3.5 rounded-lg transition-colors text-sm"
              >
                Parfums Femme
              </Link>
              <Link
                href="/parfums-orientaux"
                className="inline-flex items-center gap-2 border border-gray-200 hover:border-[#C9A84C] text-gray-700 hover:text-[#C9A84C] font-medium px-7 py-3.5 rounded-lg transition-colors text-sm"
              >
                Orientaux
              </Link>
            </div>

            {/* Trust strip */}
            <div className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-gray-100">
              {[
                "Yalidine 58 wilayas",
                "Paiement à la réception",
                "100% Original",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
                  <span className="text-xs font-medium text-gray-600">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — editorial image */}
          <div className="hidden lg:block relative h-full min-h-[560px] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1630512873379-e8c6cce16158?auto=format&fit=crop&w=900&q=85"
              alt="Parfums originaux en Algérie — Maison Numidia"
              fill
              className="object-cover"
              priority
              sizes="50vw"
            />
            {/* Légère fade côté gauche */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/60 to-transparent" />
            {/* Badge bas droite */}
            <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-sm px-5 py-3 border border-gray-100">
              <p className="text-xs text-gray-400 font-medium tracking-widest uppercase">Maison Numidia</p>
              <p className="text-sm font-bold text-[#111111] mt-0.5">Parfumerie en ligne Algérie</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
