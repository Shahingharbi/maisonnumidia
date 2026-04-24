import type { Metadata, Viewport } from "next";
import { DM_Sans, Libre_Bodoni } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { CartProvider } from "@/contexts/CartContext";
import {
  getOrganizationSchema,
  getLocalBusinessSchema,
  getWebsiteSchema,
} from "@/lib/seo";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const libreBodoni = Libre_Bodoni({
  variable: "--font-libre-bodoni",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#111111",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Parfum Original en Algérie | Maison Numidia",
    template: "%s | Maison Numidia",
  },
  description:
    "Achetez votre parfum original en Algérie chez Maison Numidia. Dior, Chanel, Lattafa, Al Haramain — 100% authentique, livraison Yalidine 58 wilayas, paiement à la réception.",
  metadataBase: new URL("https://maisonnumidia.store"),
  applicationName: "Maison Numidia",
  authors: [{ name: "Maison Numidia", url: "https://maisonnumidia.store" }],
  creator: "Maison Numidia",
  publisher: "Maison Numidia",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  openGraph: {
    siteName: "Maison Numidia",
    locale: "fr_DZ",
    type: "website",
    url: "https://maisonnumidia.store",
    title: "Parfum Original en Algérie | Maison Numidia",
    description:
      "Parfums 100% authentiques en Algérie : Dior, Chanel, Lattafa, Al Haramain. Livraison Yalidine 58 wilayas, paiement à la réception.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Parfum Original en Algérie | Maison Numidia",
    description:
      "Parfums 100% authentiques. Livraison 58 wilayas, paiement à la réception.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "https://maisonnumidia.store",
    languages: {
      "fr-DZ": "https://maisonnumidia.store",
      "fr": "https://maisonnumidia.store",
    },
  },
  verification: {
    other: {
      "geo.region": "DZ",
      "geo.placename": "Blida, Algérie",
    },
  },
  category: "shopping",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const ldGraph = {
    "@context": "https://schema.org",
    "@graph": [
      getOrganizationSchema(),
      getLocalBusinessSchema(),
      getWebsiteSchema(),
    ],
  };

  return (
    <html lang="fr-DZ">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://fimgs.net" />
        <meta name="geo.region" content="DZ" />
        <meta name="geo.placename" content="Blida, Algérie" />
        <meta name="language" content="fr-DZ" />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-77YXRM3HBT"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-77YXRM3HBT');
          `}
        </Script>
        <Script id="microsoft-clarity" strategy="lazyOnload">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "w1p8ai0hag");
          `}
        </Script>
      </head>
      <body className={`${dmSans.variable} ${libreBodoni.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ldGraph) }}
        />
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}
