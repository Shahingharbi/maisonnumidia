import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "@/components/Lien";
import { getArticleBySlug, getAllArticleSlugs } from "@/data/blog";
import { Clock, ArrowLeft, ArrowRight } from "lucide-react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { getBlogPostingSchema, getBreadcrumbSchema, getFAQSchema } from "@/lib/seo";
import { resolvePrices } from "@/lib/blog-content";
import { titrePage, titreTexte } from "@/lib/titres";
import { renderContent } from "@/components/contenu/Markdown";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: titrePage(`/blog/${slug}`, article.metaTitle),
    description: article.metaDescription,
    alternates: { canonical: `https://maisonnumidia.store/blog/${slug}` },
    openGraph: {
      title: titreTexte(`/blog/${slug}`, article.metaTitle),
      description: article.metaDescription,
      type: "article",
      publishedTime: article.publishedAt,
    },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const blogSchema = getBlogPostingSchema(article);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: article.title, url: `/blog/${slug}` },
  ]);
  const faqSchema = article.faq?.length ? getFAQSchema(article.faq) : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-100 pt-6 pb-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="mb-6">
            <Breadcrumb
              items={[
                { label: "Blog", href: "/blog" },
                { label: article.title, href: `/blog/${article.slug}` },
              ]}
            />
          </div>

          <div className="flex items-center gap-3 mb-5">
            <span className="bg-[#C9A84C]/10 text-[#C9A84C] text-xs font-semibold px-3 py-1 rounded-full">
              {article.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Clock size={11} />
              {article.readTime} min de lecture
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#111111] leading-tight mb-4">
            {article.title}
          </h1>
          <p className="text-gray-400 text-base leading-relaxed max-w-2xl">
            {article.excerpt}
          </p>

          {/* Author byline + publication date */}
          <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-100">
            <div className="w-10 h-10 rounded-full bg-[#C9A84C]/15 flex items-center justify-center text-[#C9A84C] font-semibold text-sm">
              MN
            </div>
            <div className="text-sm">
              <Link
                href="/a-propos"
                className="font-semibold text-[#111111] hover:text-[#C9A84C] transition-colors"
              >
                {article.author?.name ?? "L'équipe Maison Numidia"}
              </Link>
              {article.author?.role && (
                <span className="text-gray-400"> · {article.author.role}</span>
              )}
              <div className="text-xs text-gray-400 mt-0.5">
                Publié le{" "}
                <time dateTime={article.publishedAt}>
                  {new Date(article.publishedAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article content */}
      <article className="py-12 sm:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="prose-custom">
            {renderContent(resolvePrices(article.content))}
          </div>

          {/* FAQ — bloc Q/R structuré (citable par les IA + schema FAQPage) */}
          {article.faq?.length ? (
            <section className="mt-12 border-t border-gray-100 pt-10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#111111] mb-6">
                Questions fréquentes
              </h2>
              <div className="space-y-3">
                {article.faq.map((f) => (
                  <details key={f.question} className="group bg-[#FAFAF8] rounded-xl border border-gray-100 p-4 sm:p-5">
                    <summary className="font-semibold text-[#111111] cursor-pointer list-none flex items-center justify-between gap-3">
                      {f.question}
                      <span className="text-[#C9A84C] text-lg transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <p className="text-gray-600 text-sm leading-relaxed mt-3">{f.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          ) : null}

          {/* Footer CTA */}
          <div className="mt-14 p-6 sm:p-8 bg-[#F8F7F5] rounded-2xl border border-[#E8E8E8]">
            <p className="text-xs font-semibold text-[#C9A84C] tracking-[0.2em] uppercase mb-2">
              Maison Numidia
            </p>
            <h3 className="text-lg font-bold text-[#111111] mb-2">
              Commandez vos parfums en Algérie
            </h3>
            <p className="text-sm text-gray-400 mb-5 leading-relaxed">
              Tous les parfums cités dans cet article sont disponibles avec livraison
              dans les 69 wilayas et paiement à la livraison.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/parfums-homme"
                className="inline-flex items-center gap-2 bg-[#111111] hover:bg-[#333] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
              >
                Parfums Homme <ArrowRight size={14} />
              </Link>
              <Link
                href="/parfums-femme"
                className="inline-flex items-center gap-2 border border-gray-200 hover:border-[#C9A84C] text-gray-700 hover:text-[#C9A84C] text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
              >
                Parfums Femme
              </Link>
            </div>
          </div>

          {/* Back to blog */}
          <div className="mt-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#C9A84C] transition-colors"
            >
              <ArrowLeft size={14} />
              Retour au blog
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
