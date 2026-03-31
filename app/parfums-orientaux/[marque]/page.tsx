import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductsByBrand, getAllBrandSlugs, getBrandBySlug } from "@/lib/products";
import { getBreadcrumbSchema } from "@/lib/seo";
import ProductGrid from "@/components/product/ProductGrid";
import CategoryHero from "@/components/category/CategoryHero";
import Breadcrumb from "@/components/layout/Breadcrumb";

interface Props {
  params: Promise<{ marque: string }>;
}

export async function generateStaticParams() {
  return getAllBrandSlugs().map((slug) => ({ marque: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { marque } = await params;
  const brand = getBrandBySlug(marque);
  if (!brand) return {};
  const count = getProductsByBrand(marque).filter(p => p.isOriental).length;
  return {
    title: `Parfum Oriental ${brand.name} en Algérie — ${count} référence${count > 1 ? "s" : ""}`,
    description: `Découvrez les parfums orientaux ${brand.name} en Algérie. ${count} référence${count > 1 ? "s" : ""} authentique${count > 1 ? "s" : ""}, paiement à la livraison, expédition Yalidine 58 wilayas.`,
    alternates: { canonical: `https://maisonnumidia.store/parfums-orientaux/${marque}` },
  };
}

export default async function ParfumsOrientauxMarquePage({ params }: Props) {
  const { marque } = await params;
  const brand = getBrandBySlug(marque);
  if (!brand) notFound();

  const products = getProductsByBrand(marque).filter(p => p.isOriental);
  if (products.length === 0) notFound();

  const families = [...new Set(products.map(p => p.family))].slice(0, 4);

  const allBrandProducts = getProductsByBrand(marque);
  const hasHomme = allBrandProducts.some(p => (p.gender === "homme" || p.gender === "unisexe") && !p.isOriental);
  const hasFemme = allBrandProducts.some(p => (p.gender === "femme" || p.gender === "unisexe") && !p.isOriental);

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: "Parfums Orientaux", url: "/parfums-orientaux" },
    { name: brand.name, url: `/parfums-orientaux/${marque}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <CategoryHero
        title={`Parfum Oriental ${brand.name} en Algérie`}
        description={`${products.length} parfum${products.length > 1 ? "s" : ""} oriental${products.length > 1 ? "aux" : ""} ${brand.name} en Algérie — oud, ambre, musc. 100% authentique, paiement à la réception.`}
        count={products.length}
        brand={brand.name}
      />

      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <Breadcrumb items={[{ label: "Parfums Orientaux", href: "/parfums-orientaux" }, { label: brand.name }]} />
          </div>
          <ProductGrid products={products} />
        </div>
      </section>

      <section className="bg-[#FAFAF8] py-14 sm:py-20 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-[#111111] mb-6">Parfum Oriental {brand.name} en Algérie — Guide complet</h2>
          <div className="space-y-5 text-gray-600 text-sm sm:text-base leading-relaxed">
            <p>
              {brand.description
                ? brand.description + ` Ses créations orientales incarnent l'art du parfum dans toute sa profondeur : oud, ambre, musc et résines précieuses s'y entremêlent pour des fragrances à la fois intenses et raffinées.`
                : `Les parfums orientaux ${brand.name} représentent un voyage olfactif vers les traditions parfumées de l'Orient. Oud, ambre, bakhour et musc blanc s'y expriment avec une intensité qui séduit particulièrement le public algérien.`}
            </p>
            <p>
              Maison Numidia propose <strong className="text-[#111111]">{products.length} parfum{products.length > 1 ? "s" : ""} oriental{products.length > 1 ? "aux" : ""} {brand.name}</strong>,
              couvrant {families.length > 1 ? "les familles" : "la famille"}{" "}
              <strong className="text-[#111111]">{families.join(", ")}</strong>.
              Des compositions à l&apos;oud pur aux muscs boisés, chaque fragrance {brand.name} est une invitation à l&apos;authenticité orientale.
            </p>
            <h3 className="text-lg font-bold text-[#111111] pt-2">L&apos;art oriental de {brand.name} : oud, ambre et musc</h3>
            <p>
              Le parfum oriental est profondément ancré dans la culture algérienne. Les fragrances {brand.name} dans ce registre utilisent
              des matières premières nobles : oud du Cambodge et d&apos;Arabie, ambre gris, benjoin, rose de Taïf et musc blanc.
              Ces parfums sont conçus pour une projection ample et une longévité remarquable — idéaux pour les occasions importantes
              et le quotidien de ceux qui revendiquent un rapport intense au parfum.
            </p>
            <h3 className="text-lg font-bold text-[#111111] pt-2">Commander des orientaux {brand.name} en Algérie</h3>
            <p>
              Maison Numidia garantit l&apos;<strong className="text-[#111111]">authenticité absolue</strong> de chaque parfum oriental {brand.name}.
              Paiement à la réception, livraison <strong className="text-[#111111]">Yalidine Express 58 wilayas</strong> en 24 à 72 heures.
            </p>
            <div className="border-t border-gray-200 pt-6 mt-4">
              <p className="font-semibold text-[#111111] mb-3">Explorer également :</p>
              <div className="flex flex-wrap gap-3">
                <Link href={`/marques/${marque}`} className="text-sm text-[#C9A84C] hover:text-[#8B6914] border border-[#C9A84C]/30 hover:border-[#C9A84C] px-3 py-1.5 rounded-lg transition-colors">Toute la collection {brand.name}</Link>
                {hasHomme && <Link href={`/parfums-homme/${marque}`} className="text-sm text-gray-600 hover:text-[#C9A84C] border border-gray-200 hover:border-[#C9A84C]/30 px-3 py-1.5 rounded-lg transition-colors">{brand.name} Homme</Link>}
                {hasFemme && <Link href={`/parfums-femme/${marque}`} className="text-sm text-gray-600 hover:text-[#C9A84C] border border-gray-200 hover:border-[#C9A84C]/30 px-3 py-1.5 rounded-lg transition-colors">{brand.name} Femme</Link>}
                <Link href="/parfums-orientaux" className="text-sm text-gray-600 hover:text-[#C9A84C] border border-gray-200 hover:border-[#C9A84C]/30 px-3 py-1.5 rounded-lg transition-colors">Tous les parfums orientaux</Link>
                <Link href="/marques" className="text-sm text-gray-600 hover:text-[#C9A84C] border border-gray-200 hover:border-[#C9A84C]/30 px-3 py-1.5 rounded-lg transition-colors">Toutes les marques</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
