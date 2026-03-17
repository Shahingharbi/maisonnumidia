import type { Product } from "@/lib/types";

const SITE_URL = "https://maisonnumidia.store";
const SITE_NAME = "Maison Numidia";

export function getProductSchema(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.brand} ${product.name} ${product.volume}`,
    description: product.shortDescription,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "DZD",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: SITE_NAME,
      },
    },
    url: `${SITE_URL}/parfums/${product.slug}`,
    image: `${SITE_URL}${product.image}`,
  };
}

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "French",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "DZ",
      addressLocality: "Blida",
    },
  };
}

export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

export function generateProductMeta(product: Product) {
  // Title: "Keyword Parfum Algérie Original | Maison Numidia"
  const keyword = product.h1 ?? `${product.brand} ${product.name}`;
  // No "| Maison Numidia" here — the layout template adds it automatically
  const title = `${keyword} Original`;
  // Description: natural, no price, max ~155 chars
  const genderLabel = product.gender === "homme" ? "masculin" : product.gender === "femme" ? "féminin" : "mixte";
  const description = `Découvrez ${product.brand} ${product.name} en Algérie chez Maison Numidia. Parfum ${genderLabel} ${product.concentration} 100% authentique. Livraison rapide dans toutes les wilayas algériennes, paiement à la réception.`;
  return { title, description };
}

export function generateCategoryMeta(
  category: "homme" | "femme" | "oriental",
  brandName?: string
) {
  const categoryNames = {
    homme: "Parfums Homme",
    femme: "Parfums Femme",
    oriental: "Parfums Orientaux",
  };
  const name = categoryNames[category];
  const brand = brandName ? ` ${brandName}` : "";
  const title = `${name}${brand} Original en Algérie — Prix en Dinar`;
  const description = `Achetez ${name.toLowerCase()}${brand} originaux en Algérie. Livraison Yalidine dans les 58 wilayas, paiement à la réception. Prix en dinar algérien, 100% authentique.`;
  return { title, description };
}
