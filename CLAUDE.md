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
  "gender": "homme | femme | mixte",
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
  "related": ["slug1", "slug2", "slug3"],
  "occasions": []
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

---

## Variables d'environnement (ne jamais committer)

Dans `.env.local` (ignoré par git) :
```
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_fi7cwuf
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_49k6yf8
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=Y22CIrNZsyAGS1Jf8
```
Sur Vercel : configurées dans Settings → Environment Variables.
