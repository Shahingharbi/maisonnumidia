# CLAUDE.md — Règles strictes maisonnumidia.store

> Ce fichier est lu automatiquement à chaque session. Respecter TOUTES ces règles sans exception.

---

## Contexte projet

Site e-commerce parfums Algérie. COD (paiement à la réception), livraison Yalidine 58 wilayas.
- **Stack :** Next.js **16.1.6** (App Router, Turbopack), React 19, Tailwind v4, TypeScript strict, pnpm
- **Déploiement :** Vercel — GitHub : Shahingharbi/maisonnumidia
- **Domaine :** maisonnumidia.store (le `www` redirige en 301 vers l'apex — voir `next.config.ts`)
- **Téléphone :** 07 94 49 60 59
- **WhatsApp (FR) :** +33782214993
- **Analytics :** GA4 (`G-77YXRM3HBT`) + Microsoft Clarity, dans `app/layout.tsx`
- **Commandes :** EmailJS côté client (`app/commander/page.tsx`) → boîte du vendeur. Clés dans `.env.local` (local) et Vercel → Settings → Environment Variables (Production + Preview + Dev). Ne jamais coller les vraies valeurs dans ce fichier ni dans un commit.

### État du catalogue (21 septembre 2026 — vérifié via `node -e` sur `data/products.json`)
- **732 produits** dans `data/products.json` (265 homme, 403 femme, 64 oriental)
- **121 marques** dans `data/products.json.brands[]`
- **14 articles blog** dans `data/blog.ts` (contenu en **Markdown**, pas HTML — voir section blog plus bas)
- **550 keywords** dans `data/keywords.json` — 527 done, 23 skip, **0 pending**
- **761 images** dans `/public/images/products/` (Fragrantica CDN) — **0 manquante**
- **~1098 pages** au total (sitemap.xml — produits + marques + brand filters + blog + statiques)
- **0 brandSlug orphelin, 0 related cassé, 0 produit sans image** (audit règle n°6)
- Prix : **6 500 DA à 145 000 DA**, médiane ~20 000 DA (voir Règles prix)
- Descriptions produit : médiane **300 mots** dans le champ `description` (le reste des 600 mots de la page est généré par `lib/product-content.ts`)

Avant de citer un chiffre du catalogue dans une réponse, revérifier avec `node -e` — ce fichier est mis à jour ponctuellement, pas à chaque commit produit.

### Historique nettoyage
- **Avril 2026 :** 25 produits fantômes supprimés (noms inventés, mauvaises marques), 35 marques ajoutées, 55 fichiers `_tmp_batch*.mjs` temporaires supprimés, fix maillage interne + crawl budget (voir section dédiée).
- **Juin 2026 :** repricing complet (prix marché € × 270, puis recherche par agents), fusion de doublons (748 → 735), maillage `CategoryCatalogIndex` ajouté aux 3 pages catégorie, GEO (entité de marque, rail social).
- **Septembre 2026 :** repricing sur le marché algérien (539 prix), puis audit des 735 fiches contre Fragrantica — 555 fiches corrigées (notes, famille, genre, concentration, volume, rupture), 137 descriptions réécrites, 43 images retéléchargées depuis le bon ID, 3 fiches de parfums inexistants retirées (→ 732 produits). Procédure : `scripts/_catalog-audit/README.md`.

---

## Règles crawl / indexation — OBLIGATOIRES

> **Contexte (avril 2026) :** Le crawl budget GSC est tombé de 8000 à ~0, seulement 90 pages indexées sur ~1000. Causes identifiées et corrigées ci-dessous. **NE JAMAIS réintroduire ces bugs.**
>
> **Mise à jour (14 sept. 2026) :** trafic réel mesuré via Search Analytics API — ~1000 clics/semaine, 91% des URLs vérifiées indexées, croissance ×38 depuis mars. Le crawl marche. Les bugs ci-dessous restent des pièges à ne pas réintroduire, mais ne sont plus la priorité n°1 — voir plutôt les opportunités CTR et le robot d'indexation (rule n°7).

### Règle n°1 : JAMAIS de liens en JS conditionnel dans le header/footer
Les liens de navigation DOIVENT être dans le HTML statique. Google ne clique pas, ne hover pas.
- **BON :** `<div className={open ? "opacity-100 visible" : "opacity-0 invisible"}>` → le HTML est TOUJOURS là, seul le CSS change
- **MAUVAIS :** `{open && <div>...liens...</div>}` → le HTML n'existe PAS quand `open=false` → Google ne voit rien

**Fichier concerné :** `components/layout/Header.tsx` — les sous-menus dropdown

### Règle n°2 : generateStaticParams des pages marque doit suivre EXACTEMENT le filtre utilisé par la page

Les brand filter pages (`/parfums-homme/[marque]`, `/parfums-femme/[marque]`, `/parfums-orientaux/[marque]`) NE DOIVENT PAS utiliser `getAllBrandSlugs()` (ça génère des pages qui 404 pour des marques absentes de la catégorie).

**Mais attention (bug trouvé et corrigé le 14/09/2026) : filtrer par `category` ne suffit pas.** Le contenu réel de `/parfums-homme/[marque]` est filtré par **`gender`** (`p.gender === "homme" || p.gender === "unisexe"`), pas par `category` — car une marque comme Lattafa a tous ses produits catégorisés `"parfums-orientaux"` mais certains avec `gender: "homme"`, qui doivent apparaître sur `/parfums-homme/lattafa`. Si `generateStaticParams` filtre par `category` pendant que la page filtre par `gender`, le résultat est incohérent : la page existe et répond 200 (Next la rend à la demande), mais elle n'est ni pré-générée au build, ni dans le sitemap → invisible de Google malgré du vrai contenu. **17 marques homme et 13 marques femme étaient dans ce cas**, dont Lattafa (marque n°1 en clics GSC).

- **BON :** `getBrandSlugsForGenderPage("homme" | "femme")` (dans `lib/products.ts`) — même logique que le filtre utilisé dans le corps de la page.
- **MAUVAIS :** `getProductsByCategory("parfums-homme")` puis extraire les brandSlugs → décalé du filtre réel de la page.
- Pour `/parfums-orientaux/[marque]`, `category` et `isOriental` sont équivalents (un produit `isOriental` a toujours `category: "parfums-orientaux"`) → pas de bug ici, mais rester cohérent si cette invariance change un jour.
- **Toujours vérifier que `app/sitemap.ts` utilise la MÊME fonction que `generateStaticParams`** — les deux ont dérivé indépendamment par le passé, avec des logiques différentes malgré une intention identique.

### Règle n°3 : Le sitemap.xml ne doit contenir QUE des pages qui existent (HTTP 200)
- Vérifier que chaque URL du sitemap mène à une page réelle, pas un 404 ou redirect
- Le sitemap utilise `getBrandSlugsForGenderPage()` pour homme/femme, `category` pour orientaux (voir Règle n°2) — jamais `getAllBrandSlugs()`
- `CATALOG_DATE` (dans `app/sitemap.ts`) doit être mise à jour manuellement à chaque ajout significatif de produits ou changement structurel du sitemap (ne JAMAIS la remplacer par `new Date()` dynamique — Google y voit un signal "tout change tous les jours" qui dégrade le budget crawl)

### Règle n°4 : Chaque nouvelle marque DOIT être ajoutée dans brands[]
Quand on ajoute un produit avec un nouveau `brandSlug`, la marque correspondante DOIT exister dans `data/products.json.brands[]`. Sinon :
- La page `/marques/[slug]` sera en 404
- Les breadcrumbs produit seront cassés
- **Script de vérification :** `node -e "const p=require('./data/products.json');const b=new Set(p.brands.map(x=>x.slug));p.products.filter(x=>!b.has(x.brandSlug)).forEach(x=>console.log(x.slug,'→',x.brandSlug))"`

### Règle n°5 : Maillage interne minimum
- **Header** : lien vers chaque catégorie + top 5-7 marques par catégorie + Blog + Marques
- **Footer** : 3 catégories + 10 marques populaires + Blog + Plan du site
- **Pages catégorie** : BrandPills avec au moins 25 marques (pas 10)
- **Pages marque** : cross-links vers 20 autres marques en bas de page
- **Pages produit** : breadcrumb + related (3 min) + liens blog + lien brand filter
- **Page /plan-du-site** : liens vers TOUTES les pages du site (hub de crawl)

### Règle n°6 : Vérification avant chaque push
Lancer cet audit avant de push :
```bash
node -e "const p=require('./data/products.json'),fs=require('fs');const b=new Set(p.brands.map(x=>x.slug)),s=new Set(p.products.map(x=>x.slug));let e=0;p.products.forEach(x=>{if(!b.has(x.brandSlug)){console.log('❌ brand orphelin:',x.slug,'→',x.brandSlug);e++}if(!x.related||x.related.length<3){console.log('❌ related<3:',x.slug);e++}if(x.related&&x.related.some(r=>!s.has(r))){console.log('❌ related cassé:',x.slug);e++}if(!fs.existsSync('./public/images/products/'+x.slug+'.jpg')){console.log('❌ image manquante:',x.slug);e++}});console.log(e?'⚠️ '+e+' erreurs':'✅ 0 erreur — catalogue propre')"
```
Lancer aussi `npx tsc --noEmit` et, si un fichier de routing/sitemap a changé, `npx next build` en local (les erreurs de `generateStaticParams` ou de `redirects()` ne remontent parfois qu'au build, pas au typecheck).

### Règle n°7 : Si on renomme ou supprime un slug produit, TOUJOURS ajouter une redirection 301
Dans `next.config.ts` → `redirects()`. Sinon l'ancienne URL devient un 404 vivant si elle a déjà des impressions/backlinks Google. **17 anciens slugs de mars 2026 (fusion de doublons) sont restés en 404 pendant 6 mois avant d'être corrigés le 14/09/2026** faute de cette règle.
```ts
{ source: "/parfums/ancien-slug", destination: "/parfums/nouveau-slug", permanent: true },
```
Vérifier après coup avec `curl -sI https://maisonnumidia.store/parfums/ancien-slug` (attendu : `308` + bon `location`).

### Règle n°8 : Google Indexing API — NE JAMAIS mélanger les scopes OAuth dans un seul token
`scripts/google-indexing-api.mjs` doit générer **deux JWT distincts** : un avec le scope `https://www.googleapis.com/auth/indexing` (pour `publishUrl`/`getUrlMetadata`), un avec `siteverification` + `webmasters.readonly` (pour tout le reste : Site Verification, URL Inspection). **Ne jamais les fusionner dans un seul `scope` de token.** Panne vécue : le 08/06/2026, l'ajout de `webmasters.readonly` au scope unique a cassé silencieusement l'Indexing API (401 sur 100% des soumissions, **tous les jours pendant 3 mois**, masqué parce que le script committait quand même le log d'échecs). Corrigé le 14/09/2026 en séparant les tokens (`INDEXING_SCOPE` / `GSC_SCOPE`). Le script fait maintenant échouer le job CI (`process.exitCode = 1`) si 0 succès sur un batch non-vide — ne pas supprimer cette garde.

### Règle n°9 : ne JAMAIS créer une fiche sans avoir vérifié que le parfum existe

Une fiche produit inventée est invendable et pollue le catalogue pendant des mois. Trois cas trouvés le 21/09/2026, tous nés d'un nom « plausible » écrit sans source :
- `al-haramain-rose-d-arabie` — doublon de `al-haramain-rose-oud` sous un nom inventé
- `franck-olivier-club-night` — n'existe pas ; l'ID image utilisé était celui de *Night Touch*
- `lattafa-shamoos` — n'existe pas ; il existe une gamme *Shams Al Shamoos* en minis 35 ml

Avant d'écrire une entrée dans `products.json`, il faut **une URL Fragrantica qui prouve l'existence du parfum**, obtenue par recherche (`fragrantica <marque> <nom>`), jamais par déduction. Le nom officiel est celui de Fragrantica, pas le libellé de la boutique qui le vend (« Ysl black opium edp extreme » → *Black Opium Extreme*). Vérifier aussi que la **marque** est la bonne : *Madawi* est un Arabian Oud, pas un Al Haramain, et la fiche a porté la mauvaise marque pendant des mois.

Retirer une fiche fantôme = suppression + **301 vers la fiche canonique** si c'est un doublon, sinon vers la page marque (règle n°7), + réparation des `related[]` qui la citaient.

Procédure d'audit complète et rejouable : `scripts/_catalog-audit/README.md`.

### Règle n°10 : les textes générés par `lib/product-content.ts` obéissent aux mêmes règles de rédaction que `products.json`

Ce fichier produit la moitié du contenu de chaque fiche (profil olfactif, performance, persona, comparaison, FAQ). Une formule interdite écrite ici sort sur **toutes les pages produit d'un coup**, ce qui est passé inaperçu longtemps parce que les audits ne regardaient que les données. Les mêmes interdictions s'appliquent : pas de formule IA, pas d'affirmation chiffrée tirée d'un champ non sourcé (`longevity`, `sillage`), pas de promesse commerciale invérifiable. Attention aussi à ne pas injecter deux fois le même paragraphe dans une seule page.

---

## Règles SEO — OBLIGATOIRES

### Slugs URL
- Format : `mot-cle-exact-algerie` ou `nom-parfum-marque`
- Jamais de concentration dans l'URL : ❌ `dior-sauvage-edp-100ml` → ✅ `dior-sauvage`
- Basé sur les mots-clés SEMrush à volume en Algérie

### Titres meta
- Template automatique layout : `"%s | Maison Numidia"` — NE PAS ajouter `| Maison Numidia` manuellement
- **Produit (changé le 14/09/2026, validé par Shahin) :** `{Marque} {Nom} Prix Algérie Original` → rendu : `Dior Sauvage Prix Algérie Original | Maison Numidia`. Généré par `generateProductMeta()` dans `lib/seo.ts` — utilise `{Marque} {Nom}` (court), PAS le `h1` complet (`{Marque} {Nom} Parfum {Genre} Algérie`), sinon le titre dépasse 80-90 caractères et se fait tronquer par Google. Si `brand === name` (parfums "signature" type Franck Olivier, Jimmy Choo, Chloé), ne pas répéter : juste `{Marque}`.
  - **Pourquoi ce changement :** les données Search Console (sept. 2026) montrent que le trafic vient massivement de requêtes `"[produit] prix algérie"`, et que des fiches bien positionnées (pos ~6) avaient un CTR de seulement 1-1,7% faute du mot "Prix" dans le titre. Testé : le nouveau format est même **plus court en moyenne** que l'ancien (62 vs 67 caractères sur tout le catalogue).
  - Le `h1` (balise `<h1>` visible sur la page) ne change PAS — reste `{Marque} {Nom} Parfum {Genre} Algérie`. Seul le `<title>` meta a changé.
- Catégorie : `Parfum {Genre} Original en Algérie — {Marques phares}`
- Jamais de double `| Maison Numidia`

### H1
- Format : `{Marque} {Nom} Parfum {Genre} Algérie` (mot-clé exact SEMrush)
- Stocké dans le champ `h1` de products.json
- Exemple : `"h1": "Dior Sauvage Parfum Homme Algérie"`

### Meta descriptions
- Naturelles, pas de prix, max 155 caractères
- Mentionner : marque, authenticité, wilayas, COD
- Zéro tiret "—" dans les meta desc

### Contenu pages produit
- **Minimum 600 mots** par page produit
- Structure H1 > H2 (guide complet) > H3 (pyramide, occasions, acheter, original)
- Pas d'étoiles/avis (4.8/5 etc. → INTERDIT)
- Pas de "Promo" en badge sauf si vrai prix barré
- Maillage interne : liens vers produits liés + pages catégories

### Contenu pages catégorie
- **Minimum 1000 mots** en bas de page
- Pilules de marques cliquables en haut
- Maillage croisé entre les 3 catégories + produits phares
- Pas de tirets "---" entre les sections
- Texte humanisé, gras stratégiques, bullet points propres

---

## Règles design — OBLIGATOIRES

### Couleurs (ne jamais changer)
- Noir principal : `#111111`
- Or accent : `#C9A84C`
- Fond clair : `#FAFAF8`
- Or hover : `#8B6914`

### Composants
- **Arrondis :** `rounded-lg` maximum — jamais `rounded-2xl` sur les cartes produit/catégorie (ça inclut l'image principale de la fiche produit, corrigé le 14/09/2026 dans `app/parfums/[slug]/page.tsx`)
- **Pas d'étoiles** de notation sur aucune page
- **Pas de badge "En stock"** dans les cartes produit
- **Logo :** `<Image src="/logo-192.png" className="brightness-0" />` — filtre noir sur fond blanc. `logo-192.png` (18 Ko) est une copie réduite de `logo.png` (500×500, 95 Ko, gardé pour le schema Organization). Les images ne passent plus par l'optimiseur Vercel (`unoptimized` dans `next.config.ts`, quota épuisé = images en erreur 402) : ne jamais afficher un gros fichier source pour un petit visuel.
- **Réseaux sociaux :** rail flottant à gauche (`components/layout/SocialRail.tsx`) — avis Google, Instagram, Facebook, WhatsApp (`#25D366`), logos officiels SVG. (Remplace l'ancien bouton WhatsApp bas-droite.)
- **Téléphone dans le header :** toujours `07 94 49 60 59`, jamais "WhatsApp" dans le header

### Images
- Fond des photos produit : `bg-white` (jamais grisé, même un gris très clair type `#F8F8F8`)
- Images éditoriales : Unsplash uniquement — **vérifier le HTTP 200 avant d'utiliser une URL**
- Images produits : Fragrantica CDN ou téléchargées en local dans `/public/images/products/`
- Next.js `<Image fill>` : le parent doit avoir `position: relative` ET une hauteur définie

### ⚠️ Fragrantica — règle OBLIGATOIRE pour les IDs

**JAMAIS estimer ou déduire un ID Fragrantica.** Les IDs ne sont pas chronologiques.

**Méthode obligatoire pour trouver un ID :**
1. Aller sur `fragrantica.com/perfume/[Marque]/[Nom]-[ID].html`
2. Chercher via Google : `site:fragrantica.com "[Nom du parfum]"`
3. L'ID est le numéro à la fin de l'URL : `.../Shalimar-Eau-de-Parfum-**53**.html`
4. **Ne jamais mettre un ID dans un script sans avoir vérifié l'URL source**
5. Toujours commenter l'URL source dans le script : `// fragrantica.com/perfume/Guerlain/Shalimar-Eau-de-Parfum-53.html`

**Pourquoi :** En mars 2026, 11 images sur 13 du batch3 étaient fausses car les IDs avaient été estimés. Ombre Nomade (ID estimé 58498, vrai ID 49755), Shalimar (estimé 5, vrai 53), etc.

---

## Structure données produit (products.json)

Chaque produit DOIT avoir ces champs :
```json
{
  "id": "unique-id",
  "slug": "mot-cle-seo",
  "h1": "Marque Nom Parfum Genre Algérie",
  "name": "Nom commercial",
  "brand": "Marque",
  "brandSlug": "slug-marque",
  "category": "parfums-homme | parfums-femme | parfums-orientaux",
  "gender": "homme | femme | unisexe",
  "concentration": "EDP | EDT | Parfum | Extrait de Parfum | Cologne",
  "volume": "100ml",
  "price": 15900,
  "originalPrice": null,
  "badge": null,
  "image": "/images/products/slug.jpg",
  "shortDescription": "2-3 phrases naturelles, pas IA",
  "description": "Paragraphe long SEO 200+ mots",
  "notes": { "top": [], "heart": [], "base": [] },
  "family": "Boisé Aromatique",
  "occasions": ["Bureau", "Soirée"],
  "seasons": ["Automne", "Hiver"],
  "longevity": 4,
  "sillage": 4,
  "inStock": true,
  "featured": false,
  "isOriental": false,
  "related": ["slug1", "slug2", "slug3"]
}
```

### Règles prix (DZD)

**Méthode depuis le 15/09/2026 (validée par Shahin) : prix = médiane du prix de vente réel chez les boutiques en ligne algériennes concurrentes + 3 %** ("un petit chouïa plus cher que le marché"), arrondi à la centaine sous 10 000 DA, aux 500 DA au-dessus. **Plancher catalogue : 6 500 DA — ne jamais descendre en dessous.** L'ancienne méthode "prix Europe × 270" (`scripts/reprice.mjs`) n'est plus la référence : elle ne sert qu'en dernier recours.

Pipeline rejouable (`scripts/_price-research/`, lancer depuis la racine du repo, dans cet ordre) :
1. `fetch-apis.mjs` — catalogues complets via API publiques (WooCommerce Store API / Shopify `products.json`) : briki-parfums.com, galleryparfums-dz.com, mustbeauty.dz, tendanceparfumsdz.com, aromaticadz.com, parfum-algerie.com, parfumalgerie.shop, leena-dz.com (prix **normal**, c'est un site de ventes privées), leilaparfums-dz.com. `agents/fetch-oriental-shops.mjs` : odorem-dz.com, palaisdesparfums-dz.com, parfumdeluxedz.com, dionbyhiba.com. ≥1,5 s entre requêtes (Briki bloque en dessous). Sortie `raw2/*.json`.
2. `match-v3.mjs` — rapproche nos 735 produits des offres (alias de marques, même déclinaison, même concentration, même genre écrit, volume identique ou ajusté en (vol)^0.72). **Exclus** : testeurs (catégorie "Testeur original" chez Briki), coffrets, déodorants, minis/décants, et le site smellgood-dz.com (vend des décants au ml). Niveaux : A = 2+ boutiques cohérentes, B = 1 boutique au bon volume, C = à vérifier.
3. `merge-final.mjs` — concurrents (A/B) > prix trouvés par recherche web (`web/lot-*.json`) > estimation par l'écart médian observé sur la même marque (≥3 produits comparés). Sinon prix inchangé.
4. `apply-market-prices.mjs` (simulation) puis `--apply`. Garde-fous : variation max 45 % en niveau A ou vérifiée web, 25 % en niveau B, 20 % en estimation ; au-delà, le produit va dans la liste "à revoir" et garde son prix.
Recalage du 15/09/2026 : 539 prix modifiés (248 hausses, 291 baisses), 43 à revoir, 153 inchangés.

Fourchettes réelles au 15/09/2026 (vérifier avec `node -e` avant de s'y fier, ça évolue) :
- Dior / Chanel : **23 000 à 48 000 DA**
- Mid-range (Paco Rabanne, Armani, JPG) : **12 500 à 30 000 DA**
- Al Haramain (orientaux premium) : **8 500 à 15 500 DA**
- Lattafa / Franck Olivier (orientaux accessibles) : **6 500 à 9 800 DA**
- Niche/luxe (MFK, Creed, Amouage, Roja, Xerjoff) : jusqu'à ~145 000 DA
- Médiane catalogue : ~20 000 DA

Les parfums orientaux (Lattafa, Al Haramain, Rasasi, Swiss Arabian, Ajmal…) sont quasi absents des boutiques en ligne algériennes : seuls ~20 ont un vrai prix concurrent, les autres gardent leur prix ou une estimation par marque.

Le `priceRange` du schema `LocalBusiness` (`lib/seo.ts`) est **calculé dynamiquement** depuis `products.json` (fonction `getPriceRange()`) — ne jamais le remplacer par une valeur figée à la main.

---

## Règles rédaction — INTERDICTIONS ABSOLUES

❌ Tirets longs "---" entre les paragraphes
❌ Formules IA évidentes ("Il est important de noter", "En conclusion", "N'hésitez pas à")
❌ Prix dans les meta descriptions
❌ Double "| Maison Numidia" dans les titres
❌ Étoiles/notes (4.8/5, ★★★★☆)
❌ "WhatsApp" dans le header ou les boutons CTA principaux
❌ Années incorrectes (toujours 2026, pas 2025)
❌ Images de femmes dans les visuels catégorie homme ou oriental
❌ Inventer des données produits (notes olfactives, longévité, prix)

---

## Workflow ajout nouveaux produits

1. Ajouter l'entrée dans `data/products.json` avec TOUS les champs
2. Télécharger l'image → `/public/images/products/{slug}.jpg`
3. Vérifier que `related[]` pointe vers des slugs existants
4. Lancer `npx tsc --noEmit` pour vérifier les types
5. `git add -A && git commit && git push` → Vercel redéploie automatiquement
6. Relancer `node scripts/indexnow-submit.mjs` pour notifier Bing/Yandex des nouvelles pages (Google se gère via le cron `google-indexing-daily.yml`, pas besoin de le lancer à la main)

### Scripts dans `/scripts/`

Beaucoup de scripts `add-products-batch*.mjs` / `download-*.mjs` / `_tmp_*` sont des artefacts ponctuels d'un ajout de catalogue passé — pas la peine de les relancer, ils recréeraient des doublons ou pointeraient vers des slugs déjà modifiés. Les scripts encore utiles au quotidien :

| Script | Rôle |
|---|---|
| `google-indexing-api.mjs` | Cron quotidien GitHub Actions — vérifie le statut d'indexation GSC (URL Inspection) et soumet les URLs non-indexées à l'Indexing API. `--dry-run` pour prévisualiser, `--url=` pour tester une seule URL, `--verify-list` pour lister les propriétés vérifiées par le compte de service. |
| `indexnow-submit.mjs` | Notifie Bing/Yandex de toutes les URLs du site. `DRY_RUN=1` pour prévisualiser. À relancer après un ajout de produits/articles significatif. |
| `reprice.mjs` | Recalcule les prix par marque (table `BRAND_REF`, prix € × 270). Simulation par défaut, `--apply` pour écrire. |
| `update-keywords.mjs` | Met à jour `data/keywords.json` (status done/skip + slug), pattern à copier pour un nouveau batch de mots-clés SEMrush. |

### Workflow keywords SEMrush (`data/keywords.json`)

Chaque keyword a : `{ keyword, volume, kd, category, type, status, note, slug }`
- `status` : `"pending"` → `"done"` | `"skip"`
- `type` : `"product"` (créer page produit) | `"blog"` (créer article)
- `slug` : URL finale une fois la page créée
- Pour ajouter un batch de keywords → copier le pattern de `update-keywords.mjs`

### Workflow articles blog (`data/blog.ts`)

Interface TypeScript :
```ts
{ slug, title, metaTitle, metaDescription, publishedAt, category, readTime, excerpt, content }
```
- `category` : `"conseils"` | `"tendances"` | `"guides"` | `"actualites"`
- `content` : en pratique le contenu est écrit en **Markdown** (`##`/`###`, `**gras**`, `[lien](/url)`) et rendu tel quel — pas de HTML brut malgré ce qu'indiquait une version antérieure de ce fichier. Rester cohérent avec le format déjà en place dans les 14 articles existants. Minimum 1000 mots.
- Ajouter avant le `];` fermant du tableau `articles`
- Toujours `publishedAt: "2026-..."` (jamais 2025)
- **Tout lien interne `[texte](/parfums/slug)` dans le contenu doit pointer vers un slug qui existe réellement** — vérifier avec le script de la Règle n°6 étendu, ou `grep` manuel contre `products.json`. Un lien cassé a traîné plusieurs mois avant d'être trouvé (`/parfums/you-cacharel`, corrigé le 14/09/2026 → `/parfums/cacharel-noa`).
- `scripts/indexnow-submit.mjs` extrait les slugs blog **dynamiquement** depuis ce fichier (regex sur `slug: "..."`) — ne pas revenir à une liste figée en dur, elle se désynchronise (5 articles sur 14 n'étaient plus notifiés à IndexNow avant la correction du 14/09/2026).

### Fragrantica CDN — trouver un ID

URL image : `https://fimgs.net/mdimg/perfume/375x500.{ID}.jpg`
- Aller sur fragrantica.com → page du parfum → inspecter l'image → récupérer l'ID numérique
- Ou chercher via l'URL Fragrantica : `fragrantica.com/perfume/Brand/Name-{ID}.html`

### Règles champs critiques
- `gender` : `"homme"` | `"femme"` | `"unisexe"` (pas "mixte")
- `isOriental: true` UNIQUEMENT si `category: "parfums-orientaux"`
- `category` : `"parfums-homme"` | `"parfums-femme"` | `"parfums-orientaux"` (pas de "parfums-mixte")
- `related[]` : toujours 3 slugs qui existent réellement dans products.json
- **`category` et `gender` ne sont PAS interchangeables** dans le code (voir Règle n°2 crawl) — un produit peut être `category: "parfums-orientaux"` et `gender: "homme"` en même temps (ex : beaucoup de Lattafa). Toute nouvelle page ou fonction qui filtre "les produits homme" doit se baser sur `gender`, pas sur `category`.

---

## Variables d'environnement (ne jamais committer)

Dans `.env.local` (ignoré par git) :
```
NEXT_PUBLIC_EMAILJS_SERVICE_ID=...
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=...
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=...
```
Valeurs réelles : demander à Shahin ou consulter Vercel → Settings → Environment Variables (Production + Preview + Dev). Ne jamais recopier les vraies valeurs dans ce fichier ni dans un commit — même si `NEXT_PUBLIC_*` finit de toute façon dans le bundle JS public, ce fichier reste la doc du projet, pas un coffre à secrets.
