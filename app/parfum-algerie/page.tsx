import type { Metadata } from "next";
import Link from "next/link";
import { getFeaturedProducts, getAllBrands } from "@/lib/products";
import ProductCard from "@/components/product/ProductCard";
import { ArrowRight, Truck, Shield, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Parfum en Algérie — Livraison COD dans les 58 Wilayas | Maison Numidia",
  description: "Achetez vos parfums en Algérie chez Maison Numidia : Dior, Chanel, Lattafa, Al Haramain. Paiement à la livraison (COD) dans les 58 wilayas. Parfums 100% authentiques.",
  alternates: { canonical: "https://maisonnumidia.store/parfum-algerie" },
  keywords: ["parfum algerie", "acheter parfum algerie", "parfum original algerie", "parfum livraison algerie", "parfum dz"],
};

export default function ParfumAlgeriePage() {
  const featured = getFeaturedProducts().slice(0, 8);
  const brands = getAllBrands().filter((b) => b.featured);

  const hubSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Parfum en Algérie — Maison Numidia",
    description: "Achetez vos parfums en Algérie avec livraison dans les 58 wilayas et paiement à la livraison.",
    url: "https://maisonnumidia.store/parfum-algerie",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: "https://maisonnumidia.store" },
        { "@type": "ListItem", position: 2, name: "Parfum en Algérie", item: "https://maisonnumidia.store/parfum-algerie" },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hubSchema) }}
      />

      {/* Hero section */}
      <div className="bg-white border-b border-gray-100 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-5">
              <div className="h-px w-8 bg-[#C9A84C]" />
              <span className="text-xs tracking-[0.25em] text-[#C9A84C] font-medium uppercase">
                Livraison dans les 58 wilayas
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111111] leading-tight mb-5">
              Parfum en Algérie —
              <br />
              Authentique, livré chez vous
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-2xl">
              Maison Numidia est votre destination parfums en Algérie. Dior, Chanel,
              Lattafa, Al Haramain — tous les grands parfums du monde, livrés partout
              en Algérie avec paiement à la livraison.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/parfums-homme"
                className="inline-flex items-center gap-2 bg-[#111111] hover:bg-[#333] text-white font-medium px-6 py-3 rounded-lg transition-colors text-sm"
              >
                Parfums Homme <ArrowRight size={14} />
              </Link>
              <Link
                href="/parfums-femme"
                className="inline-flex items-center gap-2 bg-[#111111] hover:bg-[#333] text-white font-medium px-6 py-3 rounded-lg transition-colors text-sm"
              >
                Parfums Femme <ArrowRight size={14} />
              </Link>
              <Link
                href="/parfums-orientaux"
                className="inline-flex items-center gap-2 border border-gray-200 hover:border-[#C9A84C] text-gray-700 hover:text-[#C9A84C] font-medium px-6 py-3 rounded-lg transition-colors text-sm"
              >
                Parfums Orientaux
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Avantages */}
      <section className="bg-[#FAFAF8] py-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Truck, title: "Livraison Yalidine", desc: "58 wilayas · 24 à 72h · Suivi en temps réel" },
              { icon: Shield, title: "Paiement à la livraison", desc: "Cash uniquement à la réception — aucune carte requise" },
              { icon: Phone, title: "Conseils WhatsApp", desc: "Notre équipe vous guide pour choisir votre parfum" },
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-lg border border-[#C9A84C]/30 flex items-center justify-center shrink-0">
                  <f.icon size={16} className="text-[#C9A84C]" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#111111]">{f.title}</div>
                  <div className="text-xs text-gray-400 mt-0.5 leading-relaxed">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Produits vedettes */}
      <section className="bg-white py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs tracking-[0.2em] text-[#C9A84C] uppercase font-medium mb-2">
                Sélection Algérie
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#111111]">
                Les parfums les plus commandés
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Marques */}
      <section className="bg-[#FAFAF8] py-14 sm:py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <p className="text-xs tracking-[0.2em] text-[#C9A84C] uppercase font-medium mb-2">
              Marques disponibles
            </p>
            <h2 className="text-2xl font-bold text-[#111111]">
              Toutes les grandes maisons, en Algérie
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {brands.map((brand) => (
              <Link
                key={brand.slug}
                href={`/marques/${brand.slug}`}
                className="group bg-white rounded-xl py-4 px-3 text-center border border-gray-100 hover:border-[#C9A84C]/40 hover:shadow-sm transition-all duration-200"
              >
                <span className="text-sm font-semibold text-gray-700 group-hover:text-[#C9A84C] transition-colors">
                  {brand.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SEO text block — 700+ mots pour cette page goldmine KD=2 */}
      <section className="bg-white py-14 sm:py-20 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="prose-custom text-gray-600 space-y-5 text-sm sm:text-base leading-relaxed">

            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] mb-4">
              Acheter un parfum en Algérie : tout ce qu'il faut savoir
            </h2>

            <p>
              En Algérie, le marché du parfum connaît une transformation profonde. Longtemps
              dominé par les achats à l'étranger, les cadeaux ramenés de France ou des
              Émirats, et les parfumeries locales proposant des sélections limitées, le
              marché algérien du parfum en ligne prend aujourd'hui son essor. <strong>Maison
              Numidia</strong> est née de ce constat simple : les Algériens méritent d'accéder
              aux mêmes parfums que le reste du monde, sans complications et sans surpayer.
            </p>

            <h3 className="text-lg font-bold text-[#111111] mt-8">
              Pourquoi acheter votre parfum en ligne en Algérie ?
            </h3>

            <p>
              L'achat de parfum en ligne présente de nombreux avantages par rapport aux
              achats traditionnels. Le choix est incomparablement plus large : là où une
              parfumerie physique à Alger ou Oran peut proposer 50 à 100 références, Maison
              Numidia en propose plus de 200, avec des nouveautés régulières. Les prix sont
              transparents et affichés en dinars algériens, sans surprise à la livraison.
              Et surtout, le paiement à la livraison (COD) élimine tout risque : vous payez
              uniquement quand votre parfum est entre vos mains.
            </p>

            <p>
              La livraison via Yalidine Express couvre les 58 wilayas avec des délais de
              24 à 72 heures selon votre localisation. Que vous soyez à Alger, Oran, Constantine,
              Annaba, Blida, Tizi Ouzou, Béjaïa, Sétif ou dans n'importe quelle autre wilaya,
              votre commande vous parvient rapidement et en parfait état.
            </p>

            <h3 className="text-lg font-bold text-[#111111] mt-8">
              Quels parfums sont disponibles en Algérie chez Maison Numidia ?
            </h3>

            <p>
              Notre catalogue couvre l'ensemble des grandes familles de la parfumerie :
            </p>

            <ul className="space-y-2 list-disc list-inside text-gray-600">
              <li>
                <strong>Parfums homme</strong> : Dior Sauvage EDP, Bleu de Chanel EDP,
                Scandal Pour Homme Jean Paul Gaultier, Invictus Paco Rabanne, 1 Million,
                Armani Code, Hugo Boss Bottled, Versace Eros et bien d'autres.
              </li>
              <li>
                <strong>Parfums femme</strong> : Scandal Jean Paul Gaultier, Good Girl
                Carolina Herrera, Black Opium YSL, Libre YSL, Coco Mademoiselle Chanel,
                Delina Parfums de Marly, Valentino Born in Roma, Kayali Eden, La Vie est
                Belle Lancôme et bien d'autres.
              </li>
              <li>
                <strong>Parfums orientaux</strong> : Lattafa Oud Mood, Al Haramain Amber
                Oud Gold Edition, Lattafa Asad et d'autres créations de maisons du Golfe.
              </li>
            </ul>

            <h3 className="text-lg font-bold text-[#111111] mt-8">
              Comment éviter les contrefaçons de parfum en Algérie ?
            </h3>

            <p>
              La contrefaçon de parfums est un problème réel en Algérie, particulièrement
              sur les marchés informels et sur certaines plateformes de vente entre
              particuliers. Pour être certain d'acheter un parfum original, voici les
              vérifications essentielles :
            </p>

            <ul className="space-y-2 list-disc list-inside text-gray-600">
              <li>
                Le flacon doit être d'une qualité irréprochable : verre épais, spray fluide,
                étiquette parfaitement alignée et sans défaut d'impression.
              </li>
              <li>
                Le numéro de lot (batch code) doit être présent sur le flacon et la boîte
                et être cohérent — des sites comme checkfresh.com permettent de vérifier
                la date de fabrication.
              </li>
              <li>
                Le prix cassé est souvent le premier signal d'alarme : un Dior Sauvage
                100ml vendu 800 DA ne peut pas être authentique.
              </li>
              <li>
                Achetez chez des revendeurs qui s'engagent explicitement sur l'authenticité.
                Maison Numidia garantit l'authenticité de chaque flacon vendu.
              </li>
            </ul>

            <h3 className="text-lg font-bold text-[#111111] mt-8">
              Parfums les plus populaires en Algérie en 2026
            </h3>

            <p>
              D'après nos ventes et les tendances observées, les parfums les plus populaires
              en Algérie se répartissent en deux grandes catégories. D'un côté, les
              classiques masculins occidentaux dominent : Dior Sauvage reste le parfum
              masculin numéro 1, suivi de Bleu de Chanel et d'Invictus Paco Rabanne.
              Pour les femmes, Scandal de Jean Paul Gaultier et Good Girl de Carolina
              Herrera mènent le classement devant Black Opium YSL.
            </p>

            <p>
              De l'autre côté, les parfums orientaux connaissent une montée en puissance
              notable. Lattafa Oud Mood et Al Haramain Amber Oud sont particulièrement
              demandés, reflétant un retour aux racines olfactives orientales qui résonnent
              profondément avec la culture algérienne.
            </p>

            <h3 className="text-lg font-bold text-[#111111] mt-8">
              Le paiement à la livraison (COD) : comment ça marche ?
            </h3>

            <p>
              Le Cash On Delivery (COD) est le mode de paiement standard en Algérie pour
              le commerce en ligne. Voici comment se déroule une commande chez Maison Numidia :
            </p>

            <ol className="space-y-3 list-decimal list-inside text-gray-600">
              <li>
                Vous passez votre commande via notre formulaire en ligne ou sur WhatsApp
                en indiquant votre nom, numéro de téléphone, wilaya et le parfum souhaité.
              </li>
              <li>
                Notre équipe vous appelle pour confirmer la commande et vérifier les
                détails de livraison dans les 24 heures.
              </li>
              <li>
                Le colis est expédié via Yalidine Express. Vous recevez un numéro de suivi
                pour suivre votre livraison en temps réel.
              </li>
              <li>
                À la livraison, vous payez le montant en cash au livreur Yalidine.
                Si le colis ne correspond pas à votre commande, vous pouvez refuser la livraison.
              </li>
            </ol>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="font-medium text-[#111111]">
                Prêt à découvrir votre nouveau parfum ?
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                <Link
                  href="/parfums-homme"
                  className="inline-flex items-center gap-2 bg-[#111111] hover:bg-[#333] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                >
                  Parfums Homme <ArrowRight size={14} />
                </Link>
                <Link
                  href="/parfums-femme"
                  className="inline-flex items-center gap-2 bg-[#111111] hover:bg-[#333] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                >
                  Parfums Femme <ArrowRight size={14} />
                </Link>
                <Link
                  href="/commander"
                  className="inline-flex items-center gap-2 border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                >
                  Commander maintenant
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
