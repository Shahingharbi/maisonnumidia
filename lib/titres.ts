import type { Metadata } from "next";
import titres from "@/data/titres.json";

/**
 * Titres choisis page par page (data/titres.json, clé = chemin : "/parfums/dior-sauvage").
 *
 * Chaque titre y est écrit en entier, suffixe compris quand il y en a un : il ne passe pas par le
 * gabarit « %s | Maison Numidia » de app/layout.tsx. Ils sont rédigés à partir des requêtes Search
 * Console et des volumes DataForSEO de chaque page, selon scripts/_seo/titres/CHARTE-finale.md,
 * contrôlés par scripts/_seo/titres/valider.mjs et publiés par scripts/_seo/titres/publier.mjs.
 * Une page absente du fichier garde son titre par défaut, calculé par son gabarit.
 */
const T = titres as Record<string, string>;

/**
 * Typographie française, sans changer la longueur : espace insécable avant « : » et entre un
 * nombre et « ml » (« 100 ml » ne se coupe pas), espace fine insécable avant « ? ».
 * Les fichiers gardent des espaces normales, plus simples à écrire et à contrôler.
 */
function typo(t: string): string {
  return t.replace(/ :/g, " :").replace(/(\d) ml\b/g, "$1 ml").replace(/ \?/g, " ?");
}

/** Le titre à donner à Next : le titre choisi s'il existe (en absolu), sinon le défaut (gabarit). */
export function titrePage(chemin: string, defaut: string): Metadata["title"] {
  const t = T[chemin];
  return t ? { absolute: typo(t) } : defaut;
}

/** Pour une page dont le titre par défaut est déjà complet (sans gabarit). */
export function titreAbsolu(chemin: string, defautComplet: string): Metadata["title"] {
  return { absolute: typo(T[chemin] ?? defautComplet) };
}

/** Le même titre en texte complet, pour Open Graph et Twitter (qui ne voient pas le gabarit). */
export function titreTexte(chemin: string, defaut: string): string {
  return T[chemin] ? typo(T[chemin]) : `${defaut} | Maison Numidia`;
}
