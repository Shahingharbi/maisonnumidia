import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="bg-white">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px] lg:min-h-[580px]">

          {/* Left — text */}
          <div className="flex flex-col justify-center py-14 lg:py-20 lg:pr-16">

            <span className="text-xs font-medium tracking-[1.5px] uppercase text-[#AC9270] mb-5">
              Parfums authentiques — Algérie
            </span>

            <h1 className="text-[clamp(32px,4vw,48px)] text-[#535359] leading-[1.15] mb-6" style={{ fontFamily: "var(--font-libre-bodoni), Georgia, serif", fontWeight: 400 }}>
              Parfum Original
              <br />
              en Algérie, livré dans
              <br />
              <em>les 58 wilayas</em>
            </h1>

            <p className="text-[#8A8A90] text-base leading-relaxed mb-8 max-w-md">
              Dior, Chanel, Lattafa, Al Haramain. Parfums 100% originaux, prix en dinar algérien,
              paiement à la réception partout en Algérie.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/parfums-homme"
                className="inline-flex items-center gap-2 bg-[#535359] hover:bg-[#3A3A40] text-white text-xs font-medium uppercase tracking-wider px-7 py-3.5 transition-colors duration-300"
              >
                Parfums Homme
              </Link>
              <Link
                href="/parfums-femme"
                className="inline-flex items-center gap-2 border border-[#535359] text-[#535359] hover:bg-[#535359] hover:text-white text-xs font-medium uppercase tracking-wider px-7 py-3.5 transition-colors duration-300"
              >
                Parfums Femme
              </Link>
              <Link
                href="/parfums-orientaux"
                className="inline-flex items-center gap-2 border border-[#535359] text-[#535359] hover:bg-[#535359] hover:text-white text-xs font-medium uppercase tracking-wider px-7 py-3.5 transition-colors duration-300"
              >
                Orientaux
              </Link>
            </div>

            {/* Trust strip */}
            <div className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-[#e5e5e5]">
              {[
                "Yalidine 58 wilayas",
                "Paiement à la réception",
                "100% Original",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-[#AC9270]" />
                  <span className="text-xs text-[#8A8A90]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — editorial image */}
          <div className="hidden lg:block relative h-full min-h-[500px] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1630512873379-e8c6cce16158?auto=format&fit=crop&w=900&q=85"
              alt="Parfums originaux en Algérie — Maison Numidia"
              fill
              className="object-cover"
              priority
              sizes="50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/50 to-transparent" />
            <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-sm px-5 py-3">
              <p className="text-[10px] tracking-[2px] text-[#AC9270] font-medium uppercase">Maison Numidia</p>
              <p className="text-sm text-[#535359] mt-0.5" style={{ fontFamily: "var(--font-libre-bodoni), Georgia, serif" }}>
                Parfumerie en ligne Algérie
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
