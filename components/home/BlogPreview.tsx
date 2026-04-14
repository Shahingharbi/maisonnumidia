import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { articles } from "@/data/blog";

const articleImages: Record<string, string> = {
  "meilleur-parfum-homme":
    "https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&w=800&q=80",
  "parfum-de-niche-algerie":
    "https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=800&q=80",
  "eau-de-parfum-vs-eau-de-toilette":
    "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80",
};

const fallbackImages = [
  "https://images.unsplash.com/photo-1563170351-be82bc888aa4?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?auto=format&fit=crop&w=800&q=80",
];

export default function BlogPreview() {
  const latest = articles.slice(0, 3);

  return (
    <section className="bg-[#FAFAF8] py-16 sm:py-20 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs font-medium text-[#AC9270] tracking-[1.5px] uppercase">
              Conseils et expertise
            </span>
            <h2
              className="text-[clamp(28px,3vw,38px)] text-[#535359] mt-3"
              style={{ fontFamily: "var(--font-libre-bodoni), Georgia, serif", fontWeight: 400 }}
            >
              Guides &amp; Conseils Parfums
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden sm:flex items-center gap-1 text-sm text-[#8A8A90] hover:text-[#AC9270] transition-colors"
          >
            Tous les articles
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {latest.map((article, index) => {
            const imageUrl =
              articleImages[article.slug] ?? fallbackImages[index % fallbackImages.length];

            return (
              <article
                key={article.slug}
                className="group bg-white border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                {/* Article image */}
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  {/* Category label on image */}
                  <div className="absolute bottom-4 left-5">
                    <span className="inline-block text-[10px] font-medium text-[#C9A84C] tracking-[1.5px] uppercase bg-white/90 backdrop-blur-sm px-2.5 py-1">
                      {article.category}
                    </span>
                  </div>
                  {/* Read time */}
                  <div className="absolute top-4 right-5">
                    <span className="text-[10px] text-white/70 bg-black/30 backdrop-blur-sm px-2 py-1">
                      {article.readTime} min
                    </span>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-base font-bold text-[#111111] leading-snug mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-[#8A8A90] leading-relaxed mb-5 flex-1 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <Link
                    href={`/blog/${article.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#535359] hover:text-[#AC9270] transition-colors group/link mt-auto pt-4 border-t border-gray-100"
                  >
                    Lire l&apos;article
                    <ArrowRight size={13} className="group-hover/link:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link href="/blog" className="text-sm text-[#AC9270]">
            Voir tous les articles
          </Link>
        </div>

      </div>
    </section>
  );
}
