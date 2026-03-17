import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { articles } from "@/data/blog";

// Gradient header per article category
const articleStyles: Record<string, { gradient: string; label: string }> = {
  "meilleur-parfum-homme": {
    gradient: "from-[#0f0f0f] via-[#1a1a2e] to-[#2d2d4e]",
    label: "Guide d'achat",
  },
  "parfum-de-niche-algerie": {
    gradient: "from-[#2a1a00] via-[#3d2810] to-[#1c1107]",
    label: "Culture Parfum",
  },
  "eau-de-parfum-vs-eau-de-toilette": {
    gradient: "from-[#111111] via-[#1f1f1f] to-[#2a2a2a]",
    label: "Guide d'achat",
  },
};

const fallbackStyle = {
  gradient: "from-[#111111] to-[#2a2a2a]",
  label: "Conseils",
};

export default function BlogPreview() {
  const latest = articles.slice(0, 3);

  return (
    <section className="bg-[#FAFAF8] py-16 sm:py-20 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs tracking-[0.2em] text-[#C9A84C] uppercase font-medium mb-2">
              Conseils et expertise
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111111]">
              Guides &amp; Conseils Parfums
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden sm:flex items-center gap-1 text-sm text-gray-400 hover:text-[#C9A84C] transition-colors"
          >
            Tous les articles
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {latest.map((article) => {
            const style = articleStyles[article.slug] ?? fallbackStyle;
            return (
              <article
                key={article.slug}
                className="bg-white border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
              >
                {/* Article header image */}
                <div className={`relative h-44 bg-gradient-to-br ${style.gradient} flex items-end p-5`}>
                  {/* Decorative accent line */}
                  <div className="absolute top-5 left-5 h-px w-8 bg-[#C9A84C]" />
                  <div>
                    <span className="inline-block text-xs font-semibold text-[#C9A84C] tracking-[0.15em] uppercase mb-2">
                      {article.category}
                    </span>
                    <p className="text-white/30 text-xs">{article.readTime} min de lecture</p>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-base font-bold text-[#111111] leading-snug mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-5 flex-1 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <Link
                    href={`/blog/${article.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#111111] hover:text-[#C9A84C] transition-colors group mt-auto pt-4 border-t border-gray-100"
                  >
                    Lire l&apos;article
                    <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link href="/blog" className="text-sm text-[#C9A84C]">
            Voir tous les articles
          </Link>
        </div>

      </div>
    </section>
  );
}
