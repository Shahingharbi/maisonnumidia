import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/panier", "/commander", "/confirmation"],
      },
      {
        userAgent: ["GPTBot", "OAI-SearchBot", "ChatGPT-User"],
        allow: "/",
        disallow: ["/api/", "/panier", "/commander"],
      },
      {
        userAgent: ["ClaudeBot", "Claude-Web", "anthropic-ai"],
        allow: "/",
        disallow: ["/api/", "/panier", "/commander"],
      },
      {
        userAgent: ["PerplexityBot", "Perplexity-User"],
        allow: "/",
        disallow: ["/api/", "/panier", "/commander"],
      },
      {
        userAgent: ["Google-Extended", "GoogleOther"],
        allow: "/",
        disallow: ["/api/", "/panier", "/commander"],
      },
      {
        userAgent: "CCBot",
        disallow: "/",
      },
    ],
    sitemap: "https://maisonnumidia.store/sitemap.xml",
    host: "https://maisonnumidia.store",
  };
}
