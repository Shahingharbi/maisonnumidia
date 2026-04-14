import type { Metadata } from "next";
import Link from "next/link";
import { getProductsByCategory, getBrandBySlug } from "@/lib/products";
import FilterableProductGrid from "@/components/product/FilterableProductGrid";
import CategoryHero from "@/components/category/CategoryHero";
import BrandPills from "@/components/category/BrandPills";
import Breadcrumb from "@/components/layout/Breadcrumb";

export const metadata: Metadata = {
  title: "Parfum Homme Original en Algérie — Dior, Chanel, Armani",
  description:
    "Achetez votre parfum homme original en Algérie. Dior Sauvage, Bleu de Chanel, Armani Code, 1 Million — 100% authentiques, livrés dans les 58 wilayas. Paiement à la réception.",
  alternates: { canonical: "https://maisonnumidia.store/parfums-homme" },
};

export default function ParfumsHommePage() {
  const products = getProductsByCategory("parfums-homme");

  const brandCounts: Record<string, number> = {};
  products.forEach((p) => {
    brandCounts[p.brandSlug] = (brandCounts[p.brandSlug] || 0) + 1;
  });
  const brands = Object.entries(brandCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25)
    .map(([slug]) => ({
      label: getBrandBySlug(slug)?.name ?? slug,
      href: `/parfums-homme/${slug}`,
    }));

  return (
    <>
      <CategoryHero
        title="Parfums Homme en Algérie"
        description="Des classiques intemporels aux fragrances orientales les plus recherchées. Prix en dinar algérien, 100% originaux, livrés partout en Algérie."
        count={products.length}
      />

      <BrandPills brands={brands} />

      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <Breadcrumb items={[{ label: "Parfums Homme", href: "/parfums-homme" }]} />
          </div>

          <FilterableProductGrid products={products} />

          {/* SEO Block 1000+ mots */}
          <div className="mt-20 border-t border-gray-100 pt-14 max-w-4xl">

            <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] mb-8">
              Parfum homme en Algérie : le guide complet pour bien choisir
            </h2>

            <div className="space-y-10 text-gray-600 leading-relaxed text-sm sm:text-base">

              <div>
                <h3 className="text-lg font-bold text-[#111111] mb-4">
                  Les parfums masculins les plus demandés en Algérie
                </h3>
                <p className="mb-4">
                  En Algérie, le parfum masculin est bien plus qu&apos;un simple accessoire — c&apos;est une
                  signature, une façon d&apos;affirmer sa présence. Depuis plusieurs années, certaines
                  fragrances dominent les recherches et les commandes. En tête de liste, <Link href="/parfums/dior-sauvage" className="text-[#C9A84C] font-semibold hover:underline">Dior Sauvage</Link> reste
                  sans conteste le parfum homme le plus vendu en Algérie. Son accord bergamote-ambroxan-cèdre
                  fonctionne dans tous les contextes : bureau, soirée, week-end. La chaleur algérienne
                  développe magnifiquement ses notes de fond, créant un sillage chaud et masculin qui
                  peut tenir jusqu&apos;à 12 heures sur peau sèche.
                </p>
                <p className="mb-4">
                  Juste derrière, <Link href="/parfums/bleu-de-chanel" className="text-[#C9A84C] font-semibold hover:underline">Bleu de Chanel</Link> incarne
                  l&apos;élégance masculine par excellence. C&apos;est le parfum du professionnel ambitieux, de
                  l&apos;homme qui soigne son image sans ostentation. Son boisé aromatique signe d&apos;une
                  précision remarquable. Pour les amateurs de fragrances festives, <Link href="/parfums/1-million-paco-rabanne" className="text-[#C9A84C] font-semibold hover:underline">1 Million de Paco Rabanne</Link> reste
                  une valeur sûre — son accord pamplemousse-cannelle-cuir est immédiatement reconnaissable
                  lors des mariages, Aïd et grandes occasions.
                </p>
                <p>
                  Les jeunes hommes algériens se tournent de plus en plus vers <Link href="/parfums/scandal-pour-homme-jean-paul-gaultier" className="text-[#C9A84C] font-semibold hover:underline">Scandal Pour Homme de Jean Paul Gaultier</Link>,
                  une fragrance gourmande-épicée qui se démarque nettement dans un marché dominé par
                  les boisés. Sa cardamome explosive et son fond caramel-patchouli en font un choix
                  audacieux et mémorable.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#111111] mb-4">
                  Les grandes marques masculines disponibles chez Maison Numidia
                </h3>
                <p className="mb-4">
                  Notre sélection couvre le spectre complet de la parfumerie masculine de prestige.
                  Chaque marque représente un univers olfactif distinct, une vision singulière de la
                  masculinité.
                </p>
                <ul className="space-y-3 mb-4">
                  <li>
                    <strong className="text-[#111111]"><Link href="/parfums-homme/dior" className="hover:text-[#C9A84C] transition-colors">Dior</Link></strong> — La maison française par excellence.
                    Sauvage domine, mais la gamme Dior Homme offre également des alternatives plus
                    discrètes et élégantes pour les amateurs de raffinement.
                  </li>
                  <li>
                    <strong className="text-[#111111]"><Link href="/parfums-homme/chanel" className="hover:text-[#C9A84C] transition-colors">Chanel</Link></strong> — Bleu de Chanel est le symbole
                    du succès discret. Un parfum qui s&apos;adapte à toutes les situations sans jamais
                    paraître déplacé.
                  </li>
                  <li>
                    <strong className="text-[#111111]"><Link href="/parfums-homme/armani" className="hover:text-[#C9A84C] transition-colors">Giorgio Armani</Link></strong> — Armani Code
                    est l&apos;arme de séduction par excellence. Son café arabica-bois de gaïac agit
                    comme un aimant en soirée.
                  </li>
                  <li>
                    <strong className="text-[#111111]"><Link href="/parfums-homme/paco-rabanne" className="hover:text-[#C9A84C] transition-colors">Paco Rabanne</Link></strong> — Entre
                    Invictus le dynamique et 1 Million le festif, la maison espagnole propose deux
                    best-sellers à ne pas manquer.
                  </li>
                  <li>
                    <strong className="text-[#111111]"><Link href="/parfums-homme/jean-paul-gaultier" className="hover:text-[#C9A84C] transition-colors">Jean Paul Gaultier</Link></strong> — Le Male
                    est un monument depuis 1995. Scandal Pour Homme représente la modernité épicée
                    et gourmande qui plaît aux hommes d&apos;aujourd&apos;hui.
                  </li>
                  <li>
                    <strong className="text-[#111111]"><Link href="/parfums-homme/versace" className="hover:text-[#C9A84C] transition-colors">Versace</Link></strong> — Eros capte l&apos;essence
                    de la Méditerranée avec sa menthe fraîche et sa fève tonka. Parfait pour les
                    soirées estivales algériennes.
                  </li>
                  <li>
                    <strong className="text-[#111111]"><Link href="/parfums-homme/hugo-boss" className="hover:text-[#C9A84C] transition-colors">Hugo Boss</Link></strong> — Boss Bottled est
                    la référence du quotidien accessible, fiable depuis 1998.
                  </li>
                  <li>
                    <strong className="text-[#111111]"><Link href="/parfums-homme/franck-olivier" className="hover:text-[#C9A84C] transition-colors">Franck Olivier</Link></strong> — La marque
                    française historiquement présente en Algérie, offrant des fragrances orientales-boisées
                    à petit budget.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#111111] mb-4">
                  Comment choisir son parfum homme en Algérie
                </h3>
                <p className="mb-4">
                  Le choix d&apos;un parfum est une décision intime qui dépend de plusieurs facteurs.
                  Avant de commander, posez-vous les bonnes questions.
                </p>
                <p className="mb-4">
                  <strong className="text-[#111111]">Pour quelle occasion ?</strong> Un parfum de bureau
                  doit être discret et propre — pensez Bleu de Chanel ou Boss Bottled. Pour les soirées
                  et occasions spéciales, Armani Code, 1 Million ou Scandal Pour Homme projettent
                  davantage et créent un impact durable. Pour un usage polyvalent qui fonctionne du
                  matin au soir, Dior Sauvage reste la valeur refuge absolue.
                </p>
                <p className="mb-4">
                  <strong className="text-[#111111]">Quelle famille olfactive ?</strong> Les fragrances
                  boisées-aromatiques (Dior Sauvage, Bleu de Chanel, Armani Code) plaisent au plus grand
                  nombre. Les orientaux-épicés (Scandal, 1 Million) séduisent ceux qui veulent sortir du
                  lot. Les frais-aquatiques (Invictus, Versace Eros) conviennent parfaitement aux journées
                  chaudes. Pour les amateurs d&apos;oud et d&apos;ambre, notre sélection de{" "}
                  <Link href="/parfums-orientaux" className="text-[#C9A84C] font-semibold hover:underline">parfums orientaux</Link>{" "}
                  propose des alternatives riches et généreuses à des prix très accessibles.
                </p>
                <p>
                  <strong className="text-[#111111]">Quel budget ?</strong> Notre catalogue couvre
                  tous les budgets, du Franck Olivier accessible à moins de 3 000 DA jusqu&apos;aux
                  grandes maisons françaises entre 5 000 et 16 000 DA. Quelle que soit votre enveloppe,
                  vous trouverez une fragrance de qualité authentique.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#111111] mb-4">
                  Les familles olfactives masculines expliquées
                </h3>
                <p className="mb-4">
                  Comprendre les familles olfactives vous aidera à cibler rapidement ce qui vous
                  correspond. Les parfums de notre sélection homme couvrent quatre grandes familles :
                </p>
                <ul className="space-y-3 mb-4">
                  <li>
                    <strong className="text-[#111111]">Boisés aromatiques</strong> — L&apos;accord bois sec,
                    aromates et musc. La famille reine de la parfumerie masculine moderne. Représentants :
                    Dior Sauvage, Bleu de Chanel.
                  </li>
                  <li>
                    <strong className="text-[#111111]">Orientaux épicés</strong> — Ambre, épices, résines
                    chaudes. Des fragrances profondes et enveloppantes qui fonctionnent particulièrement
                    bien en automne-hiver. Représentants : Armani Code, 1 Million, Scandal Pour Homme.
                  </li>
                  <li>
                    <strong className="text-[#111111]">Frais aquatiques</strong> — Agrumes, notes marines,
                    muscs blancs. Idéaux pour l&apos;été et les régions chaudes. Représentants : Invictus,
                    Versace Eros.
                  </li>
                  <li>
                    <strong className="text-[#111111]">Orientaux oud</strong> — Le oud, l&apos;ambre et le
                    musc dans leur expression la plus pure. Pour les amateurs exigeants. Explorez notre
                    sélection de{" "}
                    <Link href="/parfums-orientaux/lattafa" className="text-[#C9A84C] font-semibold hover:underline">Lattafa</Link>{" "}
                    et{" "}
                    <Link href="/parfums-orientaux/al-haramain" className="text-[#C9A84C] font-semibold hover:underline">Al Haramain</Link>.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#111111] mb-4">
                  Commander votre parfum homme en Algérie
                </h3>
                <p className="mb-4">
                  Chez Maison Numidia, commander un parfum homme original en Algérie est un processus
                  simple et sécurisé. Vous choisissez votre fragrance, vous ajoutez au panier, vous
                  renseignez votre wilaya et votre numéro de téléphone. Aucune carte bancaire, aucun
                  virement préalable. Vous payez cash uniquement au moment de la réception du colis,
                  entre vos mains.
                </p>
                <p className="mb-4">
                  La livraison est assurée par <strong className="text-[#111111]">Yalidine Express</strong> dans
                  l&apos;ensemble des 58 wilayas algériennes. Les délais constatés sont de 24 à 48 heures
                  pour Alger, Blida, Oran et les grandes villes, et de 48 à 72 heures pour les wilayas
                  plus éloignées. Chaque expédition est tracée — vous recevez un numéro de suivi dès
                  que votre commande part de notre entrepôt.
                </p>
                <p>
                  Tous nos parfums sont garantis 100% originaux. En cas de doute à la réception sur
                  l&apos;authenticité d&apos;un flacon, vous pouvez le refuser — aucune question posée, aucune
                  pénalité. C&apos;est notre engagement envers vous. Explorez également notre sélection de{" "}
                  <Link href="/parfums-femme" className="text-[#C9A84C] font-semibold hover:underline">parfums femme</Link>{" "}
                  pour offrir en cadeau ou compléter votre collection.
                </p>
              </div>

            </div>

            {/* Maillage interne bas de page */}
            <div className="mt-12 pt-8 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-[0.15em] mb-4">Explorer aussi</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Parfums Femme", href: "/parfums-femme" },
                  { label: "Parfums Orientaux", href: "/parfums-orientaux" },
                  { label: "Dior Sauvage", href: "/parfums/dior-sauvage" },
                  { label: "Bleu de Chanel", href: "/parfums/bleu-de-chanel" },
                  { label: "Armani Code", href: "/parfums/armani-code" },
                  { label: "1 Million", href: "/parfums/1-million-paco-rabanne" },
                  { label: "Toutes les marques", href: "/marques" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-xs border border-gray-200 hover:border-[#C9A84C] hover:text-[#C9A84C] text-gray-500 px-4 py-2 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
