# Analyse complète du trafic Search Console

Lancée le 21/11/2026 à la demande de Shahin : où en est le trafic, ce qui est cannibalisé, les
requêtes où le site est bas, comment le multiplier.

## Les pièces

| quoi | où |
|---|---|
| Extraction (4 périodes, pages, requêtes, requête × page, courbes par type, pays, appareils) | `node scripts/_gsc/pull-analyse.mjs` → `scripts/_gsc/brut/` (ignoré par git : ce sont les requêtes des clients) |
| Outils communs (typage des URL, sommes pondérées, rapprochement catalogue) | `scripts/_gsc/lib-analyse.mjs` |
| Contexte donné aux analystes (données, pièges, chronologie du site) | `scripts/_gsc/brut/analyse/CONTEXTE.md` |
| Workflow : 9 analystes, puis un contre-expert par analyse | `scripts/_gsc/workflows/analyse-gsc-complete.js` (`{"sansComplements": true}` pour s'arrêter après la contre-vérification) |
| Rapports | `scripts/_gsc/brut/analyse/0N-<angle>.md` et `0N-<angle>.verif.md` |

Les 9 angles : trajectoire et effets des événements, cannibalisation, requêtes à portée de main et
écarts de CTR, intentions et gabarits, demande non servie, pages sans trafic et indexation,
concurrence (Semrush / DataForSEO), technique après le passage sur Cloudflare, prix et CTR.

## À savoir avant de relancer

- Les requêtes visibles ne portent que 25 % des clics (Google masque les requêtes rares) : toute
  somme faite sur les requêtes sous-estime la réalité. Les données par page sont complètes.
- `brut/` n'existe que sur le PC où l'extraction a tourné. Sur une autre machine, ou plusieurs
  semaines plus tard, relancer `pull-analyse.mjs` (2 minutes) et régénérer `CONTEXTE.md`.
- Le 21/11, une première passe a été coupée à mi-course ; ce que les analystes avaient déjà
  calculé est dans `brut/analyse/reprise/` et leurs scripts dans `brut/analyse/scripts/`.
- Les analystes ne doivent jamais utiliser WebSearch pendant qu'un lot de recherche catalogue
  tourne : le quota de 200 recherches par tour est commun.

## Repères au 21/11/2026 (données complètes, par page)

- 90 derniers jours : 19 864 clics, 449 704 impressions, CTR 4,4 %, position 6,8.
  Les 90 jours d'avant : 7 273 clics. Novembre : environ 300 clics par jour.
- 94 % des clics viennent d'Algérie, 90 % du mobile.
- Fiches produit : 72 % des clics. Les 3 pages catégorie : 241 clics en 90 jours.
- Le CTR est passé de 5,0 % (24/09 → 21/10) à 4,4 % (22/10 → 18/11) alors que la position
  s'améliore : à expliquer (hausse des prix du 18/10, dilution par les fiches nouvelles ?).
