import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import CategoryBanner from "@/components/home/CategoryBanner";
import FeaturedBrands from "@/components/home/FeaturedBrands";
import ProductGrid from "@/components/product/ProductGrid";
import WhyUs from "@/components/home/WhyUs";
import SeoTextBlock from "@/components/home/SeoTextBlock";
import BlogPreview from "@/components/home/BlogPreview";
import Collections from "@/components/home/Collections";
import TwoColumnSection from "@/components/home/TwoColumnSection";
import ThreeColumnSection from "@/components/home/ThreeColumnSection";
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

      {/* 1. Hero Carousel */}
      <Hero />

      {/* 2. Category Banner */}
      <CategoryBanner />

      {/* 3. Product Grid — bestsellers */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-medium text-[#AC9270] tracking-[1.5px] uppercase">
              Les plus demandés
            </span>
            <h2
              className="text-[clamp(28px,3vw,38px)] text-[#535359] mt-3"
              style={{ fontFamily: "var(--font-libre-bodoni), Georgia, serif", fontWeight: 400 }}
            >
              Bestsellers en Algérie
            </h2>
            <p className="mt-2 text-[#8A8A90] max-w-lg mx-auto text-sm">
              Les parfums les plus commandés par nos clients. Qualité garantie, livraison express.
            </p>
          </div>
          <ProductGrid products={featured} />
        </div>
      </section>

      {/* 4. Two Column — Editorial */}
      <TwoColumnSection
        panels={[
          {
            title: "Livraison express",
            subtitle: "Yalidine dans les 58 wilayas — recevez votre parfum en 24h à 72h",
            cta: "Commander maintenant",
            ctaHref: "/commander",
            bgColor: "#f0ede8",
          },
          {
            title: "Paiement à la réception",
            subtitle: "Aucune carte bancaire requise — payez en cash à la livraison",
            cta: "En savoir plus",
            ctaHref: "/commander",
            bgColor: "#e8e5e0",
          },
        ]}
      />

      {/* 5. Collections */}
      <Collections />

      {/* 6. Three Column — Categories */}
      <ThreeColumnSection
        cards={[
          {
            title: "Parfums Homme",
            subtitle: "Dior Sauvage, Bleu de Chanel, 1 Million et bien plus",
            cta: "Explorer",
            ctaHref: "/parfums-homme",
            bgColor: "#f5f0eb",
          },
          {
            title: "Parfums Femme",
            subtitle: "Black Opium, Coco Mademoiselle, La Vie Est Belle",
            cta: "Explorer",
            ctaHref: "/parfums-femme",
            bgColor: "#ebe8e3",
          },
          {
            title: "Parfums Orientaux",
            subtitle: "Oud, ambre et musc — la richesse de l'Orient",
            cta: "Explorer",
            ctaHref: "/parfums-orientaux",
            bgColor: "#e8e5e0",
          },
        ]}
      />

      {/* 7. Blog Preview */}
      <BlogPreview />

      {/* 8. Why Us */}
      <WhyUs />

      {/* 9. Featured Brands */}
      <FeaturedBrands />

      {/* 10. SEO Text Block */}
      <SeoTextBlock />
    </>
  );
}
