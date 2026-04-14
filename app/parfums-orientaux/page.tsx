import type { Metadata } from "next";
import Link from "next/link";
import { getOrientalProducts, getBrandBySlug } from "@/lib/products";
import FilterableProductGrid from "@/components/product/FilterableProductGrid";
import CategoryHero from "@/components/category/CategoryHero";
import BrandPills from "@/components/category/BrandPills";
import Breadcrumb from "@/components/layout/Breadcrumb";

export const metadata: Metadata = {
  title: "Parfum Oriental Original en Algérie — Lattafa, Al Haramain",
  description:
    "Achetez vos parfums orientaux originaux en Algérie. Lattafa, Al Haramain — oud, ambre, musc. 100% authentiques, livrés dans les 58 wilayas. Paiement à la réception.",
  alternates: { canonical: "https://maisonnumidia.store/parfums-orientaux" },
};

export default function ParfumsOrientauxPage() {
  const products = getOrientalProducts();

  const brandCounts: Record<string, number> = {};
  products.forEach((p) => {
    brandCounts[p.brandSlug] = (brandCounts[p.brandSlug] || 0) + 1;
  });
  const brands = Object.entries(brandCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25)
    .map(([slug]) => ({
      label: getBrandBySlug(slug)?.name ?? slug,
      href: `/parfums-orientaux/${slug}`,
    }));

  return (
    <>
      <CategoryHero
        title="Parfums Orientaux en Algérie"
        description="Oud, ambre, musc, rose de Taïf — les trésors de la parfumerie orientale accessibles en Algérie. 100% authentiques, prix en dinar."
        count={products.length}
      />

      <BrandPills brands={brands} />

      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <Breadcrumb items={[{ label: "Parfums Orientaux", href: "/parfums-orientaux" }]} />
          </div>

          <FilterableProductGrid products={products} />

          {/* SEO Block 1000+ mots */}
          <div className="mt-20 border-t border-gray-100 pt-14 max-w-4xl">

            <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] mb-8">
              Parfums orientaux en Algérie : une tradition, un art, une identité
            </h2>

            <div className="space-y-10 text-gray-600 leading-relaxed text-sm sm:text-base">

              <div>
                <h3 className="text-lg font-bold text-[#111111] mb-4">
                  Le parfum oriental en Algérie : bien plus qu&apos;une tendance
                </h3>
                <p className="mb-4">
                  En Algérie, le parfum oriental n&apos;est pas une mode — c&apos;est une tradition profondément
                  ancrée dans la culture. Le bois d&apos;oud brûlé lors des cérémonies de mariage, l&apos;attar
                  offert en cadeau d&apos;hospitalité, le musc ambré glissé dans les vêtements lors de l&apos;Aïd :
                  autant de rituels olfactifs qui traversent les générations et définissent l&apos;identité
                  algérienne.
                </p>
                <p className="mb-4">
                  Aujourd&apos;hui, cette tradition se réinvente. Les grandes maisons de la péninsule arabique
                  proposent des fragrances qui restent fidèles aux codes orientaux — oud, ambre, musc,
                  rose — tout en les exprimant dans des formulations modernes, plus accessibles et plus
                  polyvalentes. C&apos;est exactement ce que Maison Numidia vous propose : les meilleures
                  créations orientales, authentiques et disponibles dans toutes les wilayas d&apos;Algérie.
                </p>
                <p>
                  Les parfums orientaux présentent aussi un avantage concret pour le marché algérien :
                  une longévité et un sillage supérieurs à la moyenne des fragrances occidentales. Là où
                  un <Link href="/parfums-homme" className="text-[#C9A84C] font-semibold hover:underline">parfum homme</Link>{" "}
                  européen classique tient 6 à 8 heures, une fragrance orientale bien formulée dépasse
                  souvent les 12 heures. Un avantage précieux lors des longues journées algériennes.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#111111] mb-4">
                  Lattafa : la maison émiratie qui a conquis l&apos;Algérie
                </h3>
                <p className="mb-4">
                  <Link href="/parfums-orientaux/lattafa" className="text-[#C9A84C] font-semibold hover:underline">Lattafa</Link> est
                  sans doute la marque orientale qui a le plus rapidement conquis le marché algérien.
                  Fondée à Dubaï, cette maison a réussi ce que peu d&apos;autres ont accompli : proposer
                  des fragrances oud-ambrées d&apos;une générosité exceptionnelle à des prix accessibles au
                  grand public.
                </p>
                <p className="mb-4">
                  <Link href="/parfums/lattafa-asad" className="text-[#C9A84C] font-semibold hover:underline">Lattafa Asad</Link> est
                  l&apos;exemple parfait de ce positionnement. Son accord oud-boisé-épicé est d&apos;une
                  complexité qui rivalise avec des fragrances deux fois plus chères. Les notes d&apos;ouverture
                  sont intenses, presque tranchantes, puis s&apos;arrondissent progressivement vers un fond
                  ambré-musqué enveloppant et durable.
                </p>
                <p>
                  Pour les amateurs d&apos;oud plus doux, <Link href="/parfums/lattafa-oud-mood" className="text-[#C9A84C] font-semibold hover:underline">Lattafa Oud Mood</Link>{" "}
                  est une option plus accessible, aux accords boisés-musqués moins agressifs, idéale
                  pour une première expérience avec l&apos;oud ou pour un usage quotidien.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#111111] mb-4">
                  Al Haramain : le prestige de La Mecque en flacon
                </h3>
                <p className="mb-4">
                  Fondée à La Mecque en 1970, <Link href="/parfums-orientaux/al-haramain" className="text-[#C9A84C] font-semibold hover:underline">Al Haramain</Link> est
                  l&apos;une des maisons de parfumerie les plus respectées du monde arabe. La marque
                  utilise des matières premières d&apos;une qualité exceptionnelle — oud véritable du
                  Cambodge et d&apos;Inde, rose de Taïf, ambre gris — qui lui confèrent une aura de
                  prestige authentique.
                </p>
                <p className="mb-4">
                  <Link href="/parfums/amber-oud-al-haramain" className="text-[#C9A84C] font-semibold hover:underline">Amber Oud d&apos;Al Haramain</Link> est
                  notre best-seller de la gamme orientale. Sa pyramide olfactive est construite
                  autour d&apos;un accord ambre-oud d&apos;une richesse saisissante, avec des notes de safran
                  en ouverture et un fond boisé-musqué d&apos;une tenue remarquable. C&apos;est le parfum que
                  portent les connaisseurs qui veulent l&apos;excellence sans payer le prix des grandes
                  maisons de niche européennes.
                </p>
                <p>
                  Au rapport qualité-prix, Al Haramain est difficilement battable sur le segment
                  oriental premium. Pour environ 4 000 à 5 000 DA, vous accédez à des compositions
                  qui rivalisent avec des parfums de niche vendus à 15 000 DA et plus.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#111111] mb-4">
                  Les grandes familles de la parfumerie orientale
                </h3>
                <p className="mb-4">
                  La parfumerie orientale recouvre plusieurs familles distinctes. Comprendre ces
                  nuances vous permettra de trouver rapidement la fragrance qui correspond à votre
                  usage et vos préférences.
                </p>
                <ul className="space-y-3 mb-4">
                  <li>
                    <strong className="text-[#111111]">Oud boisé</strong> — L&apos;oud dans son expression
                    la plus pure et la plus masculine. Intense, fumé, parfois animal. Pour les amateurs
                    exigeants qui assument une présence olfactive forte. Représentant : Lattafa Asad.
                  </li>
                  <li>
                    <strong className="text-[#111111]">Ambré musqué</strong> — L&apos;ambre gris et le musc
                    blanc fusionnés dans un accord chaud et enveloppant. Moins tranchant que l&apos;oud pur,
                    plus accessible et polyvalent. Idéal pour débuter avec les orientaux. Représentant :
                    Amber Oud Al Haramain.
                  </li>
                  <li>
                    <strong className="text-[#111111]">Oriental floral</strong> — Rose ou jasmin sur
                    fond d&apos;ambre et de musc. La fusion parfaite entre féminité et tradition orientale.
                    Très prisé par les femmes algériennes pour les occasions spéciales. Représentant :
                    Lattafa Oud Mood.
                  </li>
                  <li>
                    <strong className="text-[#111111]">Oriental épicé</strong> — Safran, cardamome,
                    cannelle sur base boisée. Des fragrances chaudes et complexes qui fonctionnent
                    particulièrement bien en automne et en hiver. Puisent leurs racines dans les
                    traditions olfactives du Moyen-Orient.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#111111] mb-4">
                  Parfums orientaux ou parfums occidentaux : faut-il choisir ?
                </h3>
                <p className="mb-4">
                  La question revient souvent. La réponse est simple : les deux ont leur place dans
                  une parfumothèque bien construite. Les fragrances occidentales (Dior, Chanel, YSL)
                  sont souvent plus discrètes, adaptées au bureau et aux environnements mixtes
                  internationaux. Les orientaux, plus imposants, sont faits pour marquer les esprits
                  lors des occasions importantes.
                </p>
                <p className="mb-4">
                  De nombreux Algériens portent un parfum occidental en journée et un oriental le soir
                  ou lors des fêtes. Cette approche bi-facette est en réalité très répandue en Algérie
                  et reflète bien la double identité culturelle du pays — à la fois ancré dans ses
                  traditions arabes et ouvert sur l&apos;Europe.
                </p>
                <p>
                  Si vous souhaitez compléter votre collection avec des fragrances occidentales de prestige,
                  explorez notre sélection de{" "}
                  <Link href="/parfums-homme" className="text-[#C9A84C] font-semibold hover:underline">parfums homme</Link>{" "}
                  et de{" "}
                  <Link href="/parfums-femme" className="text-[#C9A84C] font-semibold hover:underline">parfums femme</Link>.
                  Toutes nos fragrances, orientales ou européennes, sont 100% originales et livrées dans
                  les 58 wilayas avec paiement à la réception.
                </p>
              </div>

            </div>

            {/* Maillage interne bas de page */}
            <div className="mt-12 pt-8 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-[0.15em] mb-4">Explorer aussi</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Parfums Homme", href: "/parfums-homme" },
                  { label: "Parfums Femme", href: "/parfums-femme" },
                  { label: "Lattafa Asad", href: "/parfums/lattafa-asad" },
                  { label: "Lattafa Oud Mood", href: "/parfums/lattafa-oud-mood" },
                  { label: "Amber Oud Al Haramain", href: "/parfums/amber-oud-al-haramain" },
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
