import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBrandBySlug, getProductsByBrand, getAllBrandSlugs } from "@/lib/products";
import ProductGrid from "@/components/product/ProductGrid";
import Breadcrumb from "@/components/layout/Breadcrumb";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllBrandSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) return {};
  return {
    title: `Parfums ${brand.name} en Algérie — Toute la Collection`,
    description: `Découvrez toute la collection ${brand.name} disponible en Algérie. Prix en dinar algérien. Paiement à la livraison dans toutes les wilayas.`,
    alternates: { canonical: `https://maisonnumidia.store/marques/${slug}` },
  };
}

export default async function MarquePage({ params }: Props) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) notFound();

  const products = getProductsByBrand(slug);

  return (
    <>
      <div className="bg-white border-b border-gray-100 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#C9A84C] uppercase mb-3">
            {brand.origin}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#111111] mb-3">
            Parfums {brand.name} en Algérie
          </h1>
          <p className="text-gray-400 max-w-xl text-sm sm:text-base">
            Toute la collection {brand.name} disponible en Algérie. Authentique garanti,
            paiement à la livraison, expédition Yalidine.
          </p>
          <div className="mt-4 text-sm text-gray-400">
            <strong className="text-[#111111]">{products.length}</strong> parfum{products.length > 1 ? "s" : ""} disponibles
          </div>
        </div>
      </div>

      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <Breadcrumb
              items={[
                { label: "Marques", href: "/marques" },
                { label: brand.name },
              ]}
            />
          </div>
          <ProductGrid products={products} />

          {/* SEO Block */}
          <div className="mt-20 border-t border-gray-100 pt-14 max-w-4xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] mb-8">
              Parfums {brand.name} originaux en Algérie — Guide complet
            </h2>
            <div className="space-y-10 text-gray-600 leading-relaxed text-sm sm:text-base">
              <div>
                <h3 className="text-lg font-bold text-[#111111] mb-4">
                  La maison {brand.name}
                </h3>
                <p className="mb-4">{brand.description}</p>
                <p>
                  Chez Maison Numidia, nous proposons {products.length} fragrance{products.length > 1 ? "s" : ""} {brand.name} disponibles immédiatement en Algérie.
                  Chaque flacon est garanti 100% original, expédié depuis notre entrepôt avec la rigueur que mérite une maison de cette réputation.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#111111] mb-4">
                  {products.length > 1 ? `Les parfums ${brand.name} disponibles` : `Le parfum ${brand.name} disponible`}
                </h3>
                <ul className="space-y-2 mb-4">
                  {products.map(p => (
                    <li key={p.slug}>
                      <Link href={`/parfums/${p.slug}`} className="text-[#C9A84C] font-semibold hover:underline">
                        {p.name}
                      </Link>
                      {" — "}{p.shortDescription}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#111111] mb-4">
                  Commander {brand.name} en Algérie — paiement à la livraison
                </h3>
                <p className="mb-4">
                  Maison Numidia est votre référence pour acheter des parfums {brand.name} originaux en Algérie.
                  Aucune avance, aucun virement. Vous commandez en ligne, vous payez cash à la réception du colis,
                  entre vos mains. C&apos;est le modèle COD (Cash on Delivery) que nous pratiquons depuis notre ouverture.
                </p>
                <p>
                  La livraison est assurée par <strong className="text-[#111111]">Yalidine Express</strong> dans
                  les 58 wilayas algériennes. Délai constaté : 24 à 48h pour Alger et les grandes villes,
                  48 à 72h pour les wilayas plus éloignées. Pour toute question, contactez-nous au{" "}
                  <strong className="text-[#111111]">06 99 41 85 69</strong>.
                </p>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-[0.15em] mb-4">Explorer aussi</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Parfums Homme", href: "/parfums-homme" },
                  { label: "Parfums Femme", href: "/parfums-femme" },
                  { label: "Parfums Orientaux", href: "/parfums-orientaux" },
                  { label: "Toutes les marques", href: "/marques" },
                ].map((link) => (
                  <Link key={link.href} href={link.href}
                    className="text-xs border border-gray-200 hover:border-[#C9A84C] hover:text-[#C9A84C] text-gray-500 px-4 py-2 transition-colors">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
