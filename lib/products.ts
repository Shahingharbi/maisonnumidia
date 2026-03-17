import data from "@/data/products.json";
import type { Product, Brand } from "@/lib/types";

const products = data.products as Product[];
const brands = data.brands as Brand[];

export function getAllProducts(): Product[] {
  return products;
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: Product["category"]): Product[] {
  return products.filter((p) => p.category === category);
}

export function getProductsByBrand(brandSlug: string): Product[] {
  return products.filter((p) => p.brandSlug === brandSlug);
}

export function getOrientalProducts(): Product[] {
  return products.filter((p) => p.isOriental);
}

export function getRelatedProducts(slugs: string[]): Product[] {
  return slugs
    .map((slug) => getProductBySlug(slug))
    .filter(Boolean) as Product[];
}

export function getAllBrands(): Brand[] {
  return brands;
}

export function getFeaturedBrands(): Brand[] {
  return brands.filter((b) => b.featured);
}

export function getBrandBySlug(slug: string): Brand | undefined {
  return brands.find((b) => b.slug === slug);
}

export function getAllProductSlugs(): string[] {
  return products.map((p) => p.slug);
}

export function getAllBrandSlugs(): string[] {
  return brands.map((b) => b.slug);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-DZ").format(price) + " DA";
}

export function getDiscount(price: number, originalPrice?: number): number | null {
  if (!originalPrice || originalPrice <= price) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}
