import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/panier", "/commander", "/confirmation", "/tableau-de-bord"],
      },
      {
        userAgent: ["GPTBot", "OAI-SearchBot", "ChatGPT-User"],
        allow: "/",
        disallow: ["/api/", "/panier", "/commander", "/tableau-de-bord"],
      },
      {
        userAgent: ["ClaudeBot", "Claude-Web", "anthropic-ai"],
        allow: "/",
        disallow: ["/api/", "/panier", "/commander", "/tableau-de-bord"],
      },
      {
        userAgent: ["PerplexityBot", "Perplexity-User"],
        allow: "/",
        disallow: ["/api/", "/panier", "/commander", "/tableau-de-bord"],
      },
      {
        userAgent: ["Google-Extended", "GoogleOther"],
        allow: "/",
        disallow: ["/api/", "/panier", "/commander", "/tableau-de-bord"],
      },
      {
        // Robots qui aspirent le site sans amener de clients : ni moteur de recherche
        // utilisé en Algérie, ni outil SEO de Shahin. Chaque page qu'ils lisent compte dans
        // le quota de requêtes Vercel, dont le dépassement a mis tous les sites du compte
        // en pause le 16/10/2026.
        userAgent: [
          "CCBot", "Bytespider", "Amazonbot", "meta-externalagent", "FacebookBot",
          "PetalBot", "MJ12bot", "DotBot", "BLEXBot", "Barkrowler", "DataForSeoBot",
          "Timpibot", "ImagesiftBot", "Diffbot", "omgili", "omgilibot", "cohere-ai",
        ],
        disallow: "/",
      },
    ],
    sitemap: "https://maisonnumidia.store/sitemap.xml",
    host: "https://maisonnumidia.store",
  };
}
