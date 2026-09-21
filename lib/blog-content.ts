import { getProductBySlug, formatPrice } from "@/lib/products";

const JETON_PRIX = /\{\{prix:([a-z0-9-]+)\}\}/g;

/**
 * Remplace les jetons `{{prix:slug}}` d'un article par le prix courant de la fiche.
 *
 * Les prix étaient écrits en dur dans `data/blog.ts`. Après deux repricings (juin puis
 * septembre 2026), le blog annonçait encore Dior Sauvage à 6 500 DA alors que la fiche
 * était à 30 000 DA : le lecteur lisait un prix faux dans un article, puis le vrai sur
 * la fiche. Le jeton garantit qu'un seul endroit fait foi, `data/products.json`.
 *
 * Un slug inconnu ne casse pas la page : il rend une formule neutre. Le script
 * `scripts/check-blog-links.mjs` liste ces cas avant le push.
 */
export function resolvePrices(content: string): string {
  return content.replace(JETON_PRIX, (_, slug: string) => {
    const produit = getProductBySlug(slug);
    return produit ? formatPrice(produit.price) : "prix indiqué sur la fiche";
  });
}

/** Tous les slugs cités par un jeton de prix (pour vérification hors rendu). */
export function pricedSlugs(content: string): string[] {
  return [...content.matchAll(JETON_PRIX)].map((m) => m[1]);
}
