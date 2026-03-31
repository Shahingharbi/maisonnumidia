import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductsByBrand, getAllBrandSlugs, getBrandBySlug, getProductsByCategory } from "@/lib/products";
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
  const allBrandProducts = getProductsByBrand(marque);
  const count = allBrandProducts.filter(p => p.gender === "homme" || p.gender === "unisexe").length;
  return {
    title: `Parfum Homme ${brand.name} en Algérie — ${count} référence${count > 1 ? "s" : ""}`,
    description: `Achetez les parfums homme ${brand.name} originaux en Algérie. ${count} référence${count > 1 ? "s" : ""} disponible${count > 1 ? "s" : ""}, paiement à la livraison, livraison Yalidine 58 wilayas.`,
    alternates: { canonical: `https://maisonnumidia.store/parfums-homme/${marque}` },
  };
}

export default async function ParfumsHommeMarquePage({ params }: Props) {
  const { marque } = await params;
  const brand = getBrandBySlug(marque);
  if (!brand) notFound();

  const products = getProductsByBrand(marque).filter(
    (p) => p.gender === "homme" || p.gender === "unisexe"
  );
  if (products.length === 0) notFound();

  // Familles olfactives présentes
  const families = [...new Set(products.map(p => p.family))].slice(0, 4);

  // Vérifier si la marque a aussi des produits femme ou orientaux
  const allBrandProducts = getProductsByBrand(marque);
  const hasFemme = allBrandProducts.some(p => p.gender === "femme" || p.gender === "unisexe");
  const hasOriental = allBrandProducts.some(p => p.isOriental);

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: "Parfums Homme", url: "/parfums-homme" },
    { name: brand.name, url: `/parfums-homme/${marque}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <CategoryHero
        title={`Parfum Homme ${brand.name} en Algérie`}
        description={`${products.length} parfum${products.length > 1 ? "s" : ""} ${brand.name} pour homme disponible${products.length > 1 ? "s" : ""} en Algérie — 100% authentique, livraison Yalidine, paiement à la réception.`}
        count={products.length}
        brand={brand.name}
      />

      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <Breadcrumb
              items={[
                { label: "Parfums Homme", href: "/parfums-homme" },
                { label: brand.name },
              ]}
            />
          </div>
          <ProductGrid products={products} />
        </div>
      </section>

      {/* Bloc SEO — contenu textuel pour le crawl */}
      <section className="bg-[#FAFAF8] py-14 sm:py-20 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-[#111111] mb-6">
            Parfum Homme {brand.name} en Algérie — Guide d&apos;achat
          </h2>
          <div className="space-y-5 text-gray-600 text-sm sm:text-base leading-relaxed">

            <p>
              {brand.description
                ? brand.description + ` En Algérie, les parfums ${brand.name} pour homme sont parmi les plus demandés sur le marché du luxe, appréciés pour leur qualité de fabrication et leur longévité exceptionnelle.`
                : `Les parfums ${brand.name} pour homme s'imposent comme une référence incontournable sur le marché algérien du parfum. Porteurs d'un savoir-faire reconnu internationalement, ces fragrances masculines séduisent par leur raffinement et leur tenue remarquable.`
              }
            </p>

            <p>
              Maison Numidia propose <strong className="text-[#111111]">{products.length} parfum{products.length > 1 ? "s" : ""} {brand.name} pour homme</strong>,
              couvrant {families.length > 1 ? "les familles olfactives" : "la famille olfactive"}{" "}
              <strong className="text-[#111111]">{families.join(", ")}</strong>.
              Que vous recherchiez un parfum de bureau discret, une fragrance puissante pour les soirées,
              ou un jus quotidien polyvalent, la collection {brand.name} pour homme répond à chaque usage.
            </p>

            <h3 className="text-lg font-bold text-[#111111] pt-2">
              Pourquoi choisir un parfum {brand.name} ?
            </h3>
            <p>
              {brand.name} est une maison dont la réputation n&apos;est plus à prouver. Ses fragrances masculines
              sont formulées avec des matières premières de haute qualité : extraits naturels, molécules exclusives
              et accords signés par les meilleurs parfumeurs internationaux. En Algérie, un parfum {brand.name}
              est synonyme de statut et d&apos;élégance — il se remarque, il se retient, et il dure.
            </p>
            <p>
              La longévité et le sillage sont des critères essentiels pour le consommateur algérien.
              Les parfums {brand.name} pour homme se distinguent précisément sur ces deux points :
              la plupart des références durent entre 8 et 14 heures sur la peau, avec un sillage
              ample qui marque la présence sans être oppressant.
            </p>

            <h3 className="text-lg font-bold text-[#111111] pt-2">
              Acheter {brand.name} en Algérie — ce qu&apos;il faut savoir
            </h3>
            <p>
              Chez Maison Numidia, chaque flacon {brand.name} est <strong className="text-[#111111]">100% original et garanti authentique</strong>.
              Face à la prolifération des contrefaçons sur le marché algérien, nous nous engageons sur
              la traçabilité de chaque produit. Vous payez uniquement à la réception de votre commande,
              ce qui vous permet de vérifier votre parfum avant tout règlement.
            </p>
            <p>
              La livraison est assurée via <strong className="text-[#111111]">Yalidine Express dans les 58 wilayas</strong> :
              Alger, Oran, Constantine, Annaba, Blida, Tizi Ouzou, Béjaïa, Sétif, Batna, Biskra,
              et toutes les autres wilayas. Le délai moyen est de 24 à 72 heures selon votre localisation.
            </p>

            {/* Liens de maillage interne */}
            <div className="border-t border-gray-200 pt-6 mt-4">
              <p className="font-semibold text-[#111111] mb-3">Explorer également :</p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/marques/${marque}`}
                  className="text-sm text-[#C9A84C] hover:text-[#8B6914] border border-[#C9A84C]/30 hover:border-[#C9A84C] px-3 py-1.5 rounded-lg transition-colors"
                >
                  Toute la collection {brand.name}
                </Link>
                {hasFemme && (
                  <Link
                    href={`/parfums-femme/${marque}`}
                    className="text-sm text-gray-600 hover:text-[#C9A84C] border border-gray-200 hover:border-[#C9A84C]/30 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {brand.name} Femme
                  </Link>
                )}
                {hasOriental && (
                  <Link
                    href={`/parfums-orientaux/${marque}`}
                    className="text-sm text-gray-600 hover:text-[#C9A84C] border border-gray-200 hover:border-[#C9A84C]/30 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {brand.name} Oriental
                  </Link>
                )}
                <Link
                  href="/parfums-homme"
                  className="text-sm text-gray-600 hover:text-[#C9A84C] border border-gray-200 hover:border-[#C9A84C]/30 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Tous les parfums homme
                </Link>
                <Link
                  href="/marques"
                  className="text-sm text-gray-600 hover:text-[#C9A84C] border border-gray-200 hover:border-[#C9A84C]/30 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Toutes les marques
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
