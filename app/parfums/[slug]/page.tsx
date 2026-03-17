import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getAllProductSlugs, getProductBySlug, getRelatedProducts, formatPrice, getDiscount } from "@/lib/products";
import { getProductSchema, generateProductMeta } from "@/lib/seo";
import Breadcrumb from "@/components/layout/Breadcrumb";
import ProductCard from "@/components/product/ProductCard";
import { Phone, Truck, Shield, ChevronRight } from "lucide-react";
import AddToCartButton from "@/components/product/AddToCartButton";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  const { title, description } = generateProductMeta(product);
  return {
    title,
    description,
    alternates: { canonical: `https://maisonnumidia.store/parfums/${slug}` },
  };
}

const categoryLabels: Record<string, string> = {
  "parfums-homme": "Parfums Homme",
  "parfums-femme": "Parfums Femme",
  "parfums-orientaux": "Parfums Orientaux",
};

const occasionContext: Record<string, string> = {
  "parfums-homme": "les hommes algériens qui recherchent une fragrance authentique et de qualité",
  "parfums-femme": "les femmes algériennes qui veulent un parfum signature raffiné et durable",
  "parfums-orientaux": "les amateurs de parfums orientaux et oud en Algérie",
};

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product.related);
  const discount = getDiscount(product.price, product.originalPrice);
  const schema = getProductSchema(product);

  const categoryLabel = categoryLabels[product.category] || "Parfums";
  const genderLabel = product.gender === "homme" ? "Pour Homme" : product.gender === "femme" ? "Pour Femme" : "Unisexe";
  const h1 = product.h1 ?? `${product.brand} ${product.name}`;

  // Delivery text variations for SEO richness
  const deliveryWilayas = ["Alger", "Oran", "Constantine", "Annaba", "Blida", "Tizi Ouzou", "Béjaïa", "Sétif", "Batna", "Biskra"];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 pt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <Breadcrumb
            items={[
              { label: categoryLabel, href: `/${product.category}` },
              { label: product.brand, href: `/marques/${product.brandSlug}` },
              { label: product.name },
            ]}
          />
        </div>
      </div>

      {/* Product hero */}
      <section className="bg-white py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

            {/* Image */}
            <div className="relative aspect-square bg-[#F8F8F8] rounded-2xl overflow-hidden">
              <Image
                src={product.image}
                alt={`${h1} — flacon officiel`}
                fill
                className="object-contain p-10"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {product.badge && product.badge !== "Promo" && (
                <div className="absolute top-4 left-4">
                  <span className={`text-sm font-semibold px-3 py-1.5 rounded-full ${
                    product.badge === "Nouveau" ? "bg-[#111111] text-white" :
                    "bg-[#C9A84C] text-[#111111]"
                  }`}>
                    {product.badge}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col gap-5">
              <div>
                <Link
                  href={`/marques/${product.brandSlug}`}
                  className="text-xs font-semibold text-[#C9A84C] tracking-[0.2em] uppercase hover:text-[#8B6914] transition-colors"
                >
                  {product.brand}
                </Link>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] mt-1 leading-tight">
                  {h1}
                </h1>
                <p className="text-gray-400 mt-1 text-sm">
                  {product.family} · {genderLabel} · {product.concentration} {product.volume}
                </p>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-[#111111]">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && discount && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="bg-red-50 text-red-600 text-sm font-bold px-2 py-0.5 rounded">
                      -{discount}%
                    </span>
                  </>
                )}
              </div>

              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{product.shortDescription}</p>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <AddToCartButton product={product} />
                </div>
                <a
                  href="tel:0699418569"
                  className="flex items-center justify-center gap-2 border border-gray-200 hover:border-[#C9A84C]/60 text-gray-700 hover:text-[#C9A84C] font-medium py-4 px-5 rounded-xl transition-colors"
                >
                  <Phone size={16} />
                  06 99 41 85 69
                </a>
              </div>

              {/* Delivery reassurance */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2.5 text-sm text-gray-500 bg-[#FAFAF8] rounded-xl p-3">
                  <Truck size={16} className="text-[#C9A84C] shrink-0" />
                  <span>Livraison Yalidine<br /><strong className="text-[#111111]">58 wilayas</strong></span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-gray-500 bg-[#FAFAF8] rounded-xl p-3">
                  <Shield size={16} className="text-[#C9A84C] shrink-0" />
                  <span>Paiement à la<br /><strong className="text-[#111111]">réception</strong></span>
                </div>
              </div>

              {/* Olfactive pyramid */}
              <div className="border-t border-gray-100 pt-5">
                <h2 className="font-semibold text-[#111111] mb-3 text-sm uppercase tracking-[0.12em]">Pyramide olfactive</h2>
                <div className="space-y-2">
                  {[
                    { label: "Tête", notes: product.notes.top },
                    { label: "Cœur", notes: product.notes.heart },
                    { label: "Fond", notes: product.notes.base },
                  ].map((tier) => (
                    <div key={tier.label} className="flex items-start gap-3 text-sm">
                      <span className="text-gray-400 w-10 shrink-0 pt-0.5">{tier.label}</span>
                      <span className="text-gray-700">{tier.notes.join(", ")}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full SEO content — target 600+ words */}
      <section className="bg-[#FAFAF8] py-14 sm:py-20 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] mb-8">
            {product.brand} {product.name} en Algérie — Guide complet
          </h2>

          <div className="space-y-6 text-gray-600 text-sm sm:text-base leading-relaxed">

            <p>{product.description}</p>

            <h3 className="text-lg font-bold text-[#111111] pt-4">
              Caractéristiques du parfum
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: "Marque", value: product.brand },
                { label: "Concentration", value: product.concentration },
                { label: "Volume", value: product.volume },
                { label: "Famille", value: product.family },
                { label: "Genre", value: genderLabel },
                { label: "Occasions", value: product.occasions.slice(0, 2).join(", ") },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white rounded-xl p-3 border border-gray-100">
                  <div className="text-xs text-gray-400 mb-0.5">{label}</div>
                  <div className="text-sm font-semibold text-[#111111]">{value}</div>
                </div>
              ))}
            </div>

            <h3 className="text-lg font-bold text-[#111111] pt-4">
              Tenue et projection
            </h3>
            <div className="grid grid-cols-2 gap-6 max-w-sm">
              {[
                { label: "Longévité", value: product.longevity },
                { label: "Sillage", value: product.sillage },
              ].map(({ label, value }) => (
                <div key={label}>
                  <span className="text-sm text-gray-500">{label}</span>
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <div
                        key={s}
                        className={`h-2 flex-1 rounded-full ${s <= value ? "bg-[#C9A84C]" : "bg-gray-200"}`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <h3 className="text-lg font-bold text-[#111111] pt-4">
              Quand porter {product.brand} {product.name} ?
            </h3>
            <p>
              {product.brand} {product.name} est particulièrement adapté pour {occasionContext[product.category] ?? "les amateurs de parfums en Algérie"}.
              Les occasions idéales pour cette fragrance sont : {product.occasions.join(", ")}.
              Pour les saisons, ce parfum se porte de préférence en {product.seasons.join(" et ")}.
              Grâce à {product.longevity >= 4 ? "son excellente" : "sa bonne"} longévité,
              il accompagne votre journée du matin jusqu'au soir sans retouche nécessaire.
            </p>

            <h3 className="text-lg font-bold text-[#111111] pt-4">
              Acheter {product.brand} {product.name} en Algérie
            </h3>
            <p>
              Maison Numidia propose {product.brand} {product.name} {product.concentration} {product.volume}
              au prix de <strong className="text-[#111111]">{formatPrice(product.price)}</strong>, livré partout en Algérie
              via Yalidine Express en 24 à 72 heures. Chaque flacon est 100% authentique,
              contrôlé avant expédition. Vous payez uniquement à la réception de votre commande —
              aucune carte bancaire, aucune avance.
            </p>
            <p>
              Nous livrons dans toutes les wilayas : {deliveryWilayas.join(", ")} et bien d&apos;autres.
              Pour commander, ajoutez ce parfum à votre panier et choisissez votre wilaya lors
              de la validation. Notre équipe vous contacte pour confirmation dans les 24 heures.
            </p>

            <h3 className="text-lg font-bold text-[#111111] pt-4">
              Comment reconnaître un {product.name} original ?
            </h3>
            <p>
              Face aux contrefaçons qui circulent en Algérie, voici les vérifications essentielles
              pour s&apos;assurer de l&apos;authenticité d&apos;un {product.brand} {product.name} :
            </p>
            <ul className="space-y-2 list-disc list-inside text-gray-600">
              <li>Le flacon est d&apos;une qualité irréprochable : verre épais, spray fluide, bouchon hermétique.</li>
              <li>Le numéro de lot (batch code) est présent et cohérent sur le flacon et la boîte.</li>
              <li>L&apos;odeur est complexe et évolue sur la peau — un faux sent souvent l&apos;alcool ou le chimique.</li>
              <li>Le prix trop bas est un signal d&apos;alarme : un {product.brand} original a un coût de production réel.</li>
            </ul>
            <p>
              Chez Maison Numidia, <strong className="text-[#111111]">chaque parfum est garanti 100% original</strong>.
              Nous nous engageons sur l&apos;authenticité de chaque flacon. En cas de doute à la réception,
              vous pouvez refuser la livraison — aucune question posée.
            </p>

          </div>

          {/* Bottom CTA */}
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/panier"
              className="inline-flex items-center gap-2 bg-[#111111] hover:bg-[#333] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Voir mon panier
            </Link>
            <Link
              href={`/${product.category}`}
              className="inline-flex items-center gap-2 border border-gray-200 hover:border-[#C9A84C] text-gray-700 hover:text-[#C9A84C] font-medium px-6 py-3 rounded-xl transition-colors"
            >
              Voir plus de {categoryLabel}
            </Link>
          </div>
        </div>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="bg-white py-14 sm:py-20 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-[#111111]">Vous aimerez aussi</h2>
              <Link
                href={`/${product.category}`}
                className="text-sm text-[#C9A84C] hover:text-[#8B6914] transition-colors flex items-center gap-1"
              >
                Voir tout <ChevronRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {related.map((r) => (
                <ProductCard key={r.id} product={r} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
