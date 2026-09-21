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
  // "EDP Intense", "Extrait de Parfum" et "Cologne" sont des concentrations réelles
  // confirmées sur Fragrantica pendant l'audit de septembre 2026 : l'union d'origine
  // (EDP/EDT/EDC/Parfum) ne les couvrait pas et mentait sur le contenu de products.json.
  concentration:
    | "EDP"
    | "EDT"
    | "EDC"
    | "Parfum"
    | "EDP Intense"
    | "EDT Intense"
    | "Extrait de Parfum"
    | "Cologne";
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
