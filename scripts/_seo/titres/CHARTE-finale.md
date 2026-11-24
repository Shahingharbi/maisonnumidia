# Charte finale des titres

Version du 24/11/2026, pour les ~2 750 titres du site (`data/titres.json`, rendus en `title.absolute` par `lib/titres.ts`).
Base : la charte « enseigne » (forme, 60 caractères), avec les seuils mesurés de « pertinence » et la protection des familles
et des ruptures de « clic ». Scores des trois juges : enseigne 109,5, pertinence 109,5, clic 105,5. Les 45 titres de
l'échantillon appliquent cette charte : `echantillon-charte.json`. Sources : `recherche/donnees.md`, `google.md`, `enseignes.md`.

## 1. Règles communes (vérifiables par script)

| règle | valeur |
|---|---|
| Longueur | **60 caractères au plus** (NFC, espaces et suffixe compris) : erreur au-delà. Cible 45 à 60, avertissement sous 40. Google réécrit 39-42 % des titres de 51 à 60 caractères et 76 % au-delà de 60 (Z1). |
| Majuscules | 1er mot du titre ; 1er mot après « \| » ; la marque ; le nom du parfum avec ses propres majuscules (Le Parfum, Eau Tendre, Intense Man, Pour Monsieur, Bleu de Chanel Parfum, VIP, L.12.12) ; Algérie ; Maison Numidia ; Parfumerie (accueil) ; Cologne (« eau de Cologne »). |
| Minuscules | tout le reste : prix, parfum(s), original, homme, femme, mixte, pour, eau de parfum, eau de toilette, épuisé, versions, top, meilleur, différence. Pas de majuscule après « : ». Jamais de capitales de logo (DIOR). |
| Concentrations | EDP → eau de parfum ; EDT → eau de toilette ; Parfum → parfum ; Extrait, Extrait de Parfum → extrait de parfum ; EDC, Cologne → eau de Cologne ; EDP Intense → eau de parfum intense ; EDT Intense → eau de toilette intense ; Essence de Parfum → essence de parfum. Jamais de sigle. |
| Contenance | « 100 ml » (nombre, espace, ml), seulement celle du catalogue. |
| Séparateurs | « , » entre la désignation et sa description ; « : » une seule fois, devant le complément ; « \| » seulement devant Maison Numidia ; « ? » seulement dans un article dont le h1 pose la question. Interdits : — – et - comme séparateurs (le trait d'union d'un nom reste), ( ) [ ] ! » ≡ · ★ ✔ ⚡ et tout émoji. |
| Espaces | Saisie en espaces normales. Le rendu met U+00A0 avant « : » et dans « 100 ml », U+202F avant « ? » (fonction à ajouter dans `lib/titres.ts`) : la longueur ne change pas. |
| Mots interdits | COD, promo, soldes, pas cher, meilleur prix, prix le plus bas, garanti, authentique, 100 %, livraison gratuite, en stock, disponible, avis, note, étoiles, WhatsApp, un montant (DA, dinars), toute la collection, un nombre de références, originaux, YSL, 2025, une année hors article. « meilleur » : articles seulement. « original » : là où une section le prévoit. |
| Suffixe « \| Maison Numidia » | Fiches et articles : **jamais** (le nom du site est déjà affiché au-dessus du titre, G2 ; « maison numidia » = 0 % des requêtes de fiches). Marques, filles, catégories, index, service : **présent s'il tient dans les 60 caractères, absent sinon**. Accueil : le nom fait partie du titre. |
| Arabe | Jamais dans un titre (page en français, G1). Khamrah (عطر خمرة 480/mois contre 390 en latin) et Asad (260 contre 210) seront testés une fois leur nom arabe affiché dans la page (plan C6). |

**Formes de marque** (rp-A, tout le site) : **Paco Rabanne** (1 445 imp ; « rabanne » seul 95 : le « Paco Rabanne 0 » du
tableau h1 de CLAUDE.md vient d'un bug d'`audit-h1.mjs`, qui range toute requête « paco rabanne » dans « rabanne ») ;
**Armani** sur les fiches (1 483 contre 308 pour Giorgio Armani) ; **Yves Saint Laurent** (1 754 contre 1 122 pour YSL) ;
Mont Blanc (625) ≈ Montblanc (546) : forme du catalogue. Sur une page marque ou fille, la forme la plus tapée sur la page
(Giorgio Armani sur /parfums-femme/armani : 86 imp contre 13). Ailleurs : le champ `marque` du dossier.

**Noms** : le champ `nom` du dossier, avec ses majuscules, sauf :
- corrections vérifiées sur Fragrantica (règle n°9), à reporter au catalogue : Club de Nuit Women → **Club de Nuit Woman**
  (ID 27655 ; sur la page, « woman » 392 imp, « women » 56), 212 VIP Women → **212 VIP** (ID 10126), Acqua di Gio Profumo → **Acqua di Giò Profumo** ;
- nom qui contient la marque, sous la forme du h1 (Bleu de Chanel, Miss Dior, Armani Code) : on n'ajoute pas la marque ;
- numéro final jamais tapé, sur une page qui a des données : retiré (Eden Juicy Apple, sans « 01 ») ; gardé s'il est tapé (Vanilla 28, Baccarat Rouge 540) ou si la page n'a pas de données ;
- Eau de Parfum, Eau de Toilette, EDP, EDT en fin de nom : passent dans la description (Chance Eau Tendre, eau de parfum). Parfum, Le Parfum, Elixir, Intense, Profumo restent dans le nom avec leur majuscule : ils nomment une déclinaison ;
- « Eau de {Marque} » en tête d'un nom de gamme plus long devient « {Marque} » (Lacoste L.12.12 …) ; un nom qui s'arrête là (Eau de Rochas) reste entier.

## 2. Mesures prises dans le dossier

- **Base** = impressions cumulées des requêtes du champ `requetes` écrites en alphabet latin. Une marque mal orthographiée compte comme la marque (latafa, frank olivier, kay ali). **Données suffisantes : base ≥ 30.** En dessous, la page est « sans données ».
- part(x) = impressions des requêtes qui contiennent x, divisées par la base. « parfum » = parfum(s), perfume, parfume. Genre = homme, femme, men, women, man, woman, for her, pour elle, pour lui, hors mot du nom. « original » = original(e)(s). Contenance = « N ml » ou « Nml ».
- Ordre : nom seul (le nom sans la marque), marque d'abord, nom d'abord, marque seule (la marque sans aucun mot du nom).
- **Seuils des fiches** : « parfum » ≥ 30 % ; genre ≥ 10 % ; « original » ≥ 5 % ; contenance ≥ 25 % **et** la contenance la plus tapée est celle du catalogue ; marque seule ≥ 30 % = marque qui prend la fiche. Sur les 632 fiches à données suffisantes : « parfum » ≥ 30 % sur 274, « original » ≥ 5 % sur 12.

## 3. Fiche produit : `{désignation}[, {description}][ {contenance}] : {complément}`

**3.1 Désignation**
1. **Nom d'abord**, « {Nom} de|d' {Marque} », si nom seul ≥ 60 %, ou si nom d'abord ≥ 2/3 des requêtes qui contiennent les deux : Whisky Silver d'Evaflor (95 % nom seul), Khamrah de Lattafa (66 %), Club de Nuit Woman d'Armaf (91 %), 212 Men de Carolina Herrera (95 %).
2. **Sinon marque d'abord**, « {Marque} {Nom} » : l'ordre du h1, et celui de 66 % des requêtes du site qui tapent les deux. Lattafa Asad (nom seul 59 %, 94 imp marque d'abord contre 37), Dior Sauvage (« sauvage dior » 61 % des requêtes à deux mots, sous les 2/3), Chanel Chance (79 %).
3. **Sans données** : ordre de la maison, sinon celui de sa version de base, sinon marque d'abord. Maisons « nom d'abord » (nom seul ≥ 65 %, donnees §2) : Ajmal, Armaf, By Kilian, Carolina Herrera, Escada, Evaflor, Giorgio Armani, Guy Laroche, Lattafa, Maison Crivelli, Michael Kors, Nikos, Paco Rabanne, Ralph Lauren, Rasasi, Van Cleef & Arpels, Victoria's Secret, Viktor & Rolf, Yves Rocher, Yves Saint Laurent. Toutes les autres : marque d'abord.
4. Élision : d' devant une voyelle ou un h muet (d'Armani, d'Evaflor, d'Yves Saint Laurent, d'Hermès), de sinon (de Lattafa, de Paco Rabanne).
5. La marque ne sort que si « {désignation} : prix en Algérie » dépasse déjà 60 et qu'elle est tapée dans moins de 5 % des requêtes : Baccarat Rouge 540 (Maison Francis Kurkdjian : 3,5 %).

**3.2 Description.** D'abord les éléments obligatoires, puis les facultatifs retenus par les seuils (§2), du plus tapé au moins tapé, tant que le titre tient en 60.
- Concentration **obligatoire** si une sœur du champ `variantes` porte le même nom (Chance Eau Tendre en EDP et en EDT) ou s'appelle « {Nom} Parfum » ou « {Nom} Le Parfum » (Sauvage, Libre, 1 Million, Bleu de Chanel). Concentration contestée au catalogue (armani-code noté EDP alors qu'armani-code-edp existe) : ne pas l'écrire, mettre le genre.
- Genre **obligatoire** si une sœur ne diffère que par le genre (Code et Code Femme ; 212 VIP et 212 VIP Men), sauf si le nom le porte (Intense Man, Woman). Unisexe : « mixte » seulement si une requête ou un mot-clé de la page contient un genre (Baccarat Rouge 540 : « baccarat rouge homme », 260/mois).
- Écriture, première forme qui tient en 60 :

| situation | description | exemple de l'échantillon |
|---|---|---|
| concentration obligatoire | `{concentration}[ pour {genre}]` ; jamais « original » | Libre d'Yves Saint Laurent, eau de parfum |
| « original » retenu | `parfum[ {genre}] original` | Khamrah de Lattafa, parfum original ; Baccarat Rouge 540, parfum mixte original |
| genre ou « parfum » retenu, fiche EDP ou extrait | `eau de parfum[ pour {genre}]`, puis `parfum {genre}`, puis rien et « prix du parfum » | Lattafa Asad, eau de parfum pour homme ; Club de Nuit Woman d'Armaf, parfum femme |
| genre retenu, autre concentration | `parfum {genre}` | 212 Men de Carolina Herrera, parfum homme |
| « parfum » seul retenu, autre concentration | rien : le complément devient « prix du parfum » | Whisky Silver d'Evaflor : prix du parfum en Algérie |
| « parfum » interdit (3.4), genre obligatoire | `pour {genre}` collé à la désignation | Armani Code pour homme |

- La contenance suit la désignation ou la description, sans virgule : Dior Sauvage, eau de parfum 100 ml ; Dior Sauvage Elixir 60 ml ; Bleu de Chanel Parfum 100 ml. « original » ne suit jamais « eau de … » ni une contenance (pas d'accord à faire).

**3.3 Complément** : « : prix en Algérie », ou « : prix du parfum en Algérie » quand « parfum » est retenu, absent du reste du titre et permis. « prix » porte 33 % des impressions et 48 % des clics des fiches, « Algérie » 22 % et 44 %. Jamais le montant (S1 : -15 % de trafic).

**3.4 Base et variantes**
- La base porte le nom nu. La variante colle son mot distinctif au nom de base, dans les 30 premiers caractères : Dior Sauvage Elixir, Libre Le Parfum, Khamrah Qahwa, Le Male Elixir, Chanel Chance Eau Tendre. Une déclinaison prend la requête de sa base dans 88 % des requêtes mal aiguillées (donnees §5).
- « parfum » seul est interdit (description `parfum …`, concentration « parfum », complément « prix du parfum ») sur toute fiche dont une sœur s'appelle « {Base} Parfum » ou « {Base} Le Parfum », sauf sur cette sœur : ni Dior Sauvage Elixir ni Armani Code ne l'écrivent. « eau de parfum » reste permis (Dior Sauvage, eau de parfum).
- La contenance ne départage jamais deux sœurs de même contenance : les huit fiches 1 Million font 100 ml, c'est « eau de toilette » qui sépare la base de 1 Million Parfum.
- Tête unique : deux fiches d'une même marque n'ont jamais la même désignation et la même description. Le champ `variantes` est incomplet quand un nom commence par « Eau de {Marque} » (lacoste-l12-blanc manque à la Collector) : vérifier aussi les fiches de la marque au nom voisin.

**3.5 Trop court, trop long**
- Sous 45 caractères : ajouter la concentration si elle est permise (ni contestée, ni « parfum » interdit) : Chanel Chance, eau de toilette (31 → 48), Kayali Vanilla 28, eau de parfum (35 → 50). Sinon le titre reste court : Dior Sauvage Elixir 60 ml : prix en Algérie (43), Armani Code pour homme : prix en Algérie (40). « original » ne sert jamais à remplir.
- Si les seuls éléments obligatoires dépassent 60 : retirer la marque (règle 3.1.5), puis raccourcir le nom (3.6). Un élément obligatoire ne sort jamais.

**3.6 Cas particuliers**
- **Marque qui prend la fiche** (marque seule ≥ 30 %, ou fiche sans données de Kayali, Mauboussin, Zara, Guess, Mont Blanc, Narciso Rodriguez) : marque d'abord ; ni `parfum …` ni « prix du parfum », la concentration reste permise. Ces requêtes reviennent à la page marque (§4). Kayali Eden Juicy Apple, eau de parfum : prix en Algérie (72 % de requêtes de marque seule).
- **Marque = nom** (6 fiches) : la marque une fois, puis `{concentration} pour {genre}` (ou `mixte`), raccourci en `parfum {genre}` si besoin, pour se distinguer de la page marque : Franck Olivier, eau de parfum pour femme : prix en Algérie.
- **Rupture** (`enStock: false`, 63 fiches) : `{désignation} : épuisé, voir les autres versions` si `variantes` n'est pas vide, sinon `{désignation} : épuisé, voir les parfums proches` (les mots de la meta description). Ni prix, ni « original », ni concentration sauf obligatoire (3.2) ; la marque sort au-delà de 60. Acqua di Giò Profumo : épuisé, voir les autres versions (49 % de ses impressions viennent de « acqua di gio », la base en stock).
- **Nom très long** (49 noms de plus de 35 caractères) : garder les mots qui distinguent la fiche de ses sœurs ; retirer dans l'ordre « x {collaboration} », « Edition », « Pour Homme » ou « Pour Femme » s'ils ne distinguent aucune sœur, une parenthèse (« (Jaune) »). Ne jamais couper un mot ni sauter un mot du nom avant le dernier mot distinctif : Lacoste L.12.12 Blanc Pure Collector : prix en Algérie (« Pure » reste).
- **Sans données** (base < 30 ; 419 fiches n'ont aucune requête) : ordre de la maison (3.1.3) ; « parfum » compté comme retenu (34 % des impressions des fiches, donnees §1), sauf maison qui prend ses fiches ; ni genre facultatif, ni contenance, ni « original ». Khamrah Qahwa de Lattafa, eau de parfum : prix en Algérie ; Pierre Cardin Pour Monsieur : prix du parfum en Algérie ; Libre Le Parfum d'Yves Saint Laurent : prix en Algérie.

## 4. Page marque

- **Défaut** : `{Marque} : prix des parfums en Algérie | Maison Numidia`. Sur les 89 pages marque dont l'ordre est net, 62 mettent la marque avant « parfum » (55 % des impressions). Lattafa (91 %), Bvlgari (67 %), et les pages sans données (Dior).
- `Parfums {Marque} : prix en Algérie | Maison Numidia`, pluriel du h1 « Parfums {Marque} en Algérie », si « parfum » précède la marque dans ≥ 60 % des requêtes qui contiennent les deux (≥ 30 imp), ou si les fiches de la marque prennent ses requêtes (liste de 3.6) : Parfums Kayali, qui doit reprendre « parfum kayali prix algérie » (567 imp, servies aujourd'hui par la fiche Eden).
- « prix » et « Algérie » toujours, même absents des requêtes de la page (Bvlgari) : 30 % et 52 % des clics des pages marque. Suffixe s'il tient : Jean Paul Gaultier et Yves Saint Laurent passeraient à 65, ils n'en ont pas.
- Ni nom de parfum (il prendrait les requêtes des fiches), ni genre, ni « originaux » (0,4 % des requêtes), ni autre graphie entre parenthèses (Bulgari : 61,9 % de réécriture avec parenthèses, Z1).

## 5. Page fille (marque dans une section)

- **Défaut** : `Parfum {Marque} pour {femme|homme} : prix en Algérie | Maison Numidia` (suffixe s'il tient), aussi pour les pages sans données et les filles en doublon (absentes des dossiers). Les filles se partagent entre « parfum » d'abord (51 % des impressions) et marque d'abord (49 %) ; le h1 commence par « Parfum ». Le genre suit la marque dans 92 % des requêtes « parfum » d'abord qui tapent un genre (« parfum hugo boss homme prix algérie »). Hugo Boss (marque d'abord 37 %) : Parfum Hugo Boss pour homme : prix en Algérie.
- `{Marque} : parfums pour {femme|homme}, prix en Algérie[ | Maison Numidia]` si la marque précède « parfum » dans ≥ 60 % des requêtes qui contiennent les deux (≥ 30 imp) : Jimmy Choo (76 %), Yves Saint Laurent (87 %), Giorgio Armani (66 %).
- Section orientale : `Parfum oriental {Marque} : prix en Algérie` (h1) ou `{Marque} : parfums orientaux, prix en Algérie`, même règle.
- Genre ou « oriental » toujours : « femme » est dans 32 % des impressions des filles, « homme » dans 13 %.

## 6. Catégories, accueil, articles, index et service

- **Catégorie** : `Parfum {femme|homme} original : prix en Algérie | Maison Numidia` (56) ; orientale : `Parfum oriental et arabe : prix en Algérie | Maison Numidia` (59). « original » : 54 % des requêtes de /parfums-femme hors navigation, 40 % de /parfums-homme, 0 % de /parfums-orientaux, où « arabe » pèse 29 %. « maison numidia » fait 54 % des impressions des catégories. Aucune marque. « paiement à la livraison » reste dans la meta description (64 caractères dans le titre) ; il pourra être testé contre un groupe témoin.
- **Accueil** : `Parfum original en Algérie | Parfumerie Maison Numidia` (« parfum original alger » 398 imp, « parfum original » 211, « parfumerie » 149).
- **Article** : les mots du h1, dans le même ordre, en casse de phrase. Pour tenir en 60, on retire des déterminants (le, la, les) et des membres entiers (complément après une virgule, terme d'une coordination), en gardant le plus concret pour un acheteur ; on ne reformule ni n'ajoute rien. Pas de suffixe. Une année seulement si le h1 la porte, changée le même jour que lui. Meilleur parfum homme 2026 : top 12 en Algérie, par budget ; Eau de parfum ou eau de toilette : quelle différence ?
- **Index et service** (/marques, /blog, /livraison, /parfum-algerie, /contact, /a-propos) : le h1 en casse de phrase, raccourci comme un article, puis le suffixe s'il tient. « prix » ou « original » seulement si la page en parle et que ses requêtes les contiennent.

## 7. Désaccords tranchés

| question | décision | donnée |
|---|---|---|
| 60 ou 65 caractères | 60 | 76 % de réécritures au-delà de 60 (Z1) ; les trois juges |
| « original » sur toutes les fiches (clic) | seulement s'il est tapé (≥ 5 %), catégories et accueil | 0,9 % des requêtes de fiches ; « original » dans 34 titres sur 45 chez clic : texte répété (G1) |
| Rabanne (clic, enseigne) | Paco Rabanne | 1 445 imp contre 95 |
| gabarit unique des filles (enseigne) | ordre mesuré page par page | Jimmy Choo 76 % marque d'abord, Hugo Boss 37 % |
| contenance pour séparer une base (pertinence) | jamais entre sœurs de même contenance | 1 Million : huit fiches à 100 ml |
| rupture sans le dire (enseigne) | « épuisé, voir les autres versions » | Acqua di Giò Profumo prend 537 imp de « acqua di gio » |
| parenthèses (Bvlgari (Bulgari)) | interdites | 61,9 % de réécriture (Z1) |
| « \| » ou « – » | « \| », devant le nom du site seulement | G1 le cite parmi les séparateurs ; Notino, Briki ; Ahrefs (A1) ne compte même pas le remplacement du seul séparateur |
| remplissage sous 45 | la concentration, pas « original » | juges 2 et 3 ; S5 : un mot non tapé ne rapporte rien |
| marque qui prend la fiche | pas de « parfum » seul, la concentration reste | juge 2 ; Kayali Eden à 41 caractères sinon |

## 8. Contrôle et mise en ligne

- `valider.mjs` à mettre à jour : MAX 60 et avertissement sous 40 ; suffixe présent si et seulement s'il tient (marques, filles, catégories, index, service), absent des fiches et articles ; exception « Eau de {Marque} » (faux positif actuel sur la Collector) ; « Cologne » accepté dans « eau de Cologne » ; mots et signes interdits du §1 ; « original » jamais après « eau de » ni après une contenance ; « parfum » seul refusé quand une sœur s'appelle « {Base} Parfum » ; tête unique par marque ; titre d'article = mots du h1 dans l'ordre ; année seulement si le h1 la porte. L'échantillon passe aujourd'hui avec une seule erreur, ce faux positif.
- Mise en ligne par vagues (google.md §5) : fiches à fort trafic tirées au hasard par segment, une moitié témoin, recrawl par `--urls-file`, comparaison du CTR à position égale après 3 à 4 semaines, vérification du titre affiché. Pages marque, filles et catégories testées à part.

## 9. À corriger hors titres (signalé, non modifié)

- CLAUDE.md, tableau h1 : Paco Rabanne et non Rabanne. Catalogue : Club de Nuit Woman, 212 VIP, Acqua di Giò Profumo ; armani-code probable doublon d'armani-code-edp (PLAN B3).
- h1 identiques entre base et variante, alors que Google prend le h1 dans 51 % de ses réécritures (A1) : dior-sauvage et dior-sauvage-parfum (« Dior Sauvage Parfum Homme Algérie »), bleu-de-chanel et bleu-de-chanel-parfum (« Bleu de Chanel Parfum Homme Algérie »). h1 fautifs : franck-olivier (marque en double), chanel-chance-eau-tendre (« Eau de Parfum Parfum »), libre-le-parfum-ysl (« YSL »).
- Meta description des ruptures : « Épuisé pour le moment », alors que les 63 ruptures sont des parfums arrêtés ou des éditions passées.
- `dossiers.mjs` : variantes incomplètes pour les noms en « Eau de {Marque} ». `lib/titres.ts` : conversion des espaces insécables à ajouter.
