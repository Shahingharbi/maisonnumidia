# Titres des grandes enseignes et des concurrents : relevé du 24/11/2026

Question : comment les grandes enseignes du parfum et les boutiques algériennes écrivent-elles leurs balises `<title>` ? Qu'est-ce qu'un site algérien encore peu connu de Google doit leur emprunter, et qu'est-ce qu'il doit laisser ?

## Méthode

- **Rien de mémoire.** Chaque titre ci-dessous a été lu sur la page elle-même le 24/11/2026.
  - `B` : balise `<title>` du HTML renvoyé par le serveur (curl, user-agent navigateur).
  - `N` : `document.title` lu dans un vrai navigateur, après chargement. Sephora, Nocibé, Marionnaud, Galeries Lafayette, Dior et Chanel bloquent curl (403/400).
- **Longueur** : nombre de caractères du titre complet, suffixe compris (entités HTML décodées).
- **Les titres renvoyés par l'outil WebSearch sont inutilisables** : il affiche le slug à la place du titre (« sauvage   eau de parfum 469637 », « Mine põhisisu juurde » pour Notino). Il n'a servi qu'à trouver des URL (9 recherches).
- **Titres affichés par Google** : deux recherches lancées dans le navigateur (`gl=dz`, `hl=fr`, depuis une connexion française), voir la section dédiée. À la troisième, Google a renvoyé sa page anti-robot. Elle n'a pas été contournée.
- **Limites** :
  - Douglas : `douglas.fr` redirige en 301 vers `nocibe.fr` (même groupe), donc Douglas = Nocibé.
  - Marionnaud ne remonte aucun Dior dans sa recherche : sa fiche relevée est La Vie est Belle.
  - Relevé fait en pleine période Black Friday. Les titres promo de Nocibé (« ⚡ De -30% à -40% ») sont saisonniers. La catégorie femme de Sephora passe de « Parfum femme 𝌆 SEPHORA » à « Parfum femme Black Friday 𝌆 SEPHORA » une fois ses scripts exécutés.
  - Notino : la fiche Sauvage a été lue dans le navigateur. Les pages gamme et catégorie ont été lues par curl, parce que le navigateur tombait sur la vérification Cloudflare. Elles servent un titre très court (« DIOR Sauvage », « Parfum homme »), sans doute la version servie aux robots.
  - Lattafa Khamrah : relevé seulement chez Notino et Palais des Parfums. Les autres enseignes n'en vendent pas, ou il n'a pas été trouvé.

## Relevé (84 pages)

### Grandes enseignes et maisons (France)

| site | type | URL | titre exact | long. | src |
|---|---|---|---|---:|:-:|
| Sephora | fiche | sephora.fr/p/sauvage---eau-de-parfum-469637.html | Sauvage - Eau de parfum pour homme notes épicées et d'absolu vanille \| DIOR ≡ SEPHORA | 85 | N |
| Sephora | fiche | sephora.fr/p/libre---eau-de-parfum-520562.html | YSL LIBRE Eau de Parfum - Parfum femme lavande florale rechargeable \| YVES SAINT LAURENT ≡ SEPHORA | 98 | N |
| Sephora | marque | sephora.fr/marques/de-a-a-z/dior-dior/ | DIOR ≡ SEPHORA | 14 | N |
| Sephora | catégorie | sephora.fr/shop/parfum/parfum-homme-c310/ | Parfum homme 𝌆 SEPHORA | 22 | N |
| Sephora | catégorie | sephora.fr/shop/parfum/parfum-femme-c309/ | Parfum femme 𝌆 SEPHORA | 22 | N |
| Nocibé | fiche | nocibe.fr/fr/p/3011043693 | DIOR Sauvage Notes hespéridées et boisées Parfum » achetez en ligne \| Nocibé | 76 | N |
| Nocibé | fiche | nocibe.fr/fr/p/5009868011 | Yves Saint Laurent Libre Eau de toilette » achetez en ligne \| Nocibé | 68 | N |
| Nocibé | gamme | nocibe.fr/fr/b/dior/sauvage/b0690850110 | DIOR Sauvage ✔️ achetez en ligne \| Nocibé | 41 | N |
| Nocibé | gamme | nocibe.fr/fr/b/yves-saint-laurent/libre/b061154 | Yves Saint Laurent Libre ⚡ De -30% à -40% \| NOCIBÉ | 50 | N |
| Nocibé | marque | nocibe.fr/fr/b/dior/b0690 | DIOR \| Le meilleur choix de parfum, maquillage et soin - Nocibe.fr | 66 | N |
| Nocibé | marque | nocibe.fr/fr/b/yves-saint-laurent/b0611 | Yves Saint Laurent ⚡ De -30% à -40% \| NOCIBÉ | 44 | N |
| Nocibé | catégorie | nocibe.fr/fr/c/parfum/parfum-homme/0102 | Parfum homme ⚡ De -30% à -40% \| NOCIBÉ | 38 | N |
| Marionnaud | fiche | marionnaud.fr/parfum/parfum-femme/eau-de-parfum/la-vie-est-belle-eau-de-parfum-rechargeable-lancome/p/BP_100257559 | LANCÔME LA VIE EST BELLE Eau de parfum - rechargeable \| Marionnaud | 66 | N |
| Marionnaud | marque | marionnaud.fr/lancome/b/100351 | Lancôme \| Parfum, Maquillage, Soin & Coffret \| Marionnaud \| Marionnaud | 70 | N |
| Marionnaud | catégorie | marionnaud.fr/parfum/parfum-homme/c/P0200 | Parfums pour Hommes : Découvrez l'univers masculin de Marionnaud \| Marionnaud | 77 | N |
| Marionnaud | accueil | marionnaud.fr/ | Marionnaud : parfum, maquillage, soin - parfumerie et institut \| Marionnaud | 75 | N |
| Notino | fiche | notino.fr/dior/sauvage-eau-de-parfum-pour-homme-7178429/ | DIOR Sauvage Eau de Parfum pour homme \| notino.fr | 49 | N |
| Notino | fiche | notino.fr/yves-saint-laurent/libre-eau-de-parfum-pour-femme/ | Yves Saint Laurent Libre Eau de Parfum pour femme \| notino.fr | 61 | B |
| Notino | fiche | notino.fr/lattafa/khamrah-eau-de-parfum-mixte/ | Lattafa Khamrah Eau de Parfum mixte \| notino.fr | 47 | B |
| Notino | gamme | notino.fr/dior-sauvage/ | DIOR Sauvage | 12 | B |
| Notino | gamme | notino.fr/lattafa/khamrah/ | Parfum Lattafa Khamrah \| Qahwa & Dukhan | 39 | B |
| Notino | marque | notino.fr/dior/ | Christian Dior : parfums, maquillage et cosmétiques \| notino.fr | 63 | N |
| Notino | marque | notino.fr/lattafa/ | Parfums arabes de luxe Lattafa \| notino.fr | 42 | B |
| Notino | marque × genre | notino.fr/dior-parfums-homme/ | DIOR Parfums Homme | 18 | B |
| Notino | catégorie | notino.fr/parfums-homme/ | Parfum homme | 12 | B |
| Galeries Lafayette | fiche | galerieslafayette.com/p/libre-eau+de+parfum-yves+saint+laurent/15664133/378 | Eau de Parfum - Yves Saint Laurent \| Galeries Lafayette | 55 | N |
| Galeries Lafayette | marque | galerieslafayette.com/b/yves-saint-laurent | Yves Saint Laurent \| Galeries Lafayette | 39 | N |
| Galeries Lafayette | catégorie | galerieslafayette.com/c/beaute/parfums/parfums-femme | Parfums femme - Galeries Lafayette | 34 | N |
| Dior.com | fiche | dior.com/fr_fr/beauty/products/sauvage-eau-de-parfum-F078524009.html | Sauvage Eau de Parfum : parfum hespéridé vanillé - Rechargeable \| DIOR FR | 73 | N |
| Dior.com | gamme | dior.com/fr_fr/beauty/le-parfum/les-parfums-pour-homme/sauvage | Sauvage : l'univers du parfum pour homme Dior iconique \| DIOR FR | 64 | N |
| Dior.com | catégorie | dior.com/fr_fr/beauty/le-parfum/les-parfums-pour-homme | Parfums Homme \| DIOR FR | 23 | N |
| Chanel.com | fiche | chanel.com/fr/parfums/p/107360/bleu-de-chanel-eau-de-parfum-vaporisateur/ | BLEU DE CHANEL EAU DE PARFUM VAPORISATEUR - 100 ml \| CHANEL | 59 | N |
| Chanel.com | gamme | chanel.com/fr/parfums/hommes/c/7x1x2x34/bleu-de-chanel/ | BLEU de CHANEL \| Parfums & Fragrances Hommes \| CHANEL | 53 | N |
| Chanel.com | catégorie | chanel.com/fr/parfums/hommes/c/7x1x2/ | Fragrances et Parfums Homme CHANEL \| Site Officiel \| CHANEL | 59 | N |

### Algérie

| site | type | URL | titre exact | long. | src |
|---|---|---|---|---:|:-:|
| Must | fiche | mustbeauty.dz/produit/libre/ | Libre - Must | 12 | B |
| Must | fiche | mustbeauty.dz/produit/good-girl/ | Good Girl - Must | 16 | B |
| Must | fiche | mustbeauty.dz/produit/very-good-girl/ | Very Good Girl - Must | 21 | B |
| Must | marque | mustbeauty.dz/marque/yves-saint-laurent/ | YVES SAINT LAURENT - Must | 25 | B |
| Must | marque | mustbeauty.dz/marque/carolina-herrera/ | CAROLINA HERRERA - Must | 23 | B |
| Must | catégorie | mustbeauty.dz/categorie-produit/homme/ | HOMME - Must | 12 | B |
| Must | catégorie | mustbeauty.dz/categorie-produit/parfum/ | PARFUM - Must | 13 | B |
| Must | accueil | mustbeauty.dz/ | Must - Parfums . Soin . Makeup | 30 | B |
| Briki Parfums | fiche | briki-parfums.com/parfums-homme/dior-sauvage/ | Dior Sauvage 100 MlPrix Algérie \| Briki Parfums | 47 | B |
| Briki Parfums | fiche | briki-parfums.com/parfums-homme/dior-sauvage-2/ (et -3 : même titre) | DIOR SAUVAGE 100 Ml - Parfum Homme Premium En Algérie | 53 | B |
| Briki Parfums | fiche | briki-parfums.com/parfums-femme/yves-saint-laurent-libre-2/ | YVES SAINT LAURENT LIBRE - Parfum Femme 90ml Premium Algérie | 60 | B |
| Briki Parfums | fiche | briki-parfums.com/new/dior-sauvage-extrait/ | Dior Sauvage Extrait 50 Ml - Parfum Homme Intense En Algérie | 60 | B |
| Briki Parfums | marque | briki-parfums.com/marque/dior/ | CHRISTIAN DIOR \| Briki Parfums | 30 | B |
| Briki Parfums | marque | briki-parfums.com/marque/yves-saint-laurent/ | YVES SAINT LAURENT \| Briki Parfums | 34 | B |
| Briki Parfums | liste des marques | briki-parfums.com/marque/ | Marques De Parfums En Algérie \| Briki Parfums | 45 | B |
| Briki Parfums | catégorie | briki-parfums.com/parfums-homme/ | Parfums Homme : Prix En Algérie \| Briki Parfums | 47 | B |
| Briki Parfums | catégorie | briki-parfums.com/parfums-femme/ | Parfums Femme : Prix En Algérie \| Briki Parfums | 47 | B |
| Briki Parfums | accueil | briki-parfums.com/ | Parfums En Algérie – Homme & Femme \| Briki Parfums | 50 | B |
| Gallery Parfums | fiche | galleryparfums-dz.com/produit/libre/ | LIBRE – Galleryparfums-dz | 25 | B |
| Gallery Parfums | fiche | galleryparfums-dz.com/produit/good-girl/ | GOOD GIRL – Galleryparfums-dz | 29 | B |
| Gallery Parfums | marque | galleryparfums-dz.com/marque/yves-saint-laurent/ | YVES SAINT LAURENT – Galleryparfums-dz | 38 | B |
| Gallery Parfums | catégorie | galleryparfums-dz.com/categorie-produit/parfum/parfum-homme/ | Parfum Homme – Galleryparfums-dz | 32 | B |
| Gallery Parfums | catégorie | galleryparfums-dz.com/categorie-produit/parfum/parfum-femme/ | Parfum Femme – Galleryparfums-dz | 32 | B |
| Odorem | fiche | odorem-dz.com/produit/dior-sauvage-100ml-edp/ | Dior sauvage 100ml EDP - odorem dz | 34 | B |
| Odorem | fiche | odorem-dz.com/produit/libre-berry-crush-90ml-edp/ | Libre Berry Crush 90ml EDP - odorem dz | 38 | B |
| Odorem | fiche | odorem-dz.com/produit/encounter-calvin-klein-100ml/ | Encounter Calvin Klein 100ml - odorem dz | 40 | B |
| Odorem | marque (étiquette) | odorem-dz.com/product-tag/dior/ | DIOR - odorem dz | 16 | B |
| Odorem | catégorie | odorem-dz.com/product-category/parfum/parfum-homme/ | PARFUM HOMME - odorem dz | 24 | B |
| Odorem | catégorie | odorem-dz.com/product-category/parfums-de-niche/ | PARFUMS DE NICHE - odorem dz | 28 | B |
| Palais des Parfums | fiche | palaisdesparfums-dz.com/produit/dior-sauvage-edp/ | Dior sauvage edp - palais des parfums dz | 40 | B |
| Palais des Parfums | fiche | palaisdesparfums-dz.com/produit/lattafa-khamra-edp-100ml/ | Lattafa khamra edp 100ml - palais des parfums dz | 48 | B |
| Palais des Parfums | fiche | palaisdesparfums-dz.com/produit/ysl-libre-edp/ | Ysl libre edp - palais des parfums dz | 37 | B |
| Tendance Parfums DZ | fiche | tendanceparfumsdz.com/shop/yves-saint-laurent-libre/ | Yves Saint Laurent Libre \| Tendance Parfums DZ | 46 | B |
| Tendance Parfums DZ | accueil | tendanceparfumsdz.com/ | Tendance Parfums DZ \| Parfums de grandes marques originales à Alger | 67 | B |
| Parfumdeluxe | accueil | parfumdeluxedz.com/ | Parfumdeluxe \| Parfums 100% Authentiques en Algérie : Dior, Guerlain..  – Parfumdeluxe Fragrance & Beauté | 105 | B |
| Essence du Nord | accueil | essencedenord.com/ | Essence Du Nord \| Parfumerie en Ligne en Algerie \| 1000+ Parfums | 64 | B |
| 7Doors (vend des extraits) | accueil | 7doors-parfum.com/ | 7Doors DZ Parfum Alger – Extrait Original – عطور فاخرة لأناقتك الخاصة | 69 | B |
| VIP Perfume Bar (extraits « inspirés ») | marque | vip-perfume-bar.com/marques/dior/ | Parfums Dior en Algérie — 9 extraits inspirés, dès 1 000 DA · VIP Perfume Bar | 77 | B |
| Algérie Parfums | accueil | algerieparfum.com/ | Algérie Parfums - Parfumerie & Beauté à Tébessa | 47 | B |
| Maison Numidia (repère) | fiche | maisonnumidia.store/parfums/dior-sauvage | Dior Sauvage Prix Algérie Original \| Maison Numidia | 51 | B |
| Maison Numidia (repère) | marque | maisonnumidia.store/marques/dior | Parfums Dior en Algérie — Toute la Collection \| Maison Numidia | 62 | B |
| Maison Numidia (repère) | catégorie | maisonnumidia.store/parfums-homme | Parfum Homme Original en Algérie — Dior, Chanel, Armani \| Maison Numidia | 72 | B |
| Maison Numidia (repère) | accueil | maisonnumidia.store/ | Parfum Original en Algérie — Livraison 69 Wilayas, Paiement à la Réception | 74 | B |

### Maroc et Tunisie

| site | type | URL | titre exact | long. | src |
|---|---|---|---|---:|:-:|
| Jumia Maroc | gamme | jumia.ma/dior-sauvage/ | Sauvage Parfum Prix Maroc - Dior 50 ml & 100 ml \| Jumia | 55 | B |
| Primini (comparateur, TN) | fiche | primini.tn/prix/79503/dior-sauvage-60-ml | DIOR Sauvage 60 ml : Prix, Fiche Technique & Avis en Tunisie | 60 | B |
| Spacenet (TN) | catégorie | spacenet.tn/787-parfum-homme | Parfum Homme au Meilleur Prix en Tunisie | 40 | B |
| Fatales (TN) | fiche | fatales.tn/eau-de-parfum/1325696-anthology-l-homme-eau-de-parfum.html | ANTHOLOGY L'HOMME EAU DE PARFUM | 31 | B |
| Fatales (TN) | marque | fatales.tn/brand/12-jean-paul-gaultier | JPG \| Fatales Tunisie | 21 | B |
| Fatales (TN) | catégorie | fatales.tn/1532-parfum-hommes | Parfum Hommes  en ligne  \| Fatales Tunisie | 42 | B |
| Fatales (TN) | accueil | fatales.tn/ | Fatales : Parfums, Maquillage et Soins en Tunisie | 49 | B |

## Ce que Google affiche réellement (2 pages de résultats, 24/11/2026, `gl=dz`)

**« dior sauvage prix algérie »** : les 9 premiers titres organiques, dans l'ordre.

| # | titre affiché | site |
|---|---|---|
| 1 | sauvage dior - صحة و جمال | ouedkniss.com |
| 2 | Dior Sauvage – 7Doors DZ Parfum Alger – Extrait Original | 7doors-parfum.com |
| 3 | DIOR SAUVAGE 100 Ml - Parfum Homme Premium En ... | briki-parfums.com |
| 4 | Dior Parfums | maisonprado.com |
| 5 | Parfums Dior en Algérie — 9 extraits inspirés, dès 1 000 DA | vip-perfume-bar.com |
| 6 | Dior sauvage le parfum 200ml | wasry-dz.com |
| 7 | DIOR SAUVAGE EAU DE TOILETTE Adress : 1 étage ... | Facebook (Pafen DZ) |
| 8 | Sauvage Elixir 100ml | odorem-dz.com |
| 9 | Sauvage Eau de Parfum - Dior Parfum Homme | essencedenord.com |

Maison Numidia n'apparaît pas dans ces 9 résultats, dans ce contexte (connexion française, réglée sur l'Algérie).

**« parfum homme algérie »**

| # | titre affiché | site |
|---|---|---|
| 1 | PARFUM - Must | mustbeauty.dz (`/homme/parfum-homme`) |
| 2 | PARFUM HOMME | odorem-dz.com |
| 3 | Parfums Homme : Prix En Algérie | briki-parfums.com |
| 4 | Parfums Pour Hommes - ARVEA NATURE | arvea-nature.com.dz |
| 5 | Parfum Original en Algérie — Livraison 69 Wilayas, Paiement ... | **maisonnumidia.store** (l'accueil, pas `/parfums-homme`) |
| 6 | RUE PARFUM — Parfums & Soins \| Marque algérienne | parfumerue.com |
| 7 | Essence Du Nord \| Parfumerie en Ligne en Algerie \| 1000+ ... | essencedenord.com |
| 8 | pafen-dz - Online Store | pafen-dz.com |
| 9 | Parfums homme · عطور رجالية - Algérie Parfums | algerieparfum.com |

**Constats :**

1. **Google n'a réécrit aucun de ces titres, mais il coupe le nom du site quand il l'affiche déjà au-dessus du lien.**
   - Odorem : « PARFUM HOMME - odorem dz » devient « PARFUM HOMME ».
   - Briki : « … | Briki Parfums » disparaît.
   - Notre accueil est coupé à environ 60 caractères (« Paiement ... »).
   - Conséquence : le suffixe « | Maison Numidia » n'a aucune valeur dans le résultat. Tout ce qui compte doit tenir dans les 55 à 60 premiers caractères.
2. **Le titre n'explique pas le classement.**
   - Must est 1er sur « parfum homme algérie » avec le titre le plus pauvre du relevé (« PARFUM - Must »).
   - Odorem est 2e avec « PARFUM HOMME ».
   - Cela confirme le diagnostic de `scripts/_seo/PLAN.md` : c'est la confiance qui classe, pas le contenu. Un titre fait cliquer, il ne fait pas monter.
3. **Sur cette requête, c'est notre page d'accueil qui sort, pas la catégorie `/parfums-homme`.** Son titre ne contient pas « homme ».
4. **« Original » ne distingue pas.**
   - 7Doors, qui vend des extraits, affiche « Extrait Original ».
   - VIP Perfume Bar affiche « extraits inspirés ».
   - Dans la page de résultats, « original » côtoie des copies.

## Analyse

### Casse

- **Grandes enseignes françaises : casse de phrase.** Majuscule au premier mot et aux noms propres, minuscules partout ailleurs.
  - « Eau de parfum pour homme notes épicées et d'absolu vanille » (Sephora).
  - « Parfum femme lavande florale rechargeable » (Sephora).
  - « Eau de Parfum pour homme » et « Eau de Parfum mixte » (Notino).
  - « achetez en ligne » (Nocibé).
  - « Parfum homme » (Sephora, Notino, Nocibé), « Parfums femme » (Galeries Lafayette).
- **« Eau de Parfum »** prend parfois deux majuscules, comme un nom de produit (Notino, Dior, Sephora pour YSL). D'autres écrivent « Eau de parfum » ou « Eau de toilette » (Sephora pour Dior, Nocibé, Marionnaud).
- **Majuscules de titre (chaque mot en capitale) : jamais sur un mot commercial.** On ne les voit que sur des intitulés courts de rayon : « Parfums Homme » (Dior.com), « DIOR Parfums Homme » (Notino), « Parfums pour Hommes » (Marionnaud).
- **Capitales intégrales : réservées au logotype de la marque.** DIOR, YVES SAINT LAURENT, LANCÔME, NOCIBÉ, SEPHORA, CHANEL. Chanel met tout le nom du produit en capitales parce que c'est sa typographie maison (« BLEU DE CHANEL EAU DE PARFUM VAPORISATEUR »).
- **Au Maghreb, les majuscules de titre sur les mots courants sont la norme.**
  - Briki : « Prix En Algérie », « Premium En Algérie », « 100 Ml ».
  - Jumia Maroc : « Prix Maroc ».
  - Primini : « Prix, Fiche Technique & Avis ».
  - Spacenet : « au Meilleur Prix ».
  - Essence du Nord : « Parfumerie en Ligne ».
  - Maison Numidia : « Prix Algérie Original », « Livraison 69 Wilayas, Paiement à la Réception ».
- **Ce qui fait « pas pro » vient de là.** Aucune grande enseigne n'écrit « Prix », « Original » ou « Livraison » avec une majuscule au milieu d'un titre.

### Ordre des éléments

**Fiche produit.** Deux modèles chez les grands.

| modèle | exemples | forme |
|---|---|---|
| marque en tête | Notino, Nocibé, Marionnaud | Marque + Nom + Concentration (+ genre) |
| nom en tête | Sephora, Dior.com | Nom + concentration + accroche, la marque passe au suffixe (« \| DIOR ≡ SEPHORA ») |

Dans les deux cas :

- **La concentration est écrite en toutes lettres**, chez toutes les grandes enseignes : Eau de Parfum, Eau de toilette, Parfum. « EDP » n'apparaît que chez Odorem (« 100ml EDP ») et Palais des Parfums (« edp »).
- **Le genre s'écrit « pour homme », « pour femme », « mixte »** (Notino, Sephora), ou « Parfum femme » (Sephora pour Libre).
- **Le volume est presque toujours absent**, car une page porte plusieurs contenances.
  - Seul Chanel l'indique : « - 100 ml ».
  - En Algérie il est fréquent (Briki, Odorem, Palais), parce qu'il y a une URL par contenance. Briki a deux URL Sauvage 100 ml au même titre.
- **L'accroche (au plus une, après le séparateur) est olfactive chez les grands** : « notes épicées et d'absolu vanille », « parfum hespéridé vanillé », « Notes hespéridées et boisées ». Ou c'est une action : « achetez en ligne ».
- **Le prix n'apparaît dans aucun titre de fiche d'une enseigne française.** On ne le trouve que chez les acteurs maghrébins : Briki, Jumia (« Sauvage Parfum Prix Maroc - Dior 50 ml & 100 ml »), Primini (« DIOR Sauvage 60 ml : Prix, Fiche Technique & Avis en Tunisie »).

**Page marque.** Deux formes :

- **La forme nue** « Marque | Site » : Sephora, Galeries Lafayette, Briki, Must, Gallery, Odorem.
- **La forme « Marque : ce qu'on y trouve »** :
  - « Christian Dior : parfums, maquillage et cosmétiques » (Notino).
  - « DIOR | Le meilleur choix de parfum, maquillage et soin » (Nocibé).
  - « Lancôme | Parfum, Maquillage, Soin & Coffret » (Marionnaud).
- **Pour une marque que l'internaute ne connaît pas forcément**, Notino dit ce qu'elle est : « Parfums arabes de luxe Lattafa ».

**Page catégorie : courte et littérale.**

- Exemples : « Parfum homme » (Sephora, Notino), « Parfum homme ⚡ De -30% à -40% » (Nocibé, Black Friday), « Parfums femme » (Galeries Lafayette), « Parfums Homme » (Dior).
- Marionnaud est l'exception verbeuse : « Parfums pour Hommes : Découvrez l'univers masculin de Marionnaud ».
- En Algérie, Briki est le seul à ajouter l'intention locale : « Parfums Homme : Prix En Algérie », 3e sur « parfum homme algérie ».

### Séparateurs

- **Avant le nom du site : « | » partout.**
  - Variantes décoratives : « ≡ » et « 𝌆 » chez Sephora, « · » chez VIP Perfume Bar.
  - « - » chez Must, Odorem et Galeries Lafayette (catégorie).
  - « – » chez Gallery et 7Doors (réglage par défaut de WordPress).
- **À l'intérieur du titre :**
  - « - » : Sephora, Marionnaud, Chanel, Galeries Lafayette, Briki, Jumia.
  - « : » : Dior.com, Notino (marque), Marionnaud (catégorie), Briki (catégorie), Primini.
  - « » » : Nocibé.
- **Jamais plus de deux niveaux** : `Nom - accroche | Site`.
- **Le tiret long « — » n'apparaît chez aucune grande enseigne.** On ne le trouve que chez Maison Numidia, VIP Perfume Bar et Rue Parfum.
- **Marionnaud empile et double son nom** : « Lancôme | Parfum, Maquillage, Soin & Coffret | Marionnaud | Marionnaud ».

### Suffixe de marque

- **Toujours présent, court et constant** : « | Nocibé », « | notino.fr », « | CHANEL », « | DIOR FR », « - Must ».
- **Sephora ajoute la marque du parfum devant le sien** (« | DIOR ≡ SEPHORA »). Le nom de la marque se retrouve ainsi dans le titre sans encombrer le début.
- **Google retire le suffixe** quand le nom du site est déjà affiché au-dessus du lien (voir plus haut).

### Mots commerciaux

| mot | grandes enseignes françaises | Maghreb |
|---|---|---|
| « achetez en ligne » | Nocibé (fiches et gammes) | aucun |
| « Site Officiel » | Chanel | aucun |
| promotion chiffrée | Nocibé (« ⚡ De -30% à -40% », réelle et saisonnière), Sephora (« Black Friday » ajouté par script) | aucun |
| « prix » | aucun | Briki, Jumia, Primini, Spacenet |
| « original », « authentique » | aucun | Tendance (« originales »), Parfumdeluxe (« 100% Authentiques »), 7Doors (« Extrait Original ») |
| « livraison » | aucun | Maison Numidia (accueil) |

- **Chez les grands, l'authenticité et la livraison vont dans la meta description, pas dans le titre.**
  - Notino : « Parfums 100 % authentiques à des prix imbattables ».
  - Sephora : « Livraison Gratuite ».
  - Nocibé : « Livraison gratuite dès 60€ ».

### Longueur

| type de page | nombre | min | médiane | max |
|---|---|---|---|---|
| fiches, grandes enseignes | 11 | 47 | 66 | 98 |
| marques et gammes, grandes enseignes | 14 | 12 | 44 | 70 |
| catégories, grandes enseignes | 8 | 12 | 34 | 77 |
| fiches, concurrents algériens | 16 | 12 | 40 | 60 |

- Repères pour les fiches :
  - Notino : 47 à 61 caractères.
  - Chanel : 59.
  - Nocibé : 68 à 76.
  - Sephora : 85 à 98, donc coupé dans Google.
- Notre fiche Sauvage fait 51 caractères, notre catégorie homme 72.

## Ce qu'un site algérien inconnu de Google doit copier

1. **La casse de phrase.** Majuscule au premier mot et aux noms propres, minuscules partout ailleurs. Par exemple « Dior Sauvage Eau de Parfum pour homme, prix en Algérie », et non « … Prix Algérie Original ».
   - Les marques s'écrivent dans leur graphie officielle (Lancôme, Yves Saint Laurent), sans capitales intégrales.
   - Les formes mesurées dans CLAUDE.md restent valables (Armani, Rabanne).
2. **Le nom du parfum, tel qu'il est tapé, dans les premiers mots, avec la marque à côté.**
   - Écrire la concentration en toutes lettres (« Eau de Parfum », « Parfum », « Elixir ») quand elle distingue la page d'une autre version, comme le font toutes les grandes enseignes.
   - Écrire le genre en minuscules (« pour homme », « pour femme », « mixte »).
3. **Une seule accroche, après un seul séparateur, qui dit ce que la page a de propre.**
   - Les grands mettent l'olfactif.
   - Un site local a mieux à proposer : l'intention locale que Jumia, Primini et Briki écrivent en clair (« prix en Algérie »). L'accroche olfactive vient ensuite, si la place le permet.
4. **L'essentiel dans les 55 à 60 premiers caractères, puis un suffixe court et constant.** Google tronque vers 60 caractères et efface souvent le suffixe.
5. **Pour les pages marque, la forme « Marque : ce qu'on y trouve »**, et pour une marque peu connue, dire ce qu'elle est (Notino : « Parfums arabes de luxe Lattafa »).
6. **Pour les catégories, un titre court et littéral** (« Parfum homme »), complété de l'intention locale. Briki « Parfums Homme : Prix En Algérie » est 3e, mais il faut l'écrire en casse de phrase.

## Ce qu'il ne doit pas copier

1. **Les titres nus.** Exemples :
   - Must : « Libre - Must ».
   - Gallery : « LIBRE – Galleryparfums-dz ».
   - Galeries Lafayette, qui perd même le nom du parfum : « Eau de Parfum - Yves Saint Laurent ».

   Must classe grâce à son autorité, pas à ses titres. Un site inconnu n'a pas cette autorité.
2. **Les capitales intégrales et les majuscules de titre sur les mots courants.**
   - Capitales intégrales : Gallery, Odorem, Marionnaud (« LANCÔME LA VIE EST BELLE »).
   - Majuscules de titre : Briki (« Prix En Algérie », « 100 Ml »).
3. **Les abréviations collées** : « 100ml EDP », « edp » (Odorem, Palais des Parfums).
4. **Les titres de plus de 70 caractères** (Sephora, 85 à 98) : ils sont coupés.
5. **Les promos, émojis et accroches de saison** (Nocibé « ⚡ -30 % », « ✔️ » ; Sephora « Black Friday »). Seulement avec une vraie remise, et CLAUDE.md interdit « Promo » sans prix barré.
6. **Les doublons.**
   - Nom du site répété : « | Marionnaud | Marionnaud ».
   - Même titre sur deux URL : Briki `dior-sauvage-2` et `dior-sauvage-3`.
   - Plus de deux niveaux de séparateurs.
7. **« Original » comme seul argument.** Les vendeurs d'extraits l'affichent aussi (7Doors « Extrait Original »). Dans la page de résultats, il ne distingue plus une boutique de vrais parfums.
8. **Le tiret long « — »**, absent de toutes les grandes enseignes.
