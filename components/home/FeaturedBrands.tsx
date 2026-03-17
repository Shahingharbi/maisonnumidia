import Link from "next/link";

const brands = [
  { name: "Dior", slug: "dior" },
  { name: "Chanel", slug: "chanel" },
  { name: "Yves Saint Laurent", slug: "ysl" },
  { name: "Jean Paul Gaultier", slug: "jean-paul-gaultier" },
  { name: "Paco Rabanne", slug: "paco-rabanne" },
  { name: "Carolina Herrera", slug: "carolina-herrera" },
  { name: "Valentino", slug: "valentino" },
  { name: "Parfums de Marly", slug: "parfums-de-marly" },
  { name: "Armani", slug: "armani" },
  { name: "Kayali", slug: "kayali" },
  { name: "Hugo Boss", slug: "hugo-boss" },
  { name: "Versace", slug: "versace" },
  { name: "Narciso Rodriguez", slug: "narciso-rodriguez" },
  { name: "Lancôme", slug: "lancome" },
  { name: "Lattafa", slug: "lattafa" },
  { name: "Al Haramain", slug: "al-haramain" },
  { name: "Franck Olivier", slug: "franck-olivier" },
];

export default function FeaturedBrands() {
  return (
    <section className="bg-[#FAFAF8] py-16 sm:py-20 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs tracking-[0.2em] text-[#C9A84C] uppercase font-medium mb-2">
              Nos marques
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111111]">
              Les grandes maisons
            </h2>
          </div>
          <Link
            href="/marques"
            className="hidden sm:flex items-center gap-1 text-sm text-gray-400 hover:text-[#C9A84C] transition-colors"
          >
            Toutes les marques
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          {brands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/marques/${brand.slug}`}
              className="group bg-white rounded-xl py-5 px-4 text-center border border-gray-100 hover:border-[#C9A84C]/40 hover:shadow-sm transition-all duration-200"
            >
              <span className="text-sm font-semibold text-gray-700 group-hover:text-[#C9A84C] transition-colors">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-5 text-center sm:hidden">
          <Link href="/marques" className="text-sm text-[#C9A84C]">
            Voir toutes les marques
          </Link>
        </div>
      </div>
    </section>
  );
}
