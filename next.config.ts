import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
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
    ];
  },
};

export default nextConfig;
