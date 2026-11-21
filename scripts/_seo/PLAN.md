# Plan SEO : top 3 en Algérie sur toutes les requêtes parfum

Écrit le 21/11/2026, à partir de la Search Console (90 jours), de DataForSEO (Google Algérie,
français : mots-clés de Must et les nôtres, volumes de recherche des 2 320 parfums du catalogue,
backlinks des concurrents) et d'une lecture du code. Chaque action a sa **vérification** : une
action n'est faite que quand la vérification passe.

Fichiers de données (dans le dépôt, `scripts/_seo/donnees/`) :
- `volumes-catalogue.json` : volume de recherche mensuel en Algérie de chaque parfum du catalogue.
- `ecart-must.json` : les 1 771 mots où Must est dans le top 10, avec notre position.
- `demande-produits.json` : demande par fiche (Search Console + volumes).
- `volumes-sujets.json` : volumes des sujets d'articles (français et arabe).

## 0. Le diagnostic en 10 lignes

1. Trafic : ~300 clics/jour, +20 %/mois. 94 % Algérie, 90 % mobile.
2. Ce trafic vient de la longue traîne (parfums rares, « X prix algérie »). Sur les mots à volume, on
   est loin : Must est top 10 sur 1 771 mots (397 000 recherches/mois) ; **nous, top 10 sur 7**.
3. Même sur nos propres parfums : 41 noms à plus de 500 recherches/mois où nous ne sommes **même pas
   dans le top 100** (« gentleman », « le male elixir », « irrésistible givenchy », « armani code »…).
4. Ce n'est pas le contenu : nos fiches sont plus riches que celles de Must ou Gallery.
5. Ce n'est pas les backlinks de nos concurrents : ils n'en ont presque pas (Must ~6 vrais liens).
6. C'est **la confiance** : âge du domaine (janvier 2026 contre 2021-2023), recherches de la marque
   (« must » 4 400/mois, nous ~200), signaux locaux (.dz, magasins).
7. Et probablement **la qualité perçue à l'échelle** : 46 à 63 % du texte de chaque fiche est
   identique mot pour mot d'une fiche à l'autre (blocs paiement, livraison, concentration),
   sur 2 329 fiches. Google lit ça comme du contenu fabriqué en série.
8. Cannibalisation : 100 pages « marque filtrée » doublaient leur page marque (corrigé le 21/11).
9. Les pages catégorie pesaient 3,3 Mo (corrigé le 21/11).
10. Le prix affiché dans Google coûte des clics : −16 à −26 % de CTR sur les fiches montées de +12 %.

**80/20 de la demande** : 310 fiches (≥ 100 recherches/mois) portent 180 000 des 214 000 recherches
mensuelles du catalogue (84 %). Ce sont elles qu'il faut rendre parfaites en premier.

## A. Autorité : liens et marque (le levier n°1)

| # | Action | Qui | Vérification |
|---|---|---|---|
| A1 | Fiche algeria-news.com (annuaire où Must est inscrit) : pré-remplie dans le navigateur | Shahin : email + 2 cases + Sauvegarder | la page `algeria-news.com/annuaire/maison-numidia` existe (2 à 15 jours) |
| A2 | Fiche algeria.com (annuaire) : pré-remplie | Shahin : prénom, nom, email, case, captcha | email de confirmation reçu |
| A3 | GoAfrica, PagesMaghreb, Expat.com, Ouedkniss (page boutique), Trustpilot, Bing Places | Shahin crée le compte (ou « Continuer avec Google »), Claude remplit la fiche | chaque fiche publique avec le lien du site |
| A4 | Fiche Google Business de la boutique de Blida : site = `https://maisonnumidia.store`, catégorie « Parfumerie », horaires, 10 photos, 1 publication par semaine | Shahin | la fiche affiche le site ; recherches « maison numidia » en hausse dans la Search Console |
| A5 | Avis Google : demander un avis à chaque client livré (lien `g.page/r/CbvXGSvflJQzEAE/review` dans le message de suivi) | Shahin | +20 avis en 2 mois |
| A6 | Instagram, Facebook, TikTok : lien du site en bio, et `maisonnumidia.store` écrit sur chaque visuel | Shahin | — |
| A7 | **Articles sponsorisés, 50 €/mois** : 1 à 2 par mois sur un site lifestyle ou féminin algérien (vitaminedz.com, dziriya.net, babalweb.net), 1 tous les 2-3 mois sur un média (tsa-algerie.com, algerie360.com, dzairdaily.com) | Claude rédige l'email et l'article, Shahin envoie et paie | le lien est en dofollow, sur une page indexée (`site:` sur Google) |
| A8 | Relations presse (ce qui a donné à Must son lien Kenzo) : un vrai sujet, ex. « une parfumerie de Blida livre 2 300 parfums originaux dans les 69 wilayas », « comment repérer un faux parfum en Algérie » (avec nos données) | Claude rédige le communiqué | 1 reprise par trimestre |
| A9 | Si la boutique est dans un centre commercial ou a une agence web : demander la page « boutiques » / « réalisations » avec lien (Must a les deux) | Shahin | — |

**Ancres** : varier. Nom de la marque (« Maison Numidia ») et URL nue la plupart du temps, puis
« parfum original en Algérie », « parfums homme », un nom de parfum. Jamais 10 fois la même ancre.
**Cibles** : accueil, `/parfums-femme`, `/parfums-homme`, `/parfums-orientaux`, et les fiches du top 30.
**Jamais** de liens en masse (Odorem : 807 domaines de spam, trafic divisé par 2,7 en un an).

Modèle d'email (article sponsorisé), à adapter :
> Bonjour, je suis Shahin, de Maison Numidia, une parfumerie de Blida qui vend des parfums originaux
> partout en Algérie. J'aimerais publier chez vous un article utile à vos lectrices et lecteurs
> (par exemple « Comment reconnaître un parfum original en Algérie » ou « Les parfums les plus
> recherchés en Algérie en 2026 »), avec un lien vers notre site. Quels sont vos tarifs et
> conditions pour un article sponsorisé ? Merci, Shahin, 07 94 49 60 59, maisonnumidia.store

## B. Zéro cannibalisation

Règle : **une intention de recherche = une seule page.**

| ce que les gens tapent | la seule page qui répond |
|---|---|
| parfum femme / homme / oriental (algérie) | la page catégorie |
| parfum {marque}, {marque} algérie, {marque} prix | `/marques/{marque}` |
| {marque} femme / homme (si la marque a les deux) | `/parfums-femme/{marque}` |
| {nom du parfum} | la fiche de la version de base |
| {nom} parfum / elixir / intense / EDP | la fiche de cette déclinaison, le mot distinctif en tête du titre |
| meilleur…, comment…, différence… | un article, qui renvoie vers les fiches |

| # | Action | État | Vérification |
|---|---|---|---|
| B1 | 100 pages filtrées identiques à leur page marque : canonique vers `/marques/x`, hors sitemap, liens internes vers la marque (`estDoublonDeMarque`, `urlMarqueSection`) | **fait le 21/11** | `curl` sur `/parfums-femme/kayali` : canonical = `/marques/kayali` ; sitemap sans ces URL |
| B2 | Fusion des articles `meilleur-parfum-femme-2026` → `meilleur-parfum-femme` (301) | en cours (workflow articles) | 308 sur l'ancienne URL |
| B3 | Fiches aux données suspectes. **Fait le 21/11** : `narciso-rodriguez-for-her` fusionnée dans `-edp-rouge` (même EDP 2006, 301) ; `ysl-y-femme` (le « Y » femme de 1964) et les deux Insolence (EDT 2006 / EDP 2008) sont de vrais parfums distincts. `lattafa-asad` passée de 60 à 100 ml (format vendu partout, vérifié chez 15 revendeurs). **Reste** : `armani-code` (« Code » étiqueté EDP 110 ml, notes proches de l'EDT 2004 : concentration à vérifier) ; `lattafa-bade-al-oud` : ses notes ne correspondent ni à Oud for Glory (Fragrantica 64948) ni à Amethyst (68214), **à demander à Shahin : quel flacon vend-il sous ce nom ?** (56 clics en 90 jours, ne pas supprimer à l'aveugle) ; pyramides contestées de L.12.12 Blanc, Colonia (Acqua di Parma), D&G Pour Homme ; Escada Candy Love toujours fabriqué ? (relevés par les relecteurs d'articles) | en partie | chaque fiche = un parfum distinct prouvé, sinon 301 |
| B4 | 39 requêtes partagées entre 2 URL (liste : `node scripts/_gsc/brut/analyse/scripts/express.mjs`) : Chance / Chance Eau Tendre, Club de Nuit Women / Intense, 212 (3 fiches), Kayali Eden / Vanilla 28 | à faire | après correction des titres, une seule URL > 85 % des impressions de la requête |
| B5 | Contrôle mensuel automatique : requêtes > 100 impressions partagées entre 2 URL à > 15 % chacune | script à écrire | rapport vide ou expliqué |
| B6 | Pages filles de 1 ou 2 produits (73) : garder seulement si la marque a les deux genres, sinon traitées par B1 | à revoir après B1 | — |

## C. Pages parfaites : les 310 fiches qui font 84 % de la demande

Liste : `volumes-catalogue.json`, volume ≥ 100. Ordre : par volume décroissant.

Pour chaque fiche, la vérification est une check-list :
1. **Titre** : le nom du parfum tel que tapé (« Stronger With You », « Le Male Elixir ») + « prix Algérie ».
   Test A/B proposé (décision Shahin) : sur la moitié des fiches, nom en premier :
   `Stronger With You Armani : Prix en Algérie, Original | Maison Numidia`. Mesure après 4 semaines.
2. **h1** contient les mots tapés (outil `scripts/_gsc/audit-h1.mjs`).
3. **Texte unique** ≥ 300 mots qui ne se trouve sur aucune autre fiche (aujourd'hui ~500 mots uniques
   noyés dans ~600 mots de blocs communs).
4. **Blocs communs réduits** : paiement, livraison, « EDP = 12 à 18 % » apparaissent sur 2 329 pages.
   Une phrase courte + un lien vers `/livraison` ou un guide unique, au lieu de paragraphes entiers.
   Objectif : < 20 % de texte identique d'une fiche à l'autre (mesure : script de similarité).
5. **Versions** : tableau des déclinaisons (EDT/EDP/Parfum/Elixir) avec liens croisés, pour que chaque
   déclinaison garde son mot distinctif sans voler la requête de base.
6. **Nom arabe** quand il est sûr et demandé (عطر خمرة 480/mois, عطر اسد 260) : dans un h2 ou la FAQ.
7. **Maillage entrant** : la fiche est liée depuis sa page marque, sa catégorie, au moins un article.
8. **Données structurées** : Product + Offer + shippingDetails + retour (déjà en place) : vérifier
   l'outil de test Google sur 10 fiches.
9. **Prix** : dans la fourchette du marché (voir D4).
10. **En stock**, image correcte, fiche Fragrantica de référence.

Mise en œuvre : un workflow par lots de 30 fiches (rédaction ciblée + relecture indépendante, comme pour
les fiches neuves), puis mesure des positions DataForSEO toutes les 2 semaines sur ces 310 noms.

## D. Catégories, marques, prix

| # | Action | État | Vérification |
|---|---|---|---|
| D1 | Pages catégorie allégées (3,3 Mo → quelques centaines de Ko) | **fait le 21/11** | `curl` : taille de `/parfums-femme` |
| D2 | Pages catégorie visent « parfum femme » (5 400/mois), « parfum homme » (4 400 ×2 graphies), « parfum » (9 900) : titre, h1, texte d'introduction visible au-dessus de la grille, liens depuis l'accueil et les articles, liens externes (A7) | à faire | position DataForSEO sur ces 4 mots, toutes les 2 semaines |
| D3 | Pages marque visent « parfum {marque} » et « {marque} » : « jean paul gaultier » 4 400, « yves saint laurent » 4 400, « versace parfum » 720, « calvin klein parfum » 590 où nous sommes absents. Titre actuel « Parfums X en Algérie — Toute la Collection » → « Parfum X : Prix en Algérie, Toute la Collection » + texte unique par grande marque | à faire | positions DataForSEO |
| D4 | Prix : sur les fiches montées de plus de 12 % le 18/10, revenir à +10 % au moins sur les 310 fiches à volume. Décision de Shahin (marge contre volume) | décision | CTR des fiches concernées, 4 semaines |
| D5 | Pages locales à tester : « parfumerie alger » (210), « parfum oran » (210), « parfum alger » (210), « parfumerie algerie » (480) : une page par grande ville avec du vrai contenu propre (tarif et bureaux Yalidine de la ville, délais), pas des pages vides | test sur 3 villes | positions + aucune page sans contenu propre |

## E. Contenu : articles SEO/GEO

**Publiés le 21/11** (workflow `articles-seo-geo` : rédaction, vérification des faits, relecture
SEO/GEO, correction ; intégration contrôlée par `scripts/_seo/integrer-articles.mjs`) :
réécriture de `meilleur-parfum-homme` (590 + 140 + arabe 210), `meilleur-parfum-femme` (590 + 170 + 110,
le doublon `meilleur-parfum-femme-2026` fusionné en 301), `eau-de-parfum-vs-eau-de-toilette` ;
nouveaux : `parfum-ete-homme` (190), `meilleurs-parfums-lattafa`, `parfum-sucre-vanille-femme` (180).
Sur « meilleur parfum homme », **aucun site algérien dans le top 20** : la place est libre.
Le moteur de rendu du blog lit désormais gras et liens dans les puces (avant : texte brut, 18 lignes
publiées touchées). À programmer le 15/12/2026 : passer les titres « 2026 » en « 2027 ».

Suivants, par volume : « parfum dz » / « parfumerie algerie » (page, pas article), comparatifs de
parfums phares (« Sauvage ou Bleu de Chanel », « Khamrah ou Asad »), « parfum qui tient longtemps »,
« parfum pour mariage », un article en arabe sur les meilleurs parfums (عطر 1 900, عطور 1 600).

Chaque article : réponse dans le premier paragraphe, tableau, FAQ (balisage FAQPage), liens vers les
fiches, double relecture (faits + SEO) avant publication.

## F. Arabe

La demande arabe existe et personne ne la sert : عطر 1 900/mois, عطور 1 600, عطر خمرة 480,
عطر اسد 260, عطر رجالي 260, عطر نسائي 260, افضل عطر رجالي 210. Étapes : noms arabes sur les fiches
orientales (C6), FAQ bilingue sur les articles « meilleur parfum », puis un article en arabe.
Une version arabe complète du site est un gros chantier : à décider après mesure.

## G. Technique

| # | Action | État |
|---|---|---|
| G1 | Pages catégorie allégées | fait 21/11 |
| G2 | Balises en double (vérification Google, géolocalisation) | fait 21/11 |
| G3 | Panier : erreur d'hydratation | fait 21/11 |
| G4 | Variables Brevo chez Cloudflare (newsletter disparue) | Shahin |
| G5 | Mesure Core Web Vitals mobile sur 10 pages après G1 | à faire |
| G6 | IndexNow après chaque lot de fiches ou d'articles | à chaque mise en ligne |

## H. Mesure

- Toutes les 2 semaines : positions DataForSEO sur les 310 noms de parfums + 30 mots génériques
  (~0,40 $ par relevé avec `ranked_keywords`), comparées au relevé du 21/11.
- Chaque semaine : clics Search Console par type de page (`scripts/_gsc/pull-analyse.mjs`).
- Objectif à 3 mois : 650 à 800 clics/jour ; 50 des 310 fiches dans le top 10 sur leur nom.
- Objectif à 12 mois : top 3 sur la moitié des 1 771 mots de Must.
