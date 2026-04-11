import type { Metadata } from "next";
import Link from "next/link";
import { getAllProducts, getAllBrands, getProductsByCategory } from "@/lib/products";
import { articles } from "@/data/blog";

export const metadata: Metadata = {
  title: "Plan du site",
  description:
    "Plan du site Maison Numidia. Accédez à tous nos parfums homme, femme, orientaux, marques et articles de blog.",
  alternates: { canonical: "https://maisonnumidia.store/plan-du-site" },
};

export default function PlanDuSitePage() {
  const allProducts = getAllProducts();
  const allBrands = getAllBrands();
  const hommeProducts = getProductsByCategory("parfums-homme");
  const femmeProducts = getProductsByCategory("parfums-femme");
  const orientauxProducts = getProductsByCategory("parfums-orientaux");

  const hommeBrands = [...new Set(hommeProducts.map((p) => p.brandSlug))];
  const femmeBrands = [...new Set(femmeProducts.map((p) => p.brandSlug))];
  const orientauxBrands = [...new Set(orientauxProducts.map((p) => p.brandSlug))];

  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-[#111111] mb-2">Plan du site</h1>
        <p className="text-gray-500 mb-10">
          Toutes les pages de Maison Numidia — {allProducts.length} parfums, {allBrands.length} marques, {articles.length} articles.
        </p>

        {/* Pages principales */}
        <section className="mb-12">
          <h2 className="text-lg font-bold text-[#111111] mb-4">Pages principales</h2>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Accueil", href: "/" },
              { label: "Parfums Homme", href: "/parfums-homme" },
              { label: "Parfums Femme", href: "/parfums-femme" },
              { label: "Parfums Orientaux", href: "/parfums-orientaux" },
              { label: "Toutes les Marques", href: "/marques" },
              { label: "Blog", href: "/blog" },
              { label: "Parfum Algérie", href: "/parfum-algerie" },
              { label: "Commander", href: "/commander" },
              { label: "Contact", href: "/contact" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[#C9A84C] hover:text-[#8B6914] border border-gray-200 hover:border-[#C9A84C] px-3 py-1.5 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        {/* Marques */}
        <section className="mb-12">
          <h2 className="text-lg font-bold text-[#111111] mb-4">
            Marques ({allBrands.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            {allBrands.map((brand) => (
              <Link
                key={brand.slug}
                href={`/marques/${brand.slug}`}
                className="text-xs text-gray-600 hover:text-[#C9A84C] border border-gray-100 hover:border-[#C9A84C] px-3 py-1.5 transition-colors"
              >
                {brand.name}
              </Link>
            ))}
          </div>
        </section>

        {/* Brand filters homme */}
        <section className="mb-12">
          <h2 className="text-lg font-bold text-[#111111] mb-4">
            Parfums Homme par marque ({hommeBrands.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            {hommeBrands.map((slug) => {
              const brand = allBrands.find((b) => b.slug === slug);
              return (
                <Link
                  key={slug}
                  href={`/parfums-homme/${slug}`}
                  className="text-xs text-gray-600 hover:text-[#C9A84C] border border-gray-100 hover:border-[#C9A84C] px-3 py-1.5 transition-colors"
                >
                  {brand?.name ?? slug} Homme
                </Link>
              );
            })}
          </div>
        </section>

        {/* Brand filters femme */}
        <section className="mb-12">
          <h2 className="text-lg font-bold text-[#111111] mb-4">
            Parfums Femme par marque ({femmeBrands.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            {femmeBrands.map((slug) => {
              const brand = allBrands.find((b) => b.slug === slug);
              return (
                <Link
                  key={slug}
                  href={`/parfums-femme/${slug}`}
                  className="text-xs text-gray-600 hover:text-[#C9A84C] border border-gray-100 hover:border-[#C9A84C] px-3 py-1.5 transition-colors"
                >
                  {brand?.name ?? slug} Femme
                </Link>
              );
            })}
          </div>
        </section>

        {/* Brand filters orientaux */}
        <section className="mb-12">
          <h2 className="text-lg font-bold text-[#111111] mb-4">
            Parfums Orientaux par marque ({orientauxBrands.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            {orientauxBrands.map((slug) => {
              const brand = allBrands.find((b) => b.slug === slug);
              return (
                <Link
                  key={slug}
                  href={`/parfums-orientaux/${slug}`}
                  className="text-xs text-gray-600 hover:text-[#C9A84C] border border-gray-100 hover:border-[#C9A84C] px-3 py-1.5 transition-colors"
                >
                  {brand?.name ?? slug}
                </Link>
              );
            })}
          </div>
        </section>

        {/* Blog */}
        <section className="mb-12">
          <h2 className="text-lg font-bold text-[#111111] mb-4">
            Articles de blog ({articles.length})
          </h2>
          <ul className="space-y-2">
            {articles.map((article) => (
              <li key={article.slug}>
                <Link
                  href={`/blog/${article.slug}`}
                  className="text-sm text-[#C9A84C] hover:text-[#8B6914] hover:underline"
                >
                  {article.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Tous les produits homme */}
        <section className="mb-12">
          <h2 className="text-lg font-bold text-[#111111] mb-4">
            Tous les parfums homme ({hommeProducts.length})
          </h2>
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-4">
            {hommeProducts.map((p) => (
              <div key={p.slug} className="break-inside-avoid mb-1">
                <Link
                  href={`/parfums/${p.slug}`}
                  className="text-xs text-gray-600 hover:text-[#C9A84C] transition-colors"
                >
                  {p.brand} {p.name}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Tous les produits femme */}
        <section className="mb-12">
          <h2 className="text-lg font-bold text-[#111111] mb-4">
            Tous les parfums femme ({femmeProducts.length})
          </h2>
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-4">
            {femmeProducts.map((p) => (
              <div key={p.slug} className="break-inside-avoid mb-1">
                <Link
                  href={`/parfums/${p.slug}`}
                  className="text-xs text-gray-600 hover:text-[#C9A84C] transition-colors"
                >
                  {p.brand} {p.name}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Tous les produits orientaux */}
        <section className="mb-12">
          <h2 className="text-lg font-bold text-[#111111] mb-4">
            Tous les parfums orientaux ({orientauxProducts.length})
          </h2>
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-4">
            {orientauxProducts.map((p) => (
              <div key={p.slug} className="break-inside-avoid mb-1">
                <Link
                  href={`/parfums/${p.slug}`}
                  className="text-xs text-gray-600 hover:text-[#C9A84C] transition-colors"
                >
                  {p.brand} {p.name}
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
