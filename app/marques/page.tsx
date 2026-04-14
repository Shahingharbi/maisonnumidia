import type { Metadata } from "next";
import Link from "next/link";
import { getAllBrands, getProductsByBrand } from "@/lib/products";
import Breadcrumb from "@/components/layout/Breadcrumb";

export const metadata: Metadata = {
  title: "Toutes les Marques de Parfums en Algérie",
  description:
    "Explorez toutes les marques de parfums disponibles en Algérie chez Maison Numidia : Dior, Chanel, Lattafa, Al Haramain et bien plus. Paiement à la livraison.",
  alternates: { canonical: "https://maisonnumidia.store/marques" },
};

export default function MarquesPage() {
  const brands = getAllBrands();

  return (
    <>
      <div className="bg-white border-b border-gray-100 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#C9A84C] uppercase mb-3">
            Catalogue
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#111111] mb-3">
            Toutes les Marques
          </h1>
          <p className="text-gray-400 max-w-xl text-sm sm:text-base">
            Des grandes maisons françaises aux parfumeurs du Golfe — toutes les marques
            disponibles en Algérie chez Maison Numidia.
          </p>
        </div>
      </div>

      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <Breadcrumb items={[{ label: "Marques" }]} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {brands.map((brand) => {
              const count = getProductsByBrand(brand.slug).length;
              return (
                <Link
                  key={brand.slug}
                  href={`/marques/${brand.slug}`}
                  className="group bg-white rounded-xl p-6 border border-[#E5E5E5] hover:border-[#C9A84C]/40 hover:shadow-md transition-all duration-200 flex flex-col gap-3"
                >
                  <div className="w-12 h-12 rounded-full bg-[#0F0F0F] flex items-center justify-center group-hover:bg-[#C9A84C] transition-colors">
                    <span className="text-lg font-bold text-white group-hover:text-[#0F0F0F] transition-colors">
                      {brand.name[0]}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 group-hover:text-[#C9A84C] transition-colors">
                      {brand.name}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">{brand.origin}</div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {count} parfum{count > 1 ? "s" : ""}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
