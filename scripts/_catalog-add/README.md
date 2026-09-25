# Ajout de nouveaux parfums au catalogue

Pipeline rejouable et résistant aux coupures : chaque parfum est un fichier sur le disque,
les agents sautent ceux qui existent déjà. Une interruption coûte au pire le parfum en cours.

## Ordre des étapes

1. **`select-candidates.mjs`** — lit `scripts/_price-research/add-list/data.js` (les parfums repérés
   en vente chez les boutiques algériennes), déduplique contre le catalogue, classe par nombre de
   boutiques qui les vendent. Sortie : `candidates.json` et `brands-missing.json`.
   Le **lot prioritaire** = les parfums vus chez au moins 3 boutiques : demande réelle et prix fiable.

2. **Workflow recherche** (agents Sonnet, 1 WebSearch par parfum) → `research/<slug>.json`.
   Récupère l'URL Fragrantica, l'**ID vérifié** (jamais déduit — c'est lui qui donne l'image),
   le nom officiel, le genre, l'année, les notes et la famille. ~10 k tokens par parfum.

3. **`build-fiches.mjs`** — assemble `fiches.json` à partir de `candidates` + `research` + `texts`,
   et écrit `textes-todo.json` (les fiches sans texte).

4. **Workflow rédaction** (Sonnet, sans recherche web) → `texts/<slug>.json`. ~12 k tokens par fiche.

5. **`fetch-images.mjs --apply`** — télécharge depuis `fimgs.net/mdimg/perfume/375x500.{ID}.jpg`.

6. **`check-fiches.mjs`** puis **`apply-fiches.mjs --apply`**, puis **`fix-related.mjs --apply`**.

Coût constaté de bout en bout : **~23 k tokens par produit publié**.

## ⚠️ Ne jamais relancer `build-fiches.mjs` pendant qu'un workflow de rédaction tourne

Les agents reçoivent une **plage d'index** dans `textes-todo.json` et lisent le fichier au moment
où ils démarrent. Régénérer ce fichier en cours de route décale ou raccourcit la liste : le
25/09/2026, trois agents se sont retrouvés avec des index hors limites (plage 60-71 dans un fichier
tombé à 51 entrées) et n'ont rien écrit. Rien n'a été corrompu — ils ont refusé de travailler hors
de leur plage, ce qui est le bon réflexe — mais trois agents ont été perdus.

Attendre la fin du workflow avant de reconstruire la file. Même règle pour `retry-todo.json` et
`reecriture-todo.json` côté `scripts/_catalog-audit/`.

## Garde-fous, et pourquoi ils existent

- **Collision de slug avec le catalogue = rejet**, jamais un suffixe `-2`. « Cacharel LouLou »
  allait être publié à côté de « Cacharel Lou Lou », le même parfum (Fragrantica 1276).
- **Même marque + même nom = doublon**, même si le slug diffère : « Legend Red » allait doubler
  `mont-blanc-legend-rouge`.
- **`related` ne pointe que vers des fiches publiables** — celles du catalogue et celles du lot qui
  ont déjà leur texte. Sans ça, publier un lot partiel laisse des liens cassés.
- **`apply-fiches` refuse ce que `check-fiches` a recalé** : description sous 170 mots, note citée
  absente de la pyramide, formule interdite. Une fiche recalée attend une reprise, elle n'est pas
  publiée en l'état.
- **Alias de marques** : Fragrantica écrit « Rabanne », « Montblanc », « Viktor&Rolf »,
  « Lacoste Fragrances » là où le catalogue utilise une autre forme. Sans alias, le script croit
  devoir créer une marque qui existe déjà.
- **Le nom officiel est nettoyé** de sa concentration et de la maison répétée
  (« Q by Dolce&Gabbana Eau de Parfum Intense » → « Q Intense »), mais jamais quand la maison suit
  « de / du / d' » : « Bleu de Chanel L'Exclusif » ne doit pas devenir « Bleu de L'Exclusif ».

## Documenter une marque avant de la créer

`marques-a-creer.json` → workflow de documentation → `marques/<slug>.json` → `apply-marques.mjs`.
La description s'affiche sur `/marques/<slug>` : une date inventée est une erreur factuelle publiée.
`apply-marques.mjs` refuse toute fiche de confiance basse qui affirme une année, et tout superlatif
publicitaire. Pour Assaf et Thomas Kosmala, les sources se contredisaient : leur description
n'avance ni pays ni date, et c'est la bonne réponse.

## Scripts

| Script | Rôle |
|---|---|
| `select-candidates.mjs` | construit et classe la liste des candidats |
| `build-fiches.mjs` | assemble les fiches, écrit `textes-todo.json` |
| `check-fiches.mjs` | contrôle structure, rédaction, notes citées hors pyramide |
| `apply-fiches.mjs` | injecte dans `products.json` (simulation par défaut, `--apply`) |
| `fetch-images.mjs` | télécharge les images depuis l'ID Fragrantica vérifié |
| `fix-related.mjs` | répare les `related[]` cassés ou tombés sous 3 |
| `apply-pyramides-lot.mjs` | reporte une pyramide re-cherchée dans le fichier de recherche |
| `apply-marques.mjs` | crée les marques documentées dans `brands[]` |
