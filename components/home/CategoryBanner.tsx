import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    title: "Parfums Homme",
    sub: "274 parfums",
    desc: "Dior · Chanel · Paco Rabanne · Armani",
    href: "/parfums-homme",
    image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&w=800&q=80",
    accent: "#C9A84C",
  },
  {
    title: "Parfums Femme",
    sub: "400 parfums",
    desc: "Chanel · YSL · Lancôme · Dior",
    href: "/parfums-femme",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
    accent: "#AC9270",
  },
  {
    title: "Parfums Orientaux",
    sub: "66 parfums",
    desc: "Lattafa · Al Haramain · Rasasi · Ajmal",
    href: "/parfums-orientaux",
    image: "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?auto=format&fit=crop&w=800&q=80",
    accent: "#C9A84C",
  },
];

export default function CategoryBanner() {
  return (
    <section className="py-16 sm:py-20">
      <div className="text-center mb-10 px-6">
        <span className="text-xs font-medium text-[#AC9270] tracking-[1.5px] uppercase">
          Notre catalogue
        </span>
        <h2
          className="text-[clamp(28px,3vw,38px)] text-[#535359] mt-3"
          style={{ fontFamily: "var(--font-libre-bodoni), Georgia, serif", fontWeight: 400 }}
        >
          Explorer par catégorie
        </h2>
        <p className="mt-3 text-[#8A8A90] max-w-md mx-auto text-sm leading-relaxed">
          Trois univers olfactifs, des centaines de parfums originaux livrés partout en Algérie.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-6 lg:px-10 max-w-[1440px] mx-auto">
        {categories.map((cat) => (
          <Link
            key={cat.href}
            href={cat.href}
            className="group relative overflow-hidden flex flex-col justify-end min-h-[320px] sm:min-h-[380px] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            {/* Background image */}
            <Image
              src={cat.image}
              alt={cat.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 33vw"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10 group-hover:from-black/60 transition-colors duration-300" />

            {/* Content */}
            <div className="relative z-10 p-7">
              <div
                className="h-px w-10 mb-4 transition-all duration-300 group-hover:w-16"
                style={{ backgroundColor: cat.accent }}
              />
              <h3
                className="text-xl text-white mb-1"
                style={{ fontFamily: "var(--font-libre-bodoni), Georgia, serif", fontWeight: 400 }}
              >
                {cat.title}
              </h3>
              <p className="text-white/50 text-sm mb-1">{cat.sub}</p>
              <p className="text-white/40 text-xs">{cat.desc}</p>

              <div
                className="flex items-center gap-2 mt-4 text-sm font-medium"
                style={{ color: cat.accent }}
              >
                Voir la sélection
                <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>

            {/* Accent line bottom */}
            <div
              className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500"
              style={{ backgroundColor: cat.accent }}
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
