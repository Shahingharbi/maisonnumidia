# CLAUDE.md — Règles strictes maisonnumidia.store

> Ce fichier est lu automatiquement à chaque session. Respecter TOUTES ces règles sans exception.

---

## Contexte projet

Site e-commerce parfums Algérie. COD (paiement à la réception), livraison Yalidine 58 wilayas.
- **Stack :** Next.js 14 App Router, Tailwind v4, TypeScript strict, pnpm
- **Déploiement :** Vercel — GitHub : Shahingharbi/maisonnumidia
- **Domaine :** maisonnumidia.store
- **Téléphone :** 06 99 41 85 69
- **WhatsApp (FR) :** +33782214993

### État du catalogue (avril 2026)
- **748 produits** dans `data/products.json` (~274 homme, ~400 femme, ~74 oriental)
- **121 marques** dans `data/products.json.brands[]`
- **9 articles blog** dans `data/blog.ts`
- **550 keywords** dans `data/keywords.json` — 527 done, 23 skip, **0 pending**
- **~770 images** dans `/public/images/products/` (Fragrantica CDN) — **0 manquante**
- **~1045 pages** au total (produits + marques + brand filters + blog + statiques)
- **0 brandSlug orphelin, 0 related cassé, 0 produit sans image**

### Historique nettoyage (avril 2026)
- 25 produits fantômes supprimés (n'existaient pas : noms inventés, mauvaises marques)
- 35 marques ajoutées (brandSlug orphelins corrigés)
- Choco Musk corrigé Rasasi → Al Rehab, Midnight Dreams renommé Night Dreams
- 55 fichiers `_tmp_batch*.mjs` temporaires supprimés de la racine
- Fix maillage interne + crawl budget (voir section dédiée ci-dessous)

---

## Règles crawl / indexation — OBLIGATOIRES

> **Contexte (avril 2026) :** Le crawl budget GSC est tombé de 8000 à ~0, seulement 90 pages indexées sur ~1000. Causes identifiées et corrigées ci-dessous. **NE JAMAIS réintroduire ces bugs.**

### Règle n°1 : JAMAIS de liens en JS conditionnel dans le header/footer
Les liens de navigation DOIVENT être dans le HTML statique. Google ne clique pas, ne hover pas.
- **BON :** `<div className={open ? "opacity-100 visible" : "opacity-0 invisible"}>` → le HTML est TOUJOURS là, seul le CSS change
- **MAUVAIS :** `{open && <div>...liens...</div>}` → le HTML n'existe PAS quand `open=false` → Google ne voit rien

**Fichier concerné :** `components/layout/Header.tsx` — les sous-menus dropdown

### Règle n°2 : generateStaticParams doit filtrer par catégorie
Les brand filter pages (`/parfums-homme/[marque]`, `/parfums-femme/[marque]`, `/parfums-orientaux/[marque]`) NE DOIVENT PAS utiliser `getAllBrandSlugs()`. Chaque catégorie doit générer uniquement les marques qui ont des produits dans cette catégorie.
- **BON :** `getProductsByCategory("parfums-homme")` → extraire les brandSlugs → `generateStaticParams`
- **MAUVAIS :** `getAllBrandSlugs()` → génère 121 pages dont 50+ retournent 404 (notFound)

**Pourquoi :** En avril 2026, 141 pages fantômes en 404 étaient générées. Google les crawlait, recevait un 404, et baissait le crawl budget du site entier.

### Règle n°3 : Le sitemap.xml ne doit contenir QUE des pages qui existent (HTTP 200)
- Vérifier que chaque URL du sitemap mène à une page réelle, pas un 404 ou redirect
- Le sitemap utilise les brandSlugs extraits des produits par catégorie (PAS getAllBrandSlugs)
- `CATALOG_DATE` doit être mise à jour à chaque ajout significatif de produits

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

---

## Règles SEO — OBLIGATOIRES

### Slugs URL
- Format : `mot-cle-exact-algerie` ou `nom-parfum-marque`
- Jamais de concentration dans l'URL : ❌ `dior-sauvage-edp-100ml` → ✅ `dior-sauvage`
- Basé sur les mots-clés SEMrush à volume en Algérie

### Titres meta
- Template automatique layout : `"%s | Maison Numidia"` — NE PAS ajouter `| Maison Numidia` manuellement
- Produit : `{H1 keyword} Original` → rendu : `Dior Sauvage Parfum Homme Algérie Original | Maison Numidia`
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
- **Arrondis :** `rounded-lg` maximum — jamais `rounded-2xl` sur les cartes produit/catégorie
- **Pas d'étoiles** de notation sur aucune page
- **Pas de badge "En stock"** dans les cartes produit
- **Logo :** `<Image src="/logo.png" className="brightness-0" />` — filtre noir sur fond blanc
- **WhatsApp :** bouton floating bas-droite, couleur `#25D366`
- **Téléphone dans le header :** toujours `06 99 41 85 69`, jamais "WhatsApp" dans le header

### Images
- Fond des photos produit : `bg-white` (jamais grisé)
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
  "concentration": "EDP | EDT | Parfum",
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
- Baser sur des prix réels du marché algérien — NE PAS inventer
- Dior/Chanel/grandes maisons : 12 000 à 18 000 DA
- Marques mid-range (Paco Rabanne, Armani, JPG) : 6 000 à 10 000 DA
- Orientaux premium (Al Haramain) : 4 000 à 6 000 DA
- Orientaux accessibles (Lattafa, Franck Olivier) : 2 000 à 4 000 DA

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

### Scripts disponibles dans `/scripts/`

| Script | Rôle |
|---|---|
| `add-products-batch1.mjs` | Premiers 15 produits (avant batches A-E) |
| `add-products-batchA.mjs` | Produits vol 720→480 (15 produits) |
| `add-products-batchB.mjs` | Produits vol 390→170 (15 produits) |
| `add-products-batchC.mjs` | Produits vol 170→110 (15 produits) |
| `add-products-batchD.mjs` | Produits vol 110→90 (15 produits) |
| `add-products-batchE.mjs` | Produits vol 90→70 (8 produits) |
| `download-images-batch2.mjs` | Télécharge 67 images Fragrantica → `/public/images/products/` |
| `update-keywords.mjs` | Met à jour `data/keywords.json` (status done/skip + slug) |

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
- `content` : HTML pur (pas de Markdown), minimum 1000 mots
- Ajouter avant le `];` fermant du tableau `articles`
- Toujours `publishedAt: "2026-..."` (jamais 2025)

### Fragrantica CDN — trouver un ID

URL image : `https://fimgs.net/mdimg/perfume/375x500.{ID}.jpg`
- Aller sur fragrantica.com → page du parfum → inspecter l'image → récupérer l'ID numérique
- Ou chercher via l'URL Fragrantica : `fragrantica.com/perfume/Brand/Name-{ID}.html`

### Règles champs critiques
- `gender` : `"homme"` | `"femme"` | `"unisexe"` (pas "mixte")
- `isOriental: true` UNIQUEMENT si `category: "parfums-orientaux"`
- `category` : `"parfums-homme"` | `"parfums-femme"` | `"parfums-orientaux"` (pas de "parfums-mixte")
- `related[]` : toujours 3 slugs qui existent réellement dans products.json

---

## Variables d'environnement (ne jamais committer)

Dans `.env.local` (ignoré par git) :
```
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_fi7cwuf
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_49k6yf8
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=Y22CIrNZsyAGS1Jf8
```
Sur Vercel : configurées dans Settings → Environment Variables.
