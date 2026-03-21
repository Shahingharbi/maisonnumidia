import type { MetadataRoute } from "next";
import { getAllProductSlugs, getProductsByCategory } from "@/lib/products";
import { articles } from "@/data/blog";

const BASE = "https://maisonnumidia.store";

export default function sitemap(): MetadataRoute.Sitemap {
  const productSlugs = getAllProductSlugs();

  // Only include brand/category pages that actually have products
  const hommeProducts = getProductsByCategory("parfums-homme");
  const femmeProducts = getProductsByCategory("parfums-femme");
  const orientauxProducts = getProductsByCategory("parfums-orientaux");

  const brandSlugsHomme = [...new Set(hommeProducts.map((p) => p.brandSlug))];
  const brandSlugsFemme = [...new Set(femmeProducts.map((p) => p.brandSlug))];
  const brandSlugsOrientaux = [...new Set(orientauxProducts.map((p) => p.brandSlug))];
  const allBrandSlugs = [...new Set([...brandSlugsHomme, ...brandSlugsFemme, ...brandSlugsOrientaux])];

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/parfums-homme`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/parfums-femme`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/parfums-orientaux`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/marques`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/commander`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
  ];

  const brandPages: MetadataRoute.Sitemap = [
    ...allBrandSlugs.map((slug) => ({ url: `${BASE}/marques/${slug}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 })),
    ...brandSlugsHomme.map((slug) => ({ url: `${BASE}/parfums-homme/${slug}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.75 })),
    ...brandSlugsFemme.map((slug) => ({ url: `${BASE}/parfums-femme/${slug}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.75 })),
    ...brandSlugsOrientaux.map((slug) => ({ url: `${BASE}/parfums-orientaux/${slug}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.75 })),
  ];

  const productPages: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${BASE}/parfums/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const blogPages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${BASE}/blog/${a.slug}`,
    lastModified: new Date(a.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...brandPages, ...productPages, ...blogPages];
}
