# Où reprendre — vague 2 (état au 01/11/2026)

## État

- **Catalogue en ligne : 2 329 produits** (+600 le 01/11/2026, commit `261d388`), 150 marques,
  audit règle n°6 à 0 erreur.
- **Déjà montées mais pas publiées : 72 fiches sans texte** (dans `fiches.json`), dont
  4 maisons à créer dans `brands[]` : Clive Christian, Fragrance Du Bois, Les Liquides
  Imaginaires, Moresque. Il faut une fiche par maison dans `marques/` (sources, sans date
  inventée), puis `apply-marques.mjs`.
- **Recherche Fragrantica : 565 parfums restent** dans la liste figée
  `a-rechercher-restant.json` (1 215 au départ). Les lots 1 à 3 sont finis (index 0 à 494),
  le lot 4 (495-659) a été coupé à mi-course.

Rien n'est perdu d'une session à l'autre : les agents **sautent ce qui existe déjà**
(`research/<slug>.json`, `texts/<slug>.json`). On peut relancer n'importe quelle plage.

## La contrainte : 200 WebSearch par tour

Le budget de recherche web est de **200 appels par tour**, partagés entre tous les agents d'un
même tour. D'où des lots de **165 parfums** (11 agents × 15), un lot par tour : à la fin d'un
lot, la notification ouvre un nouveau tour et on lance le suivant.

## Reprendre dans cet ordre

1. Recherche, un lot par tour : workflow `recherche-vague2-suite.js` avec
   `{"from":495,"total":660,"per":15,"concurrency":11}`, puis 660-825, 825-990, 990-1155,
   1155-1215.
2. `node scripts/_catalog-add/build-fiches.mjs`. **Jamais** pendant qu'une rédaction lit
   `textes-todo.json`. Pour tester une modification du script, utiliser `--simulation`.
3. Rédaction des fiches sans texte : workflow `redaction-fiches-nouvelles`, avec
   `{"total":N,"per":5..7}`.
4. **Relecture indépendante, obligatoire avant publication.** Écrire dans `relecture-fige-N.json`
   les fiches avec texte absentes des `relecture-fige*.json` précédents, puis lancer le
   workflow `relecture-fiches-lot-N.js` en pointant ce fichier. Le 01/11, elle a corrigé
   80 défauts sur 600 fiches.
5. `check-fiches.mjs`. Les fausses alertes « note hors fiche » se relisent une à une ; celles
   qui sont justes vont dans `notes-relues.json`, pour cette fiche seulement.
6. `fetch-images.mjs --apply`. Un échec sur délai dépassé se retente : il passe presque toujours.
7. `apply-fiches.mjs` (simulation, puis `--apply`), puis `fix-related.mjs --apply`.
8. Audit règle n°6, `npx tsc --noEmit`, `npx next build`, `CATALOG_DATE` dans `app/sitemap.ts`,
   commit, push, `verif-production.mjs`, `indexnow-submit.mjs`.

## Ce qui a été corrigé dans la chaîne (31/10 – 01/11, à ne pas défaire)

- `build-fiches.mjs` :
  - **Marque dans le nom officiel :** quand elle y est soudée (« Eau de Rochas », « My Burberry », « Cartier de Lune »), elle reste dans le nom ; le slug part alors du nom.
  - **H1 :** les parenthèses de Fragrantica en sont retirées.
  - **Slugs :** ils ne finissent plus sur un mot outil.
  - **« Ambre gris » :** ce n'est plus un marqueur oriental.
  - **Alias de marques :** Lattafa Perfumes, Viktor & Rolf, Kayali Fragrances, By Kilian, Frédéric Malle.
  - **Asdaaf :** rangé sous Lattafa (`SOUS_MARQUES`).
  - **Barre « | » :** retirée des noms.
- `check-fiches.mjs` :
  - **Homonymes ignorés :** « pensée », « glace », « accord oriental ».
  - **Mentions validées fiche par fiche :** `notes-relues.json`.
- **Textes :** « 58 wilayas » remplacé par 69 partout, et la consigne de rédaction est corrigée.
- **Reclassement :** 15 fiches orientales à tort sont passées en homme/femme (`scripts/_catalog-audit/reclasser-orientaux.mjs`).
