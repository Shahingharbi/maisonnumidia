import type { Product } from "@/lib/types";
import type { BlogArticle } from "@/data/blog";

const SITE_URL = "https://maisonnumidia.store";
const SITE_NAME = "Maison Numidia";
const TELEPHONE = "+213699418569";

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
    category: product.category,
    sku: product.id,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "DZD",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${SITE_URL}/parfums/${product.slug}`,
      priceValidUntil: "2026-12-31",
      seller: {
        "@type": "Organization",
        name: SITE_NAME,
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "DZ",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: 500,
          currency: "DZD",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "DZ",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 1,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 2,
            maxValue: 5,
            unitCode: "DAY",
          },
        },
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
    sameAs: [
      "https://www.instagram.com/maisonnumidia",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: TELEPHONE,
      contactType: "customer service",
      availableLanguage: ["French", "Arabic"],
      areaServed: "DZ",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "DZ",
      addressRegion: "Blida",
      addressLocality: "Blida",
    },
  };
}

export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": `${SITE_URL}/#store`,
    name: SITE_NAME,
    url: SITE_URL,
    image: `${SITE_URL}/logo.png`,
    telephone: TELEPHONE,
    priceRange: "2000 DA — 18000 DA",
    currenciesAccepted: "DZD",
    paymentAccepted: "Cash on Delivery",
    address: {
      "@type": "PostalAddress",
      addressCountry: "DZ",
      addressRegion: "Blida",
      addressLocality: "Blida",
    },
    areaServed: {
      "@type": "Country",
      name: "Algérie",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
        opens: "09:00",
        closes: "19:00",
      },
    ],
  };
}

export function getWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "fr-DZ",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
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

export function getBlogPostingSchema(article: BlogArticle) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.metaDescription,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    image: `${SITE_URL}/opengraph-image`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${article.slug}`,
    },
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    url: `${SITE_URL}/blog/${article.slug}`,
  };
}

export function getItemListSchema(
  items: { name: string; url: string }[],
  listName: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: `${SITE_URL}${item.url}`,
    })),
  };
}

export function getFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

export function generateProductMeta(product: Product) {
  const keyword = product.h1 ?? `${product.brand} ${product.name}`;
  const title = `${keyword} Original`;
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
