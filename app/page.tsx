import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import CategoryBanner from "@/components/home/CategoryBanner";
import FeaturedBrands from "@/components/home/FeaturedBrands";
import ProductGrid from "@/components/product/ProductGrid";
import WhyUs from "@/components/home/WhyUs";
import SeoTextBlock from "@/components/home/SeoTextBlock";
import BlogPreview from "@/components/home/BlogPreview";
import Collections from "@/components/home/Collections";
import { getFeaturedProducts } from "@/lib/products";
import { getOrganizationSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Parfum Original en Algérie — Livraison 58 Wilayas, Paiement à la Réception",
  description:
    "Parfumerie en ligne Algérie. Dior, Chanel, Lattafa, Al Haramain — parfums 100% originaux livrés partout en Algérie via Yalidine. Commandez en dinar, payez à la réception.",
  alternates: {
    canonical: "https://maisonnumidia.store",
  },
  openGraph: {
    title: "Parfum Original en Algérie | Maison Numidia",
    description:
      "Parfumerie en ligne Algérie. Dior, Chanel, Lattafa, Al Haramain — parfums 100% originaux livrés partout via Yalidine. Paiement à la réception.",
    url: "https://maisonnumidia.store",
    type: "website",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Maison Numidia",
  url: "https://maisonnumidia.store",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://maisonnumidia.store/parfums?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export default function HomePage() {
  const featured = getFeaturedProducts();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getOrganizationSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      {/* 1. Hero */}
      <Hero />

      {/* 2. Category Banner */}
      <CategoryBanner />

      {/* 3. Product Grid — bestsellers */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-10">
            <span className="text-xs font-semibold text-[#C9A84C] tracking-[0.2em] uppercase">
              Les plus demandés
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
              Bestsellers en Algérie
            </h2>
            <p className="mt-2 text-gray-400 max-w-lg">
              Les parfums les plus commandés par nos clients. Qualité garantie, livraison express.
            </p>
          </div>
          <ProductGrid products={featured} />
        </div>
      </section>

      {/* 4. Collections */}
      <Collections />

      {/* 5. SEO Text Block */}
      <SeoTextBlock />

      {/* 6. Blog Preview */}
      <BlogPreview />

      {/* 7. Why Us */}
      <WhyUs />

      {/* 8. Featured Brands */}
      <FeaturedBrands />
    </>
  );
}
