export interface ProductNotes {
  top: string[];
  heart: string[];
  base: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  h1?: string;
  brand: string;
  brandSlug: string;
  gender: "homme" | "femme" | "unisexe";
  category: "parfums-homme" | "parfums-femme" | "parfums-orientaux";
  family: string;
  concentration: "EDP" | "EDT" | "EDC" | "Parfum";
  volume: string;
  price: number;
  originalPrice?: number | null;
  shortDescription: string;
  description: string;
  notes: ProductNotes;
  occasions: string[];
  seasons: string[];
  longevity: number;
  sillage: number;
  image: string;
  images?: string[];
  inStock: boolean;
  featured: boolean;
  badge?: "Bestseller" | "Nouveau" | "Promo" | "Exclusif";
  isOriental: boolean;
  related: string[];
}

export interface Brand {
  slug: string;
  name: string;
  origin: string;
  description: string;
  logo?: string;
  featured: boolean;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  image: string;
  productCount?: number;
}
