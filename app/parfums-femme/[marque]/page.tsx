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
  const count = getProductsByBrand(marque).filter(p => p.gender === "femme" || p.gender === "unisexe").length;
  return {
    title: `Parfum Femme ${brand.name} en Algérie — ${count} référence${count > 1 ? "s" : ""}`,
    description: `Achetez les parfums femme ${brand.name} originaux en Algérie. ${count} référence${count > 1 ? "s" : ""} disponible${count > 1 ? "s" : ""}, paiement à la livraison, livraison Yalidine 58 wilayas.`,
    alternates: { canonical: `https://maisonnumidia.store/parfums-femme/${marque}` },
  };
}

export default async function ParfumsFemmeMarquePage({ params }: Props) {
  const { marque } = await params;
  const brand = getBrandBySlug(marque);
  if (!brand) notFound();

  const products = getProductsByBrand(marque).filter(
    (p) => p.gender === "femme" || p.gender === "unisexe"
  );
  if (products.length === 0) notFound();

  const families = [...new Set(products.map(p => p.family))].slice(0, 4);

  const allBrandProducts = getProductsByBrand(marque);
  const hasHomme = allBrandProducts.some(p => p.gender === "homme" || p.gender === "unisexe");
  const hasOriental = allBrandProducts.some(p => p.isOriental);

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: "Parfums Femme", url: "/parfums-femme" },
    { name: brand.name, url: `/parfums-femme/${marque}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <CategoryHero
        title={`Parfum Femme ${brand.name} en Algérie`}
        description={`${products.length} parfum${products.length > 1 ? "s" : ""} ${brand.name} pour femme disponible${products.length > 1 ? "s" : ""} en Algérie — 100% authentique, livraison Yalidine, paiement à la réception.`}
        count={products.length}
        brand={brand.name}
      />

      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <Breadcrumb items={[{ label: "Parfums Femme", href: "/parfums-femme" }, { label: brand.name }]} />
          </div>
          <ProductGrid products={products} />
        </div>
      </section>

      <section className="bg-[#FAFAF8] py-14 sm:py-20 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-[#111111] mb-6">Parfum Femme {brand.name} en Algérie — Guide d&apos;achat</h2>
          <div className="space-y-5 text-gray-600 text-sm sm:text-base leading-relaxed">
            <p>
              {brand.description
                ? brand.description + ` En Algérie, les parfums ${brand.name} pour femme s'imposent comme une référence de l'élégance féminine, appréciés pour leur qualité de fabrication et leur longévité.`
                : `Les parfums ${brand.name} pour femme représentent l'une des collections les plus recherchées en Algérie. Alliant féminité, sophistication et tenue exceptionnelle, ces fragrances accompagnent chaque moment du quotidien.`}
            </p>
            <p>
              Maison Numidia propose <strong className="text-[#111111]">{products.length} parfum{products.length > 1 ? "s" : ""} {brand.name} pour femme</strong>,
              couvrant {families.length > 1 ? "les familles olfactives" : "la famille olfactive"}{" "}
              <strong className="text-[#111111]">{families.join(", ")}</strong>.
              Des fragrances florales légères aux orientales profondes, la collection {brand.name} pour femme répond à chaque occasion et chaque saison.
            </p>
            <h3 className="text-lg font-bold text-[#111111] pt-2">{brand.name} Femme : l&apos;excellence du parfum féminin</h3>
            <p>
              La maison {brand.name} crée des fragrances féminines d&apos;une complexité remarquable, fruit d&apos;une collaboration entre les meilleurs nez de la parfumerie mondiale.
              En Algérie, ces parfums sont appréciés pour leur longévité sur la peau et leur sillage enveloppant qui s&apos;intensifie à la chaleur.
            </p>
            <h3 className="text-lg font-bold text-[#111111] pt-2">Commander {brand.name} Femme en Algérie</h3>
            <p>
              Maison Numidia garantit l&apos;<strong className="text-[#111111]">authenticité à 100%</strong> de chaque flacon {brand.name}.
              Paiement à la réception, livraison <strong className="text-[#111111]">Yalidine Express 58 wilayas</strong> en 24 à 72 heures.
            </p>
            <div className="border-t border-gray-200 pt-6 mt-4">
              <p className="font-semibold text-[#111111] mb-3">Explorer également :</p>
              <div className="flex flex-wrap gap-3">
                <Link href={`/marques/${marque}`} className="text-sm text-[#C9A84C] hover:text-[#8B6914] border border-[#C9A84C]/30 hover:border-[#C9A84C] px-3 py-1.5 rounded-lg transition-colors">Toute la collection {brand.name}</Link>
                {hasHomme && <Link href={`/parfums-homme/${marque}`} className="text-sm text-gray-600 hover:text-[#C9A84C] border border-gray-200 hover:border-[#C9A84C]/30 px-3 py-1.5 rounded-lg transition-colors">{brand.name} Homme</Link>}
                {hasOriental && <Link href={`/parfums-orientaux/${marque}`} className="text-sm text-gray-600 hover:text-[#C9A84C] border border-gray-200 hover:border-[#C9A84C]/30 px-3 py-1.5 rounded-lg transition-colors">{brand.name} Oriental</Link>}
                <Link href="/parfums-femme" className="text-sm text-gray-600 hover:text-[#C9A84C] border border-gray-200 hover:border-[#C9A84C]/30 px-3 py-1.5 rounded-lg transition-colors">Tous les parfums femme</Link>
                <Link href="/marques" className="text-sm text-gray-600 hover:text-[#C9A84C] border border-gray-200 hover:border-[#C9A84C]/30 px-3 py-1.5 rounded-lg transition-colors">Toutes les marques</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
