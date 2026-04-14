"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  background: string;
  image?: string;
  accentLabel: string;
  title: string;
  titleItalic?: string;
  description: string;
  cta: string;
  ctaHref: string;
  ctaSecondary?: string;
  ctaSecondaryHref?: string;
  contentAlign: "left" | "right";
  textColor: string;
}

const slides: Slide[] = [
  {
    background:
      "linear-gradient(135deg, #d4c4a8 0%, #c8b090 30%, #f0e0c8 70%, #e8d0b0 100%)",
    image:
      "https://images.unsplash.com/photo-1563170351-be82bc888aa4?auto=format&fit=crop&w=1400&q=80",
    accentLabel: "Parfumerie en ligne — Algérie",
    title: "Parfum Original\nen Algérie, livré dans\n",
    titleItalic: "les 58 wilayas",
    description:
      "Dior, Chanel, Lattafa, Al Haramain — 100% authentique, paiement à la réception.",
    cta: "Découvrir la collection",
    ctaHref: "/parfums-homme",
    ctaSecondary: "Parfums Femme",
    ctaSecondaryHref: "/parfums-femme",
    contentAlign: "left",
    textColor: "#ffffff",
  },
  {
    background:
      "linear-gradient(160deg, #0c1428 0%, #141832 30%, #1a1020 60%, #2a1818 100%)",
    image:
      "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?auto=format&fit=crop&w=1400&q=80",
    accentLabel: "Collection Orientaux",
    title: "Oud, Ambre\n",
    titleItalic: "& Musc d'Orient",
    description:
      "Lattafa, Al Haramain, Rasasi — les parfums orientaux les plus demandés en Algérie.",
    cta: "Explorer les Orientaux",
    ctaHref: "/parfums-orientaux",
    contentAlign: "right",
    textColor: "#ffffff",
  },
  {
    background:
      "linear-gradient(135deg, #e0d0b8 0%, #d0c0a0 40%, #f0e8d8 100%)",
    image:
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1400&q=80",
    accentLabel: "Prestige & Authenticité",
    title: "Les grandes maisons\n",
    titleItalic: "à prix algérien",
    description:
      "Dior Sauvage, Bleu de Chanel, 1 Million — livraison express Yalidine.",
    cta: "Voir les Bestsellers",
    ctaHref: "/parfums-homme",
    ctaSecondary: "Toutes les marques",
    ctaSecondaryHref: "/marques",
    contentAlign: "left",
    textColor: "#ffffff",
  },
];

export default function Hero() {
  const [active, setActive] = useState(0);

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setActive((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "clamp(420px, 50vw, 580px)" }}
    >
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{
            background: slide.background,
            opacity: i === active ? 1 : 0,
            pointerEvents: i === active ? "auto" : "none",
          }}
        >
          {/* Background image */}
          {slide.image && (
            <>
              <Image
                src={slide.image}
                alt=""
                fill
                className="object-cover"
                priority={i === 0}
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-black/45" />
            </>
          )}

          {/* Brand watermark */}
          <div
            className="absolute top-8 opacity-[0.08]"
            style={{
              fontFamily: "var(--font-libre-bodoni), Georgia, serif",
              fontSize: "clamp(60px, 10vw, 120px)",
              fontWeight: 400,
              color: slide.textColor,
              right: slide.contentAlign === "left" ? "clamp(24px, 6vw, 88px)" : "auto",
              left: slide.contentAlign === "right" ? "clamp(24px, 6vw, 88px)" : "auto",
              lineHeight: 1,
            }}
          >
            MN
          </div>

          {/* Content */}
          <div
            className="absolute bottom-16 lg:bottom-20 max-w-xl"
            style={{
              left: slide.contentAlign === "left" ? "clamp(24px, 6vw, 88px)" : "auto",
              right: slide.contentAlign === "right" ? "clamp(24px, 6vw, 88px)" : "auto",
              textAlign: slide.contentAlign,
            }}
          >
            <span
              className="inline-block mb-4"
              style={{
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: slide.textColor,
                opacity: 0.7,
              }}
            >
              {slide.accentLabel}
            </span>

            {i === 0 ? (
              <h1
                style={{
                  fontFamily: "var(--font-libre-bodoni), Georgia, serif",
                  fontSize: "clamp(28px, 3.5vw, 48px)",
                  fontWeight: 400,
                  lineHeight: 1.15,
                  color: slide.textColor,
                  whiteSpace: "pre-line",
                }}
              >
                {slide.title}
                {slide.titleItalic && (
                  <em style={{ fontStyle: "italic" }}>{slide.titleItalic}</em>
                )}
              </h1>
            ) : (
              <h2
                style={{
                  fontFamily: "var(--font-libre-bodoni), Georgia, serif",
                  fontSize: "clamp(28px, 3.5vw, 48px)",
                  fontWeight: 400,
                  lineHeight: 1.15,
                  color: slide.textColor,
                  whiteSpace: "pre-line",
                }}
              >
                {slide.title}
                {slide.titleItalic && (
                  <em style={{ fontStyle: "italic" }}>{slide.titleItalic}</em>
                )}
              </h2>
            )}

            <p
              className="mt-4 max-w-md"
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                color: slide.textColor,
                opacity: 0.7,
              }}
            >
              {slide.description}
            </p>

            <div className="flex flex-wrap gap-3 mt-6" style={{ justifyContent: slide.contentAlign === "right" ? "flex-end" : "flex-start" }}>
              <Link
                href={slide.ctaHref}
                className="inline-block transition-opacity duration-300 hover:opacity-70"
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  color: slide.textColor,
                  borderBottom: `1px solid ${slide.textColor}`,
                  paddingBottom: 2,
                }}
              >
                {slide.cta}
              </Link>
              {slide.ctaSecondary && slide.ctaSecondaryHref && (
                <Link
                  href={slide.ctaSecondaryHref}
                  className="inline-block transition-opacity duration-300 hover:opacity-70"
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    color: slide.textColor,
                    opacity: 0.6,
                    paddingBottom: 2,
                  }}
                >
                  {slide.ctaSecondary}
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors z-10 cursor-pointer"
        aria-label="Précédent"
      >
        <ChevronLeft className="w-7 h-7" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors z-10 cursor-pointer"
        aria-label="Suivant"
      >
        <ChevronRight className="w-7 h-7" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="transition-all duration-300 cursor-pointer"
            style={{
              width: i === active ? 32 : 12,
              height: 2,
              backgroundColor:
                i === active ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)",
            }}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

    </section>
  );
}
