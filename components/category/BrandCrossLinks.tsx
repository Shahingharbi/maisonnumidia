import Link from "next/link";
import { getBrandBySlug, getBrandSlugsForGenderPage, getProductsByCategory } from "@/lib/products";

interface Props {
  /** Section courante : détermine la route des liens (/parfums-homme/<marque>, etc.). */
  section: "parfums-homme" | "parfums-femme" | "parfums-orientaux";
  /** Marque de la page courante, exclue de la liste. */
  currentSlug: string;
  /**
   * Nombre de marques a lier. Volontairement modeste : une page marque sortait 44 liens
   * vers ses soeurs, ce qui dilue plus que ca ne transmet. Douze suffisent a relier le
   * niveau entre lui, l'annuaire complet reste sur la page categorie et sur /plan-du-site.
   */
  limit?: number;
}

/**
 * Maillage entre pages marque d'une même section. Ces pages (/parfums-homme/dior…) forment
 * le plus gros bloc d'URLs du site et n'étaient reliées entre elles par aucun lien : chacune
 * n'offrait que 2 à 5 sorties, toutes vers des pages déjà très liées par ailleurs.
 *
 * La liste suit EXACTEMENT le filtre utilisé par les pages elles-mêmes (règle n°2) : `gender`
 * pour homme et femme, `category` pour les orientaux — sinon on lierait des pages en 404.
 */
export default function BrandCrossLinks({ section, currentSlug, limit = 12 }: Props) {
  const slugs =
    section === "parfums-orientaux"
      ? [...new Set(getProductsByCategory("parfums-orientaux").map((p) => p.brandSlug))]
      : getBrandSlugsForGenderPage(section === "parfums-homme" ? "homme" : "femme");

  const autres = slugs
    .filter((s) => s !== currentSlug)
    .map((s) => getBrandBySlug(s))
    .filter((b): b is NonNullable<typeof b> => Boolean(b))
    .sort((a, b) => a.name.localeCompare(b.name, "fr"))
    .slice(0, limit);

  if (autres.length === 0) return null;

  const label =
    section === "parfums-homme"
      ? "Autres marques de parfums homme"
      : section === "parfums-femme"
      ? "Autres marques de parfums femme"
      : "Autres marques de parfums orientaux";

  return (
    <div className="border-t border-gray-200 pt-6 mt-6">
      <p className="font-semibold text-[#111111] mb-3">{label}</p>
      <div className="flex flex-wrap gap-2">
        {autres.map((b) => (
          <Link
            key={b.slug}
            href={`/${section}/${b.slug}`}
            className="text-sm text-gray-600 hover:text-[#C9A84C] border border-gray-200 hover:border-[#C9A84C]/30 px-3 py-1.5 rounded-lg transition-colors"
          >
            {b.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
