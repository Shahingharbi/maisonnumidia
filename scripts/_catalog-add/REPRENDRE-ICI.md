# Où reprendre — vague 2 (état au 21/11/2026)

## État

- **Catalogue en ligne : 2 329 produits**, 150 marques (inchangé depuis le 01/11/2026).
- **262 fiches montées, aucune publiée** (`fiches.json`) :
  - 73 rédigées et relues le 21/11 (`relecture-fige-5.json`, 18 défauts corrigés) ;
  - 189 dont la rédaction + relecture a été lancée le 21/11 (`relecture-fige-6.json`) : vérifier
    combien ont leur `texts/<slug>.json`, relancer le workflow sur ce qui manque.
- **4 maisons documentées, pas encore dans `brands[]`** : Clive Christian, Fragrance Du Bois,
  Les Liquides Imaginaires, Moresque (`marques/*.json`). `apply-marques.mjs --apply` les crée en
  une seconde : à lancer au moment de publier, pas avant (une marque sans produit ne sert à rien).
- **11 maisons encore à documenter** avant de publier leurs fiches : Akro, Atelier des Ors,
  Blend Oud, Christian Louboutin, French Avenue, Giardino Benessere, L'Atelier Parfum, Laverne,
  Masque Milano, Ramón Béjar, Rosendo Mateu Olfactive Expressions, plus celles que le lot
  990-1155 a fait apparaître (`build-fiches.mjs` les liste : « marques à créer »).
- **Recherche Fragrantica : 234 parfums restent** dans `a-rechercher-restant.json` :
  index 1155 à 1214 (60, jamais cherchés) et 174 entre 495 et 825 (cherchés le 21/11 sans le
  filtre de domaine, donc sans ID : mis de côté dans `a-rechercher-de-nouveau/2026-11-21/`).

Rien n'est perdu d'une session à l'autre : les agents **sautent ce qui existe déjà**
(`research/<slug>.json`, `texts/<slug>.json`). On peut relancer n'importe quelle plage.

## PIÈGE du 21/11/2026 : la recherche web ne remonte plus Fragrantica toute seule

Une recherche `fragrantica <marque> <nom>` ne renvoie plus aucune page fragrantica.com (17
résultats de revendeurs et de Parfumo pour un Dunhill courant). Il faut le paramètre
**`allowed_domains: ["fragrantica.com"]`** et une requête SANS le mot « fragrantica ».
Mesuré sur deux lots de 165 parfums : **1 fiche exploitable sans le filtre, 141 avec.**
Si le rendement d'un lot s'effondre (`sansId` élevé, `confiance: basse` partout), tester une
recherche à la main avant de brûler le quota. `mettre-de-cote.mjs` sort les fichiers ratés.

## La contrainte : 200 WebSearch par tour

Le budget de recherche web est de **200 appels par tour**, partagés entre tous les agents d'un
même tour. D'où des lots de **165 parfums** (11 agents × 15, 17 recherches au plus par agent).
**Le budget ne se recharge que quand le tour est terminé** : lancer un lot, rendre la main, et
lancer le suivant à la notification de fin. Deux lots enchaînés dans le même tour : le second
s'arrête au bout de 25 recherches (vécu le 21/11).

## Reprendre dans cet ordre

Les workflows sont dans `scripts/_catalog-add/workflows/` (à passer en `scriptPath`).

1. Recherche, un lot par tour : `workflows/recherche-fragrantica-filtre.js` avec
   `{"from":1155,"total":1215,"date":"AAAA-MM-JJ","marques":[{"slug":"akro","nom":"Akro"},…]}`
   (le champ `marques` documente des maisons dans le même tour, 2 recherches chacune), puis
   `{"from":495,"total":660,…}` et `{"from":660,"total":825,…}`.
2. `node scripts/_catalog-add/build-fiches.mjs`. **Jamais** pendant qu'une rédaction lit
   `textes-todo.json`. Pour tester une modification du script, utiliser `--simulation`.
3. Rédaction puis relecture indépendante, **obligatoire avant publication**, en un seul
   workflow : copier `textes-todo.json` dans `relecture-fige-N.json`, puis
   `workflows/redaction-relecture.js` avec `{"total":<nombre>,"date":"AAAA-MM-JJ","lot":N}`.
   Le 01/11, la relecture a corrigé 80 défauts sur 600 fiches ; le 21/11, 18 sur 73.
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
