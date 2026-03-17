import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    title: "Parfums Homme",
    sub: "Dior · Chanel · Lattafa · Armani",
    desc: "Fragrances masculines pour toutes les occasions",
    href: "/parfums-homme",
    image: "https://images.unsplash.com/photo-1767187861728-942f561b7103?auto=format&fit=crop&w=800&q=80",
    accent: "#C9A84C",
  },
  {
    title: "Parfums Femme",
    sub: "Chanel · YSL · Lancôme · Dior",
    desc: "Élégance féminine, de la fleur à l'accord boisé",
    href: "/parfums-femme",
    image: "https://images.unsplash.com/photo-1770301410072-f6ef6dad65b2?auto=format&fit=crop&w=800&q=80",
    accent: "#e8c98a",
  },
  {
    title: "Parfums Orientaux",
    sub: "Lattafa · Al Haramain · Franck Olivier",
    desc: "Oud, ambre et musc — la richesse de l'Orient",
    href: "/parfums-orientaux",
    image: "https://images.unsplash.com/photo-1732828912093-a776288edfed?auto=format&fit=crop&w=800&q=80",
    accent: "#C9A84C",
  },
];

export default function CategoryBanner() {
  return (
    <section className="bg-white py-16 sm:py-20 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs tracking-[0.2em] text-[#C9A84C] uppercase font-medium mb-2">
              Notre catalogue
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111111]">
              Explorez par catégorie
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="group relative overflow-hidden flex flex-col justify-between min-h-[260px] sm:min-h-[300px] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{
                backgroundImage: `url('${cat.image}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Overlay sombre */}
              <div className="absolute inset-0 bg-black/55 group-hover:bg-black/45 transition-colors duration-300" />

              {/* Contenu */}
              <div className="relative z-10 p-7">
                <div
                  className="h-px w-10 mb-5 transition-all duration-300 group-hover:w-16"
                  style={{ backgroundColor: cat.accent }}
                />
                <h3 className="text-xl font-bold text-white mb-1.5">
                  {cat.title}
                </h3>
                <p className="text-white/50 text-sm">{cat.sub}</p>
                <p className="text-white/60 text-xs mt-2">{cat.desc}</p>
              </div>

              <div
                className="relative z-10 px-7 pb-7 flex items-center gap-2 text-sm font-semibold"
                style={{ color: cat.accent }}
              >
                Voir la sélection
                <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
              </div>

              {/* Ligne accent en bas au hover */}
              <div
                className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500"
                style={{ backgroundColor: cat.accent }}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
