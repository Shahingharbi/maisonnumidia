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
    ];
  },
};

export default nextConfig;
