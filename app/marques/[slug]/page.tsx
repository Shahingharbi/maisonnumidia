import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
    title: `Parfums ${brand.name} en Algérie — Toute la Collection | Maison Numidia`,
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
        </div>
      </section>
    </>
  );
}
