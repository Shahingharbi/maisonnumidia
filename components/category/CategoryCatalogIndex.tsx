import Link from "next/link";
import type { Product } from "@/lib/types";

interface CategoryCatalogIndexProps {
  products: Product[];
  category: string;       // ex: "parfums-homme"
  categoryLabel: string;  // ex: "Parfums Homme"
}

/**
 * Index de catalogue complet, rendu côté serveur (crawlable).
 * Regroupe TOUS les produits de la catégorie par marque :
 *   - chaque titre de marque = lien vers la page filtre /{category}/{brandSlug}
 *   - chaque produit = lien vers sa fiche /parfums/{slug}
 * Objectif SEO : depuis une page catégorie (bien indexée), Google atteint
 * chaque fiche produit ET chaque page marque en un seul clic, via de vrais
 * liens <a> présents dans le HTML statique (pas de JS, pas de "voir plus").
 */
export default function CategoryCatalogIndex({
  products,
  category,
  categoryLabel,
}: CategoryCatalogIndexProps) {
  if (products.length === 0) return null;

  // Regroupement par marque
  const byBrand = new Map<string, { name: string; items: Product[] }>();
  for (const p of products) {
    const group = byBrand.get(p.brandSlug);
    if (group) {
      group.items.push(p);
    } else {
      byBrand.set(p.brandSlug, { name: p.brand, items: [p] });
    }
  }

  const groups = Array.from(byBrand.entries())
    .map(([slug, { name, items }]) => ({ slug, name, items }))
    .sort((a, b) => a.name.localeCompare(b.name, "fr"));

  return (
    <nav
      aria-label={`Catalogue complet ${categoryLabel}`}
      className="mt-20 border-t border-gray-100 pt-14"
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] mb-2">
        Tout le catalogue {categoryLabel}
      </h2>
      <p className="text-gray-400 text-sm mb-10">
        {products.length} parfums classés par marque — sélectionnez une fragrance pour la découvrir.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-9">
        {groups.map((g) => (
          <div key={g.slug} className="break-inside-avoid">
            <h3 className="text-sm font-bold text-[#111111] mb-2.5">
              <Link
                href={`/${category}/${g.slug}`}
                className="hover:text-[#C9A84C] transition-colors"
              >
                {g.name}
              </Link>
              <span className="text-gray-300 font-normal"> ({g.items.length})</span>
            </h3>
            <ul className="space-y-1.5">
              {g.items.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/parfums/${p.slug}`}
                    className="text-sm text-gray-500 hover:text-[#C9A84C] transition-colors"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
