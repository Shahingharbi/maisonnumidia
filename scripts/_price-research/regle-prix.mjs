// La règle de prix de Maison Numidia, à UN SEUL endroit. Tout script qui fixe un prix doit
// passer par ici : le rafraîchissement (rafraichir.mjs) comme l'ajout de nouveaux parfums
// (add-candidates.mjs). Un script qui recoderait son propre « +3 % » remettrait les anciens
// prix au prochain passage.
//
// Historique :
//  - 15/09/2026 : médiane du marché algérien +3 %.
//  - 18/10/2026 (décision de Shahin) : +20 % pour les parfums jusqu'à 15 000 DA, +10 %
//    au-dessus. Le seuil porte sur le prix tel qu'il aurait été affiché avec l'ancienne
//    règle (médiane +3 %), pour que le passage d'une règle à l'autre soit continu.
//
// Arrondi : toujours vers le haut, à la centaine sous 10 000 DA, aux 500 DA au-dessus.
// Plancher catalogue : 6 500 DA.

export const PLANCHER = 6500;
export const SEUIL = 15000;
export const MARGE_PETITS_PRIX = 0.20;
export const MARGE_AUTRES = 0.10;

export function arrondi(t) {
  const pas = t < 10000 ? 100 : 500;
  return Math.max(PLANCHER, Math.ceil(t / pas) * pas);
}

/** Prix de vente à partir de la médiane des prix de vente concurrents. */
export function prixDeVente(mediane) {
  const marge = arrondi(mediane * 1.03) <= SEUIL ? MARGE_PETITS_PRIX : MARGE_AUTRES;
  return arrondi(mediane * (1 + marge));
}
