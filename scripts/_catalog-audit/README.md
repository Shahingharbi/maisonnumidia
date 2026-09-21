# Audit & correction des fiches produit (septembre 2026)

## Pourquoi
Les agents de recherche de prix (15/09/2026) ont signalé 90 problèmes sur ~94 fiches parmi ~290 examinées :
notes olfactives inventées, volumes ou concentrations qui n'existent pas, noms faux, produit fantôme
("Franck Olivier Club Night"), doublons (dior-homme / dior-homme-edp), parfums arrêtés.
Liste brute : `scripts/_price-research/catalog-issues.json`.
Les fiches d'origine ont été rédigées sans source : le reste du catalogue est probablement touché aussi.

## Décisions de Shahin (17/09/2026)
- On corrige les 735 fiches existantes AVANT d'ajouter les ~3 483 nouveaux parfums.
- Source de vérité : **Fragrantica**. Leurs pages sont protégées (Cloudflare, 403 pour tout outil
  automatique, robots.txt bloque les robots de Claude) : on ne contourne rien. On lit les données
  Fragrantica **via les résultats de recherche** (WebSearch "fragrantica <marque> <nom>"), qui donnent
  URL + ID officiels, genre, année, notes. Recoupement possible avec le site officiel de la marque.
- Parfums arrêtés / vraiment rares : **passer en rupture** (`inStock: false`), pas de suppression.
- Unisexe : une seule fiche/URL, affichée dans les listes Homme ET Femme (badge "Unisexe"),
  pas de page unisexe dédiée (9 impressions GSC en 90 jours).
- Lot test de 30 fiches avec des agents **Sonnet** (moins coûteux) avant de lancer le reste
  (après le reset du quota hebdo du 20/09/2026).

## Fonctionnement (résistant aux coupures)
1. `test-lot.json` : les 30 fiches du lot test (données actuelles + ID Fragrantica connu + prix/volumes concurrents).
2. Les agents écrivent **un fichier par fiche** dans `results/<slug>.json` dès qu'elle est traitée.
   Un fichier présent = fiche faite : à la reprise, on saute les fiches déjà traitées.
3. Les agents NE modifient PAS `data/products.json`. Ce sont des propositions.
4. Relecture humaine (Shahin) du rapport avant/après, puis application par script, build, push.

## Format d'un résultat `results/<slug>.json`
```json
{
  "slug": "...",
  "fragrantica": { "url": "...", "id": 46093, "officialName": "...", "brand": "...", "gender": "men|women|unisex", "year": 2017, "notes": { "top": [], "heart": [], "base": [] }, "accords": [] },
  "idStatus": "confirmed | wrong | not-found",
  "exists": true,
  "discontinued": "yes | no | unknown",
  "issues": [{ "field": "notes", "current": "...", "correct": "...", "severity": "high|medium|low" }],
  "corrections": { "name": null, "h1": null, "gender": null, "concentration": null, "volume": null, "family": null, "notes": null, "inStock": null },
  "description": { "needsRewrite": false, "shortDescription": null, "description": null },
  "confidence": "high | medium | low",
  "sources": ["https://..."],
  "checkedAt": "2026-09-17"
}
```

## État
- 17/09/2026 : lot test lancé (30 fiches, 3 agents Sonnet, 10 fiches chacun).
- 17/09/2026 : lot test MIS EN PAUSE à la demande de Shahin (sortie). 7/30 fiches faites. Pour reprendre : relancer le workflow sur les slugs restants (les agents sautent les fichiers results/ existants) : hermes-eau-intense-vetiver, issey-miyake-l-homme-issey, chanel-n5-parfum, dior-homme, dior-homme-edp, armani-code-absolu, bvlgari-jasmin-noir, givenchy-gentleman-parfum, bvlgari-splendida-magnolia, dior-sauvage, bleu-de-chanel, lattafa-khamrah, lattafa-yara, kayali-eden, coco-mademoiselle-chanel, armaf-club-de-nuit-intense-femme, nautica-voyage, good-girl-carolina-herrera, l-aventure-al-haramain, montale-dark-aoud, rasasi-hawas, swiss-arabian-shaghaf-oud, scandal-jean-paul-gaultier
- 19/09/2026 : audit étendu à TOUT le catalogue (735 fiches) à la demande de Shahin. Lancement par
  `workflow-audit.js` : les agents lisent eux-mêmes `todo.json` par plage d'index (pas de liste de slugs
  dans les args). Reprise après coupure : `node scripts/_catalog-audit/progress.mjs` (régénère todo.json
  et affiche la commande), puis relancer le workflow avec le `total` indiqué.
