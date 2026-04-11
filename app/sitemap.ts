import type { MetadataRoute } from "next";
import { getAllProducts, getProductsByCategory } from "@/lib/products";
import { articles } from "@/data/blog";

const BASE = "https://maisonnumidia.store";

// Date stable du dernier ajout de produits — NE PAS utiliser new Date()
// qui fait croire à Google que tout change chaque jour (signal négatif pour le budget crawl)
const CATALOG_DATE = new Date("2026-04-11");
const SITE_LAUNCH = new Date("2026-01-15");

export default function sitemap(): MetadataRoute.Sitemap {
  const allProducts = getAllProducts();

  const hommeProducts = getProductsByCategory("parfums-homme");
  const femmeProducts = getProductsByCategory("parfums-femme");
  const orientauxProducts = getProductsByCategory("parfums-orientaux");

  const brandSlugsHomme = [...new Set(hommeProducts.map((p) => p.brandSlug))];
  const brandSlugsFemme = [...new Set(femmeProducts.map((p) => p.brandSlug))];
  const brandSlugsOrientaux = [...new Set(orientauxProducts.map((p) => p.brandSlug))];
  const allBrandSlugs = [...new Set([...brandSlugsHomme, ...brandSlugsFemme, ...brandSlugsOrientaux])];

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: CATALOG_DATE, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/parfums-homme`, lastModified: CATALOG_DATE, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/parfums-femme`, lastModified: CATALOG_DATE, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/parfums-orientaux`, lastModified: CATALOG_DATE, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/marques`, lastModified: CATALOG_DATE, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/commander`, lastModified: SITE_LAUNCH, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/contact`, lastModified: SITE_LAUNCH, changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE}/parfum-algerie`, lastModified: CATALOG_DATE, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/plan-du-site`, lastModified: CATALOG_DATE, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/blog`, lastModified: CATALOG_DATE, changeFrequency: "weekly", priority: 0.7 },
  ];

  const brandPages: MetadataRoute.Sitemap = [
    ...allBrandSlugs.map((slug) => ({
      url: `${BASE}/marques/${slug}`,
      lastModified: CATALOG_DATE,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...brandSlugsHomme.map((slug) => ({
      url: `${BASE}/parfums-homme/${slug}`,
      lastModified: CATALOG_DATE,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
    ...brandSlugsFemme.map((slug) => ({
      url: `${BASE}/parfums-femme/${slug}`,
      lastModified: CATALOG_DATE,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
    ...brandSlugsOrientaux.map((slug) => ({
      url: `${BASE}/parfums-orientaux/${slug}`,
      lastModified: CATALOG_DATE,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
  ];

  // Produits featured prioritaires, les autres en 0.7
  const productPages: MetadataRoute.Sitemap = allProducts.map((p) => ({
    url: `${BASE}/parfums/${p.slug}`,
    lastModified: CATALOG_DATE,
    changeFrequency: "monthly" as const,
    priority: p.featured ? 0.85 : 0.7,
  }));

  // Blog en premier (contenu éditorial = signal qualité), puis produits featured
  const blogPages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${BASE}/blog/${a.slug}`,
    lastModified: new Date(a.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [...staticPages, ...blogPages, ...brandPages, ...productPages];
}
