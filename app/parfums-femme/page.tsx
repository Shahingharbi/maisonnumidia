import type { Metadata } from "next";
import Link from "next/link";
import { getProductsByCategory, getBrandBySlug } from "@/lib/products";
import FilterableProductGrid from "@/components/product/FilterableProductGrid";
import CategoryHero from "@/components/category/CategoryHero";
import BrandPills from "@/components/category/BrandPills";
import Breadcrumb from "@/components/layout/Breadcrumb";

export const metadata: Metadata = {
  title: "Parfum Femme Original en Algérie — Chanel, YSL, Lancôme",
  description:
    "Achetez votre parfum femme original en Algérie. Coco Mademoiselle, Black Opium YSL, La Vie Est Belle, Delina — 100% authentiques, livrés dans les 58 wilayas. Paiement à la réception.",
  alternates: { canonical: "https://maisonnumidia.store/parfums-femme" },
};

export default function ParfumsFemmePage() {
  const products = getProductsByCategory("parfums-femme");

  const brandCounts: Record<string, number> = {};
  products.forEach((p) => {
    brandCounts[p.brandSlug] = (brandCounts[p.brandSlug] || 0) + 1;
  });
  const brands = Object.entries(brandCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25)
    .map(([slug]) => ({
      label: getBrandBySlug(slug)?.name ?? slug,
      href: `/parfums-femme/${slug}`,
    }));

  return (
    <>
      <CategoryHero
        title="Parfums Femme en Algérie"
        description="Floraux, orientaux, gourmands. Des fragrances féminines 100% authentiques, prix en dinar, livrées partout en Algérie."
        count={products.length}
      />

      <BrandPills brands={brands} />

      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <Breadcrumb items={[{ label: "Parfums Femme", href: "/parfums-femme" }]} />
          </div>

          <FilterableProductGrid products={products} />

          {/* SEO Block 1000+ mots */}
          <div className="mt-20 border-t border-gray-100 pt-14 max-w-4xl">

            <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] mb-8">
              Parfum femme en Algérie : élégance, authenticité et livraison partout
            </h2>

            <div className="space-y-10 text-gray-600 leading-relaxed text-sm sm:text-base">

              <div>
                <h3 className="text-lg font-bold text-[#111111] mb-4">
                  Les parfums féminins les plus appréciés en Algérie
                </h3>
                <p className="mb-4">
                  La femme algérienne a un rapport particulier au parfum. Il accompagne ses journées,
                  marque ses occasions importantes, et devient souvent une signature personnelle
                  reconnue par son entourage. Certaines fragrances s&apos;imposent naturellement comme
                  les plus recherchées.
                </p>
                <p className="mb-4">
                  <Link href="/parfums/coco-mademoiselle-chanel" className="text-[#C9A84C] font-semibold hover:underline">Coco Mademoiselle de Chanel</Link> règne
                  sur la parfumerie féminine depuis des décennies. Son accord rose-patchouli-muscs
                  blancs est d&apos;une sophistication rare, aussi bien pour une journée de travail que
                  pour une soirée habillée. C&apos;est le parfum que l&apos;on offre, que l&apos;on reçoit, et
                  que l&apos;on garde précieusement.
                </p>
                <p className="mb-4">
                  <Link href="/parfums/black-opium-ysl" className="text-[#C9A84C] font-semibold hover:underline">Black Opium d&apos;Yves Saint Laurent</Link> représente
                  l&apos;autre visage de la féminité moderne — audacieuse, intense, addictive. Son accord
                  café-vanille-fleur blanche est devenu une référence incontournable chez les femmes
                  de 25 à 40 ans en Algérie. Sillage puissant, tenue remarquable.
                </p>
                <p>
                  Pour les amateurs de fragrances florales légères, <Link href="/parfums/idole-lancome" className="text-[#C9A84C] font-semibold hover:underline">Idôle de Lancôme</Link>{" "}
                  propose un iris-rose-musc d&apos;une fraîcheur aérienne, parfaite pour les journées
                  printanières. <Link href="/parfums/la-vie-est-belle-lancome" className="text-[#C9A84C] font-semibold hover:underline">La Vie Est Belle</Link> reste
                  quant à elle le symbole de la joie de vivre féminine avec son iris-pralin-patchouli
                  gourmand.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#111111] mb-4">
                  Les marques féminines de notre catalogue
                </h3>
                <p className="mb-4">
                  Maison Numidia réunit pour vous les maisons les plus désirées dans la parfumerie féminine.
                </p>
                <ul className="space-y-3 mb-4">
                  <li>
                    <strong className="text-[#111111]"><Link href="/parfums-femme/chanel" className="hover:text-[#C9A84C] transition-colors">Chanel</Link></strong> — L&apos;icône absolue.
                    Coco Mademoiselle et Chanel N°5 restent les parfums féminins les plus vendus
                    dans le monde. Un classique qui ne vieillit pas.
                  </li>
                  <li>
                    <strong className="text-[#111111]"><Link href="/parfums-femme/ysl" className="hover:text-[#C9A84C] transition-colors">Yves Saint Laurent</Link></strong> — Entre
                    la puissance de Black Opium et la liberté de Libre, YSL incarne la femme
                    moderne qui s&apos;affirme sans compromis.
                  </li>
                  <li>
                    <strong className="text-[#111111]"><Link href="/parfums-femme/lancome" className="hover:text-[#C9A84C] transition-colors">Lancôme</Link></strong> — La maison
                    de la joie de vivre française. La Vie Est Belle et Idôle représentent deux
                    visions de l&apos;élégance : l&apos;une gourmande, l&apos;autre aérienne.
                  </li>
                  <li>
                    <strong className="text-[#111111]"><Link href="/parfums-femme/carolina-herrera" className="hover:text-[#C9A84C] transition-colors">Carolina Herrera</Link></strong> — Good
                    Girl est devenu un phénomène mondial. Son accord jasmin-cacao dans un flacon
                    en forme de talon est une déclaration d&apos;intention féministe et élégante.
                  </li>
                  <li>
                    <strong className="text-[#111111]"><Link href="/parfums-femme/parfums-de-marly" className="hover:text-[#C9A84C] transition-colors">Parfums de Marly</Link></strong> — Delina
                    est la fragrance niche la plus désirée du moment. Rose de Taïf, litchi et
                    poivre rose — une complexité qui justifie chaque dinar investi.
                  </li>
                  <li>
                    <strong className="text-[#111111]"><Link href="/parfums-femme/valentino" className="hover:text-[#C9A84C] transition-colors">Valentino</Link></strong> — Born in Roma
                    capture l&apos;essence de la jeunesse romaine dans un accord iris-vanille-bois
                    de cashmere d&apos;une finesse remarquable.
                  </li>
                  <li>
                    <strong className="text-[#111111]"><Link href="/parfums-femme/kayali" className="hover:text-[#C9A84C] transition-colors">Kayali</Link></strong> — La marque
                    émiratie qui révolutionne l&apos;accès au parfum niche. Eden Juicy Apple est
                    l&apos;entrée idéale dans l&apos;univers des fragrances premium.
                  </li>
                  <li>
                    <strong className="text-[#111111]"><Link href="/parfums-femme/narciso-rodriguez" className="hover:text-[#C9A84C] transition-colors">Narciso Rodriguez</Link></strong> — For
                    Her est un musc poudré d&apos;une sensualité discrète et enveloppante.
                    Le parfum préféré des femmes qui ne veulent pas être remarquées
                    mais ne pas être oubliées.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#111111] mb-4">
                  Floraux, gourmands, orientaux : quelle famille olfactive choisir ?
                </h3>
                <p className="mb-4">
                  La parfumerie féminine offre une palette plus vaste que la masculine. Voici comment
                  naviguer entre les grandes familles.
                </p>
                <ul className="space-y-3 mb-4">
                  <li>
                    <strong className="text-[#111111]">Floraux</strong> — Rose, jasmin, iris, pivoine.
                    La famille la plus classique et la plus portée. Idéaux pour le bureau et les
                    occasions formelles. Exemples : Coco Mademoiselle, Idôle, Libre YSL.
                  </li>
                  <li>
                    <strong className="text-[#111111]">Gourmands</strong> — Vanille, caramel, pralin,
                    cacao. Des fragrances chaudes et addictives, parfaites pour l&apos;automne-hiver
                    ou les soirées. Exemples : Black Opium, La Vie Est Belle, Good Girl.
                  </li>
                  <li>
                    <strong className="text-[#111111]">Musqués poudrés</strong> — Musc blanc, iris,
                    santal. Discrets, élégants, universellement appréciés. L&apos;accord "seconde peau"
                    par excellence. Exemples : Narciso Rodriguez For Her.
                  </li>
                  <li>
                    <strong className="text-[#111111]">Orientaux floraux</strong> — Rose, oud, ambre.
                    Une fusion Orient-Occident très prisée en Algérie. Les femmes qui aiment les
                    parfums qui durent toute la journée. Explorez notre gamme de{" "}
                    <Link href="/parfums-orientaux" className="text-[#C9A84C] font-semibold hover:underline">parfums orientaux</Link>{" "}
                    pour cette famille.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#111111] mb-4">
                  Offrir un parfum femme en Algérie : les meilleures options
                </h3>
                <p className="mb-4">
                  Un parfum est l&apos;un des cadeaux les plus appréciés en Algérie, que ce soit pour
                  un mariage, un anniversaire, un Aïd ou simplement pour faire plaisir. Mais choisir
                  le bon parfum pour quelqu&apos;un d&apos;autre est un exercice délicat.
                </p>
                <p className="mb-4">
                  Pour un cadeau qui ne peut pas rater, misez sur les classiques universels. <strong className="text-[#111111]">Coco Mademoiselle</strong>{" "}
                  plaît à 95% des femmes. <strong className="text-[#111111]">La Vie Est Belle</strong>{" "}
                  est joyeux et positif. <strong className="text-[#111111]">Good Girl de Carolina Herrera</strong>{" "}
                  impressionne par son flacon autant que par son jus. Si vous connaissez les goûts
                  de la personne, <strong className="text-[#111111]">Delina de Parfums de Marly</strong>{" "}
                  est l&apos;option qui marque vraiment les esprits.
                </p>
                <p>
                  Notre service de commande est simple : ajoutez le parfum au panier, renseignez votre
                  wilaya, et payez à la livraison. Aucune avance, aucun risque. Nos parfums sont
                  emballés avec soin pour les offrir directement. Découvrez aussi notre sélection de{" "}
                  <Link href="/parfums-homme" className="text-[#C9A84C] font-semibold hover:underline">parfums homme</Link>{" "}
                  pour offrir en duo.
                </p>
              </div>

            </div>

            {/* Maillage interne bas de page */}
            <div className="mt-12 pt-8 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-[0.15em] mb-4">Explorer aussi</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Parfums Homme", href: "/parfums-homme" },
                  { label: "Parfums Orientaux", href: "/parfums-orientaux" },
                  { label: "Coco Mademoiselle", href: "/parfums/coco-mademoiselle-chanel" },
                  { label: "Black Opium YSL", href: "/parfums/black-opium-ysl" },
                  { label: "La Vie Est Belle", href: "/parfums/la-vie-est-belle-lancome" },
                  { label: "Good Girl", href: "/parfums/good-girl-carolina-herrera" },
                  { label: "Delina", href: "/parfums/delina-parfums-de-marly" },
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
