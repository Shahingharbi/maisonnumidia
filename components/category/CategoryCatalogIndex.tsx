import Link from "next/link";
import {
  getAllProducts,
  getBrandBySlug,
  getBrandSlugsForGenderPage,
  getProductsByCategory,
} from "@/lib/products";

interface CategoryCatalogIndexProps {
  /** Catégorie courante : détermine la route des liens et la façon de lister les marques. */
  category: "parfums-homme" | "parfums-femme" | "parfums-orientaux";
  categoryLabel: string;
}

/**
 * Annuaire des marques de la catégorie, rendu côté serveur (crawlable).
 *
 * Deux corrections par rapport à la version de juin 2026.
 *
 * 1. Il listait CHAQUE produit de la catégorie pour offrir à Google un chemin en un clic
 *    vers toutes les fiches. Objectif atteint (91 % des URL vérifiées sont indexées), mais
 *    /parfums-femme sortait 466 liens produit et liait ses fiches phares jusqu'à quatre
 *    fois. On revient à une hiérarchie simple : la catégorie (mère) envoie vers ses pages
 *    marque (filles), chaque page marque porte ses produits. Les fiches restent atteignables
 *    par la grille du haut, /plan-du-site, le sitemap et les produits liés.
 *
 * 2. Il tirait sa liste de marques des produits de la CATÉGORIE, alors que les pages
 *    /parfums-{homme,femme}/[marque] sont générées par GENRE (règle n°2). Les deux listes
 *    ne coïncidaient pas : 12 pages marque femme et 21 pages marque homme ne recevaient
 *    aucun lien depuis leur propre catégorie. La liste vient maintenant de
 *    `getBrandSlugsForGenderPage`, exactement comme `generateStaticParams` et le sitemap.
 */
export default function CategoryCatalogIndex({
  category,
  categoryLabel,
}: CategoryCatalogIndexProps) {
  const estOriental = category === "parfums-orientaux";
  const genre = category === "parfums-homme" ? "homme" : "femme";

  // Même filtre que la page marque correspondante, sinon on lie des pages qui n'existent pas.
  const correspond = estOriental
    ? (brandSlug: string) =>
        getProductsByCategory("parfums-orientaux").filter((p) => p.brandSlug === brandSlug)
    : (brandSlug: string) =>
        getAllProducts().filter(
          (p) => p.brandSlug === brandSlug && (p.gender === genre || p.gender === "unisexe")
        );

  const slugs = estOriental
    ? [...new Set(getProductsByCategory("parfums-orientaux").map((p) => p.brandSlug))]
    : getBrandSlugsForGenderPage(genre);

  const marques = slugs
    .map((slug) => {
      const brand = getBrandBySlug(slug);
      return brand ? { slug, name: brand.name, count: correspond(slug).length } : null;
    })
    .filter((x): x is { slug: string; name: string; count: number } => Boolean(x) && (x as { count: number }).count > 0)
    .sort((a, b) => a.name.localeCompare(b.name, "fr"));

  if (marques.length === 0) return null;
  const total = marques.reduce((s, m) => s + m.count, 0);

  return (
    <nav
      aria-label={`Marques ${categoryLabel}`}
      className="mt-20 border-t border-gray-100 pt-14"
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] mb-2">
        Toutes les marques de {categoryLabel.toLowerCase()}
      </h2>
      <p className="text-gray-400 text-sm mb-10">
        {marques.length} marques, {total} parfums — ouvrez une marque pour voir ses références.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-3">
        {marques.map((m) => (
          <Link
            key={m.slug}
            href={`/${category}/${m.slug}`}
            className="text-sm text-gray-600 hover:text-[#C9A84C] transition-colors"
          >
            {m.name}
            <span className="text-gray-300"> ({m.count})</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
