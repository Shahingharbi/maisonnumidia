import type { Metadata } from "next";
import Link from "next/link";
import { articles } from "@/data/blog";
import { Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog Parfums — Conseils, Guides & Tendances en Algérie | Maison Numidia",
  description: "Guides d'achat parfums, conseils de pro et tendances olfactives en Algérie. Tout savoir pour choisir son parfum.",
  alternates: { canonical: "https://maisonnumidia.store/blog" },
};

export default function BlogPage() {
  return (
    <>
      <div className="bg-white border-b border-gray-100 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#C9A84C] uppercase mb-3">
            Nos guides
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#111111] mb-3">
            Blog & Conseils Parfums
          </h1>
          <p className="text-gray-400 max-w-xl text-sm sm:text-base">
            Guides d'achat, comparatifs et conseils de nos experts pour choisir
            le parfum idéal disponible en Algérie.
          </p>
        </div>
      </div>

      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-[#C9A84C]/30 hover:shadow-md transition-all duration-200"
              >
                <div className="bg-[#F8F7F5] h-44 flex items-center justify-center">
                  <span className="text-5xl">📖</span>
                </div>
                <div className="p-5 flex flex-col gap-3 flex-1">
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="bg-[#C9A84C]/10 text-[#C9A84C] px-2 py-0.5 rounded-full font-medium">
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {article.readTime} min
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-[#111111] group-hover:text-[#C9A84C] transition-colors leading-snug">
                    {article.title}
                  </h2>
                  <p className="text-sm text-gray-400 leading-relaxed line-clamp-3 flex-1">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-1 text-sm font-medium text-[#111111] group-hover:text-[#C9A84C] transition-colors mt-auto pt-2">
                    Lire l'article
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
