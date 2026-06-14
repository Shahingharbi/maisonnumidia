import type { Product } from "@/lib/types";
import type { BlogArticle } from "@/data/blog";

const SITE_URL = "https://maisonnumidia.store";
const SITE_NAME = "Maison Numidia";
const TELEPHONE = "+213794496059";
const TELEPHONE_FR = "+33782214993";

function getDynamicPriceValidUntil(): string {
  const next = new Date();
  next.setFullYear(next.getFullYear() + 1, 11, 31);
  return next.toISOString().split("T")[0];
}

export function getProductSchema(product: Product) {
  const additionalProperty: Array<{
    "@type": "PropertyValue";
    name: string;
    value: string;
  }> = [];

  if (product.notes?.top?.length) {
    additionalProperty.push({
      "@type": "PropertyValue",
      name: "Notes de tête",
      value: product.notes.top.join(", "),
    });
  }
  if (product.notes?.heart?.length) {
    additionalProperty.push({
      "@type": "PropertyValue",
      name: "Notes de cœur",
      value: product.notes.heart.join(", "),
    });
  }
  if (product.notes?.base?.length) {
    additionalProperty.push({
      "@type": "PropertyValue",
      name: "Notes de fond",
      value: product.notes.base.join(", "),
    });
  }
  if (product.family) {
    additionalProperty.push({
      "@type": "PropertyValue",
      name: "Famille olfactive",
      value: product.family,
    });
  }
  if (product.occasions?.length) {
    additionalProperty.push({
      "@type": "PropertyValue",
      name: "Occasions",
      value: product.occasions.join(", "),
    });
  }
  if (product.seasons?.length) {
    additionalProperty.push({
      "@type": "PropertyValue",
      name: "Saisons",
      value: product.seasons.join(", "),
    });
  }
  if (product.concentration) {
    additionalProperty.push({
      "@type": "PropertyValue",
      name: "Concentration",
      value: product.concentration,
    });
  }
  if (product.volume) {
    additionalProperty.push({
      "@type": "PropertyValue",
      name: "Volume",
      value: product.volume,
    });
  }

  const audience =
    product.gender === "homme"
      ? { "@type": "PeopleAudience", suggestedGender: "https://schema.org/Male" }
      : product.gender === "femme"
      ? { "@type": "PeopleAudience", suggestedGender: "https://schema.org/Female" }
      : { "@type": "PeopleAudience", suggestedGender: "https://schema.org/Unisex" };

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.brand} ${product.name} ${product.volume}`,
    description: product.shortDescription,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    category: "Beauty/Fragrance",
    sku: product.id,
    audience,
    additionalProperty,
    image: {
      "@type": "ImageObject",
      url: `${SITE_URL}${product.image}`,
      contentUrl: `${SITE_URL}${product.image}`,
      width: 800,
      height: 1067,
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "DZD",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${SITE_URL}/parfums/${product.slug}`,
      priceValidUntil: getDynamicPriceValidUntil(),
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
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
  };
}

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: "Maison Numidia Parfumerie",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.png`,
      width: 512,
      height: 512,
    },
    description:
      "Parfumerie en ligne algérienne proposant des parfums originaux livrés dans les 58 wilayas. Paiement à la réception, garantie d'authenticité.",
    foundingDate: "2024",
    sameAs: [
      "https://www.instagram.com/maisonnumidia",
      "https://www.facebook.com/maisonnumidia",
      "https://www.tiktok.com/@maisonnumidia",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: TELEPHONE,
        contactType: "customer service",
        availableLanguage: ["French", "Arabic"],
        areaServed: "DZ",
      },
      {
        "@type": "ContactPoint",
        telephone: TELEPHONE_FR,
        contactType: "customer service",
        availableLanguage: ["French"],
      },
    ],
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
    priceRange: "2000 DA — 42000 DA",
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
        dayOfWeek: [
          "Saturday",
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        opens: "09:00",
        closes: "21:00",
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
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
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
  const authorName = article.author?.name ?? "L'équipe Maison Numidia";
  const authorRole = article.author?.role;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.metaDescription,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    image: {
      "@type": "ImageObject",
      url: `${SITE_URL}/opengraph-image`,
      width: 1200,
      height: 630,
      caption: article.title,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${article.slug}`,
    },
    author: {
      "@type": "Person",
      name: authorName,
      ...(authorRole ? { jobTitle: authorRole } : {}),
      url: `${SITE_URL}/a-propos`,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
        width: 512,
        height: 512,
      },
    },
    url: `${SITE_URL}/blog/${article.slug}`,
    articleSection: article.category,
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
  const genderLabel =
    product.gender === "homme"
      ? "homme"
      : product.gender === "femme"
      ? "femme"
      : "unisexe";
  const description = `${product.brand} ${product.name} ${product.concentration} ${product.volume} ${genderLabel} 100% authentique. Livraison Yalidine, paiement à la réception.`;
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
  const description = `${name}${brand} 100% originaux. Livraison Yalidine 58 wilayas, paiement à la réception. Prix en dinar algérien.`;
  return { title, description };
}
