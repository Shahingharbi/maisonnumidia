# Titres de toutes les pages : reprendre ici

État au **24/11/2026, arrêt demandé par Shahin** (PC trop chargé). Rien n'est en ligne : tout est
committé sur la branche locale `seo/titres-2026-11-24`, pas poussé. `main` n'a pas bougé.

## Ce qui est fait (sur la branche)

- **Charte** : `CHARTE-finale.md` (la règle), 45 titres de référence dans `echantillon-charte.json`.
  Recherches qui l'ont fondée : `recherche/donnees.md` (nos requêtes GSC), `recherche/google.md`
  (réécriture, troncature, casse française), `recherche/enseignes.md` (Sephora, Notino, Must…).
  Une deuxième charte, écartée, est dans `archives/`.
- **Outils** : `dossiers.mjs` (un dossier par page), `mesures.mjs <lot>` (mesures de la charte §2),
  `valider.mjs` (contrôle), `par-marque.mjs <slug>` (titres déjà écrits d'une marque),
  `publier.mjs` (rassemble tout dans `data/titres.json`, refuse s'il reste une erreur).
- **Site branché** : `lib/titres.ts` lit `data/titres.json` (vide pour l'instant) ; toutes les pages
  (fiches, marques, filles, catégories, accueil, blog, service) passent par `titrePage()`.
- **Titres rédigés, validateur à 0 erreur, PAS ENCORE RELUS** : `sorties/speciaux.json` (26 pages),
  `sorties/lot-001.json` à `lot-009.json` (360 pages, les plus fortes en impressions). Soit 386 titres.
- `avant.json` : les titres en ligne avant la refonte, pour mesurer le CTR avant/après.

## Ce qui reste

1. **Rédaction des lots 010 à 069** (60 lots, ~2 360 pages). Les lots 010 et 011 avaient commencé
   au moment de l'arrêt : leur travail est perdu, à refaire.
2. **Relecture de TOUS les lots**, y compris speciaux et 001-009 (aucune n'a eu le temps de finir).
3. **Cohérence par marque** entre les lots (12 groupes de marques équilibrés).
4. À corriger à la main dans `speciaux.json` (le validateur interdisait alors « avis » et « pas cher »
   aussi sur les articles, il les autorise maintenant) :
   - `/blog/lattafa-khamrah-avis` → reprendre « avis » (ex. « Lattafa Khamrah avis : notes, tenue et alternatives ») ;
   - `/blog/parfum-pas-cher-original-algerie` → reprendre « pas cher », et ne plus doubler le titre de
     `/blog/parfum-original-algerie` (cannibalisation).
5. `node scripts/_seo/titres/publier.mjs` (simulation) puis `--ecrire`, `npx tsc --noEmit`,
   `npx next build`, vérifier 5 pages en local, fusionner la branche dans `main`, pousser.
6. Après la mise en ligne : `--urls-file` du robot d'indexation pour les pages à fort trafic, et
   relevé du CTR à position égale après 3-4 semaines (comparer à `avant.json`).

## Comment relancer sans rien perdre

Le workflow de rédaction est `C:/Users/superindep/.claude/projects/C--Users-superindep-maisonnumidia/51d8e666-d998-4488-a549-82491feebfd2/workflows/scripts/titres-toutes-pages-wf_4142ff12-527.js`
(barres obliques normales exprès : écrit avec des antislashs, ce chemin cassait la compilation, Tailwind lisant l'antislash suivi de 51d8e6 comme un caractère invalide)
(copie dans ce dossier : `workflow-titres.js`). **Ne pas le relancer tel quel** :
- lui passer en `lots` **seulement les lots sans fichier** dans `sorties/` pour la rédaction, et
  faire relire tous les lots dans une phase séparée ;
- demander aux rédacteurs d'**écrire leur fichier tous les 10 titres** (pas seulement à la fin), pour
  qu'un arrêt ne perde au plus que 10 titres par lot ;
- lancer par vagues de 15 à 20 lots, pour ne pas saturer le PC (Shahin l'utilise en même temps).

Les dossiers (`dossiers/lot-*.json`) datent d'avant la fusion de 2 fiches (Romance, Eternity) :
ne PAS les régénérer avant la fin de la rédaction (la composition des lots changerait). Les fiches
fusionnées sont ignorées par `valider.mjs --tout` et écartées par `publier.mjs`.
