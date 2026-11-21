import data from "@/data/products.json";
import type { Product, Brand, CarteProduit } from "@/lib/types";

const products = data.products as Product[];
const brands = data.brands as Brand[];

/** Réduit une fiche aux champs d'une carte : à utiliser pour tout ce qui part vers un composant client. */
export function versCarte(p: Product): CarteProduit {
  return {
    id: p.id, slug: p.slug, name: p.name, brand: p.brand, brandSlug: p.brandSlug, family: p.family,
    concentration: p.concentration, volume: p.volume, price: p.price, originalPrice: p.originalPrice ?? null,
    image: p.image, ...(p.badge ? { badge: p.badge } : {}),
  };
}

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

/**
 * Marques à générer pour une page filtre /parfums-{homme|femme}/[marque].
 * IMPORTANT : basé sur `gender` (homme|unisexe / femme|unisexe), PAS sur `category`.
 * Les pages filtrent leur contenu par gender (ex: un Lattafa gender="homme" catégorisé
 * "parfums-orientaux" apparaît quand même sur /parfums-homme/lattafa). generateStaticParams
 * ET le sitemap doivent utiliser la même logique, sinon des pages avec du vrai contenu
 * restent invisibles de Google (absentes du sitemap, non pré-générées au build).
 */
export function getBrandSlugsForGenderPage(gender: "homme" | "femme"): string[] {
  return [
    ...new Set(
      products
        .filter((p) => p.gender === gender || p.gender === "unisexe")
        .map((p) => p.brandSlug)
    ),
  ];
}

export type SectionMarque = "parfums-homme" | "parfums-femme" | "parfums-orientaux";

const dansSection: Record<SectionMarque, (p: Product) => boolean> = {
  "parfums-homme": (p) => p.gender === "homme" || p.gender === "unisexe",
  "parfums-femme": (p) => p.gender === "femme" || p.gender === "unisexe",
  "parfums-orientaux": (p) => p.category === "parfums-orientaux",
};

/**
 * Vrai quand /parfums-femme/<marque> (ou homme, orientaux) affiche EXACTEMENT les mêmes produits
 * que /marques/<marque> : la marque n'a rien hors de cette section. Mesuré le 21/11/2026 :
 * 100 pages dans ce cas (Kayali, Elizabeth Arden, Lattafa côté orientaux…), qui se partageaient
 * les requêtes « parfum <marque> » avec leur page marque, chacune vers la 6e-8e place.
 * Ces pages restent en ligne (navigation) mais désignent la page marque comme canonique, sortent
 * du sitemap, et les liens du site pointent directement vers la page marque.
 */
export function estDoublonDeMarque(section: SectionMarque, brandSlug: string): boolean {
  const ps = products.filter((p) => p.brandSlug === brandSlug);
  return ps.length > 0 && ps.every(dansSection[section]);
}

/** L'URL à lier pour « la marque X dans la section Y » : la page marque quand la page filtrée la double. */
export function urlMarqueSection(section: SectionMarque, brandSlug: string): string {
  return estDoublonDeMarque(section, brandSlug) ? `/marques/${brandSlug}` : `/${section}/${brandSlug}`;
}

const sansAccent = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/**
 * Les autres versions du même parfum : même maison, même début de nom.
 * Black Opium en a cinq au catalogue (Intense, Extreme, Neon, Over Red), 1 Million aussi.
 *
 * C'est la question la plus posée à Google sur nos fiches — les requêtes contenant une
 * déclinaison (Elixir, Intense, Extrême, Profumo, Le Parfum…) pèsent 38 588 impressions
 * sur 16 mois, et c'est là que le site est le plus mal placé. Le tri se fait par prix
 * croissant : c'est l'ordre dans lequel on choisit quand on hésite.
 */
export function getLineVersions(product: Product): Product[] {
  const tokens = sansAccent(product.name).split(/[^a-z0-9]+/).filter(Boolean);
  if (tokens.length === 0) return [];
  const racine = tokens.slice(0, Math.min(2, tokens.length)).join(" ");
  return products
    .filter((p) => {
      if (p.brandSlug !== product.brandSlug) return false;
      const t = sansAccent(p.name).split(/[^a-z0-9]+/).filter(Boolean);
      return t.slice(0, Math.min(2, t.length)).join(" ") === racine;
    })
    .sort((a, b) => a.price - b.price);
}

/**
 * Ce qui distingue une version des autres : les notes qu'elle est seule à porter.
 * Calculé sur les pyramides réelles, jamais décrit à la main — sinon la phrase
 * survit à une correction de notes et devient fausse.
 */
export function getDistinctiveNotes(product: Product, versions: Product[]): string[] {
  const siennes = [...product.notes.top, ...product.notes.heart, ...product.notes.base];
  const ailleurs = new Set(
    versions
      .filter((v) => v.slug !== product.slug)
      .flatMap((v) => [...v.notes.top, ...v.notes.heart, ...v.notes.base])
      .map((n) => sansAccent(n))
  );
  return siennes.filter((n) => !ailleurs.has(sansAccent(n)));
}

/** Fourchette de prix d'une marque au catalogue, pour situer un parfum dans sa gamme. */
export function getBrandPriceStats(brandSlug: string) {
  const prix = products.filter((p) => p.brandSlug === brandSlug).map((p) => p.price).sort((a, b) => a - b);
  if (!prix.length) return null;
  return { min: prix[0], max: prix[prix.length - 1], mediane: prix[Math.floor(prix.length / 2)], nombre: prix.length };
}

export function getRelatedProducts(slugs: string[]): Product[] {
  return slugs
    .map((slug) => getProductBySlug(slug))
    .filter(Boolean) as Product[];
}

/**
 * Marques qui ont au moins un produit au catalogue.
 *
 * Une marque doit exister dans brands[] AVANT que ses produits soient injectes (regle n4),
 * donc le fichier contient toujours quelques marques en avance de phase. Elles ne doivent
 * ni apparaitre dans /marques, ni etre pre-generees : une page marque a zero produit est
 * une page vide offerte a Google. Le sitemap, lui, derive deja des produits.
 */
export function getBrandsWithProducts(): Brand[] {
  const avecProduits = new Set(products.map((p) => p.brandSlug));
  return brands.filter((b) => avecProduits.has(b.slug));
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

export function getDiscount(price: number, originalPrice?: number | null): number | null {
  if (!originalPrice || originalPrice <= price) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}
