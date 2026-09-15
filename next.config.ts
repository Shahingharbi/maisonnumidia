import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    // Images servies telles quelles (fichiers statiques + CDN Unsplash), SANS l'optimiseur
    // d'images Vercel : son quota gratuit est épuisé et il renvoyait "402 PAYMENT_REQUIRED"
    // pour toute variante pas encore en cache -> images produit qui ne s'affichaient pas
    // "des fois" (constaté le 15/09/2026). Les photos produit sont déjà légères (~23 Ko,
    // 375x500) ; les visuels Unsplash sont déjà dimensionnés/compressés par Unsplash.
    // Ne pas réactiver sans vérifier le quota Vercel (Settings > Usage > Image Optimization).
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "fimgs.net" },
      { protocol: "https", hostname: "www.fragrantica.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|woff2)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // www -> apex (canonicalisation domaine). DOIT rester en premier : les URLs
      // /parfums/... ci-dessous ont des destinations relatives qui résolvent sur
      // le même host que la requête entrante — sans cette règle en tête, un visiteur
      // arrivant sur www resterait sur www après un 2e redirect.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.maisonnumidia.store" }],
        destination: "https://maisonnumidia.store/:path*",
        permanent: true,
      },
      { source: "/parfums/acqua-di-gio-femme-armani", destination: "/parfums/armani-acqua-di-gioia", permanent: true },
      { source: "/parfums/armani-si-passione", destination: "/parfums/si-passione-armani", permanent: true },
      // Fusion de doublons (juin 2026) — 301 vers la fiche canonique
      { source: "/parfums/allure-homme-chanel", destination: "/parfums/chanel-allure-homme", permanent: true },
      { source: "/parfums/calvin-klein-eternity-homme", destination: "/parfums/eternity-homme-ck", permanent: true },
      { source: "/parfums/coach-wild-rose-femme", destination: "/parfums/coach-wild-rose", permanent: true },
      { source: "/parfums/dior-sauvage-elixir-intense", destination: "/parfums/dior-sauvage-elixir", permanent: true },
      // Fusion de doublons round 2 (juin 2026)
      { source: "/parfums/elizabeth-arden-fifth-avenue", destination: "/parfums/5th-avenue-elizabeth-arden", permanent: true },
      { source: "/parfums/prada-candy-femme", destination: "/parfums/prada-candy", permanent: true },
      { source: "/parfums/versace-crystal-noir-edp", destination: "/parfums/crystal-noir-versace", permanent: true },
      { source: "/parfums/carolina-herrera-212-men-edp", destination: "/parfums/carolina-herrera-212-men", permanent: true },
      { source: "/parfums/paco-rabanne-phantom-le-parfum", destination: "/parfums/paco-rabanne-phantom-parfum", permanent: true },
      { source: "/parfums/kenzo-flower-edp", destination: "/parfums/kenzo-flower", permanent: true },
      // Anciens slugs retirés en mars 2026 (dédoublonnage), jamais redirigés depuis —
      // 404 vivants trouvés en audit sept. 2026 (images orphelines dans public/images/products/)
      { source: "/parfums/armani-si-edp", destination: "/parfums/armani-si", permanent: true },
      { source: "/parfums/chanel-allure-homme-sport", destination: "/parfums/allure-homme-sport-chanel", permanent: true },
      { source: "/parfums/chanel-bleu-de-chanel-parfum", destination: "/parfums/bleu-de-chanel-parfum", permanent: true },
      { source: "/parfums/dior-fahrenheit", destination: "/parfums/fahrenheit-dior", permanent: true },
      { source: "/parfums/dior-hypnotic-poison", destination: "/parfums/hypnotic-poison-dior", permanent: true },
      { source: "/parfums/dior-j-adore-infinissime", destination: "/parfums/dior-jadore-infinissime", permanent: true },
      { source: "/parfums/dior-joy", destination: "/parfums/joy-dior", permanent: true },
      { source: "/parfums/dior-miss-dior-blooming-bouquet", destination: "/parfums/miss-dior-blooming-bouquet", permanent: true },
      { source: "/parfums/hermes-voyage", destination: "/parfums/voyage-d-hermes", permanent: true },
      { source: "/parfums/jean-paul-gaultier-scandal", destination: "/parfums/scandal-jean-paul-gaultier", permanent: true },
      { source: "/parfums/lancome-idole-aura", destination: "/parfums/idole-aura-lancome", permanent: true },
      { source: "/parfums/lancome-la-nuit-tresor", destination: "/parfums/la-nuit-tresor-lancome", permanent: true },
      { source: "/parfums/versace-bright-crystal", destination: "/parfums/bright-crystal-versace", permanent: true },
      { source: "/parfums/versace-eros-flame-parfum", destination: "/parfums/eros-flame-versace", permanent: true },
      { source: "/parfums/versace-eros-flame", destination: "/parfums/eros-flame-versace", permanent: true },
      { source: "/parfums/versace-yellow-diamond", destination: "/parfums/yellow-diamond-versace", permanent: true },
      { source: "/parfums/ysl-black-opium", destination: "/parfums/black-opium-ysl", permanent: true },
    ];
  },
};

export default nextConfig;
