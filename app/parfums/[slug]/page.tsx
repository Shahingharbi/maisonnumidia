import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  getAllProductSlugs,
  getProductBySlug,
  getRelatedProducts,
  formatPrice,
  getDiscount,
  getLineVersions,
  getBrandPriceStats,
  getDistinctiveNotes,
  getProductsByBrand,
} from "@/lib/products";
import { getProductSchema, getBreadcrumbSchema, generateProductMeta, getFAQSchema } from "@/lib/seo";
import {
  generateFamilyAndFeel,
  generatePersona,
  generateFAQ,
  generatePriceSection,
  generateVersionsSection,
  generateConcentrationSection,
} from "@/lib/product-content";
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
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://maisonnumidia.store/parfums/${slug}`,
      images: [
        { url: `https://maisonnumidia.store${product.image}`, width: 800, height: 1067, alt: title },
        { url: `https://maisonnumidia.store/opengraph-image`, width: 1200, height: 630, alt: title },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`https://maisonnumidia.store${product.image}`],
    },
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
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: categoryLabel, url: `/${product.category}` },
    { name: product.brand, url: `/${product.category}/${product.brandSlug}` },
    { name: product.h1 ?? product.name, url: `/parfums/${product.slug}` },
  ]);

  // Les autres versions de la meme ligne (Black Opium en a cinq, 1 Million aussi).
  // C'est la question la plus posee a Google sur nos fiches, et notre position la plus faible.
  const versions = getLineVersions(product);
  const brandStats = getBrandPriceStats(product.brandSlug);

  // Contenu genere, propre a ce produit
  const priceSection = generatePriceSection(product, brandStats, versions);
  const versionsSection = generateVersionsSection(product, versions);
  const concentrationSection = generateConcentrationSection(product, versions);
  const familyAndFeel = generateFamilyAndFeel(product);
  const persona = generatePersona(product);
  const faq = generateFAQ(product, versions);
  // Nom de la ligne = la version au nom le plus court (Black Opium pour Black Opium Extreme).
  // « Prix de Dior » mais « Prix d'Yves Saint Laurent ».
  const marqueElidee = /^[aeiouyàâäéèêëîïôöùûüh]/i.test(product.brand.trim())
    ? `d'${product.brand}`
    : `de ${product.brand}`;
  // Certains parfums n'ont pas de pyramide decoupee publiee : toutes les notes sont
  // rangees dans `top`. On l'affiche alors comme une simple liste de notes.
  const toutesLesNotes = [...product.notes.top, ...product.notes.heart, ...product.notes.base];
  const pyramideDecoupee = product.notes.heart.length > 0 || product.notes.base.length > 0;

  const ligneNom = versions.length > 1
    ? versions.reduce((a, b) => (a.name.length <= b.name.length ? a : b)).name
    : product.name;
  // Repli quand le parfum n'a pas de soeur : les references de la marque les plus proches en prix.
  const voisinsMarque = getProductsByBrand(product.brandSlug)
    .filter((v) => v.slug !== product.slug && v.inStock)
    .sort((a, b) => Math.abs(a.price - product.price) - Math.abs(b.price - product.price))
    .slice(0, 6);
  const faqSchema = getFAQSchema(faq.map((item) => ({ question: item.q, answer: item.a })));

  // Articles de blog pertinents selon le genre du produit
  const blogLinks: { label: string; href: string }[] = [
    { label: "Comment reconnaître un parfum original", href: "/blog/reconnaitre-parfum-original" },
    ...(product.category === "parfums-homme"
      ? [{ label: "Meilleur parfum homme en Algérie", href: "/blog/meilleur-parfum-homme" }]
      : []),
    ...(product.category === "parfums-femme"
      ? [{ label: "Meilleur parfum femme en Algérie", href: "/blog/meilleur-parfum-femme" }]
      : []),
    ...(product.category === "parfums-orientaux"
      ? [{ label: "Les parfums de niche en Algérie", href: "/blog/parfum-de-niche-algerie" }]
      : []),
    { label: "EDP vs EDT : quelle différence ?", href: "/blog/eau-de-parfum-vs-eau-de-toilette" },
  ];
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 pt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <Breadcrumb
            schema={false}
            items={[
              { label: categoryLabel, href: `/${product.category}` },
              { label: product.brand, href: `/${product.category}/${product.brandSlug}` },
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
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden">
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
                  href="tel:0794496059"
                  className="flex items-center justify-center gap-2 border border-gray-200 hover:border-[#C9A84C]/60 text-gray-700 hover:text-[#C9A84C] font-medium py-4 px-5 rounded-xl transition-colors"
                >
                  <Phone size={16} />
                  07 94 49 60 59
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

              {/* Olfactive pyramid.
                  Quelques parfums n'ont pas de pyramide découpée publiée : toutes leurs notes
                  sont dans `top`. Afficher « Cœur : » et « Fond : » vides donnerait une fiche
                  qui a l'air incomplète — on annonce alors simplement « Notes ». */}
              <div className="border-t border-gray-100 pt-5">
                <h2 className="font-semibold text-[#111111] mb-3 text-sm uppercase tracking-[0.12em]">
                  {pyramideDecoupee ? "Pyramide olfactive" : "Notes olfactives"}
                </h2>
                <div className="space-y-2">
                  {(pyramideDecoupee
                    ? [
                        { label: "Tête", notes: product.notes.top },
                        { label: "Cœur", notes: product.notes.heart },
                        { label: "Fond", notes: product.notes.base },
                      ]
                    : [{ label: "", notes: toutesLesNotes }]
                  )
                    .filter((tier) => tier.notes.length > 0)
                    .map((tier) => (
                      <div key={tier.label || "toutes"} className="flex items-start gap-3 text-sm">
                        {tier.label && (
                          <span className="text-gray-400 w-10 shrink-0 pt-0.5">{tier.label}</span>
                        )}
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

          <div className="space-y-6 text-gray-600 text-sm sm:text-base leading-relaxed">

            {/* La description est redigee en paragraphes : un seul <p> les ecraserait. */}
            {product.description.split(/\n{2,}/).map((para, i) => (
              <p key={i}>{para.trim()}</p>
            ))}

            {/* Le prix ouvre la section : c'est le premier mot que l'internaute ajoute au nom
                du parfum (28 793 impressions sur 16 mois, devant tous les autres). */}
            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] pt-6">
              Prix {marqueElidee} {product.name} en Algérie
            </h2>
            <p>{priceSection}</p>

            {versions.length > 1 ? (
              <>
                <h2 className="text-xl sm:text-2xl font-bold text-[#111111] pt-6">
                  Quelle version de {ligneNom} choisir ?
                </h2>
                <p>{versionsSection}</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 text-left">
                        <th className="py-2 pr-4 font-semibold text-[#111111]">Version</th>
                        <th className="py-2 pr-4 font-semibold text-[#111111]">Concentration</th>
                        <th className="py-2 pr-4 font-semibold text-[#111111]">Contenance</th>
                        <th className="py-2 pr-4 font-semibold text-[#111111]">Prix</th>
                        <th className="py-2 font-semibold text-[#111111]">Ce qui la distingue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {versions.map((v) => {
                        const distinctives = getDistinctiveNotes(v, versions);
                        const estCelleCi = v.slug === product.slug;
                        return (
                          <tr key={v.slug} className={`border-b border-gray-100 ${estCelleCi ? "bg-[#C9A84C]/10" : ""}`}>
                            <td className="py-2.5 pr-4">
                              {estCelleCi ? (
                                <strong className="text-[#111111]">{v.name}</strong>
                              ) : (
                                <Link href={`/parfums/${v.slug}`} className="text-[#C9A84C] hover:text-[#8B6914] font-medium">
                                  {v.name}
                                </Link>
                              )}
                            </td>
                            <td className="py-2.5 pr-4">{v.concentration}</td>
                            <td className="py-2.5 pr-4">{v.volume}</td>
                            <td className="py-2.5 pr-4 whitespace-nowrap">{formatPrice(v.price)}</td>
                            <td className="py-2.5">
                              {distinctives.length ? distinctives.slice(0, 3).join(", ") : "Formule de référence"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl sm:text-2xl font-bold text-[#111111] pt-6">
                  Les autres parfums {product.brand} du catalogue
                </h2>
                <p>
                  Ce parfum est la seule version de sa ligne que nous distribuons. Dans le reste
                  de la collection {product.brand}, voici les références les plus proches en
                  budget, qui répondent souvent à la même hésitation.
                </p>
                <div className="flex flex-wrap gap-2">
                  {voisinsMarque.map((v) => (
                    <Link
                      key={v.slug}
                      href={`/parfums/${v.slug}`}
                      className="text-sm text-gray-600 hover:text-[#C9A84C] border border-gray-200 hover:border-[#C9A84C]/40 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      {v.name} · {formatPrice(v.price)}
                    </Link>
                  ))}
                </div>
              </>
            )}

            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] pt-6">
              {product.concentration} {product.volume} : ce que change la concentration
            </h2>
            <p>{concentrationSection}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-white rounded-lg p-3 border border-gray-100">
                <div className="text-xs text-gray-400 mb-0.5">Marque</div>
                <Link href={`/marques/${product.brandSlug}`} className="text-sm font-semibold text-[#C9A84C] hover:text-[#8B6914] transition-colors">
                  {product.brand}
                </Link>
              </div>
              {[
                { label: "Concentration", value: product.concentration },
                { label: "Contenance", value: product.volume },
                { label: "Famille", value: product.family },
                { label: "Genre", value: genderLabel },
                { label: "Occasions", value: product.occasions.slice(0, 2).join(", ") },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white rounded-lg p-3 border border-gray-100">
                  <div className="text-xs text-gray-400 mb-0.5">{label}</div>
                  <div className="text-sm font-semibold text-[#111111]">{value}</div>
                </div>
              ))}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] pt-6">
              {product.family} : ce que {product.name} donne sur la peau
            </h2>
            <p>{familyAndFeel}</p>

            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] pt-6">
              Pour qui, et quand le porter
            </h2>
            <p>{persona}</p>

            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] pt-6">
              Reconnaître un {product.name} original en Algérie
            </h2>
            <p>
              Face aux contrefaçons qui circulent, voici ce qui se vérifie flacon en main,
              au moment de la livraison :
            </p>
            <ul className="space-y-2 list-disc list-inside text-gray-600">
              <li>Le verre est épais, le spray fluide et régulier, le bouchon tient fermement.</li>
              <li>Le numéro de lot est présent et <strong className="text-[#111111]">identique</strong> sur le flacon et sur la boîte.</li>
              <li>L&apos;odeur évolue au fil des minutes ; une contrefaçon sent souvent l&apos;alcool à l&apos;ouverture puis disparaît.</li>
              <li>Un prix très inférieur au marché est le signal le plus fiable : un {product.brand} a un coût de production réel.</li>
            </ul>
            <p>
              C&apos;est exactement pour cette vérification que nous livrons en paiement à la
              réception : vous contrôlez le flacon devant le livreur, et vous refusez le colis
              si quelque chose ne va pas, sans avoir rien avancé.
            </p>

            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] pt-6">
              Acheter {product.brand} {product.name} en Algérie
            </h2>
            <p>
              La livraison est assurée par Yalidine Express dans les 58 wilayas :
              {" "}{deliveryWilayas.join(", ")}, et toutes les autres. Ajoutez le parfum au panier,
              indiquez votre wilaya, et notre équipe vous appelle pour confirmer la commande
              avant l&apos;expédition. Aucune carte bancaire n&apos;est demandée à aucun moment.
            </p>

            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] pt-6">
              Questions fréquentes
            </h2>
            <div className="space-y-4">
              {faq.map((item) => (
                <div key={item.q} className="bg-white rounded-lg p-4 border border-gray-100">
                  <p className="font-semibold text-[#111111] text-sm sm:text-base mb-1.5">{item.q}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>

          </div>

          {/* Bottom CTA + maillage interne */}
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/panier"
              className="inline-flex items-center gap-2 bg-[#111111] hover:bg-[#333] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Voir mon panier
            </Link>
            <Link
              href={`/${product.category}/${product.brandSlug}`}
              className="inline-flex items-center gap-2 border border-gray-200 hover:border-[#C9A84C] text-gray-700 hover:text-[#C9A84C] font-medium px-6 py-3 rounded-xl transition-colors"
            >
              Tous les {product.brand} {product.gender === "homme" ? "Homme" : product.gender === "femme" ? "Femme" : ""}
            </Link>
            <Link
              href={`/marques/${product.brandSlug}`}
              className="inline-flex items-center gap-2 border border-gray-200 hover:border-[#C9A84C] text-gray-700 hover:text-[#C9A84C] font-medium px-6 py-3 rounded-xl transition-colors"
            >
              Collection {product.brand}
            </Link>
          </div>

          {/* Liens blog — maillage éditorial */}
          {blogLinks.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-[0.15em] mb-3">À lire aussi</p>
              <div className="flex flex-wrap gap-2">
                {blogLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-[#C9A84C] border border-gray-200 hover:border-[#C9A84C]/40 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
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
