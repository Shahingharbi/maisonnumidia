import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductsByBrand, getAllBrandSlugs, getBrandBySlug } from "@/lib/products";
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
  return {
    title: `Parfums Homme ${brand.name} en Algérie — Prix DA`,
    description: `Achetez les parfums homme ${brand.name} en Algérie. Paiement à la livraison dans toutes les wilayas. Prix en dinar algérien.`,
    alternates: {
      canonical: `https://maisonnumidia.store/parfums-homme/${marque}`,
    },
  };
}

export default async function ParfumsHommeMarquePage({ params }: Props) {
  const { marque } = await params;
  const brand = getBrandBySlug(marque);
  if (!brand) notFound();

  const products = getProductsByBrand(marque).filter(
    (p) => p.gender === "homme" || p.gender === "unisexe"
  );

  return (
    <>
      <CategoryHero
        title={`Parfums Homme ${brand.name} en Algérie`}
        description={`Toute la collection ${brand.name} pour homme disponible en Algérie. Authentique, livraison Yalidine, paiement à la livraison.`}
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
    </>
  );
}
