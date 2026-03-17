import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticleBySlug, getAllArticleSlugs } from "@/data/blog";
import { Clock, ArrowLeft, ArrowRight } from "lucide-react";
import Breadcrumb from "@/components/layout/Breadcrumb";

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
    title: article.metaTitle,
    description: article.metaDescription,
    alternates: { canonical: `https://maisonnumidia.store/blog/${slug}` },
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      type: "article",
      publishedTime: article.publishedAt,
    },
  };
}

// Simple markdown-like renderer for the article content
function renderContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={key++} className="text-xl sm:text-2xl font-bold text-[#111111] mt-10 mb-4">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={key++} className="text-lg font-bold text-[#111111] mt-7 mb-3">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith("**") && line.endsWith("**") && line.length > 4) {
      elements.push(
        <p key={key++} className="font-semibold text-[#111111] mt-4 mb-1">
          {line.slice(2, -2)}
        </p>
      );
    } else if (line.startsWith("- ")) {
      elements.push(
        <li key={key++} className="text-gray-600 leading-relaxed ml-4">
          {line.slice(2)}
        </li>
      );
    } else if (line.startsWith("---")) {
      elements.push(<hr key={key++} className="border-gray-100 my-8" />);
    } else if (line.startsWith("| ")) {
      // Table — skip for now, render as pre
      elements.push(
        <div key={key++} className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <tbody>
              {line.split("|").filter(Boolean).map((cell, ci) => (
                <td key={ci} className="border border-gray-100 px-3 py-2 text-gray-600">
                  {cell.trim()}
                </td>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else if (line.trim() !== "") {
      // Parse inline bold and links
      const parsed = parseInline(line);
      elements.push(
        <p key={key++} className="text-gray-600 leading-relaxed my-3">
          {parsed}
        </p>
      );
    }
  }

  return elements;
}

function parseInline(text: string): React.ReactNode {
  // Handle **bold** and [link](href)
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold text-[#111111]">{part.slice(2, -2)}</strong>;
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return <Link key={i} href={linkMatch[2]} className="text-[#C9A84C] hover:underline">{linkMatch[1]}</Link>;
    }
    return part;
  });
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const schemaArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription,
    datePublished: article.publishedAt,
    publisher: {
      "@type": "Organization",
      name: "Maison Numidia",
      url: "https://maisonnumidia.store",
    },
    url: `https://maisonnumidia.store/blog/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaArticle) }}
      />

      {/* Header */}
      <div className="bg-white border-b border-gray-100 pt-6 pb-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="mb-6">
            <Breadcrumb
              items={[
                { label: "Blog", href: "/blog" },
                { label: article.title },
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
        </div>
      </div>

      {/* Article content */}
      <article className="py-12 sm:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="prose-custom">
            {renderContent(article.content)}
          </div>

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
              dans les 58 wilayas et paiement à la livraison.
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
