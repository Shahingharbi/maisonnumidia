# Où reprendre — vague 2 (arrêt du 31/10/2026, PC éteint en cours de route)

Rien n'est perdu : tout ce qui est fait est sur le disque (`research/`, `texts/`, images). Les
agents **sautent ce qui existe déjà**, on peut relancer n'importe quelle plage sans rien refaire.

## État au moment de l'arrêt

- **Catalogue en ligne : 1 729 produits** (rien du nouveau lot n'est encore publié).
- **`fiches.json` : ~600 fiches montées avec texte**, images téléchargées (2 échecs d'image :
  kayali-fleur-majesty-rose-royale-31, penhaligons-endymion, apply-fiches les laisse de côté).
  - 536 textes relus par la relecture indépendante (74 corrections appliquées), plus 64
    relus en relecture 3 (4 corrections).
  - 64 textes écrits juste avant l'arrêt (workflow w75f3gufv) : **pas encore relus**.
- **Recherche Fragrantica** : liste figée `a-rechercher-restant.json` (1 215 parfums), lots de
  165 par tour (le budget est de **200 WebSearch par tour**, partagé entre tous les agents).
  Lots 1 à 3 finis (index 0-494). Lot 4 (495-659) coupé par l'extinction. **577 restent.**
- **Modifs non commitées** : `data/products.json` (barre « | » retirée de 2 noms Kayali),
  scripts `build-fiches.mjs`, `check-fiches.mjs`, `notes-relues.json`, `reclasser-orientaux.mjs`.

## Reprendre dans cet ordre

1. Relancer la recherche, un lot par tour :
   Workflow `recherche-vague2-suite.js` avec `{"from":495,"total":660,"per":15,"concurrency":11}`,
   puis 660-825, 825-990, 990-1155, 1155-1215.
2. `node scripts/_catalog-add/build-fiches.mjs` (jamais pendant qu'une rédaction lit `textes-todo.json`).
3. Rédaction des fiches sans texte (workflow `redaction-fiches-nouvelles`, `{"total":N,"per":5..7}`).
4. Relecture des textes pas encore relus. Lister les slugs absents de `relecture-fige*.json`,
   écrire `relecture-fige-4.json`, puis lancer le workflow `relecture-fiches-lot-3.js` en
   remplaçant le nom du fichier.
5. `check-fiches.mjs`. Les fausses alertes « note hors fiche » se relisent une par une ; celles
   qui sont justes vont dans `notes-relues.json`, pour cette fiche seulement.
6. `fetch-images.mjs --apply`, puis `apply-fiches.mjs` (simulation, puis `--apply`), puis `fix-related.mjs --apply`.
7. **Reclassement orientaux** (`scripts/_catalog-audit/reclasser-orientaux.mjs`) : 15 fiches
   publiées classées orientales à tort (règle « ambre gris »). **Attend l'accord de Shahin.**
   À lancer APRÈS apply-fiches, pour que la liste des pages `/parfums-orientaux/<marque>`
   qui disparaissent tienne compte du nouveau lot. Ajouter les 301 listées dans
   `reclasser-orientaux-redirections.json`.
8. Audit règle n°6, `npx tsc --noEmit`, `npx next build`, `CATALOG_DATE` dans `app/sitemap.ts`,
   commit, push, `verif-production.mjs`, `indexnow-submit.mjs`. Google : le cron quotidien
   prend les nouvelles pages en premier (`firstSeen`).

## Ce qui a été corrigé le 31/10 dans la chaîne (à ne pas défaire)

- `build-fiches.mjs` :
  - **Marque dans le nom officiel :** quand elle y est soudée (« Eau de Rochas », « My Burberry », « Cartier de Lune »), elle reste dans le nom.
  - **H1 :** les parenthèses de Fragrantica en sont retirées.
  - **Slugs :** ils ne finissent plus sur un mot outil.
  - **« Ambre gris » :** ce n'est plus un marqueur oriental.
  - **Alias de marques :** Lattafa Perfumes, Viktor & Rolf, Kayali Fragrances, By Kilian, Frédéric Malle.
  - **Asdaaf :** rangé sous Lattafa (`SOUS_MARQUES`).
  - **Barre « | » :** retirée des noms.
  - **Option `--simulation` :** n'écrit rien.
- `check-fiches.mjs` :
  - **Homonymes ignorés :** « pensée » et « glace ».
  - **Mentions validées fiche par fiche :** `notes-relues.json`.
- **Textes :** « 58 wilayas » remplacé par 69 dans les 1 200 fichiers de `texts/`, et la consigne de rédaction est corrigée.
