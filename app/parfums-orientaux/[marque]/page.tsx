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
    title: `Parfums Orientaux ${brand.name} en Algérie | Maison Numidia`,
    description: `Collection orientale ${brand.name} disponible en Algérie. Paiement à la livraison, livraison rapide Yalidine.`,
    alternates: { canonical: `https://maisonnumidia.store/parfums-orientaux/${marque}` },
  };
}

export default async function ParfumsOrientauxMarquePage({ params }: Props) {
  const { marque } = await params;
  const brand = getBrandBySlug(marque);
  if (!brand) notFound();

  const products = getProductsByBrand(marque).filter((p) => p.isOriental);

  return (
    <>
      <CategoryHero
        title={`Parfums Orientaux ${brand.name}`}
        description={`L'art oriental de ${brand.name} en Algérie. Collection complète, authentique, livraison partout.`}
        count={products.length}
        brand={brand.name}
      />
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <Breadcrumb
              items={[
                { label: "Parfums Orientaux", href: "/parfums-orientaux" },
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
